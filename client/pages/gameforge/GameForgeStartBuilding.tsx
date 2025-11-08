import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  Users,
  Zap,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GameForgeStartBuilding() {
  const navigate = useNavigate();

  const currentProjects = [
    {
      title: "Pixel Quest: Reckoning",
      phase: "Shipping",
      progress: 95,
      team: "Green Squadron (8 devs)",
      daysLeft: 3,
      features: "New combat, 50 levels, multiplayer beta",
    },
    {
      title: "Logic Master Pro",
      phase: "Alpha Testing",
      progress: 65,
      team: "Logic Lab (5 devs)",
      daysLeft: 14,
      features: "Daily challenges, leaderboards, cross-platform",
    },
    {
      title: "Mystic Realms: Awakening",
      phase: "Development",
      progress: 40,
      team: "Adventure Wing (10 devs)",
      daysLeft: 22,
      features: "Story driven, 100+ hours, procedural dungeons",
    },
  ];

  const monthlyReleaseSchedule = [
    {
      month: "January",
      releaseDate: "Jan 31, 2025",
      game: "Pixel Quest: Reckoning",
      status: "On Track",
    },
    {
      month: "February",
      releaseDate: "Feb 28, 2025",
      game: "Logic Master Pro",
      status: "On Track",
    },
    {
      month: "March",
      releaseDate: "Mar 31, 2025",
      game: "Mystic Realms: Awakening",
      status: "Planned",
    },
  ];

  const productionPhases = [
    {
      phase: "Ideation",
      duration: "1 week",
      description: "Brainstorm and validate core concept",
      team: "Design + Leads",
    },
    {
      phase: "Prototyping",
      duration: "1 week",
      description: "Build playable proof of concept",
      team: "Tech Lead + 2 Devs",
    },
    {
      phase: "Development",
      duration: "3 weeks",
      description: "Full production with parallel teams",
      team: "Full Team",
    },
    {
      phase: "Polish & QA",
      duration: "1 week",
      description: "Bug fixes, optimization, player testing",
      team: "QA Team + Leads",
    },
    {
      phase: "Launch",
      duration: "1 day",
      description: "Ship to production, monitor metrics",
      team: "DevOps + Product",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
                onClick={() => navigate("/gameforge")}
              >
                ← Back to GameForge
              </Button>

              <h1 className="text-4xl lg:text-5xl font-black text-green-300 mb-4">
                Production Pipeline
              </h1>
              <p className="text-lg text-green-100/80 max-w-3xl">
                How we ship a game every month. Our proven process, team
                coordination, and development tools that make monthly shipping
                possible.
              </p>
            </div>
          </section>

          {/* Current Projects */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-8">
                Current Projects in Development
              </h2>
              <div className="space-y-6">
                {currentProjects.map((project, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-green-300 mb-2">
                              {project.title}
                            </h3>
                            <p className="text-sm text-green-200/70">
                              {project.team}
                            </p>
                          </div>
                          <Badge className="bg-green-500/20 text-green-300 border border-green-400/40">
                            {project.phase}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-semibold text-green-400">
                              Progress
                            </span>
                            <span className="text-xs text-green-200/70">
                              {project.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-green-950/40 rounded-full h-3">
                            <div
                              className="bg-green-400 h-3 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-green-400/10">
                          <div>
                            <p className="text-xs text-green-400 font-semibold mb-1">
                              Days to Ship
                            </p>
                            <p className="text-lg font-bold text-green-300">
                              {project.daysLeft}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-green-400 font-semibold mb-1">
                              Key Features
                            </p>
                            <p className="text-sm text-green-200/70">
                              {project.features}
                            </p>
                          </div>
                          <div className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-300 hover:bg-green-500/10"
                            >
                              View Details →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Release Schedule */}
          <section className="py-16 border-t border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-8">
                Monthly Release Schedule
              </h2>
              <div className="space-y-3">
                {monthlyReleaseSchedule.map((item, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Calendar className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="font-semibold text-green-300">
                              {item.month} - {item.game}
                            </p>
                            <p className="text-sm text-green-200/70">
                              Shipping {item.releaseDate}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            item.status === "On Track"
                              ? "bg-green-500/20 text-green-300 border border-green-400/40"
                              : "bg-purple-500/20 text-purple-300 border border-purple-400/40"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Production Phases */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-8">
                Our 5-Week Process
              </h2>
              <div className="space-y-4">
                {productionPhases.map((item, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-6">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-green-300 mb-2">
                            {item.phase}
                          </h3>
                          <p className="text-sm text-green-200/70 mb-2">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap gap-4">
                            <Badge className="bg-green-500/20 text-green-300 border border-green-400/40 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.duration}
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-300 border border-green-400/40 text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {item.team}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Key Metrics */}
          <section className="py-16 border-t border-green-400/10">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-8">
                Production Metrics
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { label: "Monthly Cycle", value: "32 days" },
                  { label: "Avg Team Size", value: "8 devs" },
                  { label: "Lines of Code", value: "50K+" },
                  { label: "Success Rate", value: "100%" },
                ].map((metric, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/30 border-green-400/40 text-center"
                  >
                    <CardContent className="pt-6">
                      <p className="text-3xl font-black text-green-400 mb-2">
                        {metric.value}
                      </p>
                      <p className="text-sm text-green-200/70">
                        {metric.label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
