import TitleBar from "./TitleBar";
import { ReactNode } from "react";

interface DesktopShellProps {
  children: ReactNode;
  title?: string;
}

export default function DesktopShell({ children, title }: DesktopShellProps) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#030712",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TitleBar title={title} />
      <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
    </div>
  );
}
