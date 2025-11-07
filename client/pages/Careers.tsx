import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  Briefcase,
  Users,
  Zap,
  Heart,
  TrendingUp,
  ArrowRight,
  Microscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Careers() {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Microscope className="h-6 w-6" />,
      title: "Innovation First",
      description:
        "We push boundaries and explore cutting-edge technologies daily",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "People Matter",
      description:
        "We invest in our team's growth, health, and work-life balance",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Ship It",
      description:
        "We believe in execution over perfection—iterate and learn fast",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaboration",
      description:
        "Great ideas come from diverse teams working together openly",
    },
  ];

  const benefits = [
    "Competitive salary & equity package",
    "Comprehensive health insurance (medical, dental, vision)",
    "Unlimited PTO",
    "Remote-first, work from anywhere",
    "Equipment budget for your home office",
    "Professional development fund ($5k/year)",
    "Team offsites & retreats",
    "Stock options",
    "Parental leave",
    "Gym & wellness stipend",
    "Learning & conference budget",
    "Commuter benefits",
  ];

  const openRoles = [
    {
      title: "Senior Software Engineer",
      team: "Platform Engineering",
      location: "Remote",
      level: "Senior",
      type: "Full-time",
      description:
        "Lead architecture and implementation of next-generation platform systems",
    },
    {
      title: "Game Developer",
      team: "GameForge",
      location: "Remote",
      level: "Mid-level",
      type: "Full-time",
      description: "Ship games monthly with our world-class production team",
    },
    {
      title: "Research Scientist",
      team: "Labs",
      location: "Remote",
      level: "Senior",
      type: "Full-time",
      description:
        "Explore AI/ML applications in game development and interactive experiences",
    },
    {
      title: "Product Manager",
      team: "Labs",
      location: "Remote",
      level: "Mid-level",
      type: "Full-time",
      description:
        "Shape the future of our developer tools and platforms",
    },
    {
      title: "UX/UI Designer",
      team: "Design System",
      location: "Remote",
      level: "Mid-level",
      type: "Full-time",
      description:
        "Design beautiful, intuitive interfaces for millions of developers",
    },
    {
      title: "DevOps Engineer",
      team: "Infrastructure",
      location: "Remote",
      level: "Senior",
      type: "Full-time",
      description: "Build the infrastructure that powers AeThex at scale",
    },
  ];

  const hiringProcess = [
    {
      step: "1",
      title: "Application",
      description: "Submit your resume and tell us about yourself",
    },
    {
      step: "2",
      title: "Phone Screen",
      description: "30-min chat with our recruiting team",
    },
    {
      step: "3",
      title: "Technical Interview",
      description: "Technical discussion or coding challenge",
    },
    {
      step: "4",
      title: "Take-Home Project",
      description: "Real-world problem relevant to the role",
    },
    {
      step: "5",
      title: "Team Interview",
      description: "Meet the team and discuss culture fit",
    },
    {
      step: "6",
      title: "Offer",
      description: "Receive offer and negotiate terms",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#fbbf24_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(251,191,36,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(251,191,36,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="py-16 lg:py-20">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-yellow-300 hover:bg-yellow-500/10 mb-8"
                onClick={() => navigate("/labs")}
              >
                ← Back to Labs
              </Button>

              <Badge className="border-yellow-400/40 bg-yellow-500/10 text-yellow-300 shadow-[0_0_20px_rgba(251,191,36,0.2)] mb-4">
                <Briefcase className="h-4 w-4 mr-2" />
                Join Our Team
              </Badge>
              <h1 className="text-4xl font-black text-yellow-300 mb-4 lg:text-5xl">
                Work on the Future
              </h1>
              <p className="text-lg text-yellow-100/80 max-w-3xl">
                Join a team of innovators, creators, and builders pushing the boundaries of what's possible. Work on cutting-edge technology that impacts millions of developers worldwide.
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section className="py-16 border-y border-yellow-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-12">
                Our Values
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, idx) => (
                  <Card
                    key={idx}
                    className="bg-yellow-950/20 border-yellow-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="text-yellow-400 mb-3">{value.icon}</div>
                      <h3 className="font-bold text-yellow-300 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-yellow-200/70">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-12">
                Benefits & Perks
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-lg bg-yellow-950/20 border border-yellow-400/20"
                  >
                    <Check className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-yellow-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Open Roles */}
          <section className="py-16 border-t border-yellow-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-12">
                Open Positions
              </h2>
              <div className="space-y-4">
                {openRoles.map((role, idx) => (
                  <Card
                    key={idx}
                    className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-all cursor-pointer"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-yellow-300">
                            {role.title}
                          </h3>
                          <p className="text-sm text-yellow-200/70">
                            {role.team}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-yellow-400 mt-1" />
                      </div>

                      <p className="text-sm text-yellow-100/80 mb-4">
                        {role.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-yellow-500/20 border border-yellow-400/40 text-yellow-300">
                          {role.location}
                        </Badge>
                        <Badge className="bg-yellow-500/20 border border-yellow-400/40 text-yellow-300">
                          {role.level}
                        </Badge>
                        <Badge className="bg-yellow-500/20 border border-yellow-400/40 text-yellow-300">
                          {role.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Hiring Process */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-12">
                Our Hiring Process
              </h2>
              <div className="grid md:grid-cols-6 gap-4">
                {hiringProcess.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold mb-2">
                        {item.step}
                      </div>
                      {idx < hiringProcess.length - 1 && (
                        <div className="hidden md:block w-1 h-8 bg-gradient-to-b from-yellow-400 to-transparent" />
                      )}
                    </div>
                    <h4 className="font-semibold text-yellow-300 text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-yellow-200/70">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 border-t border-yellow-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                Ready to Join?
              </h2>
              <p className="text-lg text-yellow-100/80 mb-8">
                Browse open roles and apply today. We're excited to meet you.
              </p>
              <Button className="bg-yellow-400 text-black shadow-[0_0_30px_rgba(251,191,36,0.35)] hover:bg-yellow-300">
                View All Roles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
