import { parentPort, workerData } from "worker_threads";
import { transform } from "sucrase";

const port = parentPort;
if (!port) throw new Error("IllegalState");

interface CodeMessage {
  id: string;
  code: string;
}

port.on("message", (message: CodeMessage) => {
  const { id, code } = message;
  const results: string[] = [];

  const customConsole = {
    log: (...args: any[]) => {
      results.push(
        args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "),
      );
    },
  };

  try {
    const jsCode = transform(code, {
      transforms: ["typescript"],
    }).code;

    const fn = new Function("console", jsCode);
    fn(customConsole);

    port.postMessage({
      id,
      success: true,
      results,
    });
  } catch (error: any) {
    port.postMessage({
      id,
      success: false,
      error: error.message,
    });
  }
});
