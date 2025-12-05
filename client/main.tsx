import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Overlay from "./pages/Overlay";
import DesktopShell from "./components/DesktopShell";
import ErrorBoundary from "./components/ErrorBoundary";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

const hash = typeof window !== "undefined" ? window.location.hash : "";
if (hash.startsWith("#/overlay")) {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <Overlay />
      </ErrorBoundary>
    </StrictMode>,
  );
} else {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <DesktopShell>
          <App />
        </DesktopShell>
      </ErrorBoundary>
    </StrictMode>,
  );
}
