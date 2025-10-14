import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Safely load HelloSkip agent: fetch the script first and only evaluate if fetching succeeds.
// This prevents the external script from executing its runtime network checks when the host
// environment blocks cross-origin requests, avoiding uncaught "Failed to fetch" errors.
(async function loadHelloSkipAgent() {
  try {
    if (!('fetch' in window) || !navigator.onLine) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch('https://helloskip.com/agent.js', { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error('Failed to download HelloSkip agent script');

    const scriptText = await res.text();
    const blob = new Blob([scriptText], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);

    const s = document.createElement('script');
    s.src = url;
    s.dataset.agentId = 'vVEuropu5l7xvT4Swwif';
    s.async = true;
    s.onload = () => {
      URL.revokeObjectURL(url);
    };
    s.onerror = (e) => {
      console.warn('HelloSkip agent failed to execute', e);
      URL.revokeObjectURL(url);
    };

    document.body.appendChild(s);
  } catch (err) {
    console.warn('Skipped loading HelloSkip agent:', err);
  }
})();
