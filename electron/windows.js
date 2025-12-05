import { BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let overlayWindow = null;

export function getMainWindow() {
  return mainWindow;
}

export function getOverlayWindow() {
  return overlayWindow;
}

export function getRendererUrl(entryFile = "desktop-main.html") {
  if (process.env.VITE_DEV_SERVER_URL) {
    return `${process.env.VITE_DEV_SERVER_URL}/${entryFile}`;
  }
  return `file://${path.join(__dirname, "../dist/desktop", entryFile)}`;
}

export function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#030712",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(getRendererUrl("desktop-main.html"));

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  return mainWindow;
}

export function createOverlayWindow() {
  overlayWindow = new BrowserWindow({
    width: 380,
    height: 320,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    focusable: true,
    skipTaskbar: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  overlayWindow.setAlwaysOnTop(true, "floating");
  overlayWindow.loadURL(getRendererUrl("desktop-overlay.html"));

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });

  return overlayWindow;
}

export function toggleMainVisibility() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
}
