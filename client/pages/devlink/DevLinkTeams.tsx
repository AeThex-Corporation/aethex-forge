import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Github, Mail, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TEAM_MEMBERS = [
  {
    name: "Amanda Foster",
    role: "Platform Lead",
    bio: "Building the future of developer networking",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
    skills: ["Platform", "Product", "Leadership"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Chris Martinez",
    role: "Community Lead",
    bio: "Fostering connections between developers",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    skills: ["Community", "Engagement", "Growth"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Priya Sharma",
    role: "Product Manager",
    bio: "Shaping the future of Dev-Link platform",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    skills: ["Product", "Strategy", "Design"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Marcus Williams",
    role: "Engineering Lead",
    bio: "Building robust and scalable infrastructure",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    skills: ["Engineering", "Infrastructure", "Scaling"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
];

export default function DevLinkTeams() {
  const navigate = useNavigate();

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

              <div className="mb-12">
                <Badge className="border-cyan-400/40 bg-cyan-500/10 text-cyan-300 mb-4">
                  <Users className="h-4 w-4 mr-2" />
                  Our Team
                </Badge>
                <h1 className="text-4xl font-black tracking-tight text-cyan-300 sm:text-5xl mb-4">
                  Meet the Dev-Link Team
                </h1>
                <p className="text-lg text-cyan-100/80 max-w-2xl">
                  Connecting Roblox developers worldwide
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
                    className="bg-cyan-950/20 border-cyan-400/30 hover:border-cyan-400/60 hover:bg-cyan-950/30 transition-all"
                  >
                    <CardHeader className="text-center">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-cyan-400/50"
                      />
                      <CardTitle className="text-cyan-300">{member.name}</CardTitle>
                      <p className="text-sm text-cyan-200/70 mt-1">{member.role}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-cyan-200/70">{member.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-cyan-500/20 text-cyan-300 border-0 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <a href={member.social.github} className="text-cyan-400 hover:text-cyan-300">
                          <Github className="h-5 w-5" />
                        </a>
                        <a href={member.social.linkedin} className="text-cyan-400 hover:text-cyan-300">
                          <Linkedin className="h-5 w-5" />
                        </a>
                        <a href={member.social.email} className="text-cyan-400 hover:text-cyan-300">
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Hiring Section */}
              <div className="rounded-lg border border-cyan-400/30 bg-cyan-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">Join Dev-Link</h2>
                <p className="text-cyan-200/80 mb-6 max-w-2xl mx-auto">
                  Help us build the professional network for Roblox developers
                </p>
                <Button className="bg-cyan-400 text-black hover:bg-cyan-300">
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
