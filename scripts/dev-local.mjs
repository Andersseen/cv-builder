import { spawn } from "node:child_process";

const commands = {
  worker: ["pnpm", ["dev:worker"]],
  app: ["pnpm", ["dev:app"]],
};

const children = new Set();
let appStarted = false;
let shuttingDown = false;

startWorker();

function startWorker() {
  const worker = start("worker", commands.worker);

  const startAppWhenWorkerIsReady = (chunk) => {
    const text = chunk.toString();
    if (!appStarted && text.includes("Ready on")) {
      appStarted = true;
      start("app", commands.app);
    }
  };
  worker.stdout.on("data", startAppWhenWorkerIsReady);
  worker.stderr.on("data", startAppWhenWorkerIsReady);

  worker.on("exit", (code) => {
    if (!shuttingDown && !appStarted) {
      console.error(
        "[dev] Cloud PDF Worker exited before Vite started. Check the Wrangler output above.",
      );
      process.exit(code ?? 1);
    }
  });
}

function start(label, [command, args]) {
  const child = spawn(command, args, {
    stdio: ["inherit", "pipe", "pipe"],
    env: process.env,
  });

  children.add(child);
  child.stdout.on("data", (chunk) => write(label, chunk, false));
  child.stderr.on("data", (chunk) => write(label, chunk, true));
  child.on("exit", (code, signal) => {
    children.delete(child);
    if (!shuttingDown && label === "app") {
      shutdown(code ?? signal ?? 0);
    }
  });

  return child;
}

function write(label, chunk, isError) {
  const stream = isError ? process.stderr : process.stdout;
  for (const line of chunk.toString().split(/\r?\n/)) {
    if (line) {
      stream.write(`[${label}] ${line}\n`);
    }
  }
}

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of children) {
    child.kill("SIGINT");
  }
  process.exit(typeof code === "number" ? code : 0);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
