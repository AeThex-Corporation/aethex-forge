import { clipboard } from "electron";
import { getMainWindow } from "./windows.js";
import { scrubPII } from "../services/pii-scrub.js";

let sentinelInterval = null;

export function startClipboardSentinel() {
  if (sentinelInterval) return;

  let lastClipboard = clipboard.readText();

  sentinelInterval = setInterval(() => {
    const current = clipboard.readText();
    if (current !== lastClipboard) {
      lastClipboard = current;
      const scrubbed = scrubPII(current);
      if (scrubbed !== current) {
        const mainWindow = getMainWindow();
        mainWindow?.webContents.send("sentinel:clipboard-alert", {
          original: current,
          scrubbed: scrubbed,
        });
      }
    }
  }, 1500);
}

export function stopClipboardSentinel() {
  if (sentinelInterval) {
    clearInterval(sentinelInterval);
    sentinelInterval = null;
  }
}
