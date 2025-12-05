import { app, globalShortcut } from "electron";
import {
  createMainWindow,
  createOverlayWindow,
  toggleMainVisibility,
} from "./windows.js";
import { registerIpcHandlers } from "./ipc.js";
import { startClipboardSentinel, stopClipboardSentinel } from "./sentinel.js";

app.whenReady().then(() => {
  registerIpcHandlers();

  createMainWindow();
  createOverlayWindow();

  startClipboardSentinel();

  globalShortcut.register("Alt+Space", toggleMainVisibility);
});

app.on("window-all-closed", () => {
  stopClipboardSentinel();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  createMainWindow();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  stopClipboardSentinel();
});
