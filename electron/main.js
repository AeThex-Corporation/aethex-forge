import {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  clipboard,
  dialog, // Import dialog for file selection
  shell, // Import shell for opening paths
} from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs"; // Import fs.promises for async file operations
import chokidar from "chokidar"; // Import chokidar for file watching
import { startWatcher, stopWatcher } from "../services/watcher.js";
import { scrubPII } from "../services/pii-scrub.js";
import { execa } from "execa"; // Import execa for running Git commands

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
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
      sandbox: false,
    },
  });

  const url = getRendererUrl();
  console.log("[Main] Loading URL:", url);
  
  // Clear cache to prevent stale assets
  mainWindow.webContents.session.clearCache();
  
  // Disable caching in development
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      details.requestHeaders["Cache-Control"] = "no-store, no-cache, must-revalidate, proxy-revalidate";
      callback({ requestHeaders: details.requestHeaders });
    }
  );
  
  // If loading from dev server, wait a moment for it to start
  if (process.env.VITE_DEV_SERVER_URL) {
    setTimeout(() => {
      mainWindow.loadURL(url).catch(err => {
        console.error('[Main] Failed to load:', err);
        setTimeout(() => mainWindow.loadURL(url), 1000);
      });
    }, 1000);
  } else {
    mainWindow.loadURL(url);
  }
  
  mainWindow.webContents.openDevTools();
  
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('[Main] Failed to load:', errorCode, errorDescription);
    setTimeout(() => mainWindow.loadURL(url), 1000);
  });
  
  mainWindow.webContents.on('crashed', () => {
    console.error('[Main] Renderer crashed');
  });
}

function createOverlayWindow() {
  // Overlay window disabled for now - it was blocking clicks on main window
  /*
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
  */
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
  // createOverlayWindow();  // Disabled for debugging
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

  // File system IPC handlers
  ipcMain.handle("fs:select-folder", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    if (canceled) return null;
    return filePaths[0];
  });

  ipcMain.handle("fs:select-files", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile", "multiSelections"],
    });
    if (canceled) return null;
    return filePaths;
  });

  ipcMain.handle("fs:read-project-metadata", async (_e, folderPath) => {
    try {
      const packageJsonPath = path.join(folderPath, "package.json");
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
      return {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        // Add more metadata as needed
      };
    } catch (error) {
      console.error("Failed to read project metadata:", error);
      return null;
    }
  });

  let activeWatchers = {};

  ipcMain.handle("fs:watch-folder", async (_e, folderPath) => {
    if (activeWatchers[folderPath]) {
      console.log(`Already watching ${folderPath}`);
      return true;
    }

    const watcher = chokidar.watch(folderPath, {
      ignored: /(^|\/)\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on("add", (filePath) => {
      mainWindow?.webContents.send("fs:file-change", {
        type: "add",
        filePath,
        folderPath,
      });
    });
    watcher.on("change", (filePath) => {
      mainWindow?.webContents.send("fs:file-change", {
        type: "change",
        filePath,
        folderPath,
      });
    });
    watcher.on("unlink", (filePath) => {
      mainWindow?.webContents.send("fs:file-change", {
        type: "unlink",
        filePath,
        folderPath,
      });
    });
    watcher.on("addDir", (dirPath) => {
      mainWindow?.webContents.send("fs:folder-change", {
        type: "add",
        dirPath,
        folderPath,
      });
    });
    watcher.on("unlinkDir", (dirPath) => {
      mainWindow?.webContents.send("fs:folder-change", {
        type: "unlink",
        dirPath,
        folderPath,
      });
    });

    activeWatchers[folderPath] = watcher;
    console.log(`Started watching ${folderPath}`);
    return true;
  });

  ipcMain.handle("fs:unwatch-folder", async (_e, folderPath) => {
    if (activeWatchers[folderPath]) {
      await activeWatchers[folderPath].close();
      delete activeWatchers[folderPath];
      console.log(`Stopped watching ${folderPath}`);
    }
    return true;
  });

  // Git IPC handlers
  ipcMain.handle("git:get-status", async (_e, folderPath) => {
    try {
      const { stdout } = await execa("git", ["status", "--porcelain"], { cwd: folderPath });
      const changes = stdout.split("\n").filter(line => line.trim() !== "");
      let status = "clean";
      if (changes.length > 0) {
        status = "modified";
      }
      const { stdout: branchOutput } = await execa("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: folderPath });
      const branch = branchOutput.trim();
      return { status, branch, changes: changes.length };
    } catch (error) {
      console.error(`Failed to get Git status for ${folderPath}:`, error);
      return { status: "error", branch: "N/A", changes: 0, error: error.message };
    }
  });

  ipcMain.handle("git:pull", async (_e, folderPath) => {
    try {
      const { stdout } = await execa("git", ["pull"], { cwd: folderPath });
      return { success: true, output: stdout };
    } catch (error) {
      console.error(`Failed to pull Git changes for ${folderPath}:`, error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("git:push", async (_e, folderPath) => {
    try {
      const { stdout } = await execa("git", ["push"], { cwd: folderPath });
      return { success: true, output: stdout };
    } catch (error) {
      console.error(`Failed to push Git changes for ${folderPath}:`, error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("shell:open-path", async (_e, itemPath) => {
    try {
      await shell.openPath(itemPath);
      return { success: true };
    } catch (error) {
      console.error(`Failed to open path ${itemPath}:`, error);
      return { success: false, error: error.message };
    }
  });

  // Build runner - runs a project's build script in a safe, cwd-restricted manner
  ipcMain.handle("build:run", async (_e, folderPath) => {
    try {
      // Ensure folder exists
      await fs.stat(folderPath);
    } catch (err) {
      console.error("Build run failed - folder not found:", folderPath, err?.message || err);
      return { success: false, error: "folder-not-found" };
    }

    try {
      // Default to running the repo's npm build script. This keeps scope narrow and predictable.
      const child = execa("npm", ["run", "build"], { cwd: folderPath });

      // Stream stdout/stderr back to renderer for live logs
      if (child.stdout) {
        child.stdout.on("data", (chunk) => {
          mainWindow?.webContents.send("build:log", {
            folderPath,
            type: "stdout",
            text: String(chunk),
          });
        });
      }
      if (child.stderr) {
        child.stderr.on("data", (chunk) => {
          mainWindow?.webContents.send("build:log", {
            folderPath,
            type: "stderr",
            text: String(chunk),
          });
        });
      }

      mainWindow?.webContents.send("build:log", { folderPath, type: "start", text: "Build started" });

      const result = await child;

      mainWindow?.webContents.send("build:log", { folderPath, type: "finish", text: result.stdout || "Build finished" });

      return { success: true, output: result.stdout || "" };
    } catch (error) {
      console.error(`Build failed for ${folderPath}:`, error);
      mainWindow?.webContents.send("build:log", { folderPath, type: "error", text: error?.message || String(error) });
      return { success: false, error: error?.message || String(error) };
    }
  });
});

// Don't quit the app when all windows are closed in development
// This allows the app to stay running and prevents auto-close
app.on("window-all-closed", () => {
  // Only quit on macOS - on Windows/Linux, keep the app running
  // This prevents the immediate close issue
  if (process.platform === "darwin") app.quit();
});

