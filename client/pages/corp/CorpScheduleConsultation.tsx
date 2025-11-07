import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CorpScheduleConsultation() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated grid background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Button
                  variant="ghost"
                  className="text-blue-300 hover:bg-blue-500/10"
                  onClick={() => navigate("/corp")}
                >
                  ← Back to Corp
                </Button>

                <Badge
                  variant="outline"
                  className="border-blue-400/40 bg-blue-500/10 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Consultation
                </Badge>

                <h1 className="text-4xl font-black tracking-tight text-blue-300 sm:text-5xl lg:text-6xl">
                  Let's Talk Strategy
                </h1>

                <p className="text-lg text-blue-100/90 sm:text-xl">
                  Book a consultation with our experts to discuss your digital
                  transformation goals and how we can help.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-blue-400 text-black shadow-[0_0_30px_rgba(59,130,246,0.35)] transition hover:bg-blue-300"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-400/60 text-blue-300 hover:bg-blue-500/10"
                  >
                    View Availability
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Consultation Types */}
          <section className="border-y border-blue-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-blue-300 mb-8">
                Consultation Options
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-colors">
                  <CardHeader>
                    <Clock className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">
                      30 Min Quick Sync
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-200/70">
                      A focused discussion to understand your challenges and
                      explore potential solutions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-colors">
                  <CardHeader>
                    <Briefcase className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">
                      1 Hour Strategy Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-200/70">
                      In-depth consultation to develop a strategic roadmap for
                      your digital goals.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-colors">
                  <CardHeader>
                    <Users className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">
                      Team Workshop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-200/70">
                      Collaborative session with your team to identify
                      opportunities and align strategy.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-colors">
                  <CardHeader>
                    <Calendar className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">
                      Discovery Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-200/70">
                      Comprehensive assessment of your current state and
                      transformation priorities.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
