self.importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");

let runtime;

self.onmessage = async ({ data }) => {
  if (!runtime) {
    runtime = await self.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/" });
  }

  const output = [];
  const input = [...data.input];
  runtime.setStdout({ batched: (value) => output.push(value) });
  runtime.setStderr({ batched: (value) => output.push(value) });
  runtime.setStdin({ stdin: () => input.shift() ?? "" });
  const globals = runtime.toPy({});

  try {
    await runtime.runPythonAsync(data.code, { globals });
    self.postMessage({ id: data.id, output: output.join("\n"), error: "" });
  } catch (error) {
    self.postMessage({ id: data.id, output: output.join("\n"), error: String(error) });
  } finally {
    globals.destroy();
  }
};
