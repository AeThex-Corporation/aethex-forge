import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("aeBridge", {
  startWatcher: (dir) => ipcRenderer.invoke("watcher:start", dir),
  stopWatcher: () => ipcRenderer.invoke("watcher:stop"),
  togglePin: () => ipcRenderer.invoke("window:toggle-pin"),
  close: () => ipcRenderer.invoke("window:close"),
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  onClipboardAlert: (fn) =>
    ipcRenderer.on("sentinel:clipboard-alert", (_e, payload) => fn(payload)),
});

