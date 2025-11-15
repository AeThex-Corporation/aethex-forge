import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { useSubdomainPassport } from "@/contexts/SubdomainPassportContext";
import Layout from "@/components/Layout";
import PassportSummary from "@/components/passport/PassportSummary";
import ProjectPassport from "@/components/passport/ProjectPassport";
import FourOhFourPage from "@/pages/404";
import Index from "@/pages/Index";
import type { AethexUserProfile } from "@/lib/aethex-database-adapter";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface CreatorPassportResponse {
  type: "creator";
  user: AethexUserProfile;
  domain: string;
}

interface ProjectPassportResponse {
  type: "project";
  project: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    user_id: string;
    created_at: string;
    updated_at: string;
    status?: string;
    image_url?: string;
    website?: string;
  };
  owner?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  domain: string;
}

const SubdomainPassport = () => {
  const { subdomainInfo, isLoading: isSubdomainLoading } =
    useSubdomainPassport();
  const [data, setData] = useState<
    CreatorPassportResponse | ProjectPassportResponse | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPassportData = async () => {
      if (isSubdomainLoading || !subdomainInfo) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let url = "";
        if (subdomainInfo.isCreatorPassport) {
          url = `${API_BASE}/api/passport/subdomain/${encodeURIComponent(
            subdomainInfo.subdomain
          )}`;
        } else if (subdomainInfo.isProjectPassport) {
          url = `${API_BASE}/api/passport/project/${encodeURIComponent(
            subdomainInfo.subdomain
          )}`;
        }

        if (!url) {
          setError("Invalid subdomain configuration");
          setLoading(false);
          return;
        }

        console.log("[SubdomainPassport] Fetching:", url);

        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP ${response.status}: Not found`
          );
        }

        const result = await response.json();
        setData(result);
      } catch (e: any) {
        console.error("[SubdomainPassport] Error:", e?.message);
        setError(e?.message || "Failed to load passport");
      } finally {
        setLoading(false);
      }
    };

    fetchPassportData();
  }, [subdomainInfo, isSubdomainLoading]);

  // Still detecting subdomain
  if (isSubdomainLoading) {
    return <LoadingScreen message="Detecting passport..." />;
  }

  // No subdomain detected - not a subdomain request, show main Index page
  if (!subdomainInfo) {
    return <Index />;
  }

  // Loading passport data
  if (loading) {
    return (
      <LoadingScreen
        message={`Loading ${
          subdomainInfo.isCreatorPassport ? "creator" : "project"
        } passport...`}
      />
    );
  }

  // Error loading passport
  if (error || !data) {
    return <FourOhFourPage />;
  }

  // Render creator passport
  if (
    subdomainInfo.isCreatorPassport &&
    data.type === "creator" &&
    "user" in data
  ) {
    return (
      <Layout>
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          <PassportSummary
            profile={data.user as any}
            achievements={[]}
            interests={[]}
            isSelf={false}
            linkedProviders={[]}
          />
        </div>
      </Layout>
    );
  }

  // Render project passport
  if (
    subdomainInfo.isProjectPassport &&
    data.type === "project" &&
    "project" in data
  ) {
    return (
      <ProjectPassport
        project={data.project}
        owner={data.owner}
        isSubdomain={true}
      />
    );
  }

  return <FourOhFourPage />;
};

export default SubdomainPassport;
