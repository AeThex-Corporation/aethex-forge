import chokidar from "chokidar";
import fs from "node:fs";
import path from "node:path";
import { scrubPII } from "./pii-scrub.js";

let watcher = null;

export async function startWatcher(dir) {
  if (watcher) await watcher.close();
  watcher = chokidar.watch(["**/*.lua", "**/*.cs", "**/*.ts", "**/*.tsx"], {
    cwd: dir,
    ignoreInitial: true,
  });

  watcher.on("change", (filePath) => {
    const full = path.join(dir, filePath);
    try {
      const content = fs.readFileSync(full, "utf-8");
      const safe = scrubPII(content);
      console.log(`[watcher] ${filePath} changed`);
      // TODO: route safe content to renderer or local analysis pipeline
      console.log(safe.slice(0, 400));
    } catch (err) {
      console.error("watcher read error", err);
    }
  });

  return true;
}

export async function stopWatcher() {
  if (watcher) await watcher.close();
  watcher = null;
  return true;
}

