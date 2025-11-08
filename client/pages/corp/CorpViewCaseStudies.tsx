import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, Users, ArrowRight, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CorpViewCaseStudies() {
  const navigate = useNavigate();

  const caseStudies = [
    {
      id: 1,
      company: "Global Tech Corp",
      industry: "Technology",
      challenge: "Legacy systems blocking innovation",
      solution: "Cloud-native modernization with microservices",
      result: "$2.5M annual savings, 3x faster deployments",
      metrics: [
        { label: "Annual Savings", value: "$2.5M" },
        { label: "Deployment Speed", value: "3x faster" },
        { label: "Uptime", value: "99.99%" },
        { label: "Team Growth", value: "+40%" },
      ],
      timeline: "12 months",
      teamSize: "8 developers",
    },
    {
      id: 2,
      company: "Gaming Studio Pro",
      industry: "Gaming",
      challenge: "Scaling multiplayer to 100K concurrent players",
      solution: "Custom networking architecture & optimization",
      result: "99.99% uptime, 150K peak concurrent users",
      metrics: [
        { label: "Peak Concurrent Users", value: "150K" },
        { label: "Uptime", value: "99.99%" },
        { label: "Latency", value: "<100ms" },
        { label: "Scaling Improvement", value: "15x" },
      ],
      timeline: "8 months",
      teamSize: "6 developers + 2 DevOps",
    },
    {
      id: 3,
      company: "Financial Services Firm",
      industry: "Finance",
      challenge: "Building real-time trading platform",
      solution: "Low-latency system with custom databases",
      result: "Sub-millisecond latency, 99.95% uptime",
      metrics: [
        { label: "Latency", value: "<1ms" },
        { label: "Uptime", value: "99.95%" },
        { label: "Transactions/sec", value: "100K+" },
        { label: "Time to Market", value: "6 months" },
      ],
      timeline: "6 months",
      teamSize: "10 developers",
    },
    {
      id: 4,
      company: "E-Commerce Giant",
      industry: "Retail",
      challenge: "Modernizing payment processing system",
      solution: "PCI-DSS compliant microservices architecture",
      result: "99.98% uptime, 50% transaction cost reduction",
      metrics: [
        { label: "Uptime", value: "99.98%" },
        { label: "Cost Reduction", value: "50%" },
        { label: "Transaction Volume", value: "2M+/day" },
        { label: "Customer Satisfaction", value: "98%" },
      ],
      timeline: "9 months",
      teamSize: "7 developers",
    },
    {
      id: 5,
      company: "Healthcare Platform",
      industry: "Healthcare",
      challenge: "HIPAA-compliant application modernization",
      solution: "Secure cloud infrastructure with audit logging",
      result: "100% compliance, 5x performance improvement",
      metrics: [
        { label: "Compliance", value: "100% HIPAA" },
        { label: "Performance", value: "5x faster" },
        { label: "Patient Records", value: "500K+" },
        { label: "Uptime", value: "99.99%" },
      ],
      timeline: "10 months",
      teamSize: "9 developers",
    },
    {
      id: 6,
      company: "Media Broadcasting Co",
      industry: "Media",
      challenge: "Real-time video streaming to millions",
      solution: "Distributed CDN with custom encoding",
      result: "4K streaming, 50M+ concurrent viewers",
      metrics: [
        { label: "Concurrent Viewers", value: "50M+" },
        { label: "Video Quality", value: "4K" },
        { label: "Global Regions", value: "6" },
        { label: "Buffering Rate", value: "<0.5%" },
      ],
      timeline: "14 months",
      teamSize: "12 developers",
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
                Case Studies
              </h1>
              <p className="text-lg text-blue-100/80 max-w-3xl">
                Real-world success stories from our enterprise clients. See how
                we've helped transform businesses across industries.
              </p>
            </div>
          </section>

          {/* Case Studies Grid */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="space-y-8">
                {caseStudies.map((study, idx) => (
                  <Card
                    key={study.id}
                    className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-all overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-2 gap-6 p-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-2xl font-bold text-blue-300 mb-1">
                                  {study.company}
                                </h3>
                                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/40">
                                  {study.industry}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-blue-400 mb-1">
                                CHALLENGE
                              </p>
                              <p className="text-sm text-blue-200/80">
                                {study.challenge}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-blue-400 mb-1">
                                SOLUTION
                              </p>
                              <p className="text-sm text-blue-200/80">
                                {study.solution}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-blue-400/10">
                            <div>
                              <p className="text-xs text-blue-400 font-semibold mb-1">
                                TIMELINE
                              </p>
                              <p className="font-semibold text-blue-300">
                                {study.timeline}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-blue-400 font-semibold mb-1">
                                TEAM
                              </p>
                              <p className="font-semibold text-blue-300">
                                {study.teamSize}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4 text-white">
                            <p className="text-xs font-semibold mb-2 opacity-90">
                              RESULTS
                            </p>
                            <p className="text-lg font-bold">{study.result}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {study.metrics.map((metric, midx) => (
                              <div
                                key={midx}
                                className="bg-blue-950/40 rounded-lg p-3"
                              >
                                <p className="text-xs text-blue-400 font-semibold mb-1">
                                  {metric.label}
                                </p>
                                <p className="text-lg font-bold text-blue-300">
                                  {metric.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Summary Stats */}
          <section className="py-16 border-t border-blue-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-12">
                Overall Impact
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { label: "Enterprise Clients", value: "100+" },
                  { label: "Successful Projects", value: "250+" },
                  { label: "Total Investment Saved", value: "$50M+" },
                  { label: "Avg Satisfaction", value: "98%" },
                ].map((stat, idx) => (
                  <Card
                    key={idx}
                    className="bg-blue-950/30 border-blue-400/40 text-center"
                  >
                    <CardContent className="pt-6">
                      <p className="text-3xl font-black text-blue-400 mb-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-blue-200/70">{stat.label}</p>
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
                Ready for Your Success Story?
              </h2>
              <p className="text-lg text-blue-100/80 mb-8">
                Let's discuss how we can help transform your business and
                achieve similar results.
              </p>
              <Button
                className="bg-blue-400 text-black shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-300"
                onClick={() => navigate("/corp/schedule-consultation")}
              >
                Schedule a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
