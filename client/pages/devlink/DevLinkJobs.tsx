import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DevLinkJobs() {
  const navigate = useNavigate();

  const jobs = [
    {
      title: "Senior Roblox Developer",
      company: "Studio XYZ",
      type: "Full-time",
      location: "Remote",
      salary: "$120K - $150K/yr",
      description: "Lead development on flagship title with 100K+ players",
      skills: ["Roblox", "Lua", "Leadership"],
    },
    {
      title: "Game Designer",
      company: "Creative Games Inc",
      type: "Contract",
      location: "Remote",
      salary: "$80/hr",
      description: "Design gameplay systems for new multiplayer game",
      skills: ["Game Design", "Roblox", "Balancing"],
    },
    {
      title: "UI/UX Designer",
      company: "Pixel Studios",
      type: "Part-time",
      location: "Remote",
      salary: "$50/hr",
      description: "Create beautiful interfaces for mobile game",
      skills: ["UI Design", "Roblox", "User Research"],
    },
    {
      title: "Backend Engineer",
      company: "GameTech Corp",
      type: "Full-time",
      location: "Hybrid",
      salary: "$130K - $170K/yr",
      description: "Build scalable backend systems for multiplayer platform",
      skills: ["Backend", "Systems Design", "Databases"],
    },
    {
      title: "Audio Engineer",
      company: "Sound Studios",
      type: "Contract",
      location: "Remote",
      salary: "$75/hr",
      description: "Compose and implement audio for 5-game project",
      skills: ["Audio Design", "Music Composition", "SFX"],
    },
    {
      title: "QA Tester",
      company: "Quality First Games",
      type: "Full-time",
      location: "Remote",
      salary: "$60K - $80K/yr",
      description: "Comprehensive testing on multiplayer platform",
      skills: ["QA", "Testing", "Roblox"],
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
                Job Board
              </h1>
              <p className="text-lg text-cyan-100/80 max-w-3xl">
                Find your next opportunity in the Roblox ecosystem. Full-time,
                part-time, and contract roles available.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="space-y-4">
                {jobs.map((job, idx) => (
                  <Card
                    key={idx}
                    className="bg-cyan-950/20 border-cyan-400/30 hover:border-cyan-400/60 transition-all cursor-pointer"
                  >
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-bold text-cyan-300 mb-1">
                            {job.title}
                          </h3>
                          <p className="text-sm text-cyan-400 font-medium mb-3">
                            {job.company}
                          </p>
                          <p className="text-sm text-cyan-200/70 mb-4">
                            {job.description}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge
                              className={`${
                                job.type === "Full-time"
                                  ? "bg-green-500/20 text-green-300 border border-green-400/40"
                                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                              }`}
                            >
                              {job.type}
                            </Badge>
                            <span className="flex items-center gap-1 text-sm text-cyan-200/70">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-lg font-bold text-cyan-300">
                            <DollarSign className="h-5 w-5" />
                            {job.salary}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, i) => (
                              <Badge
                                key={i}
                                className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            className="w-full bg-cyan-400 text-black hover:bg-cyan-300"
                            size="sm"
                          >
                            Apply Now
                          </Button>
                        </div>
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
                Hiring? Post a Job
              </h2>
              <p className="text-lg text-cyan-100/80 mb-8">
                Reach 50K+ talented Roblox developers.
              </p>
              <Button className="bg-cyan-400 text-black hover:bg-cyan-300">
                Post a Job Opening
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
