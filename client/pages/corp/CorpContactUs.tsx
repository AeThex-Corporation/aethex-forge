import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CorpContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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
                Get in Touch
              </h1>
              <p className="text-lg text-blue-100/80 max-w-3xl">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-blue-300 mb-8">
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <Mail className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-blue-400 mb-1">
                          Email
                        </p>
                        <a
                          href="mailto:info@aethex.biz"
                          className="text-blue-300 hover:text-blue-200 transition-colors"
                        >
                          info@aethex.biz
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Phone className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-blue-400 mb-1">
                          Phone
                        </p>
                        <a
                          href="tel:+13465567100"
                          className="text-blue-300 hover:text-blue-200 transition-colors"
                        >
                          (346) 556-7100
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Clock className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-blue-400 mb-1">
                          Response Time
                        </p>
                        <p className="text-blue-300">
                          Within 24 business hours
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-blue-400/10">
                    <h3 className="text-lg font-bold text-blue-300 mb-4">
                      Quick Links
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-blue-300 hover:bg-blue-500/10"
                        onClick={() => navigate("/services")}
                      >
                        View Services →
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-blue-300 hover:bg-blue-500/10"
                        onClick={() => navigate("/corp/view-case-studies")}
                      >
                        Case Studies →
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-blue-300 hover:bg-blue-500/10"
                        onClick={() => navigate("/corp/schedule-consultation")}
                      >
                        Schedule Consultation →
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <Card className="bg-blue-950/20 border-blue-400/30">
                    <CardContent className="pt-8 space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-blue-300 mb-2">
                          Name
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
                          Message
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          rows={5}
                          className="w-full px-4 py-2 bg-blue-950/40 border border-blue-400/30 rounded text-blue-300 placeholder-blue-400/50"
                          placeholder="Tell us about your project..."
                        />
                      </div>

                      <Button className="w-full bg-blue-400 text-black hover:bg-blue-300 py-6">
                        Send Message
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
