import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  UserPlus,
  Settings,
  LayoutDashboard,
  BookOpen,
  Users,
  LifeBuoy,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function GetStarted() {
  const steps = [
    {
      title: "Create your account",
      description: "Sign up with email or GitHub/Google.",
      icon: UserPlus,
      points: [
        "Secure auth via Supabase",
        "Email verification",
        "OAuth supported",
      ],
      cta: { label: "Join AeThex", href: "/onboarding" },
      color: "from-aethex-500 to-neon-blue",
    },
    {
      title: "Complete onboarding",
      description: "Tell us what you build to personalize your experience.",
      icon: Settings,
      points: ["Profile basics", "Interests & skills", "Realm & level"],
      cta: { label: "Start Onboarding", href: "/onboarding" },
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      title: "Explore your dashboard",
      description: "Manage profile, projects, applications, and rewards.",
      icon: LayoutDashboard,
      points: [
        "Profile & settings",
        "Community feed",
        "Achievements & rewards",
      ],
      cta: { label: "Open Dashboard", href: "/dashboard" },
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const quickLinks = [
    {
      title: "Documentation",
      desc: "Guides and API reference",
      icon: BookOpen,
      href: "/docs",
      color: "from-cyan-500 to-sky-500",
    },
    {
      title: "Community",
      desc: "Share progress & find collaborators",
      icon: Users,
      href: "/community",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Support",
      desc: "We’re here to help",
      icon: LifeBuoy,
      href: "/support",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user && profile) navigate("/dashboard", { replace: true });
    if (user && !profile) navigate("/onboarding", { replace: true });
  }, [user, profile, loading, navigate]);

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-aethex-900/40 via-background to-neon-blue/10" />
        <div className="container mx-auto px-4 relative z-10 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              <span className="text-gradient">Get Started</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your account, personalize your experience, and ship faster
              with AeThex.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift"
              >
                <Link to="/onboarding" className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> Join AeThex
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-aethex-400/50 hover:border-aethex-400"
              >
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Guided Steps */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Card
                  key={idx}
                  className="relative overflow-hidden bg-card/60 border-border/50 hover:border-aethex-400/50 transition-all duration-300 group"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">
                        {step.title}
                      </CardTitle>
                      <div
                        className={`w-10 h-10 rounded-md bg-gradient-to-r ${step.color} grid place-items-center`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {step.points.map((p) => (
                        <li key={p} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-aethex-400/70" />{" "}
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className={`w-full bg-gradient-to-r ${step.color}`}
                    >
                      <Link
                        to={step.cta.href}
                        className="flex items-center justify-center gap-2"
                      >
                        {step.cta.label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gradient-purple">
              Helpful Resources
            </h2>
            <p className="text-sm text-muted-foreground">
              Jump into docs, community, or support
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickLinks.map((q) => {
              const Icon = q.icon;
              return (
                <Card
                  key={q.title}
                  className="relative overflow-hidden bg-card/60 border-border/50 hover:border-aethex-400/50 transition-all duration-300 group"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${q.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-md bg-gradient-to-r ${q.color} grid place-items-center`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{q.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {q.desc}
                        </p>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-border/60 hover:border-aethex-400/60"
                    >
                      <Link
                        to={q.href}
                        className="flex items-center justify-center gap-2"
                      >
                        Open
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-5">
          <Badge
            variant="outline"
            className="border-aethex-400/40 text-aethex-300"
          >
            Next up
          </Badge>
          <h3 className="text-2xl font-bold">
            Create your account and start building
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue"
            >
              <Link to="/onboarding">Join AeThex</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-aethex-400/50 hover:border-aethex-400"
            >
              <Link to="/dashboard">Explore Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
