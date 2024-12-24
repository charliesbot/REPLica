use std::sync::Arc;
use swc_core::{
    common::{FileName, SourceMap, SyntaxContext},
    ecma::{
        ast::{CallExpr, Callee, Expr, ExprOrSpread, Ident, Number, Stmt}, // Added Number
        codegen::{text_writer::JsWriter, Config, Emitter},
        parser::{Parser, StringInput, Syntax, TsSyntax},
        visit::{VisitMut, VisitMutWith},
    },
};

#[tauri::command]
async fn parse_typescript(code: String) -> Result<String, String> {
    let source_map = Arc::new(SourceMap::default());
    let source_file =
        source_map.new_source_file(Arc::new(FileName::Custom("input.ts".into())), code);

    let input = StringInput::from(&*source_file);
    let mut parser = Parser::new(Syntax::Typescript(TsSyntax::default()), input, None);
    let mut program = parser.parse_program().map_err(|e| format!("{:?}", e))?;

    let mut transformer = LogTransformer::default();
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

    // Updated wrapper code without IIFE
    let wrapper = format!(
        "const results = new Array({}).fill(undefined);\n\
        const customLog = (lineIndex, ...args) => {{\n\
            results[lineIndex] = args\n\
                .map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))\n\
                .join(' ');\n\
        }};\n\
        try {{\n\
            {}\n\
        }} catch (error) {{\n\
            results[0] = `Error: ${{error.message}}`;\n\
        }}\n\
        return results;",
        js_code.lines().count(),
        js_code.trim()
    );

    Ok(wrapper)
}

#[derive(Default)]
struct LogTransformer {
    current_line: usize,
}

impl VisitMut for LogTransformer {
    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        self.current_line += 1;

        if let Stmt::Expr(expr_stmt) = stmt {
            let span = expr_stmt.span;

            // If it's already a console.log, convert to customLog
            if let Expr::Call(call) = &*expr_stmt.expr {
                if is_console_log(call) {
                    let span = call.span;
                    expr_stmt.expr = convert_to_custom_log(call, self.current_line, span);
                    return;
                }
            }

            // For any other expression, wrap in customLog
            let ctxt = SyntaxContext::empty();
            expr_stmt.expr = Box::new(Expr::Call(CallExpr {
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
                                value: self.current_line as f64,
                                raw: None,
                            }
                            .into(),
                        )),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: expr_stmt.expr.clone(),
                    },
                ],
                type_args: None,
                ctxt,
            }));
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
