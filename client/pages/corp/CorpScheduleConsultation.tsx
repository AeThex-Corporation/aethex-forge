import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CorpScheduleConsultation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "custom-software",
    timeline: "3-months",
    budget: "100k-500k",
  });

  const services = [
    { id: "custom-software", label: "Custom Software Development" },
    { id: "technology-consulting", label: "Technology Consulting" },
    { id: "game-dev", label: "Game Development Services" },
    { id: "design", label: "UX/UI Design" },
    { id: "other", label: "Other" },
  ];

  const timelines = [
    { id: "asap", label: "ASAP (Within 1 month)" },
    { id: "3-months", label: "3 Months" },
    { id: "6-months", label: "6 Months" },
    { id: "tbd", label: "TBD" },
  ];

  const budgets = [
    { id: "50k-100k", label: "$50K - $100K" },
    { id: "100k-500k", label: "$100K - $500K" },
    { id: "500k-1m", label: "$500K - $1M" },
    { id: "1m+", label: "$1M+" },
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
                Schedule a Consultation
              </h1>
              <p className="text-lg text-blue-100/80 max-w-3xl">
                Tell us about your project and let's discuss how we can help transform your business.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-4xl px-4">
              <Card className="bg-blue-950/20 border-blue-400/30">
                <CardContent className="pt-8 space-y-6">
                  {/* Name & Company */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-blue-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-blue-950/40 border border-blue-400/30 rounded text-blue-300 placeholder-blue-400/50"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-blue-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-blue-950/40 border border-blue-400/30 rounded text-blue-300 placeholder-blue-400/50"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-blue-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-blue-950/40 border border-blue-400/30 rounded text-blue-300 placeholder-blue-400/50"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-blue-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-blue-950/40 border border-blue-400/30 rounded text-blue-300 placeholder-blue-400/50"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-300 mb-3">
                      Service Needed
                    </label>
                    <div className="space-y-2">
                      {services.map((svc) => (
                        <label key={svc.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="service"
                            value={svc.id}
                            checked={formData.service === svc.id}
                            onChange={(e) =>
                              setFormData({ ...formData, service: e.target.value })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-blue-300">{svc.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Timeline & Budget */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-blue-300 mb-3">
                        Project Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) =>
                          setFormData({ ...formData, timeline: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-blue-950/40 border border-blue-400/30 rounded text-blue-300"
                      >
                        {timelines.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-blue-300 mb-3">
                        Budget Range
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData({ ...formData, budget: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-blue-950/40 border border-blue-400/30 rounded text-blue-300"
                      >
                        {budgets.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-400 text-black hover:bg-blue-300 py-6">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Consultation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="py-16 border-t border-blue-400/10">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-8">
                What to Expect
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Clock className="h-6 w-6" />,
                    title: "30-Minute Call",
                    description: "Initial discovery meeting with our team",
                  },
                  {
                    icon: <Users className="h-6 w-6" />,
                    title: "Technical Discussion",
                    description: "Deep dive into your requirements and challenges",
                  },
                  {
                    icon: <CheckCircle className="h-6 w-6" />,
                    title: "Proposal",
                    description: "Custom proposal with timeline and pricing",
                  },
                ].map((item, idx) => (
                  <Card
                    key={idx}
                    className="bg-blue-950/20 border-blue-400/30 text-center"
                  >
                    <CardContent className="pt-6">
                      <div className="text-blue-400 mb-3 flex justify-center">
                        {item.icon}
                      </div>
                      <h3 className="font-bold text-blue-300 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-blue-200/70">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
