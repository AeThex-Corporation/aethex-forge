import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Github, Mail, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TEAM_MEMBERS = [
  {
    name: "Victoria Chen",
    role: "Chief Strategy Officer",
    bio: "Leading enterprise partnerships and solutions",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria",
    skills: ["Strategy", "Partnerships", "Enterprise"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
  {
    name: "David Martinez",
    role: "Solutions Architect",
    bio: "Designing custom enterprise solutions",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    skills: ["Architecture", "Consulting", "Solutions"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Lisa Wong",
    role: "Account Executive",
    bio: "Managing key enterprise relationships",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    skills: ["Sales", "Relationships", "Business Dev"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Robert Johnson",
    role: "Implementation Lead",
    bio: "Ensuring successful client implementations",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    skills: ["Implementation", "Project Mgmt", "Support"],
    social: { github: "#", linkedin: "#", email: "#" },
  },
];

export default function CorpTeams() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/corp")}
                variant="ghost"
                className="text-blue-300 hover:bg-blue-500/10 mb-8"
              >
                ← Back to Corp
              </Button>

              <div className="mb-12">
                <Badge className="border-blue-400/40 bg-blue-500/10 text-blue-300 mb-4">
                  <Users className="h-4 w-4 mr-2" />
                  Our Team
                </Badge>
                <h1 className="text-4xl font-black tracking-tight text-blue-300 sm:text-5xl mb-4">
                  AeThex Corp Leadership
                </h1>
                <p className="text-lg text-blue-100/80 max-w-2xl">
                  Enterprise experts delivering world-class consulting services
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
                    className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 hover:bg-blue-950/30 transition-all"
                  >
                    <CardHeader className="text-center">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-blue-400/50"
                      />
                      <CardTitle className="text-blue-300">{member.name}</CardTitle>
                      <p className="text-sm text-blue-200/70 mt-1">{member.role}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-blue-200/70">{member.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-blue-500/20 text-blue-300 border-0 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <a href={member.social.github} className="text-blue-400 hover:text-blue-300">
                          <Github className="h-5 w-5" />
                        </a>
                        <a href={member.social.linkedin} className="text-blue-400 hover:text-blue-300">
                          <Linkedin className="h-5 w-5" />
                        </a>
                        <a href={member.social.email} className="text-blue-400 hover:text-blue-300">
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Hiring Section */}
              <div className="rounded-lg border border-blue-400/30 bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">Join AeThex Corp</h2>
                <p className="text-blue-200/80 mb-6 max-w-2xl mx-auto">
                  We're growing our team of enterprise experts and consultants
                </p>
                <Button className="bg-blue-400 text-black hover:bg-blue-300">
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
