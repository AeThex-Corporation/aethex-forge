import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CorpScheduleConsultation() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    {
      id: "custom-dev",
      name: "Custom Software Development",
      duration: "60 min",
      description:
        "Discuss your project requirements and our development approach",
      details: [
        "Project scope assessment",
        "Technology stack recommendations",
        "Timeline & budget estimation",
        "Team composition planning",
      ],
    },
    {
      id: "consulting",
      name: "Technology Consulting",
      duration: "45 min",
      description: "Strategic guidance for digital transformation initiatives",
      details: [
        "Architecture review",
        "Technology roadmap",
        "Risk assessment",
        "Implementation strategy",
      ],
    },
    {
      id: "game-dev",
      name: "Game Development Services",
      duration: "60 min",
      description: "Specialized consultation for gaming and Roblox solutions",
      details: [
        "Game design review",
        "Technical architecture",
        "Optimization strategies",
        "Multiplayer systems",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise Solutions",
      duration: "90 min",
      description: "Comprehensive enterprise-level project planning",
      details: [
        "Full assessment",
        "Custom proposal",
        "Resource planning",
        "Governance setup",
      ],
    },
  ];

  const consultationProcess = [
    {
      step: "1",
      title: "Initial Assessment",
      description: "We learn about your business, challenges, and goals",
    },
    {
      step: "2",
      title: "Solution Design",
      description: "Our team designs a tailored solution approach",
    },
    {
      step: "3",
      title: "Proposal & Pricing",
      description: "Receive a detailed proposal with timeline and investment",
    },
    {
      step: "4",
      title: "Partnership Begins",
      description: "Start building with dedicated team support",
    },
  ];

  const availability = [
    { day: "Monday - Friday", time: "9:00 AM - 6:00 PM EST" },
    { day: "Saturday", time: "10:00 AM - 2:00 PM EST" },
    { day: "Sunday", time: "By appointment" },
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
          {/* Header */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-blue-300 hover:bg-blue-500/10 mb-8"
                onClick={() => navigate("/corp")}
              >
                ← Back to Corp
              </Button>

              <h1 className="text-4xl lg:text-5xl font-black text-blue-300 mb-4">
                Schedule Your Consultation
              </h1>
              <p className="text-lg text-blue-100/80 max-w-3xl">
                Get expert guidance from our enterprise solutions team. Choose a
                service, pick your time, and let's discuss how we can help
                transform your business.
              </p>
            </div>
          </section>

          {/* Service Selection */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-8">
                Select a Consultation Type
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all ${
                      selectedService === service.id
                        ? "bg-blue-500/20 border-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                        : "bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60"
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-blue-300 text-lg">
                          {service.name}
                        </CardTitle>
                        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/40">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.duration}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-blue-200/70">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.details.map((detail, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-blue-300"
                          >
                            <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
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

          {/* Consultation Process */}
          <section className="py-16 border-t border-blue-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-12">
                How It Works
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {consultationProcess.map((process, idx) => (
                  <div key={idx} className="relative">
                    <Card className="bg-blue-950/20 border-blue-400/30">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold mb-4">
                          {process.step}
                        </div>
                        <h3 className="font-bold text-blue-300 mb-2">
                          {process.title}
                        </h3>
                        <p className="text-sm text-blue-200/70">
                          {process.description}
                        </p>
                      </CardContent>
                    </Card>
                    {idx < consultationProcess.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 transform">
                        <ArrowRight className="h-6 w-6 text-blue-400/40" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Availability */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-8">
                Our Availability
              </h2>
              <div className="space-y-4">
                {availability.map((slot, idx) => (
                  <Card key={idx} className="bg-blue-950/20 border-blue-400/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="font-semibold text-blue-300">
                              {slot.day}
                            </p>
                            <p className="text-sm text-blue-200/70">
                              {slot.time}
                            </p>
                          </div>
                        </div>
                        <Button
                          className="bg-blue-400 text-black hover:bg-blue-300"
                          size="sm"
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className="py-16 border-t border-blue-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-blue-300 mb-4">
                What to Expect
              </h2>
              <p className="text-lg text-blue-100/80 mb-8">
                Our consultants will assess your needs, provide expert
                recommendations, and create a customized solution proposal
                tailored to your business goals.
              </p>
              <Button
                className="bg-blue-400 text-black shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-300"
                onClick={() => navigate("/corp/contact-us")}
              >
                Continue to Contact Form
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
