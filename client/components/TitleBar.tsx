import { useState, CSSProperties } from "react";

export default function TitleBar() {
  const [pinned, setPinned] = useState(false);

  const call = async (method: string) => {
    const api = (window as any)?.aeBridge;
    if (!api || !api[method]) return;
    const res = await api[method]();
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
        // @ts-ignore - Electron-specific property
        WebkitAppRegion: "drag",
        borderBottom: "1px solid #0f172a",
        letterSpacing: "0.08em",
        fontSize: 12,
      } as CSSProperties}
    >
      <div style={{ fontFamily: "Space Mono, monospace" }}>AeThex Terminal</div>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 8,
          // @ts-ignore - Electron-specific property
          WebkitAppRegion: "no-drag",
        } as CSSProperties}
      >
        <button
          onClick={() => call("togglePin")}
          style={btnStyle(pinned ? "#38bdf8" : "#1f2937")}
          title="Pin / Unpin"
        >
          {pinned ? "Pinned" : "Pin"}
        </button>
        <button
          onClick={() => call("minimize")}
          style={btnStyle("#1f2937")}
          title="Minimize"
        >
          _
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
          X
        </button>
      </div>
    </div>
  );
}

function btnStyle(bg: string) {
  return {
    border: "1px solid #111827",
    background: bg,
    color: "#e5e7eb",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: 12,
    minWidth: 46,
  } as React.CSSProperties;
}

