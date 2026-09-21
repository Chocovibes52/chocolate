import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// Self-heal broken nested rolldown pluginutils if created
try {
  const brokenNested = path.resolve(
    "node_modules/vite/node_modules/rolldown/node_modules/@rolldown/pluginutils",
  );
  const brokenIndex = path.resolve(
    "node_modules/vite/node_modules/rolldown/node_modules/@rolldown/pluginutils/dist/index.js",
  );
  if (fs.existsSync(brokenNested) && !fs.existsSync(brokenIndex)) {
    fs.rmSync(brokenNested, { recursive: true, force: true });
  }
} catch (e) {
  console.warn("Pluginutils check warning:", e);
}

const args = process.argv.slice(2);
let port = "3000";
let host = "0.0.0.0";

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if ((arg === "--port" || arg === "-p") && args[i + 1]) {
    port = args[++i];
  } else if ((arg === "--host" || arg === "-h") && args[i + 1]) {
    host = args[++i];
  } else if (/^\d{2,5}$/.test(arg)) {
    port = arg;
  } else if (/^\d+\.\d+\.\d+\.\d+$/.test(arg) || arg === "localhost") {
    host = arg;
  }
}

const viteBin = path.resolve("node_modules/.bin/vite");

console.log(`Starting Vite on ${host}:${port}...`);
const child = spawn(viteBin, ["--port", port, "--host", host], {
  stdio: "inherit",
  env: process.env,
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
