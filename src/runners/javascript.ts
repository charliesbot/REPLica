import { invoke } from "@tauri-apps/api/core";

type EvaluationResult = (string | undefined)[];

async function runJavascript(code: string | undefined): Promise<EvaluationResult> {
  if (!code) {
    return [];
  }

  try {
    const jsCode = await invoke<string>("parse_typescript", { code });
    console.log("jsCode", jsCode);
    return new Function(jsCode)();
  } catch (error: any) {
    console.error("Execution error:", error);
    return [`Error: ${error.message}`];
  }
}

export { runJavascript };
