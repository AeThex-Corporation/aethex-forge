import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Users, DollarSign, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CorpViewCaseStudies() {
  const navigate = useNavigate();

  const caseStudies = [
    {
      title: "Fortune 500 Tech Company - Digital Transformation",
      industry: "Technology",
      scope: "Cloud Migration & Modernization",
      timeline: "9 months",
      team: "15 engineers",
      challenge:
        "Legacy systems preventing innovation. Quarterly release cycles. High operational costs.",
      solution:
        "Complete cloud-native architecture redesign. Microservices migration. CI/CD pipeline implementation.",
      results: [
        { metric: "$2.5M", description: "Annual cost savings" },
        { metric: "3x", description: "Faster deployment cycles" },
        { metric: "99.99%", description: "System uptime achieved" },
      ],
      testimonial:
        '"AeThex completely transformed our development process. We went from quarterly to weekly deployments."',
      author: "CTO",
    },
    {
      title: "Gaming Studio - Multiplayer Architecture",
      industry: "Gaming",
      scope: "Backend Infrastructure",
      timeline: "6 months",
      team: "8 engineers",
      challenge:
        "Scaling real-time multiplayer from 10K to 100K concurrent players. Network latency issues.",
      solution:
        "Custom networking layer. Server clustering. Database optimization and sharding strategy.",
      results: [
        { metric: "150K", description: "Peak concurrent players" },
        { metric: "50ms", description: "Average latency" },
        { metric: "99.99%", description: "Uptime during launch" },
      ],
      testimonial:
        '"Their expertise in game architecture was exactly what we needed. Launch was flawless."',
      author: "Studio Director",
    },
    {
      title: "Enterprise Client - Roblox Platform Experience",
      industry: "Enterprise",
      scope: "Custom Roblox Development",
      timeline: "4 months",
      team: "10 developers",
      challenge:
        "Create engaging branded experience on Roblox for 10K+ internal employees. No prior Roblox experience.",
      solution:
        "Custom Roblox game development. Branded environment. Interactive activities and leaderboards.",
      results: [
        { metric: "10K+", description: "Employee engagement" },
        { metric: "85%", description: "Completion rate" },
        { metric: "Record", description: "Internal engagement scores" },
      ],
      testimonial:
        '"We had no idea Roblox could be this powerful for internal engagement. Impressive work."',
      author: "HR Director",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-blue-300 hover:bg-blue-500/10 mb-8"
                onClick={() => navigate("/corp")}
              >
                ← Back to Corp
              </Button>

              <h1 className="text-4xl lg:text-5xl font-black text-blue-300 mb-4">
                Client Success Stories
              </h1>
              <p className="text-lg text-blue-100/80 max-w-3xl">
                Real results from real clients. See how we've transformed businesses through technology.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="space-y-12">
                {caseStudies.map((study, idx) => (
                  <Card
                    key={idx}
                    className="bg-blue-950/20 border-blue-400/30 overflow-hidden"
                  >
                    <CardContent className="pt-8 space-y-8">
                      {/* Header */}
                      <div>
                        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/40 mb-3">
                          {study.industry}
                        </Badge>
                        <h2 className="text-2xl font-bold text-blue-300 mb-2">
                          {study.title}
                        </h2>
                        <p className="text-blue-200/70">{study.scope}</p>
                      </div>

                      {/* Grid */}
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left */}
                        <div className="space-y-6">
                          <div>
                            <p className="text-xs font-semibold text-blue-400 mb-2">
                              CHALLENGE
                            </p>
                            <p className="text-sm text-blue-200/80">
                              {study.challenge}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-blue-400 mb-2">
                              SOLUTION
                            </p>
                            <p className="text-sm text-blue-200/80">
                              {study.solution}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-blue-400 mb-2">
                              PROJECT DETAILS
                            </p>
                            <div className="flex flex-wrap gap-4">
                              <div>
                                <Clock className="h-4 w-4 text-blue-400 mb-1" />
                                <p className="text-xs text-blue-200/70">
                                  {study.timeline}
                                </p>
                              </div>
                              <div>
                                <Users className="h-4 w-4 text-blue-400 mb-1" />
                                <p className="text-xs text-blue-200/70">
                                  {study.team}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right - Results */}
                        <div>
                          <p className="text-xs font-semibold text-green-400 mb-4">
                            RESULTS
                          </p>
                          <div className="space-y-4">
                            {study.results.map((result, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <TrendingUp className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-bold text-green-300">
                                    {result.metric}
                                  </p>
                                  <p className="text-xs text-blue-200/70">
                                    {result.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Testimonial */}
                      <div className="pt-6 border-t border-blue-400/10">
                        <p className="italic text-blue-200/80 mb-2">
                          {study.testimonial}
                        </p>
                        <p className="text-xs text-blue-400 font-semibold">
                          — {study.author}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 border-t border-blue-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-blue-300 mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg text-blue-100/80 mb-8">
                Let's discuss how we can help you achieve similar results.
              </p>
              <Button
                className="bg-blue-400 text-black hover:bg-blue-300"
                onClick={() => navigate("/corp/schedule-consultation")}
              >
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
