import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Zap, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GameForgeJoinGameForge() {
  const navigate = useNavigate();

  const team = [
    {
      name: "Alex Turner",
      role: "Game Director",
      expertise: ["Game Design", "Team Leadership", "Player Psychology"],
    },
    {
      name: "Sam Lee",
      role: "Lead Programmer",
      expertise: ["Gameplay Systems", "Networking", "Performance"],
    },
    {
      name: "Jordan Davis",
      role: "Art Director",
      expertise: ["Visual Design", "Animation", "Aesthetics"],
    },
    {
      name: "Casey Williams",
      role: "Producer",
      expertise: ["Project Management", "Shipping", "Strategy"],
    },
    {
      name: "Morgan Smith",
      role: "QA Lead",
      expertise: ["Quality Assurance", "Testing", "Optimization"],
    },
    {
      name: "Riley Chen",
      role: "Sound Designer",
      expertise: ["Audio Design", "Music", "Polish"],
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
                The Team
              </h1>
              <p className="text-lg text-green-100/80 max-w-3xl">
                The talented developers, designers, and producers who ship a
                game every month.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold mb-3">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <h3 className="text-lg font-bold text-green-300 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-green-400 font-medium mb-4">
                        {member.role}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((exp, i) => (
                          <Badge
                            key={i}
                            className="bg-green-500/20 text-green-300 border border-green-400/40 text-xs"
                          >
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 border-t border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-8">
                GameForge Culture
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Zap className="h-6 w-6" />,
                    title: "Ship Every Month",
                    description:
                      "We deliver a complete, polished game every month",
                  },
                  {
                    icon: <Heart className="h-6 w-6" />,
                    title: "Love What You Make",
                    description: "We care about quality and player experience",
                  },
                  {
                    icon: <Users className="h-6 w-6" />,
                    title: "Together",
                    description:
                      "Cross-functional teams working toward one goal",
                  },
                ].map((item, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30"
                  >
                    <CardContent className="pt-6 text-center">
                      <div className="text-green-400 mb-3 flex justify-center">
                        {item.icon}
                      </div>
                      <h3 className="font-bold text-green-300 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-green-200/70">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 border-t border-green-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-green-300 mb-4">
                Join the Team
              </h2>
              <p className="text-lg text-green-100/80 mb-8">
                Interested in shipping games with us?
              </p>
              <Button
                className="bg-green-400 text-black hover:bg-green-300"
                onClick={() => navigate("/careers")}
              >
                View Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
