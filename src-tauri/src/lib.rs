use std::sync::Arc;
use swc_core::{
    common::{FileName, SourceMap, SyntaxContext},
    ecma::{
        ast::{CallExpr, Callee, Expr, ExprOrSpread, Ident, Number, Stmt},
        codegen::{text_writer::JsWriter, Config, Emitter},
        parser::{Parser, StringInput, Syntax, TsSyntax},
        visit::{VisitMut, VisitMutWith},
    },
};

#[tauri::command]
async fn parse_typescript(code: String) -> Result<String, String> {
    let line_count = code.lines().count();

    let source_map = Arc::new(SourceMap::default());
    let source_file =
        source_map.new_source_file(Arc::new(FileName::Custom("input.ts".into())), code);

    let input = StringInput::from(&*source_file);
    let mut parser = Parser::new(Syntax::Typescript(TsSyntax::default()), input, None);
    let mut program = parser.parse_program().map_err(|e| format!("{:?}", e))?;

    let mut transformer = LogTransformer {
        source_map: source_map.clone(),
    };
    program.visit_mut_with(&mut transformer);

    let mut buf = vec![];
    let writer = JsWriter::new(source_map.clone(), "\n", &mut buf, None);
    let mut emitter = Emitter {
        cfg: Config::default(),
        cm: source_map,
        comments: None,
        wr: writer,
    };
    emitter
        .emit_program(&program)
        .map_err(|e| format!("{:?}", e))?;
    let js_code = String::from_utf8(buf).map_err(|e| format!("{:?}", e))?;

    let wrapper = format!(
        "
        const results = Array.from({{ length: {} }}, () => []);
        const customLog = (lineIndex, ...args) => {{
            // Only log if the last argument isn't undefined
            const lastArg = args[args.length - 1];
            if (lastArg !== undefined) {{
                const output = args
                    .map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
                    .join(' ');
                results[lineIndex - 1]?.push(output);
            }}
        }};
        try {{
            {}
        }} catch (error) {{
            results[0] = [`Error: ${{error.message}}`];
        }}
        return results.map(outputs => outputs.length ? outputs.join(' ') : undefined);",
        line_count,
        js_code.trim()
    );

    Ok(wrapper)
}

struct LogTransformer {
    source_map: Arc<SourceMap>,
}

impl Default for LogTransformer {
    fn default() -> Self {
        Self {
            source_map: Arc::new(SourceMap::default()),
        }
    }
}

fn should_log_statement(expr: &Expr) -> bool {
    match expr {
        // Show direct value access (like array[0] or obj.prop)
        Expr::Member(_) => true,
        // Show regular value reads (like variables)
        Expr::Ident(_) => true,
        // Show literal values
        Expr::Array(_) => true,
        Expr::Object(_) => true,
        // Show method calls - we'll filter undefined at runtime
        Expr::Call(_) => true,
        // Don't show assignments
        Expr::Assign(_) => false,
        // Show anything else that might be an expression
        _ => true,
    }
}

impl VisitMut for LogTransformer {
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        // Visit children first to handle nested expressions
        expr.visit_mut_children_with(self);

        // Convert console.log calls to customLog wherever they appear
        if let Expr::Call(call) = expr {
            if is_console_log(call) {
                let line_number = self.source_map.lookup_char_pos(call.span.lo).line;
                *expr = *convert_to_custom_log(call, line_number, call.span);
            }
        }
    }

    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        // Visit children first
        stmt.visit_mut_children_with(self);

        match stmt {
            Stmt::Expr(expr_stmt) => {
                match &*expr_stmt.expr {
                    // Special handling for console.log
                    Expr::Call(call) if is_console_log(call) => {
                        let line_number = self.source_map.lookup_char_pos(call.span.lo).line;
                        expr_stmt.expr = convert_to_custom_log(call, line_number, expr_stmt.span);
                    }
                    // Other expressions
                    expr => {
                        if should_log_statement(expr) {
                            let line_number =
                                self.source_map.lookup_char_pos(expr_stmt.span.lo).line;
                            expr_stmt.expr = create_custom_log_call(
                                line_number,
                                expr_stmt.expr.clone(),
                                expr_stmt.span,
                            );
                        }
                    }
                }
            }
            _ => {}
        }
    }
}

fn is_console_log(call: &CallExpr) -> bool {
    if let Callee::Expr(expr) = &call.callee {
        if let Expr::Member(member) = &**expr {
            if let (Expr::Ident(obj), true) = (&*member.obj, member.prop.is_ident()) {
                return obj.sym.to_string() == "console"
                    && member.prop.as_ident().unwrap().sym.to_string() == "log";
            }
        }
    }
    false
}

fn create_custom_log_call(line: usize, expr: Box<Expr>, span: swc_core::common::Span) -> Box<Expr> {
    let ctxt = SyntaxContext::empty();
    Box::new(Expr::Call(CallExpr {
        span,
        callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
            "customLog".into(),
            span,
            ctxt,
        )))),
        args: vec![
            ExprOrSpread {
                spread: None,
                expr: Box::new(Expr::Lit(
                    Number {
                        span,
                        value: line as f64,
                        raw: None,
                    }
                    .into(),
                )),
            },
            ExprOrSpread { spread: None, expr },
        ],
        type_args: None,
        ctxt,
    }))
}

fn convert_to_custom_log(call: &CallExpr, line: usize, span: swc_core::common::Span) -> Box<Expr> {
    let ctxt = SyntaxContext::empty();
    Box::new(Expr::Call(CallExpr {
        span,
        callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
            "customLog".into(),
            span,
            ctxt,
        )))),
        args: std::iter::once(ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Lit(
                Number {
                    span,
                    value: line as f64,
                    raw: None,
                }
                .into(),
            )),
        })
        .chain(call.args.iter().cloned())
        .collect(),
        type_args: None,
        ctxt,
    }))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![parse_typescript])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
