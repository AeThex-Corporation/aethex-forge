import { useState, CSSProperties, useEffect } from "react";
import type { AeBridge } from "../types/preload";

interface TitleBarProps {
  title?: string;
}

export default function TitleBar({ title = "AeThex Terminal" }: TitleBarProps) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const bridge = window.aeBridge;
    if (bridge?.isPinned) {
      bridge.isPinned().then(setPinned).catch(() => {});
    }
  }, []);

  const call = async (method: keyof AeBridge) => {
    const api = window.aeBridge;
    if (!api || typeof api[method] !== "function") return;
    const fn = api[method] as () => Promise<boolean>;
    const res = await fn();
    if (method === "togglePin") setPinned(res);
  };

  return (
    <div
      style={{
        height: 36,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        background: "#050814",
        color: "#9ca3af",
        WebkitAppRegion: "drag",
        borderBottom: "1px solid #0f172a",
        letterSpacing: "0.08em",
        fontSize: 12,
      } as CSSProperties}
    >
      <div style={{ fontFamily: "Space Mono, monospace" }}>{title}</div>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 8,
          WebkitAppRegion: "no-drag",
        } as CSSProperties}
      >
        <button
          onClick={() => call("togglePin")}
          style={btnStyle(pinned ? "#38bdf8" : "#1f2937")}
          title="Pin / Unpin"
        >
          {pinned ? "📌" : "Pin"}
        </button>
        <button
          onClick={() => call("minimize")}
          style={btnStyle("#1f2937")}
          title="Minimize"
        >
          —
        </button>
        <button
          onClick={() => call("maximize")}
          style={btnStyle("#1f2937")}
          title="Maximize / Restore"
        >
          ▢
        </button>
        <button
          onClick={() => call("close")}
          style={btnStyle("#ef4444")}
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function btnStyle(bg: string): CSSProperties {
  return {
    border: "1px solid #111827",
    background: bg,
    color: "#e5e7eb",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: 12,
    minWidth: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}
