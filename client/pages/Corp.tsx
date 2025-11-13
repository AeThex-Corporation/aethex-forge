import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useArmTheme } from "@/contexts/ArmThemeContext";
import {
  Briefcase,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Code,
  Palette,
  Shield,
  Cpu,
  BarChart3,
  Rocket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useArmToast } from "@/hooks/use-arm-toast";

export default function Corp() {
  const navigate = useNavigate();
  const { theme } = useArmTheme();
  const armToast = useArmToast();
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        armToast.system("Corp systems engaged");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [armToast]);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Engaging Corp Systems..."
        showProgress={true}
        duration={900}
        accentColor="from-blue-500 to-blue-400"
        armLogo="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3772073d5b4b49e688ed02480f4cae43?format=webp&width=800"
      />
    );
  }

  const highlights = [
    {
      metric: "$50M+",
      label: "Total Client Impact",
      icon: TrendingUp,
    },
    {
      metric: "100+",
      label: "Enterprise Clients",
      icon: Users,
    },
    {
      metric: "99.9%",
      label: "Project Success Rate",
      icon: CheckCircle,
    },
    {
      metric: "24/7",
      label: "Support Available",
      icon: Zap,
    },
  ];

  const services = [
    {
      title: "Custom Software Development",
      description: "Bespoke applications built for enterprise scale",
      icon: Code,
      examples: [
        "Web & mobile applications",
        "Real-time systems",
        "3D experiences & games",
        "API development",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Technology Consulting",
      description: "Strategic guidance for digital transformation",
      icon: Briefcase,
      examples: [
        "Architecture design",
        "Cloud strategy",
        "DevOps & infrastructure",
        "Security & compliance",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Game Development Services",
      description: "Specialized expertise for gaming companies",
      icon: Rocket,
      examples: [
        "Full game production",
        "Metaverse experiences",
        "Roblox enterprise solutions",
        "Engine optimization",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "UX/UI & Design",
      description: "Beautiful interfaces that drive engagement",
      icon: Palette,
      examples: [
        "User research",
        "Design systems",
        "Accessibility (WCAG)",
        "Brand strategy",
      ],
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentWins = [
    {
      company: "Global Tech Corp",
      challenge: "Legacy systems blocking innovation",
      solution: "Cloud-native modernization with microservices",
      result: "$2.5M annual savings, 3x faster deployments",
    },
    {
      company: "Gaming Studio",
      challenge: "Scaling multiplayer to 100K concurrent players",
      solution: "Custom networking architecture & optimization",
      result: "99.99% uptime, 150K peak concurrent users",
    },
    {
      company: "Financial Services Firm",
      challenge: "Building real-time trading platform",
      solution: "Low-latency system with custom databases",
      result: "Sub-millisecond latency, 99.95% uptime",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Discovery & Strategy",
      description: "Understand your business goals and technical challenges",
    },
    {
      step: 2,
      title: "Architecture & Design",
      description: "Create scalable, robust system designs",
    },
    {
      step: 3,
      title: "Development & Iteration",
      description: "Build with quality and speed using agile practices",
    },
    {
      step: 4,
      title: "Deployment & Support",
      description: "Launch with confidence and 24/7 ongoing support",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="py-20 lg:py-32">
            <div className="container mx-auto max-w-6xl px-4">
              {/* Logo */}
              <div className="mb-12 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3772073d5b4b49e688ed02480f4cae43?format=webp&width=800"
                    alt="Corp Logo"
                    className="relative h-32 w-32 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Tagline Badge */}
              <div className="flex justify-center mb-8">
                <Badge className="border-blue-400/40 bg-blue-500/10 text-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.3)] px-6 py-2 text-lg">
                  <Cpu className="h-4 w-4 mr-2" />
                  The Profit Engine
                </Badge>
              </div>

              {/* Main Headline */}
              <div className="text-center space-y-6 mb-12">
                <h1 className={`text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-200 to-cyan-300 leading-tight ${theme.fontClass}`}>
                  Enterprise Engineering
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100/80 max-w-4xl mx-auto leading-relaxed">
                  High-margin consulting, proprietary software, and specialized game development that funds AeThex's ambitious innovation roadmap. We deliver enterprise-grade solutions powered by cutting-edge technology from our Labs.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  size="lg"
                  className="bg-blue-400 text-black hover:bg-blue-300 font-bold text-lg px-8 py-6"
                  onClick={() => navigate("/corp/contact-us")}
                >
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-400/40 text-blue-300 hover:bg-blue-500/10 font-bold text-lg px-8 py-6"
                  onClick={() => navigate("/corp/case-studies")}
                >
                  View Case Studies
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {highlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={idx}
                      className="bg-blue-950/30 border-blue-400/30 hover:border-blue-400/60 transition-all"
                    >
                      <CardContent className="pt-6 text-center">
                        <Icon className="h-6 w-6 text-blue-400 mx-auto mb-3" />
                        <p className="text-2xl font-black text-blue-300">
                          {item.metric}
                        </p>
                        <p className="text-sm text-blue-200/70 mt-1">
                          {item.label}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Core Missions */}
          <section className="py-20 border-t border-blue-400/10 bg-blue-950/5">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-blue-300 mb-4">
                  Three Strategic Pillars
                </h2>
                <p className="text-lg text-blue-100/70 max-w-2xl mx-auto">
                  Every engagement drives revenue while advancing our mission to democratize advanced technology
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-blue-950/30 border-blue-400/30 hover:border-blue-400/60 transition-all">
                  <CardHeader>
                    <div className="text-4xl mb-3">💰</div>
                    <CardTitle className="text-blue-300">High-Margin Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200/70">
                      Enterprise consulting contracts with premium pricing that fund our research and development initiatives
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-950/30 border-blue-400/30 hover:border-blue-400/60 transition-all">
                  <CardHeader>
                    <div className="text-4xl mb-3">⚡</div>
                    <CardTitle className="text-blue-300">Technology Transfer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200/70">
                      Deploy innovations from Labs to production, validating new technologies with real enterprise clients
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-950/30 border-blue-400/30 hover:border-blue-400/60 transition-all">
                  <CardHeader>
                    <div className="text-4xl mb-3">🚀</div>
                    <CardTitle className="text-blue-300">Market Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200/70">
                      Gather real-world insights from enterprise clients to inform next-generation product development
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="py-20">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-blue-300 mb-4">
                  Service Offerings
                </h2>
                <p className="text-lg text-blue-100/70">
                  End-to-end solutions for enterprise challenges
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <Card
                      key={idx}
                      className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-all overflow-hidden group"
                    >
                      <div
                        className={`h-1 bg-gradient-to-r ${service.color}`}
                      />
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <Icon className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                          <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/40">
                            Specialized
                          </Badge>
                        </div>
                        <CardTitle className="text-blue-300">
                          {service.title}
                        </CardTitle>
                        <p className="text-sm text-blue-200/70 mt-2">
                          {service.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {service.examples.map((example, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-blue-200/70 text-sm"
                            >
                              <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-12 text-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-400/40 text-blue-300 hover:bg-blue-500/10"
                  onClick={() => navigate("/corp/contact-us")}
                >
                  Discuss Your Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-20 border-t border-blue-400/10 bg-blue-950/5">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-blue-300 mb-4">
                  Our Engagement Process
                </h2>
                <p className="text-lg text-blue-100/70">
                  From discovery to delivery, we follow a proven methodology
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {processSteps.map((step) => (
                  <div key={step.step} className="relative">
                    <div className="bg-blue-950/30 border border-blue-400/30 rounded-lg p-6">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-black text-black border-4 border-black">
                        {step.step}
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-bold text-blue-300 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-blue-200/70">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {step.step < 4 && (
                      <div className="hidden md:block absolute top-1/3 -right-3 w-6 h-1 bg-gradient-to-r from-blue-400 to-transparent" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Case Studies */}
          <section className="py-20">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-blue-300 mb-4">
                  Client Success Stories
                </h2>
                <p className="text-lg text-blue-100/70">
                  Real results from real enterprise partnerships
                </p>
              </div>

              <div className="space-y-6">
                {recentWins.map((win, idx) => (
                  <Card
                    key={idx}
                    className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-all"
                  >
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs font-semibold text-blue-400 mb-1 uppercase">
                            Client
                          </p>
                          <p className="font-bold text-blue-300">{win.company}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-400 mb-1 uppercase">
                            Challenge
                          </p>
                          <p className="text-blue-200/70 text-sm">
                            {win.challenge}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-400 mb-1 uppercase">
                            Solution
                          </p>
                          <p className="text-blue-200/70 text-sm">{win.solution}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-400 mb-1 uppercase">
                            Result
                          </p>
                          <p className="text-blue-200/70 text-sm font-semibold">
                            {win.result}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 border-t border-blue-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-blue-300 mb-6">
                Ready to Transform Your Enterprise?
              </h2>
              <p className="text-lg text-blue-100/70 mb-8">
                Let's discuss how AeThex Corp can accelerate your digital innovation with proven expertise and cutting-edge technology.
              </p>
              <Button
                size="lg"
                className="bg-blue-400 text-black hover:bg-blue-300 font-bold text-lg px-8 py-6 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                onClick={() => navigate("/corp/contact-us")}
              >
                Start Your Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
