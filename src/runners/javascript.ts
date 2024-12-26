import { invoke } from "@tauri-apps/api/core";

type EvaluationResult = (string | undefined)[];

async function runJavascript(code: string | undefined): Promise<EvaluationResult> {
  if (!code) {
    return [];
  }

  try {
    const jsCode = await invoke<string>("parse_typescript", { code });
    return await new Function(jsCode)();
  } catch (error: any) {
    return [`Error: ${error.message}`];
  }
}

export { runJavascript };
