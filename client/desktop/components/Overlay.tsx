import { useState } from "react";
import "../types/preload";

interface OverlayProps {
  defaultPath?: string;
}

export default function Overlay({ defaultPath = "" }: OverlayProps) {
  const [dir, setDir] = useState(defaultPath);
  const [status, setStatus] = useState<"idle" | "watching" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    try {
      setError(null);
      await window.aeBridge?.startWatcher(dir);
      setStatus("watching");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to start watcher";
      setError(message);
      setStatus("error");
    }
  };

  const stop = async () => {
    try {
      setError(null);
      await window.aeBridge?.stopWatcher();
      setStatus("idle");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to stop watcher";
      setError(message);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "rgba(3, 7, 18, 0.92)",
        color: "#e5e7eb",
        fontFamily: "Inter, sans-serif",
        padding: 16,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          marginBottom: 12,
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        AeThex Overlay
      </div>

      <div
        style={{
          border: "1px solid #38bdf8",
          borderRadius: 12,
          padding: 16,
          background: "rgba(14, 165, 233, 0.06)",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            marginBottom: 12,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>📂</span> File Watcher
        </div>

        <label
          style={{
            display: "block",
            fontSize: 11,
            marginBottom: 6,
            opacity: 0.8,
          }}
        >
          Directory to watch
        </label>
        <input
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          placeholder="Enter folder path..."
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #1f2937",
            background: "#0f172a",
            color: "#e5e7eb",
            marginBottom: 12,
            fontSize: 13,
          }}
        />

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button
            onClick={start}
            disabled={status === "watching" || !dir}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #22c55e",
              background:
                status === "watching"
                  ? "rgba(34, 197, 94, 0.3)"
                  : "rgba(34, 197, 94, 0.1)",
              color: "#86efac",
              cursor: status === "watching" || !dir ? "not-allowed" : "pointer",
              opacity: status === "watching" || !dir ? 0.5 : 1,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            ▶ Start
          </button>
          <button
            onClick={stop}
            disabled={status !== "watching"}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #ef4444",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#fca5a5",
              cursor: status !== "watching" ? "not-allowed" : "pointer",
              opacity: status !== "watching" ? 0.5 : 1,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            ⏹ Stop
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background:
                status === "watching"
                  ? "#22c55e"
                  : status === "error"
                    ? "#ef4444"
                    : "#6b7280",
            }}
          />
          <span style={{ opacity: 0.8 }}>
            {status === "watching"
              ? "Watching for changes..."
              : status === "error"
                ? "Error"
                : "Idle"}
          </span>
        </div>

        {error && (
          <div
            style={{
              marginTop: 8,
              padding: 8,
              borderRadius: 6,
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              fontSize: 11,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            fontSize: 10,
            marginTop: 12,
            opacity: 0.5,
            borderTop: "1px solid #1f2937",
            paddingTop: 10,
          }}
        >
          PII is scrubbed locally before processing
        </div>
      </div>
    </div>
  );
}
