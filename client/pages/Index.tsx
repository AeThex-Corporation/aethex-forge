import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import IsometricRealmSelector from "@/components/IsometricRealmSelector";

export default function Index() {
  return (
    <Layout>
      <SEO
        pageTitle="AeThex | Immersive OS"
        description="AeThex OS — Cyberpunk Animus command center for Nexus, GameForge, Foundation, Labs, and Corp."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />
      <IsometricRealmSelector />
    </Layout>
  );
}
