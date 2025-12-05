import TitleBar from "./TitleBar";
import { ReactNode } from "react";

export default function DesktopShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#030712",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TitleBar />
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

