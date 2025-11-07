import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Linkedin, Github, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamMemberDetails {
  id: number;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  social: {
    linkedin?: string;
    github?: string;
    email: string;
  };
  joinedYear: number;
}

const TEAM: TeamMemberDetails[] = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Founder & CEO",
    bio: "Visionary leader with 20+ years in game technology. Built teams at major studios and led technical innovation.",
    expertise: ["Strategic Vision", "Game Architecture", "Team Building"],
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "alex@gameforge.dev",
    },
    joinedYear: 2020,
  },
  {
    id: 2,
    name: "Jordan Lee",
    role: "VP Engineering",
    bio: "Engineering leader focused on developer experience. Passionate about making tools that developers love.",
    expertise: ["Platform Architecture", "DevOps", "Developer Tools"],
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "jordan@gameforge.dev",
    },
    joinedYear: 2021,
  },
  {
    id: 3,
    name: "Casey Williams",
    role: "Head of Community",
    bio: "Community builder who believes in empowering creators. Led developer programs at top tech companies.",
    expertise: ["Community Strategy", "Events", "Developer Relations"],
    social: {
      linkedin: "https://linkedin.com",
      email: "casey@gameforge.dev",
    },
    joinedYear: 2021,
  },
  {
    id: 4,
    name: "Taylor Chen",
    role: "Product Manager",
    bio: "Product strategist with a track record of shipping features developers actually want.",
    expertise: ["Product Strategy", "User Research", "Roadmapping"],
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "taylor@gameforge.dev",
    },
    joinedYear: 2022,
  },
  {
    id: 5,
    name: "Morgan Swift",
    role: "Head of Design",
    bio: "Design-focused leader creating beautiful, intuitive experiences for game developers.",
    expertise: ["UI/UX Design", "Design Systems", "User Experience"],
    social: {
      linkedin: "https://linkedin.com",
      email: "morgan@gameforge.dev",
    },
    joinedYear: 2022,
  },
  {
    id: 6,
    name: "Riley Davis",
    role: "Developer Relations",
    bio: "Passionate educator helping developers succeed. Active speaker at conferences and events.",
    expertise: ["Developer Education", "Technical Writing", "Speaking"],
    social: {
      github: "https://github.com",
      email: "riley@gameforge.dev",
    },
    joinedYear: 2023,
  },
];

export default function GameForgeTeams() {
  const navigate = useNavigate();

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
                <Users className="h-4 w-4 mr-2" />
                Our Team
              </Badge>
              <h1 className="text-4xl font-black text-green-300 mb-4 lg:text-5xl">
                The People Behind GameForge
              </h1>
              <p className="text-lg text-green-100/80 max-w-2xl">
                Meet the passionate team dedicated to helping you build amazing
                games.
              </p>
            </div>
          </section>

          {/* Team Grid */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {TEAM.map((member) => (
                  <Card
                    key={member.id}
                    className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-all hover:shadow-lg hover:shadow-green-500/20 overflow-hidden group"
                  >
                    {/* Avatar Area */}
                    <div className="h-32 bg-gradient-to-b from-green-500/20 to-transparent flex items-center justify-center group-hover:from-green-500/30 transition-colors">
                      <div className="w-20 h-20 rounded-full bg-green-400/20 border-2 border-green-400/40 flex items-center justify-center text-xl font-bold text-green-300">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>

                    <CardContent className="pt-6 space-y-4">
                      {/* Name & Role */}
                      <div>
                        <h3 className="text-lg font-bold text-green-300">
                          {member.name}
                        </h3>
                        <p className="text-sm text-green-400 font-medium">
                          {member.role}
                        </p>
                        <p className="text-xs text-green-200/60 mt-1">
                          Joined {member.joinedYear}
                        </p>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-green-200/70">{member.bio}</p>

                      {/* Expertise Tags */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-green-400">
                          Expertise
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-green-500/10 border-green-400/30 text-green-300 text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="flex items-center gap-2 pt-4 border-t border-green-400/10">
                        {member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded hover:bg-green-500/10 text-green-300 hover:text-green-200 transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {member.social.github && (
                          <a
                            href={member.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded hover:bg-green-500/10 text-green-300 hover:text-green-200 transition-colors"
                            title="GitHub"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        <a
                          href={`mailto:${member.social.email}`}
                          className="p-2 rounded hover:bg-green-500/10 text-green-300 hover:text-green-200 transition-colors ml-auto"
                          title="Email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Join Our Team CTA */}
          <section className="py-16 border-t border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-green-300 mb-4">
                Want to Join Us?
              </h2>
              <p className="text-lg text-green-100/80 mb-8">
                We're building the future of game development. If you're
                passionate about empowering creators, we'd love to hear from
                you.
              </p>
              <Button className="bg-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-green-300">
                View Open Positions
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
