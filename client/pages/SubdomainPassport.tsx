import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { useSubdomainPassport } from "@/contexts/SubdomainPassportContext";
import Layout from "@/components/Layout";
import PassportSummary from "@/components/passport/PassportSummary";
import ProjectPassport from "@/components/passport/ProjectPassport";
import GroupPassport from "@/components/passport/GroupPassport";
import FourOhFourPage from "@/pages/404";
import Index from "@/pages/Index";
import type { AethexUserProfile } from "@/lib/aethex-database-adapter";

const getApiBase = () =>
  typeof window !== "undefined" ? window.location.origin : "";

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

interface GroupPassportResponse {
  type: "group";
  group: {
    id: string;
    name: string;
    description: string | null;
    logo_url: string | null;
    banner_url: string | null;
    website: string | null;
    github_url: string | null;
    created_at: string;
    updated_at: string;
    memberCount: number;
    members: Array<{
      userId: string;
      role: string;
      joinedAt: string;
      user: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
      };
    }>;
  };
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
  }>;
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
    | CreatorPassportResponse
    | ProjectPassportResponse
    | GroupPassportResponse
    | null
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

        const apiBase = getApiBase();
        if (!apiBase) {
          setError("Cannot determine API base");
          setLoading(false);
          return;
        }

        let url = "";
        if (subdomainInfo.isCreatorPassport) {
          url = `${apiBase}/api/passport/subdomain-data/${encodeURIComponent(
            subdomainInfo.subdomain,
          )}`;
        } else if (subdomainInfo.isProjectPassport) {
          url = `${apiBase}/api/passport/project-data/${encodeURIComponent(
            subdomainInfo.subdomain,
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
            errorData.error || `HTTP ${response.status}: Not found`,
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
    const passportType = subdomainInfo.isCreatorPassport ? "creator" : "group";
    return <LoadingScreen message={`Loading ${passportType} passport...`} />;
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
    const user = data.user as any;
    return (
      <Layout>
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          <PassportSummary
            profile={user}
            achievements={user.achievements || []}
            interests={user.interests || []}
            isSelf={false}
            linkedProviders={user.linkedProviders || []}
          />
        </div>
      </Layout>
    );
  }

  // Render group passport
  if (
    subdomainInfo.isProjectPassport &&
    data.type === "group" &&
    "group" in data
  ) {
    return (
      <Layout>
        <div className="container mx-auto px-4 max-w-6xl">
          <GroupPassport
            group={data.group}
            projects={data.projects}
            owner={data.owner}
          />
        </div>
      </Layout>
    );
  }

  return <FourOhFourPage />;
};

export default SubdomainPassport;
