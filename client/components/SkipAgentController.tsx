import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { setSkipAgentActive, disableSkipAgent } from "@/lib/skip-agent";

const DOCS_PATH_PREFIX = "/docs";

const SkipAgentController = () => {
  const location = useLocation();

  useEffect(() => {
    // Require an explicit opt-in to enable third-party agents.
    // Set `window.__AETHEX_ENABLE_SKIP_AGENT = true` in the browser console or a hosting config
    // to opt into loading partner SDKs outside of /docs pages.
    const optedIn = typeof window !== "undefined" && (window as any).__AETHEX_ENABLE_SKIP_AGENT === true;
    const onDocs = location.pathname.startsWith(DOCS_PATH_PREFIX);

    if (optedIn && !onDocs) {
      void setSkipAgentActive(true);
    } else {
      // Ensure the agent is disabled by default or on docs routes
      disableSkipAgent();
    }

    return () => {
      // Keep the agent disabled on unmount to avoid leaks across route changes
      disableSkipAgent();
    };
  }, [location.pathname]);

  return null;
};

export default SkipAgentController;
