import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Linkedin, Github, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LabsJoinTeam() {
  const navigate = useNavigate();

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Research Director",
      bio: "PhD in Computer Science (MIT). 15+ years in game technology. Led AI research at major studios.",
      expertise: ["AI/ML", "Game Architecture", "Team Leadership"],
      social: {
        linkedin: "#",
        github: "#",
        email: "sarah@aethex.com",
      },
    },
    {
      name: "Marcus Johnson",
      role: "Senior Graphics Engineer",
      bio: "GPU optimization specialist. Published research on ray tracing. Built rendering engines at AAA studios.",
      expertise: ["Graphics", "GPU Computing", "Performance"],
      social: {
        linkedin: "#",
        github: "#",
        email: "marcus@aethex.com",
      },
    },
    {
      name: "Elena Rodriguez",
      role: "Distributed Systems Engineer",
      bio: "Expert in scalable backend architecture. Built systems handling 1M+ concurrent connections.",
      expertise: ["Distributed Systems", "Cloud Architecture", "DevOps"],
      social: {
        linkedin: "#",
        github: "#",
        email: "elena@aethex.com",
      },
    },
    {
      name: "David Kim",
      role: "ML Engineer",
      bio: "TensorFlow contributor. Specializes in game AI and procedural generation algorithms.",
      expertise: ["Machine Learning", "Game AI", "Neural Networks"],
      social: {
        linkedin: "#",
        github: "#",
        email: "david@aethex.com",
      },
    },
    {
      name: "Sophia Patel",
      role: "Research Scientist",
      bio: "Published 10+ papers on game optimization. PhD from Stanford. Published in top conferences.",
      expertise: ["Algorithm Design", "Optimization", "Research"],
      social: {
        linkedin: "#",
        github: "#",
        email: "sophia@aethex.com",
      },
    },
    {
      name: "Alex Morgan",
      role: "Director of Innovation",
      bio: "20+ years driving innovation. Mentor to the team. Visionary for future of gaming tech.",
      expertise: ["Vision", "Mentorship", "Strategy"],
      social: {
        linkedin: "#",
        github: "#",
        email: "alex@aethex.com",
      },
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#fbbf24_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(251,191,36,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(251,191,36,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-yellow-300 hover:bg-yellow-500/10 mb-8"
                onClick={() => navigate("/labs")}
              >
                ← Back to Labs
              </Button>

              <div className="space-y-4 mb-12">
                <h1 className="text-4xl lg:text-5xl font-black text-yellow-300">
                  Meet the Lab
                </h1>
                <p className="text-lg text-yellow-100/80 max-w-3xl">
                  World-class researchers and engineers dedicated to advancing
                  technology. Our team includes PhD researchers, published
                  authors, and visionary thinkers.
                </p>
              </div>
            </div>
          </section>

          {/* Team Grid */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member, idx) => (
                  <Card
                    key={idx}
                    className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-all"
                  >
                    <CardContent className="pt-6 space-y-4">
                      {/* Avatar Placeholder */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      {/* Name & Role */}
                      <div>
                        <h3 className="text-lg font-bold text-yellow-300">
                          {member.name}
                        </h3>
                        <p className="text-sm text-yellow-400 font-medium">
                          {member.role}
                        </p>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-yellow-200/70">{member.bio}</p>

                      {/* Expertise */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-yellow-400">
                          Expertise
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((skill, i) => (
                            <Badge
                              key={i}
                              className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="flex gap-2 pt-4 border-t border-yellow-400/10">
                        <a
                          href={member.social.linkedin}
                          className="p-2 rounded hover:bg-yellow-500/10 text-yellow-300 hover:text-yellow-200 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                        <a
                          href={member.social.github}
                          className="p-2 rounded hover:bg-yellow-500/10 text-yellow-300 hover:text-yellow-200 transition-colors"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                        <a
                          href={`mailto:${member.social.email}`}
                          className="p-2 rounded hover:bg-yellow-500/10 text-yellow-300 hover:text-yellow-200 transition-colors ml-auto"
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

          {/* Culture */}
          <section className="py-16 border-t border-yellow-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-8">
                Lab Culture
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Push Boundaries",
                    description:
                      "We tackle problems nobody else is solving. Innovation over comfort.",
                  },
                  {
                    title: "Publish Results",
                    description:
                      "Share your research with the world. Present at conferences. Build your reputation.",
                  },
                  {
                    title: "Mentor Others",
                    description:
                      "Junior researchers learn from seniors. We grow as a team and help the community.",
                  },
                ].map((item, idx) => (
                  <Card
                    key={idx}
                    className="bg-yellow-950/20 border-yellow-400/30"
                  >
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-yellow-300 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-yellow-200/70">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 border-t border-yellow-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                Join the Lab
              </h2>
              <p className="text-lg text-yellow-100/80 mb-8">
                We're looking for brilliant minds to join our team. Researchers,
                engineers, and visionaries welcome.
              </p>
              <Button
                className="bg-yellow-400 text-black hover:bg-yellow-300"
                onClick={() => navigate("/careers")}
              >
                See Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
