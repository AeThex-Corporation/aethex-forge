declare global {
  interface Window {
    SkipAgent?: {
      embed: (
        agentId: string,
        options?: Record<string, unknown>,
      ) => Promise<unknown>;
    };
    __aethexSkipAgentInit?: boolean;
  }
}

const SKIP_AGENT_ID = "vVEuropu5l7xvT4Swwif";
// Default agent src intentionally empty to avoid unconfigured external fetches.
// Operators must set `window.__AETHEX_SKIP_AGENT_CONFIG = { src, id }` to enable runtime loading.
const SKIP_AGENT_SRC = "";
const SKIP_AGENT_SCRIPT_ID = "aethex-skip-agent-runtime";
const SKIP_AGENT_THEME_ID = "aethex-skip-agent-theme";

const SKIP_AGENT_EMBED_OPTIONS = {
  buttonSize: 66,
  iframeWidth: 448,
  iframeHeight: "85vh",
  buttonPosition: "bottom-right",
  buttonOffset: { x: 32, y: 32 },
  animationDuration: 240,
  tooltipText: "Need a hand?\nAeThex Copilot is live.",
  tooltipColor: "#16122A",
  zIndex: 2_147_483_000,
};

const SKIP_AGENT_THEME = `
.skip-agent-button {
  background-image: linear-gradient(135deg, hsl(var(--aethex-600)) 0%, hsl(var(--neon-blue)) 48%, hsl(var(--neon-purple)) 100%) !important;
  border-radius: 1.25rem !important;
  border: 1px solid hsla(252, 88%, 68%, 0.35) !important;
  box-shadow:
    0 18px 38px rgba(24, 18, 54, 0.65),
    0 0 0 1px rgba(126, 106, 255, 0.28) !important;
  color: hsl(var(--primary-foreground)) !important;
  backdrop-filter: blur(18px);
  transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease !important;
}

.skip-agent-button:hover {
  transform: translateY(-2px) scale(1.04) !important;
  box-shadow:
    0 24px 48px rgba(26, 20, 66, 0.7),
    0 0 0 1px rgba(126, 106, 255, 0.42) !important;
}

.skip-agent-button:active {
  transform: translateY(1px) scale(0.97) !important;
}

.skip-agent-button:focus-visible {
  outline: 2px solid hsl(var(--neon-blue)) !important;
  outline-offset: 4px !important;
}

.skip-agent-button svg {
  width: 26px !important;
  height: 26px !important;
  stroke: currentColor !important;
  stroke-width: 1.6 !important;
  fill: none !important;
}

.skip-agent-tooltip {
  background: rgba(14, 12, 28, 0.93) !important;
  color: hsl(var(--foreground)) !important;
  border: 1px solid hsla(252, 88%, 68%, 0.35) !important;
  box-shadow: 0 18px 34px rgba(8, 6, 24, 0.7) !important;
  backdrop-filter: blur(20px);
  font-family: inherit !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.04em !important;
  text-transform: uppercase;
  line-height: 1.25rem !important;
  white-space: pre-line;
}

.skip-agent-iframe-container {
  background: rgba(9, 11, 22, 0.92) !important;
  border-radius: 1.5rem !important;
  border: 1px solid hsla(252, 88%, 68%, 0.28) !important;
  box-shadow:
    0 40px 72px rgba(5, 8, 24, 0.75),
    0 0 0 1px rgba(126, 106, 255, 0.22) !important;
  backdrop-filter: blur(26px);
  overflow: hidden !important;
}

.skip-agent-iframe {
  background: transparent !important;
}

.skip-agent-overlay {
  background: radial-gradient(circle at 85% 15%, rgba(102, 76, 255, 0.35), rgba(5, 8, 20, 0.85)) !important;
  backdrop-filter: blur(6px);
}

.skip-agent-close {
  top: 18px !important;
  right: 18px !important;
  width: 40px !important;
  height: 40px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 9999px !important;
  border: 1px solid hsla(252, 88%, 68%, 0.35) !important;
  background: rgba(20, 16, 36, 0.85) !important;
  color: hsl(var(--foreground)) !important;
  font-size: 18px !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

.skip-agent-close:hover {
  transform: rotate(90deg) scale(1.05) !important;
  box-shadow: 0 12px 28px rgba(32, 24, 76, 0.55) !important;
}

.skip-agent-close:focus-visible {
  outline: 2px solid hsl(var(--neon-blue)) !important;
  outline-offset: 3px !important;
}

.skip-agent-loading {
  background: linear-gradient(135deg, rgba(18, 14, 34, 0.92), rgba(10, 12, 26, 0.88)) !important;
  border-radius: 1.25rem !important;
  border: 1px solid hsla(252, 88%, 68%, 0.25) !important;
  padding: 1.5rem !important;
  gap: 0.75rem !important;
  box-shadow: inset 0 0 0 1px rgba(126, 106, 255, 0.2) !important;
}

.skip-agent-spinner {
  border: 3px solid rgba(126, 106, 255, 0.15) !important;
  border-top-color: hsl(var(--neon-blue)) !important;
}

.skip-agent-loading-text {
  color: hsl(var(--muted-foreground)) !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.2em !important;
  text-transform: uppercase !important;
}

@media (prefers-reduced-motion: reduce) {
  .skip-agent-button,
  .skip-agent-iframe-container,
  .skip-agent-overlay {
    transition: none !important;
  }
}

@media (max-width: 768px) {
  .skip-agent-button {
    width: 60px !important;
    height: 60px !important;
    border-radius: 1rem !important;
  }

  .skip-agent-iframe-container {
    border-radius: 1.25rem !important;
    inset-inline: 16px !important;
  }
}
`;

const SKIP_AGENT_ROOT_SELECTORS = [
  ".skip-agent-button",
  ".skip-agent-overlay",
  ".skip-agent-iframe-container",
  ".skip-agent-tooltip",
  ".skip-agent-notification",
];

let shouldEnableSkipAgent = false;

// Allow operators to override the agent configuration at runtime when needed.
// Example override (console): window.__AETHEX_SKIP_AGENT_CONFIG = { src: 'https://example.com/agent.js', id: '...' };
const getRuntimeConfig = () => {
  try {
    if (
      typeof window !== "undefined" &&
      (window as any).__AETHEX_SKIP_AGENT_CONFIG
    ) {
      return (window as any).__AETHEX_SKIP_AGENT_CONFIG as {
        src?: string;
        id?: string;
      };
    }
  } catch (e) {
    // ignore
  }
  return null;
};

const getAgentSrc = () => {
  const cfg = getRuntimeConfig();
  return cfg?.src ?? (SKIP_AGENT_SRC ? SKIP_AGENT_SRC : null);
};

const getAgentId = () => {
  const cfg = getRuntimeConfig();
  return cfg?.id ?? SKIP_AGENT_ID;
};

const createSkipAgentTheme = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById(SKIP_AGENT_THEME_ID)) return;

  const style = document.createElement("style");
  style.id = SKIP_AGENT_THEME_ID;
  style.textContent = SKIP_AGENT_THEME;
  document.head.appendChild(style);
};

const isDocsPath = () => {
  try {
    return (
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/docs")
    );
  } catch (e) {
    return false;
  }
};

const isSkipAgentReachable = async (): Promise<boolean> => {
  if (!shouldEnableSkipAgent) {
    return false;
  }

  if (isDocsPath()) {
    // Never check or initialize the agent from documentation routes.
    return false;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4000);

  try {
    const agentSrc = getAgentSrc();
    if (!agentSrc) {
      window.clearTimeout(timeout);
      return false;
    }

    let origin: string;
    try {
      origin = new URL(agentSrc).origin;
    } catch (e) {
      window.clearTimeout(timeout);
      if (shouldEnableSkipAgent) {
        console.warn("Invalid agent src; skipping status check", agentSrc);
      }
      return false;
    }

    const response = await fetch(
      `${origin}/api/agent/status?agentId=${encodeURIComponent(getAgentId())}`,
      {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
        signal: controller.signal,
      },
    );
    window.clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Agent status request failed with ${response.status}`);
    }

    const payload = (await response.json().catch(() => null)) as {
      active?: boolean;
    } | null;

    if (payload && payload.active === false) {
      throw new Error("Agent reported inactive");
    }

    return true;
  } catch (error) {
    window.clearTimeout(timeout);
    if (shouldEnableSkipAgent) {
      console.warn(
        "Agent status endpoint unreachable; skipping embed to prevent runtime errors:",
        error,
      );
    }
    return false;
  }
};

const embedSkipAgent = async () => {
  if (!shouldEnableSkipAgent) {
    return;
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (!window.SkipAgent?.embed) {
    return;
  }

  if (window.__aethexSkipAgentInit) {
    return;
  }

  const reachable = await isSkipAgentReachable();
  if (!reachable || !shouldEnableSkipAgent) {
    return;
  }

  try {
    await window.SkipAgent.embed(getAgentId(), SKIP_AGENT_EMBED_OPTIONS);
    if (!shouldEnableSkipAgent) {
      return;
    }
    window.__aethexSkipAgentInit = true;
    createSkipAgentTheme();
  } catch (error) {
    window.__aethexSkipAgentInit = false;
    if (shouldEnableSkipAgent) {
      console.warn("Skip Agent embed failed:", error);
    }
  }
};

const removeSkipAgentNodes = () => {
  if (typeof document === "undefined") return;

  SKIP_AGENT_ROOT_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.remove();
    });
  });

  if (typeof window !== "undefined") {
    window.__aethexSkipAgentInit = false;
  }
};

const loadSkipAgent = async (): Promise<void> => {
  if (!shouldEnableSkipAgent) {
    return;
  }

  if (isDocsPath()) {
    // Prevent any network activity from documentation routes
    return;
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (typeof navigator === "undefined") {
    return;
  }

  if (!("fetch" in window)) {
    return;
  }

  if (!navigator.onLine) {
    const handleOnline = () => {
      window.removeEventListener("online", handleOnline);
      void loadSkipAgent();
    };

    window.addEventListener("online", handleOnline, { once: true });
    return;
  }

  if (window.SkipAgent?.embed) {
    await embedSkipAgent();
    return;
  }

  const existingScript = document.getElementById(
    SKIP_AGENT_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (existingScript) {
    existingScript.addEventListener(
      "load",
      () => {
        void embedSkipAgent();
      },
      { once: true },
    );
    return;
  }

  try {
    const agentSrc = getAgentSrc();
    if (!agentSrc) {
      throw new Error("No agent source configured");
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    const response = await fetch(agentSrc, { signal: controller.signal });
    window.clearTimeout(timeout);

    if (!response.ok) {
      throw new Error("Failed to download agent script");
    }

    const scriptText = await response.text();
    const blobUrl = URL.createObjectURL(
      new Blob([scriptText], { type: "application/javascript" }),
    );

    const script = document.createElement("script");
    script.id = SKIP_AGENT_SCRIPT_ID;
    script.async = true;
    script.src = blobUrl;

    script.onload = () => {
      URL.revokeObjectURL(blobUrl);
      void embedSkipAgent();
    };

    script.onerror = (event) => {
      URL.revokeObjectURL(blobUrl);
      window.__aethexSkipAgentInit = false;
      if (shouldEnableSkipAgent) {
        console.warn("Agent runtime failed to execute", event);
      }
    };

    document.body.appendChild(script);
  } catch (error) {
    window.__aethexSkipAgentInit = false;
    if (shouldEnableSkipAgent) {
      console.warn("Skipped loading agent runtime:", error);
    }
  }
};

export const setSkipAgentActive = async (active: boolean): Promise<void> => {
  shouldEnableSkipAgent = active;

  if (!active) {
    removeSkipAgentNodes();
    return;
  }

  await loadSkipAgent();
};

export const disableSkipAgent = () => {
  shouldEnableSkipAgent = false;
  removeSkipAgentNodes();
};

export const enableSkipAgent = async () => {
  shouldEnableSkipAgent = true;
  await loadSkipAgent();
};
