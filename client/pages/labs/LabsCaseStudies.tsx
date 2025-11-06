import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CASE_STUDIES = [
  {
    title: "Scaling Game Performance",
    studio: "MegaStudios Inc.",
    challenge:
      "Handling 10,000+ concurrent players while maintaining 60fps performance",
    solution:
      "Implemented Labs optimization framework and distributed architecture patterns",
    results: ["99.8% uptime", "2x performance improvement", "30% cost reduction"],
    image: "🚀",
  },
  {
    title: "Dev-Link Integration",
    studio: "TalentFlow Collective",
    challenge:
      "Recruiting and retaining top Roblox developers across multiple timezones",
    solution:
      "Adopted Dev-Link platform for community building and skill matching, combined with Labs training resources",
    results: [
      "150% increase in quality hires",
      "40% faster onboarding",
      "Enhanced developer satisfaction",
    ],
    image: "🌐",
    highlighted: true,
  },
  {
    title: "Framework Modernization",
    studio: "InnovateGames Ltd.",
    challenge: "Upgrading legacy codebase while maintaining live product",
    solution:
      "Used Labs best practices and graduated migration strategy to modernize framework",
    results: [
      "Zero production downtime",
      "50% code reduction",
      "Modern architecture established",
    ],
    image: "⚙️",
  },
  {
    title: "Team Growth & Development",
    studio: "GrowthLabs Studio",
    challenge:
      "Building a world-class engineering team from junior developers",
    solution:
      "Leveraged Labs educational resources and Dev-Link community for talent discovery and mentorship",
    results: [
      "10 developers trained and promoted",
      "Internal innovation projects launched",
      "Industry recognition achieved",
    ],
    image: "👥",
  },
];

export default function LabsCaseStudies() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#fbbf24_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(251,191,36,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(251,191,36,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/labs")}
                variant="ghost"
                className="text-yellow-300 hover:bg-yellow-500/10 mb-8"
              >
                ← Back to Labs
              </Button>

              <h1 className="text-4xl font-black tracking-tight text-yellow-300 sm:text-5xl mb-4">
                Case Studies
              </h1>
              <p className="text-lg text-yellow-100/80 max-w-2xl">
                See how leading studios use AeThex Labs and Dev-Link to achieve their goals
              </p>
            </div>
          </section>

          {/* Case Studies */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="space-y-8">
                {CASE_STUDIES.map((study) => (
                  <Card
                    key={study.title}
                    className={`border transition-all ${
                      study.highlighted
                        ? "bg-yellow-950/40 border-yellow-400 ring-2 ring-yellow-400/50"
                        : "bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <CardTitle className="text-yellow-300 mb-2">
                            {study.title}
                          </CardTitle>
                          <p className="text-sm text-yellow-200/70">{study.studio}</p>
                        </div>
                        <div className="text-4xl">{study.image}</div>
                      </div>
                      {study.highlighted && (
                        <Badge className="border-yellow-400/40 bg-yellow-500/10 text-yellow-300 w-fit">
                          <TrendingUp className="h-3 w-3 mr-2" />
                          Featured
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-yellow-300 mb-2">
                          Challenge
                        </h4>
                        <p className="text-yellow-200/70">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-300 mb-2">
                          Solution
                        </h4>
                        <p className="text-yellow-200/70">{study.solution}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-300 mb-2">
                          Results
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {study.results.map((result) => (
                            <Badge
                              key={result}
                              className="bg-yellow-500/20 text-yellow-300 border-0"
                            >
                              ✓ {result}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-12 rounded-lg border border-yellow-400/30 bg-yellow-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                  Ready to Write Your Success Story?
                </h2>
                <p className="text-yellow-200/80 mb-6 max-w-2xl mx-auto">
                  Combine AeThex Labs research with Dev-Link's professional community to accelerate your growth
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-300">
                    Get Started with Labs
                  </Button>
                  <Button
                    variant="outline"
                    className="border-yellow-400/60 text-yellow-300 hover:bg-yellow-500/10"
                    onClick={() => navigate("/dev-link/waitlist")}
                  >
                    Join Dev-Link <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
