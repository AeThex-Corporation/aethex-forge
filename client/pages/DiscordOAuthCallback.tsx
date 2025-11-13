import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import LoadingScreen from "@/components/LoadingScreen";

export default function DiscordOAuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      window.location.href = `/login?error=${error}`;
      return;
    }

    if (!code) {
      window.location.href = "/login?error=no_code";
      return;
    }

    const params = new URLSearchParams({
      code,
      state: state || "/dashboard",
      ...(error && { error }),
    });

    window.location.href = `/api/discord/oauth/callback?${params.toString()}`;
  }, [searchParams]);

  return (
    <Layout>
      <SEO title="Discord Authentication | AeThex" />
      <LoadingScreen
        message="Completing Discord authentication..."
        showProgress
        duration={10000}
      />
    </Layout>
  );
}
