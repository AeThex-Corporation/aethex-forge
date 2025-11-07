import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Briefcase, Zap, Code, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Custom Software Development",
      description:
        "Bespoke solutions built from the ground up for your unique business needs",
      features: [
        "Web & mobile applications",
        "Real-time systems",
        "3D experiences & games",
        "API development",
        "System integration",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Technology Consulting",
      description:
        "Strategic guidance on architecture, modernization, and digital transformation",
      features: [
        "Technology roadmap planning",
        "Cloud-native architecture",
        "DevOps & infrastructure",
        "Security & compliance",
        "Performance optimization",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Game Development Contracts",
      description: "Specialized game dev services for studios and enterprises",
      features: [
        "Full game production",
        "Custom game engines",
        "Metaverse experiences",
        "Roblox enterprise solutions",
        "Game porting & optimization",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "UX/UI & Product Design",
      description:
        "Beautiful, intuitive interfaces that drive user engagement and retention",
      features: [
        "User research & testing",
        "Design systems",
        "Interaction design",
        "Brand strategy",
        "Accessibility (WCAG)",
      ],
      color: "from-orange-500 to-red-500",
    },
  ];

  const caseStudies = [
    {
      company: "Fortune 500 Tech Company",
      project: "Digital Transformation Initiative",
      challenge:
        "Legacy systems preventing innovation, slow time-to-market for new features",
      solution:
        "Cloud-native architecture redesign, microservices migration, CI/CD pipeline setup",
      result: "$2.5M annual cost savings, 3x faster deployment cycles",
      testimonial:
        '"AeThex transformed our entire development process. We went from quarterly releases to weekly deployments."',
      author: "VP of Engineering",
    },
    {
      company: "Gaming Studio",
      project: "Multiplayer Game Architecture",
      challenge: "Scaling real-time multiplayer for 100K+ concurrent players",
      solution:
        "Custom networking layer, server optimization, database sharding strategy",
      result: "Successfully launched with 150K peak concurrent players, 99.99% uptime",
      testimonial:
        '"Their expertise in game architecture was exactly what we needed. Launch was flawless."',
      author: "Studio Director",
    },
    {
      company: "Enterprise Client",
      project: "Internal Roblox Experience",
      challenge:
        "Create engaging brand experience on Roblox for corporate audience",
      solution:
        "Custom Roblox game development, branded environment, interactive activities",
      result:
        "10K+ employees engaged, 85% completion rate, record internal engagement scores",
      testimonial:
        '"We had no idea Roblox could be this powerful for internal engagement. Impressive work."',
      author: "HR Director",
    },
  ];

  const engagementModels = [
    {
      model: "Fixed Project",
      description: "Defined scope, timeline, and budget",
      best: "Well-defined projects with clear requirements",
      pricing: "Quote-based",
    },
    {
      model: "Time & Materials",
      description: "Flexible engagement billed hourly",
      best: "Exploratory projects, evolving requirements",
      pricing: "$150-300/hr",
    },
    {
      model: "Retainer",
      description: "Ongoing support and maintenance",
      best: "Continuous support, regular updates",
      pricing: "Custom monthly",
    },
    {
      model: "Staff Augmentation",
      description: "Augment your team with experienced developers",
      best: "Scaling teams, specialized skills needed",
      pricing: "Custom based on roles",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="py-16 lg:py-20">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-blue-300 hover:bg-blue-500/10 mb-8"
                onClick={() => navigate("/corp")}
              >
                ← Back to Corp
              </Button>

              <Badge className="border-blue-400/40 bg-blue-500/10 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] mb-4">
                <Briefcase className="h-4 w-4 mr-2" />
                Services
              </Badge>
              <h1 className="text-4xl font-black text-blue-300 mb-4 lg:text-5xl">
                Enterprise Solutions
              </h1>
              <p className="text-lg text-blue-100/80 max-w-3xl">
                Comprehensive consulting and development services designed to drive business value and accelerate digital transformation.
              </p>
            </div>
          </section>

          {/* Service Cards */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, idx) => (
                  <Card
                    key={idx}
                    className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-all"
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-4`}>
                        {service.icon}
                      </div>
                      <CardTitle className="text-blue-300 text-xl">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-blue-200/70">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-blue-300">
                            <Check className="h-4 w-4 text-blue-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Case Studies */}
          <section className="py-16 border-t border-blue-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-12">
                Client Success Stories
              </h2>
              <div className="space-y-8">
                {caseStudies.map((study, idx) => (
                  <Card key={idx} className="bg-blue-950/20 border-blue-400/30">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <Badge className="bg-blue-500/20 border border-blue-400/40 text-blue-300 mb-3">
                            {study.company}
                          </Badge>
                          <h3 className="text-xl font-bold text-blue-300 mb-2">
                            {study.project}
                          </h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-blue-400 mb-1">
                              Challenge
                            </p>
                            <p className="text-sm text-blue-200/70">
                              {study.challenge}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-blue-400 mb-1">
                              Solution
                            </p>
                            <p className="text-sm text-blue-200/70">
                              {study.solution}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-green-400 mb-1">
                              Result
                            </p>
                            <p className="text-sm text-green-300/90 font-semibold">
                              {study.result}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-blue-400/10">
                          <p className="text-sm italic text-blue-200/80 mb-2">
                            "{study.testimonial}"
                          </p>
                          <p className="text-xs text-blue-300/60">
                            — {study.author}
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
                Engagement Models
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {engagementModels.map((model, idx) => (
                  <Card
                    key={idx}
                    className="bg-blue-950/30 border-blue-400/40"
                  >
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-blue-300 mb-3">
                        {model.model}
                      </h3>
                      <p className="text-sm text-blue-200/70 mb-4">
                        {model.description}
                      </p>
                      <div className="space-y-3 pt-4 border-t border-blue-400/10">
                        <div>
                          <p className="text-xs font-semibold text-blue-400">
                            Best for
                          </p>
                          <p className="text-xs text-blue-200/70">
                            {model.best}
                          </p>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/40">
                          {model.pricing}
                        </Badge>
                      </div>
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
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg text-blue-100/80 mb-8">
                Let's discuss your challenges and find the right solution for your team.
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
