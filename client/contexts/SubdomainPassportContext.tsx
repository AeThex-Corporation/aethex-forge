import { createContext, useContext, useEffect, useState } from "react";

interface SubdomainInfo {
  subdomain: string;
  domain: string;
  isCreatorPassport: boolean;
  isProjectPassport: boolean;
}

interface SubdomainPassportContextType {
  subdomainInfo: SubdomainInfo | null;
  isLoading: boolean;
  error: string | null;
}

const SubdomainPassportContext = createContext<SubdomainPassportContextType>({
  subdomainInfo: null,
  isLoading: true,
  error: null,
});

export const useSubdomainPassport = () => {
  const context = useContext(SubdomainPassportContext);
  if (!context) {
    throw new Error(
      "useSubdomainPassport must be used within SubdomainPassportProvider",
    );
  }
  return context;
};

export const SubdomainPassportProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [subdomainInfo, setSubdomainInfo] = useState<SubdomainInfo | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectSubdomain = () => {
      try {
        const hostname = window.location.hostname;
        let subdomain = "";
        let domain = "";

        if (hostname.includes("aethex.me")) {
          const parts = hostname.split(".");
          if (parts.length > 2) {
            subdomain = parts[0];
            domain = "aethex.me";
          }
        } else if (hostname.includes("aethex.space")) {
          const parts = hostname.split(".");
          if (parts.length > 2) {
            subdomain = parts[0];
            domain = "aethex.space";
          }
        }

        if (domain) {
          const info: SubdomainInfo = {
            subdomain,
            domain,
            isCreatorPassport: domain === "aethex.me",
            isProjectPassport: domain === "aethex.space",
          };
          setSubdomainInfo(info);
          console.log("[SubdomainPassport] Detected:", info);
        } else {
          setSubdomainInfo(null);
        }
      } catch (e: any) {
        console.error("[SubdomainPassport] Detection error:", e?.message);
        setError("Failed to detect subdomain");
      } finally {
        setIsLoading(false);
      }
    };

    detectSubdomain();
  }, []);

  return (
    <SubdomainPassportContext.Provider
      value={{
        subdomainInfo,
        isLoading,
        error,
      }}
    >
      {children}
    </SubdomainPassportContext.Provider>
  );
};
