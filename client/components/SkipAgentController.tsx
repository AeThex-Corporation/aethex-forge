import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { setSkipAgentActive, disableSkipAgent } from "@/lib/skip-agent";

const DOCS_PATH_PREFIX = "/docs";

const SkipAgentController = () => {
  const location = useLocation();

  useEffect(() => {
    const onDocs = location.pathname.startsWith(DOCS_PATH_PREFIX);

    if (onDocs) {
      disableSkipAgent();
    } else {
      void setSkipAgentActive(true);
    }

    return () => {
      disableSkipAgent();
    };
  }, [location.pathname]);

  return null;
};

export default SkipAgentController;
