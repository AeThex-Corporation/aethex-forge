import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Github, Mail, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TEAM_MEMBERS = [
  {
    name: "Alex Thompson",
    role: "Lead Engineer",
    bio: "Game architecture specialist with 10+ years experience",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    skills: ["Architecture", "Systems Design", "Leadership"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Jordan Kim",
    role: "Tools Developer",
    bio: "Building next-generation development tools",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    skills: ["Tools", "Automation", "DevOps"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Sam Patel",
    role: "Game Designer",
    bio: "Crafting engaging gameplay experiences",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    skills: ["Design", "Game Mechanics", "UX"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Morgan Lee",
    role: "QA Lead",
    bio: "Ensuring quality across all releases",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
    skills: ["QA", "Testing", "Automation"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
];

export default function GameForgeTeams() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/game-development")}
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
              >
                ← Back to GameForge
              </Button>

              <div className="mb-12">
                <Badge className="border-green-400/40 bg-green-500/10 text-green-300 mb-4">
                  <Users className="h-4 w-4 mr-2" />
                  Our Team
                </Badge>
                <h1 className="text-4xl font-black tracking-tight text-green-300 sm:text-5xl mb-4">
                  Meet the GameForge Team
                </h1>
                <p className="text-lg text-green-100/80 max-w-2xl">
                  Passionate developers creating the future of game development
                </p>
              </div>
            </div>
          </section>

          {/* Team Grid */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {TEAM_MEMBERS.map((member) => (
                  <Card
                    key={member.name}
                    className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 hover:bg-green-950/30 transition-all"
                  >
                    <CardHeader className="text-center">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-green-400/50"
                      />
                      <CardTitle className="text-green-300">{member.name}</CardTitle>
                      <p className="text-sm text-green-200/70 mt-1">{member.role}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-green-200/70">{member.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-green-500/20 text-green-300 border-0 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <a href={member.social.github} className="text-green-400 hover:text-green-300">
                          <Github className="h-5 w-5" />
                        </a>
                        <a href={member.social.linkedin} className="text-green-400 hover:text-green-300">
                          <Linkedin className="h-5 w-5" />
                        </a>
                        <a href={member.social.email} className="text-green-400 hover:text-green-300">
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Hiring Section */}
              <div className="rounded-lg border border-green-400/30 bg-green-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-green-300 mb-4">Join GameForge</h2>
                <p className="text-green-200/80 mb-6 max-w-2xl mx-auto">
                  We're hiring talented developers to help shape the future of game development
                </p>
                <Button className="bg-green-400 text-black hover:bg-green-300">
                  View Open Positions
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
