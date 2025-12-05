import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("aeBridge", {
  startWatcher: (dir) => ipcRenderer.invoke("watcher:start", dir),
  stopWatcher: () => ipcRenderer.invoke("watcher:stop"),

  togglePin: () => ipcRenderer.invoke("window:toggle-pin"),
  isPinned: () => ipcRenderer.invoke("window:is-pinned"),
  close: () => ipcRenderer.invoke("window:close"),
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),

  onClipboardAlert: (callback) => {
    ipcRenderer.on("sentinel:clipboard-alert", (_event, payload) =>
      callback(payload)
    );
    return () => {
      ipcRenderer.removeAllListeners("sentinel:clipboard-alert");
    };
  },
});
