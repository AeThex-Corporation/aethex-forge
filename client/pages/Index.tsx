import SEO from "@/components/SEO";
import Scene from "@/components/Scene";

export default function Index() {
  return (
    <>
      <SEO
        pageTitle="AeThex | Immersive OS"
        description="AeThex OS — Cyberpunk Animus command center for Nexus, GameForge, Foundation, Labs, and Corp."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />
      <Scene />
    </>
  );
}
