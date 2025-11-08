import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Zap, Target, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DevLinkAbout() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "Built by Roblox creators, for Roblox creators",
    },
    {
      icon: Zap,
      title: "Empower",
      description: "Help developers connect and grow together",
    },
    {
      icon: Target,
      title: "Professional",
      description: "A platform that takes Roblox development seriously",
    },
    {
      icon: Heart,
      title: "Inclusive",
      description: "Supporting developers at all skill levels",
    },
  ];

  const milestones = [
    { year: "2024", event: "Dev-Link Founded", status: "Complete" },
    { year: "2025", event: "Beta Launch", status: "In Progress" },
    { year: "2025", event: "Public Release", status: "Q2" },
    { year: "2025", event: "Job Board Launch", status: "Q3" },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#06b6d4_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(6,182,212,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-cyan-300 hover:bg-cyan-500/10 mb-8"
                onClick={() => navigate("/dev-link")}
              >
                ← Back to Dev-Link
              </Button>

              <h1 className="text-4xl lg:text-5xl font-black text-cyan-300 mb-4">
                About Dev-Link
              </h1>
              <p className="text-lg text-cyan-100/80 max-w-3xl">
                The professional networking platform built for Roblox
                developers. Connect, collaborate, and grow your career in game
                development.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-cyan-300 mb-8">
                Our Mission
              </h2>
              <Card className="bg-cyan-950/20 border-cyan-400/30">
                <CardContent className="pt-6">
                  <p className="text-lg text-cyan-200/80 leading-relaxed">
                    Dev-Link is on a mission to empower Roblox developers
                    worldwide. We believe that the Roblox platform has created
                    an incredible community of creators who deserve a
                    professional space to connect, showcase their work, and find
                    amazing opportunities. Just like LinkedIn transformed
                    professional networking, Dev-Link is transforming how Roblox
                    developers collaborate and build their careers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="py-16 border-t border-cyan-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-cyan-300 mb-8">
                Our Values
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, idx) => {
                  const Icon = value.icon;
                  return (
                    <Card
                      key={idx}
                      className="bg-cyan-950/20 border-cyan-400/30"
                    >
                      <CardContent className="pt-6">
                        <Icon className="h-8 w-8 text-cyan-400 mb-3" />
                        <h3 className="text-lg font-bold text-cyan-300 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-sm text-cyan-200/70">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-cyan-300 mb-8">
                Our Roadmap
              </h2>
              <div className="space-y-4">
                {milestones.map((milestone, idx) => (
                  <Card key={idx} className="bg-cyan-950/20 border-cyan-400/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 mb-2">
                            {milestone.year}
                          </Badge>
                          <p className="font-bold text-cyan-300">
                            {milestone.event}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            milestone.status === "Complete"
                              ? "bg-green-500/20 text-green-300"
                              : milestone.status === "In Progress"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-cyan-500/20 text-cyan-300"
                          } border`}
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 border-t border-cyan-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-cyan-300 mb-4">
                Join the Community
              </h2>
              <p className="text-lg text-cyan-100/80 mb-8">
                Be part of the professional Roblox developer community
              </p>
              <Button
                className="bg-cyan-400 text-black shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:bg-cyan-300"
                onClick={() => navigate("/dev-link/waitlist")}
              >
                Join Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
