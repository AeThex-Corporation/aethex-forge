import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CorpContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  });

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "enterprise@aethex.tech",
      description: "Response within 24 hours",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Available 9AM-6PM EST",
    },
    {
      icon: MapPin,
      title: "Office",
      value: "San Francisco, CA",
      description: "Schedule an in-person meeting",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      value: "Chat with us",
      description: "Available during business hours",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the form data to your backend
  };

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
                Get In Touch
              </h1>
              <p className="text-lg text-blue-100/80 max-w-3xl">
                Have questions about our services? Want to schedule a
                consultation? Contact our enterprise team and we'll get back to
                you quickly.
              </p>
            </div>
          </section>

          {/* Contact Methods */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-8">
                Ways to Reach Us
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactMethods.map((method, idx) => {
                  const Icon = method.icon;
                  return (
                    <Card
                      key={idx}
                      className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-all"
                    >
                      <CardContent className="pt-6 text-center">
                        <Icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                        <h3 className="font-bold text-blue-300 mb-2">
                          {method.title}
                        </h3>
                        <p className="text-sm font-semibold text-blue-200 mb-1">
                          {method.value}
                        </p>
                        <p className="text-xs text-blue-200/60">
                          {method.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="py-16 border-t border-blue-400/10 bg-black/40">
            <div className="container mx-auto max-w-2xl px-4">
              <Card className="bg-blue-950/30 border-blue-400/40">
                <CardHeader>
                  <CardTitle className="text-blue-300">
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold text-blue-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-blue-950/50 border border-blue-400/30 rounded-lg px-4 py-2 text-white placeholder-blue-200/40 focus:outline-none focus:border-blue-400/60"
                          placeholder="John Doe"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-blue-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-blue-950/50 border border-blue-400/30 rounded-lg px-4 py-2 text-white placeholder-blue-200/40 focus:outline-none focus:border-blue-400/60"
                          placeholder="john@company.com"
                        />
                      </div>

                      {/* Company */}
                      <div>
                        <label className="block text-sm font-semibold text-blue-300 mb-2">
                          Company *
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-blue-950/50 border border-blue-400/30 rounded-lg px-4 py-2 text-white placeholder-blue-200/40 focus:outline-none focus:border-blue-400/60"
                          placeholder="Your Company"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-blue-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-blue-950/50 border border-blue-400/30 rounded-lg px-4 py-2 text-white placeholder-blue-200/40 focus:outline-none focus:border-blue-400/60"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    {/* Service Type */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-300 mb-2">
                        Service of Interest
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full bg-blue-950/50 border border-blue-400/30 rounded-lg px-4 py-2 text-white placeholder-blue-200/40 focus:outline-none focus:border-blue-400/60"
                      >
                        <option value="">Select a service...</option>
                        <option value="custom-dev">
                          Custom Software Development
                        </option>
                        <option value="consulting">
                          Technology Consulting
                        </option>
                        <option value="game-dev">
                          Game Development Services
                        </option>
                        <option value="enterprise">Enterprise Solutions</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full bg-blue-950/50 border border-blue-400/30 rounded-lg px-4 py-2 text-white placeholder-blue-200/40 focus:outline-none focus:border-blue-400/60 resize-none"
                        placeholder="Tell us about your project or business challenge..."
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-blue-400 text-black hover:bg-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                    >
                      Send Message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Response Time */}
          <section className="py-16">
            <div className="container mx-auto max-w-4xl px-4">
              <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/40">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-blue-300 mb-2">
                        Expected Response Time
                      </h3>
                      <p className="text-blue-200/80">
                        We typically respond to inquiries within 24 business
                        hours. For urgent matters, please call our direct line
                        during business hours (9AM-6PM EST, Monday-Friday).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
