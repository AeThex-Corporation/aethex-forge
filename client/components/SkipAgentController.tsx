import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { setSkipAgentActive } from "@/lib/skip-agent";

const DOCS_PATH_PREFIX = "/docs";

const SkipAgentController = () => {
  const location = useLocation();

  useEffect(() => {
    const disableForDocs = location.pathname.startsWith(DOCS_PATH_PREFIX);
    void setSkipAgentActive(!disableForDocs);
  }, [location.pathname]);

  return null;
};

export default SkipAgentController;
