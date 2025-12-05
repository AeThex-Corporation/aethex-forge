import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DesktopShell } from "./components";
import ErrorBoundary from "../components/ErrorBoundary";
import App from "../App";
import "../global.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <DesktopShell title="AeThex">
        <App />
      </DesktopShell>
    </ErrorBoundary>
  </StrictMode>
);
