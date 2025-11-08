import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Users,
  BookOpen,
  Code,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LabsGetInvolved() {
  const navigate = useNavigate();

  const opportunities = [
    {
      title: "Research Partnerships",
      description: "Collaborate with our team on research projects",
      details: [
        "Co-author research papers",
        "Access to our lab facilities",
        "Joint publications",
        "Revenue sharing on commercialized research",
      ],
      icon: <BookOpen className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Open Source Contributions",
      description: "Help us build and improve our open-source projects",
      details: [
        "Fork and contribute to projects",
        "Get recognized as contributor",
        "Influence project direction",
        "Build your open-source portfolio",
      ],
      icon: <Code className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Speaking & Workshops",
      description: "Share your expertise with our community",
      details: [
        "Host technical workshops",
        "Speak at our conferences",
        "Lead educational content",
        "Build your professional brand",
      ],
      icon: <Users className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Technical Advisory",
      description: "Advise us on emerging technologies",
      details: [
        "Join our advisory board",
        "Shape research direction",
        "Quarterly meetings",
        "Competitive advisory fees",
      ],
      icon: <Zap className="h-6 w-6" />,
      color: "from-orange-500 to-red-500",
    },
  ];

  const process = [
    {
      step: 1,
      title: "Express Interest",
      description: "Tell us which opportunity excites you",
    },
    {
      step: 2,
      title: "Initial Conversation",
      description: "Meet with our team to discuss details",
    },
    {
      step: 3,
      title: "Formalize Agreement",
      description: "Sign partnership terms and get started",
    },
    {
      step: 4,
      title: "Collaborate",
      description: "Work together to advance technology",
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
                  Get Involved
                </h1>
                <p className="text-lg text-yellow-100/80 max-w-3xl">
                  There are many ways to collaborate with AeThex Labs. Whether
                  you're a researcher, developer, or thought leader, we'd love
                  to work together.
                </p>
              </div>
            </div>
          </section>

          {/* Opportunities Grid */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 gap-6">
                {opportunities.map((opp, idx) => (
                  <Card
                    key={idx}
                    className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-all"
                  >
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${opp.color} flex items-center justify-center text-white mb-4`}
                      >
                        {opp.icon}
                      </div>
                      <CardTitle className="text-yellow-300">
                        {opp.title}
                      </CardTitle>
                      <p className="text-sm text-yellow-200/70 mt-2">
                        {opp.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {opp.details.map((detail, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-yellow-200/80"
                          >
                            <CheckCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 border-t border-yellow-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-12">
                How to Get Started
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {process.map((item) => (
                  <Card
                    key={item.step}
                    className="bg-yellow-950/20 border-yellow-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="text-4xl font-black text-yellow-400 mb-3">
                        {item.step}
                      </div>
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

          {/* Benefits */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-8">
                Why Partner With Labs
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Cutting-Edge Technology",
                    description:
                      "Access to our latest research and innovations before they're public",
                  },
                  {
                    title: "Global Reach",
                    description:
                      "Connect with 50K+ developers in our ecosystem and beyond",
                  },
                  {
                    title: "Professional Growth",
                    description:
                      "Build your reputation through published research and speaking engagements",
                  },
                  {
                    title: "Revenue Sharing",
                    description:
                      "Get compensated for contributions that drive business value",
                  },
                  {
                    title: "Mentorship",
                    description:
                      "Learn from world-class researchers and engineers on our team",
                  },
                  {
                    title: "Community Impact",
                    description:
                      "Help shape the future of gaming and digital technology",
                  },
                ].map((benefit, idx) => (
                  <Card
                    key={idx}
                    className="bg-yellow-950/20 border-yellow-400/30"
                  >
                    <CardContent className="pt-6">
                      <CheckCircle className="h-6 w-6 text-yellow-400 mb-3" />
                      <h3 className="font-bold text-yellow-300 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-yellow-200/70">
                        {benefit.description}
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
                Ready to Collaborate?
              </h2>
              <p className="text-lg text-yellow-100/80 mb-8">
                Reach out to learn more about our partnership opportunities.
              </p>
              <Button
                className="bg-yellow-400 text-black hover:bg-yellow-300"
                onClick={() => navigate("/contact")}
              >
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
