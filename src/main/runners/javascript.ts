import createWorker from "../workers/codeRunner.worker?nodeWorker";

export function runJavaScript(code: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substring(7);

    const worker = createWorker({ workerData: "code-runner" });

    worker.on(
      "message",
      (response: { id: string; success: boolean; results?: string[]; error?: string }) => {
        if (response.id !== id) return;

        worker.terminate();

        if (response.success) {
          resolve(response.results || []);
        } else {
          reject(new Error(response.error));
        }
      },
    );

    worker.on("error", (error) => {
      worker.terminate();
      reject(new Error(`Worker error: ${error.message}`));
    });

    worker.postMessage({ id, code });
  });
}
