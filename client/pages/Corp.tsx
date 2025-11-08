import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Corp() {
  const navigate = useNavigate();

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

  const serviceAreas = [
    {
      title: "Custom Software Development",
      description: "Bespoke applications tailored to your business needs",
      examples: [
        "Enterprise web applications",
        "Mobile apps (iOS/Android)",
        "Real-time systems",
        "3D experiences & games",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Technology Consulting",
      description: "Strategic guidance for digital transformation",
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

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="mb-8 flex justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fae654ecc18b241bdab273893e8231970?format=webp&width=800"
                  alt="Corp Logo"
                  className="h-24 w-24 object-contain drop-shadow-lg"
                />
              </div>
              <Badge className="border-blue-400/40 bg-blue-500/10 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] mb-6">
                <Briefcase className="h-4 w-4 mr-2" />
                AeThex Corp
              </Badge>

              <div className="space-y-6 mb-12">
                <h1 className="text-5xl lg:text-7xl font-black text-blue-300 leading-tight">
                  The Profit Engine
                </h1>
                <p className="text-xl text-blue-100/70 max-w-3xl">
                  AeThex Corp delivers high-margin enterprise consulting and specialized software development. We leverage proprietary technologies from Labs to create cutting-edge solutions while generating stable, benchmarkable revenue that funds our ambitious R&D roadmap.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-blue-400 text-black hover:bg-blue-300"
                  onClick={() => navigate("/services")}
                >
                  View Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-400/40 text-blue-300 hover:bg-blue-500/10"
                  onClick={() => navigate("/corp/contact-us")}
                >
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section className="py-12 border-t border-blue-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-4 gap-6">
                {highlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={idx}
                      className="bg-blue-950/30 border-blue-400/40"
                    >
                      <CardContent className="pt-6">
                        <Icon className="h-8 w-8 text-blue-400 mb-3" />
                        <p className="text-3xl font-black text-blue-300 mb-2">
                          {item.metric}
                        </p>
                        <p className="text-sm text-blue-200/70">{item.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Service Areas */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-12">
                What We Offer
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {serviceAreas.map((service, idx) => (
                  <Card
                    key={idx}
                    className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-all"
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-4`}>
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-blue-300">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-blue-200/70">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.examples.map((example, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-blue-300">
                            <CheckCircle className="h-4 w-4 text-blue-400" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Client Wins */}
          <section className="py-16 border-t border-blue-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-12">
                Recent Success Stories
              </h2>
              <div className="space-y-6">
                {recentWins.map((win, idx) => (
                  <Card
                    key={idx}
                    className="bg-blue-950/20 border-blue-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs font-semibold text-blue-400 mb-1">
                            CLIENT
                          </p>
                          <p className="text-sm font-bold text-blue-300">
                            {win.company}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-400 mb-1">
                            CHALLENGE
                          </p>
                          <p className="text-sm text-blue-200/70">
                            {win.challenge}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-400 mb-1">
                            SOLUTION
                          </p>
                          <p className="text-sm text-blue-200/70">
                            {win.solution}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-green-400 mb-1">
                            RESULT
                          </p>
                          <p className="text-sm font-semibold text-green-300">
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

          {/* Engagement Models */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-12">
                How We Work
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    model: "Fixed Project",
                    description: "Defined scope, budget & timeline",
                  },
                  {
                    model: "Time & Materials",
                    description: "Flexible engagement with hourly billing",
                  },
                  {
                    model: "Retainer",
                    description: "Ongoing support & continuous improvement",
                  },
                  {
                    model: "Staff Augmentation",
                    description: "Specialized developers for your team",
                  },
                ].map((model, idx) => (
                  <Card
                    key={idx}
                    className="bg-blue-950/30 border-blue-400/40"
                  >
                    <CardContent className="pt-6 text-center">
                      <h3 className="font-bold text-blue-300 mb-2">
                        {model.model}
                      </h3>
                      <p className="text-sm text-blue-200/70">
                        {model.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 border-t border-blue-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-blue-300 mb-4">
                Ready to Partner?
              </h2>
              <p className="text-lg text-blue-100/80 mb-8">
                Let's discuss your business challenges and build a solution that drives results.
              </p>
              <Button
                className="bg-blue-400 text-black shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-300"
                onClick={() => navigate("/corp/contact-us")}
              >
                Start Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
