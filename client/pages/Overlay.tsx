import { useState } from "react";

const defaultPath = "C:/Projects/Roblox"; // change as needed

export default function Overlay() {
  const [dir, setDir] = useState(defaultPath);
  const [status, setStatus] = useState<"idle" | "watching">("idle");

  const start = async () => {
    try {
      await (window as any)?.aeBridge?.startWatcher(dir);
      setStatus("watching");
    } catch (e) {
      console.error(e);
    }
  };

  const stop = async () => {
    try {
      await (window as any)?.aeBridge?.stopWatcher();
      setStatus("idle");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "rgba(3, 7, 18, 0.88)",
        color: "#e5e7eb",
        fontFamily: "Inter, sans-serif",
        padding: 20,
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ marginBottom: 12, fontSize: 12, letterSpacing: "0.1em" }}>
        AeThex Overlay — On-Top Sidecar
      </div>
      <div
        style={{
          border: "1px solid #38bdf8",
          borderRadius: 12,
          padding: 14,
          background: "rgba(14, 165, 233, 0.07)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>
          File Watcher
        </div>
        <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
          Folder to watch (.lua / .cs / .ts / .tsx)
        </label>
        <input
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #1f2937",
            background: "#0f172a",
            color: "#e5e7eb",
            marginBottom: 10,
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={start}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #38bdf8",
              background: "rgba(56, 189, 248, 0.14)",
              color: "#e0f2fe",
              cursor: "pointer",
            }}
          >
            Start
          </button>
          <button
            onClick={stop}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ef4444",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#fecdd3",
              cursor: "pointer",
            }}
          >
            Stop
          </button>
          <span style={{ fontSize: 12, opacity: 0.8, alignSelf: "center" }}>
            Status: {status}
          </span>
        </div>
        <div style={{ fontSize: 11, marginTop: 10, opacity: 0.75 }}>
          PII is scrubbed locally before any processing.
        </div>
      </div>
    </div>
  );
}

