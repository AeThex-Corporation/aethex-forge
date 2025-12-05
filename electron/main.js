import {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  clipboard,
} from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startWatcher, stopWatcher } from "../services/watcher.js";
import { scrubPII } from "../services/pii-scrub.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let overlayWindow = null;
let pinned = false;
let sentinelInterval = null;

function getRendererUrl() {
  return (
    process.env.VITE_DEV_SERVER_URL ||
    `file://${path.join(__dirname, "../dist/spa/index.html")}`
  );
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#030712",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(getRendererUrl());
}

function createOverlayWindow() {
  overlayWindow = new BrowserWindow({
    width: 420,
    height: 640,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    focusable: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  overlayWindow.setAlwaysOnTop(true, "floating");
  const base = getRendererUrl();
  // Assumes your SPA has a route for /overlay
  overlayWindow.loadURL(base + "#/overlay");
}

function toggleMainVisibility() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
}

function startClipboardSentinel() {
  if (sentinelInterval) return;
  let last = clipboard.readText();
  sentinelInterval = setInterval(() => {
    const now = clipboard.readText();
    if (now !== last) {
      last = now;
      const scrubbed = scrubPII(now);
      if (scrubbed !== now) {
        mainWindow?.webContents.send("sentinel:clipboard-alert", now);
      }
    }
  }, 1500);
}

app.whenReady().then(() => {
  createMainWindow();
  createOverlayWindow();
  startClipboardSentinel();

  // Global hotkey to toggle visibility
  globalShortcut.register("Alt+Space", toggleMainVisibility);

  ipcMain.handle("watcher:start", async (_e, dir) => {
    await startWatcher(dir);
    return true;
  });

  ipcMain.handle("watcher:stop", async () => {
    await stopWatcher();
    return true;
  });

  ipcMain.handle("window:toggle-pin", () => {
    pinned = !pinned;
    mainWindow?.setAlwaysOnTop(pinned, "floating");
    return pinned;
  });

  ipcMain.handle("window:close", () => {
    mainWindow?.close();
  });

  ipcMain.handle("window:minimize", () => {
    mainWindow?.minimize();
  });

  ipcMain.handle("window:maximize", () => {
    if (!mainWindow) return false;
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return mainWindow.isMaximized();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

