import { ipcMain } from "electron";
import { getMainWindow } from "./windows.js";
import { startWatcher, stopWatcher } from "../services/watcher.js";

let pinned = false;

export function registerIpcHandlers() {
  ipcMain.handle("watcher:start", async (_event, dir) => {
    if (!dir || typeof dir !== "string") {
      throw new Error("Invalid directory path");
    }
    await startWatcher(dir);
    return true;
  });

  ipcMain.handle("watcher:stop", async () => {
    await stopWatcher();
    return true;
  });

  ipcMain.handle("window:toggle-pin", () => {
    const mainWindow = getMainWindow();
    pinned = !pinned;
    mainWindow?.setAlwaysOnTop(pinned, "floating");
    return pinned;
  });

  ipcMain.handle("window:close", () => {
    const mainWindow = getMainWindow();
    mainWindow?.close();
  });

  ipcMain.handle("window:minimize", () => {
    const mainWindow = getMainWindow();
    mainWindow?.minimize();
  });

  ipcMain.handle("window:maximize", () => {
    const mainWindow = getMainWindow();
    if (!mainWindow) return false;
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return mainWindow.isMaximized();
  });

  ipcMain.handle("window:is-pinned", () => {
    return pinned;
  });
}
