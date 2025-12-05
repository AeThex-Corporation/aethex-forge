export interface ClipboardAlertPayload {
  original: string;
  scrubbed: string;
}

export interface AeBridge {
  startWatcher: (dir: string) => Promise<boolean>;
  stopWatcher: () => Promise<boolean>;
  togglePin: () => Promise<boolean>;
  isPinned: () => Promise<boolean>;
  close: () => Promise<void>;
  minimize: () => Promise<void>;
  maximize: () => Promise<boolean>;
  onClipboardAlert: (callback: (payload: ClipboardAlertPayload) => void) => () => void;
}

declare global {
  interface Window {
    aeBridge?: AeBridge;
  }
}

export {};
