import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Star, Users, ArrowRight, Github } from "lucide-react";
import { useNavigate, useState } from "react-router-dom";

export default function DevLinkProfiles() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const developers = [
    {
      name: "Alex Rivera",
      title: "Roblox Game Developer",
      skills: ["Roblox", "Lua", "Game Design"],
      portfolio: "3 games shipped",
      rating: 4.9,
      available: true,
    },
    {
      name: "Jordan Chen",
      title: "Full Stack Developer",
      skills: ["Roblox", "TypeScript", "Backend"],
      portfolio: "5 projects",
      rating: 4.8,
      available: true,
    },
    {
      name: "Sam Taylor",
      title: "UI/UX Designer",
      skills: ["Game UI", "Roblox", "Design"],
      portfolio: "10+ designs",
      rating: 4.7,
      available: false,
    },
    {
      name: "Morgan Lee",
      title: "Audio Engineer",
      skills: ["Game Audio", "Music", "Sound Design"],
      portfolio: "15+ games",
      rating: 4.9,
      available: true,
    },
    {
      name: "Casey Williams",
      title: "Technical Lead",
      skills: ["Architecture", "Roblox", "Leadership"],
      portfolio: "Lead on 20+ games",
      rating: 5.0,
      available: false,
    },
    {
      name: "Riley Martinez",
      title: "Gameplay Programmer",
      skills: ["Game Logic", "Roblox", "C++"],
      portfolio: "8 shipped titles",
      rating: 4.8,
      available: true,
    },
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
                Developer Directory
              </h1>
              <p className="text-lg text-cyan-100/80 max-w-3xl">
                Find and connect with talented Roblox developers, browse
                portfolios, and discover collaboration opportunities.
              </p>
            </div>
          </section>

          <section className="py-8">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="relative">
                <Search className="absolute left-4 top-3 h-5 w-5 text-cyan-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, skill, or role..."
                  className="w-full pl-12 pr-4 py-3 bg-cyan-950/40 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400/60"
                />
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {developers.map((dev, idx) => (
                  <Card
                    key={idx}
                    className="bg-cyan-950/20 border-cyan-400/30 hover:border-cyan-400/60 transition-all cursor-pointer"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {dev.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        {dev.available && (
                          <Badge className="bg-green-500/20 text-green-300 border border-green-400/40 text-xs">
                            Available
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-cyan-300 mb-1">
                        {dev.name}
                      </h3>
                      <p className="text-sm text-cyan-400 font-medium mb-4">
                        {dev.title}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {dev.skills.map((skill, i) => (
                          <Badge
                            key={i}
                            className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-cyan-400/10 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-cyan-200/70">
                            {dev.portfolio}
                          </span>
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Star className="h-4 w-4 fill-yellow-400" />
                            {dev.rating}
                          </span>
                        </div>
                        <Button
                          className="w-full bg-cyan-400 text-black hover:bg-cyan-300"
                          size="sm"
                        >
                          View Profile
                        </Button>
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
                Create Your Profile
              </h2>
              <p className="text-lg text-cyan-100/80 mb-8">
                Showcase your work and connect with other developers.
              </p>
              <Button className="bg-cyan-400 text-black hover:bg-cyan-300">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
