import { transform } from "sucrase";

type EvaluationResult = (string | undefined)[];

function stripTypes(code: string): string {
  const result = transform(code, {
    transforms: ["typescript"],
  });
  return result.code;
}

// TODO - use Babel to understand when there's a expression,
// so we don't need use console.log to get the result
function runJavascript(code: string | undefined): EvaluationResult {
  if (!code) {
    return [];
  }

  const jsCode = stripTypes(code);
  const lines = jsCode.split("\n");
  const results: EvaluationResult = new Array(lines.length).fill(undefined);

  // Wrap each console.log with a line number
  const wrappedCode = lines
    .map((line, index) => line.replace(/console\.log\((.*)\)/g, `customLog(${index}, $1)`))
    .join("\n");

  const customLog = (lineIndex: number, ...args: any[]) => {
    results[lineIndex] = args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
      .join(" ");
  };

  try {
    // Execute the wrapped code
    new Function("customLog", wrappedCode)(customLog);
  } catch (error: any) {
    console.error("Execution error:", error);
    results[results.length - 1] = `Error: ${error.message}`;
  }

  return results;
}

export { runJavascript };
