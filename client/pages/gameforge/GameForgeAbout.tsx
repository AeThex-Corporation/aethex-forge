import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Rocket, Target, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GameForgeAbout() {
  const navigate = useNavigate();

  const milestones = [
    {
      year: 2020,
      title: "GameForge Founded",
      description:
        "Born from a frustration with fragmented game development tools, we set out to create something better.",
    },
    {
      year: 2021,
      title: "First 1000 Developers",
      description:
        "Reached our first major milestone with developers from 50+ countries using GameForge.",
    },
    {
      year: 2022,
      title: "Monthly Shipping Model",
      description:
        "Launched our signature monthly shipping cycles helping developers release faster.",
    },
    {
      year: 2023,
      title: "100+ Games Shipped",
      description:
        "Celebrated as our community shipped over 100 games through the platform.",
    },
    {
      year: 2024,
      title: "Global Expansion",
      description:
        "Expanded to support multiple languages and localization for worldwide developers.",
    },
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-green-400" />,
      title: "Creator First",
      description:
        "Everything we build is designed with developers and creators in mind. Your success is our success.",
    },
    {
      icon: <Rocket className="h-8 w-8 text-green-400" />,
      title: "Speed & Momentum",
      description:
        "We believe in rapid iteration and shipping fast. Monthly cycles keep your games fresh and your players engaged.",
    },
    {
      icon: <Target className="h-8 w-8 text-green-400" />,
      title: "Quality Obsessed",
      description:
        "High standards across everything. From tools to community, we maintain excellence in every detail.",
    },
    {
      icon: <Globe className="h-8 w-8 text-green-400" />,
      title: "Open Community",
      description:
        "We believe in the power of community. Together, we build stronger games and support each other.",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="py-16 lg:py-20">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
                onClick={() => navigate("/gameforge")}
              >
                ← Back to GameForge
              </Button>

              <Badge className="border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] mb-4">
                <Rocket className="h-4 w-4 mr-2" />
                Our Story
              </Badge>
              <h1 className="text-4xl font-black text-green-300 mb-4 lg:text-5xl">
                Building the Future of Game Development
              </h1>
              <p className="text-lg text-green-100/80 max-w-3xl">
                GameForge was born from a simple belief: game development should
                be fast, accessible, and community-driven. We're on a mission to
                empower creators worldwide to build amazing games.
              </p>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-16 border-y border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-green-300 mb-4">
                    Our Mission
                  </h2>
                  <p className="text-lg text-green-100/80 mb-4">
                    To democratize game development by providing tools,
                    resources, and community support that enable anyone to
                    create and ship games at scale.
                  </p>
                  <p className="text-lg text-green-100/80">
                    We believe that great games come from passionate creators.
                    Our job is to remove barriers and accelerate their journey
                    from idea to shipped product.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-green-300 mb-4">
                    Our Vision
                  </h2>
                  <p className="text-lg text-green-100/80 mb-4">
                    A world where game development is accessible, fast, and
                    collaborative. Where indie developers have the same tools
                    and support as major studios.
                  </p>
                  <p className="text-lg text-green-100/80">
                    We're building a platform where monthly shipping cycles are
                    the norm, where community support accelerates growth, and
                    where every creator has the chance to succeed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12">
                Our Core Values
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{value.icon}</div>
                        <CardTitle className="text-green-300 text-xl">
                          {value.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-200/70">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-16 border-t border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12">
                Our Journey
              </h2>
              <div className="space-y-8">
                {milestones.map((milestone, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-green-400 border-4 border-black" />
                      {idx < milestones.length - 1 && (
                        <div className="w-1 h-24 bg-gradient-to-b from-green-400 to-transparent" />
                      )}
                    </div>
                    <div className="pb-8">
                      <Badge className="bg-green-500/20 border border-green-400/40 text-green-300 mb-2">
                        {milestone.year}
                      </Badge>
                      <h3 className="text-xl font-bold text-green-300 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-green-200/70">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { value: "50K+", label: "Developers" },
                  { value: "150+", label: "Games Shipped" },
                  { value: "75+", label: "Countries" },
                  { value: "99.9%", label: "Uptime" },
                ].map((stat, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/30 border-green-400/40 text-center"
                  >
                    <CardContent className="pt-6">
                      <div className="text-4xl font-black text-green-400 mb-2">
                        {stat.value}
                      </div>
                      <p className="text-green-200/70">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-16 border-t border-green-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-green-300 mb-4">
                Join the Movement
              </h2>
              <p className="text-lg text-green-100/80 mb-8">
                Be part of something bigger. Join thousands of developers
                building the future of games.
              </p>
              <Button className="bg-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-green-300">
                Start Building Today
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
