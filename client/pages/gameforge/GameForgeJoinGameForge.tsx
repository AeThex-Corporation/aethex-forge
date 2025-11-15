import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Zap,
  Heart,
  ArrowRight,
  Rocket,
  Gamepad2,
  Trophy,
  Code,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GameForgeJoinGameForge() {
  const navigate = useNavigate();

  const joinPaths = [
    {
      icon: <Gamepad2 className="h-6 w-6" />,
      title: "Create a Studio",
      description:
        "Start a new game studio and ship monthly games with full support from AeThex",
      action: "Set Up Studio",
      actionPath: "/teams",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Join Existing Project",
      description:
        "Contribute to active game projects and collaborate with talented developers",
      action: "Browse Projects",
      actionPath: "/projects",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Apply as Developer",
      description:
        "Join GameForge as a core team member and help ship games every month",
      action: "View Positions",
      actionPath: "/careers",
    },
  ];

  const requirements = [
    {
      title: "Commitment",
      items: [
        "Ability to ship a complete game or feature monthly",
        "Active participation in collaboration and planning",
        "Willingness to learn and adapt quickly",
      ],
    },
    {
      title: "Skills",
      items: [
        "Game development experience (programming, design, art, etc.)",
        "Understanding of game design principles",
        "Ability to work in cross-functional teams",
      ],
    },
    {
      title: "Mindset",
      items: [
        "Ship-focused mentality - done over perfect",
        "Collaborative approach to problem-solving",
        "Passion for game development and players",
      ],
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Explore",
      description: "Browse current projects and studios on AeThex GameForge",
    },
    {
      number: "2",
      title: "Apply or Create",
      description:
        "Apply to a project team or create your own studio with a founding team",
    },
    {
      number: "3",
      title: "Onboard",
      description: "Get integrated into the community and start collaborating",
    },
    {
      number: "4",
      title: "Ship",
      description:
        "Work with your team to deliver your first game or update within a month",
    },
  ];

  const benefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Monthly Shipping Cycles",
      description:
        "Release complete games or major updates every month. Fast feedback, real results.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Supportive Community",
      description:
        "Network with other game developers, studios, and industry professionals.",
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Recognition & Rewards",
      description:
        "Get featured in GameForge showcase, earn achievements, and build your portfolio.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaboration Tools",
      description:
        "Access to AeThex infrastructure, project management, and team coordination tools.",
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
          {/* Hero Section */}
          <section className="py-20 border-b border-green-400/10">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
                onClick={() => navigate("/gameforge")}
              >
                ← Back to GameForge
              </Button>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-black text-green-300">
                  Join GameForge
                </h1>
                <p className="text-xl text-green-100/80 max-w-3xl">
                  Ship complete games every month. GameForge is where game
                  studios and developers collaborate to create, iterate, and
                  ship on a monthly cadence. Join existing projects, create your
                  own studio, or contribute as a developer.
                </p>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge className="bg-green-500/20 text-green-300 border border-green-400/40">
                    Monthly Shipping
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-300 border border-green-400/40">
                    Collaborative Teams
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-300 border border-green-400/40">
                    Full Lifecycle Support
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Join Paths */}
          <section className="py-20 border-b border-green-400/10">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-4">
                How to Join
              </h2>
              <p className="text-green-100/70 mb-12 max-w-2xl">
                Whether you're a solo developer or leading a studio, there's a
                path for you in GameForge.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {joinPaths.map((path, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30 hover:border-green-400/50 transition-colors"
                  >
                    <CardContent className="pt-6">
                      <div className="text-green-400 mb-4">{path.icon}</div>
                      <h3 className="text-lg font-bold text-green-300 mb-2">
                        {path.title}
                      </h3>
                      <p className="text-sm text-green-200/70 mb-6">
                        {path.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-400/40 text-green-300 hover:bg-green-500/10 w-full"
                        onClick={() => navigate(path.actionPath)}
                      >
                        {path.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-20 border-b border-green-400/10">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12">
                Benefits of Joining GameForge
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="text-green-400 mb-4">{benefit.icon}</div>
                      <h3 className="font-bold text-green-300 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-green-200/70">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="py-20 border-b border-green-400/10">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12">
                What We're Looking For
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {requirements.map((req, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30"
                  >
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-green-300 mb-4">
                        {req.title}
                      </h3>
                      <ul className="space-y-2">
                        {req.items.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-green-200/70 flex gap-2"
                          >
                            <span className="text-green-400 flex-shrink-0">
                              ✓
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-20 border-b border-green-400/10">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12">
                Getting Started
              </h2>

              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-black font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-bold text-green-300 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-green-200/70">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-lg border border-green-400/30 bg-green-950/20">
                <h3 className="font-bold text-green-300 mb-2">
                  First Month Timeline
                </h3>
                <p className="text-sm text-green-200/70">
                  Week 1: Onboarding & team setup. Week 2-3: Development &
                  collaboration. Week 4: Polish & ship your first game or
                  update.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-4xl font-bold text-green-300 mb-4">
                Ready to Ship?
              </h2>
              <p className="text-lg text-green-100/80 mb-8">
                Join GameForge and start building with a community of passionate
                game developers.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  className="bg-green-400 text-black hover:bg-green-300"
                  size="lg"
                  onClick={() => navigate("/projects")}
                >
                  Browse Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-green-400/40 text-green-300 hover:bg-green-500/10"
                  onClick={() => navigate("/teams")}
                >
                  Create or Join a Team
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
