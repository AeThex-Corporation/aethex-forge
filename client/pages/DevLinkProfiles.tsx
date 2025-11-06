import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function DevLinkProfiles() {
  const navigate = useNavigate();
  const location = useLocation();
  const isWaitlist = location.pathname.includes("/waitlist");

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#06b6d4_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(6,182,212,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/dev-link")}
                variant="ghost"
                className="text-cyan-300 hover:bg-cyan-500/10 mb-8"
              >
                ← Back to Dev-Link
              </Button>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-cyan-300 sm:text-5xl mb-2">
                    {isWaitlist ? "Dev-Link Waitlist" : "Browse Profiles"}
                  </h1>
                  <p className="text-lg text-cyan-100/80 max-w-2xl">
                    {isWaitlist
                      ? "Join the professional network for Roblox developers. Sign up for early access!"
                      : "Explore talented Roblox developers in our community."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Iframe Container */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="rounded-lg overflow-hidden border border-cyan-400/30 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <iframe
                  src={
                    isWaitlist
                      ? "https://dev-link.me/waitlist"
                      : "https://dev-link.me"
                  }
                  className="w-full border-0"
                  title={isWaitlist ? "Dev-Link Waitlist" : "Dev-Link Profiles"}
                  style={{
                    minHeight: "800px",
                    height: "80vh",
                    maxHeight: "800px",
                  }}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-top-navigation-by-user-activation"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>

              {/* Fallback Message */}
              <div className="mt-12 text-center">
                <p className="text-cyan-200/70 mb-4">
                  {isWaitlist
                    ? "Having trouble loading the waitlist form?"
                    : "Having trouble loading the profiles?"}
                </p>
                <a
                  href={
                    isWaitlist
                      ? "https://dev-link.me/waitlist"
                      : "https://dev-link.me"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/30 transition"
                >
                  {isWaitlist ? "Visit Waitlist" : "Visit Profiles"} Directly
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
