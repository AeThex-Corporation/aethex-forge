import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Settings, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Corp() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
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
                <Badge
                  variant="outline"
                  className="border-blue-400/40 bg-blue-500/10 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fae654ecc18b241bdab273893e8231970?format=webp&width=800"
                    alt="Corp"
                    className="h-5 w-5 mr-2"
                  />
                  Aethex Corp
                </Badge>

                <h1 className="text-4xl font-black tracking-tight text-blue-300 sm:text-5xl lg:text-6xl">
                  Enterprise Solutions
                </h1>

                <p className="text-lg text-blue-100/90 sm:text-xl">
                  Strategic consulting, technology integration, and digital
                  transformation for enterprises. We help companies navigate the
                  future.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-blue-400 text-black shadow-[0_0_30px_rgba(59,130,246,0.35)] transition hover:bg-blue-300"
                    onClick={() => navigate("/corp/schedule-consultation")}
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    Schedule Consultation
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-400/60 text-blue-300 hover:bg-blue-500/10"
                    onClick={() => navigate("/corp/view-case-studies")}
                  >
                    View Case Studies
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="border-y border-blue-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-colors">
                  <CardHeader>
                    <Settings className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">Consulting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-200/70">
                      Strategic guidance for digital transformation and
                      technology adoption.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-colors">
                  <CardHeader>
                    <TrendingUp className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">
                      Scale & Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-200/70">
                      Build robust systems designed for enterprise scale and
                      reliability.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-colors">
                  <CardHeader>
                    <Users className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">
                      Team Partnership
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-200/70">
                      Work with dedicated teams augmenting your existing
                      development capacity.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60 transition-colors">
                  <CardHeader>
                    <Briefcase className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">Solutions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-200/70">
                      Custom solutions tailored to your business needs and
                      technical requirements.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 lg:py-28">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-4xl font-bold text-blue-300 mb-4">
                Transform Your Business
              </h2>
              <p className="text-lg text-blue-100/80 mb-8">
                Let's discuss how AeThex Corp can help accelerate your digital
                initiatives and drive growth.
              </p>
              <Button
                size="lg"
                className="bg-blue-400 text-black shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-300"
                onClick={() => navigate("/corp/contact-us")}
              >
                Contact Us
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
