import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useArmToast } from "@/hooks/use-arm-toast";

export default function DevLink() {
  const navigate = useNavigate();
  const armToast = useArmToast();
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        armToast.system("Dev-Link platform loaded");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [armToast]);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Dev-Link Platform..."
        showProgress={true}
        duration={900}
        accentColor="from-cyan-500 to-cyan-400"
        armLogo="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800"
      />
    );
  }
  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#06b6d4_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(6,182,212,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Badge
                  variant="outline"
                  className="border-cyan-400/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800"
                    alt="Dev-Link"
                    className="h-5 w-5 mr-2"
                  />
                  Dev-Link
                </Badge>

                <h1 className="text-4xl font-black tracking-tight text-cyan-300 sm:text-5xl lg:text-6xl">
                  LinkedIn for Roblox
                </h1>

                <p className="text-lg text-cyan-100/90 sm:text-xl">
                  Connect with Roblox developers, showcase your portfolio, find
                  collaborators, and land your next opportunity. The
                  professional network built by Roblox creators, for Roblox
                  creators.
                </p>

                <Button
                  size="lg"
                  className="bg-cyan-400 text-black shadow-[0_0_30px_rgba(6,182,212,0.35)] transition hover:bg-cyan-300"
                  onClick={() => navigate("/dev-link/waitlist")}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join Waitlist
                </Button>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="border-y border-cyan-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-cyan-950/20 border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
                  <CardHeader>
                    <Users className="h-8 w-8 text-cyan-400 mb-2" />
                    <CardTitle className="text-cyan-300">Network</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-cyan-200/70">
                      Connect with thousands of Roblox developers worldwide and
                      expand your opportunities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-cyan-950/20 border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
                  <CardHeader>
                    <Briefcase className="h-8 w-8 text-cyan-400 mb-2" />
                    <CardTitle className="text-cyan-300">
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-cyan-200/70">
                      Discover jobs, collaborations, and projects tailored to
                      your skills and interests.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-cyan-950/20 border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
                  <CardHeader>
                    <Star className="h-8 w-8 text-cyan-400 mb-2" />
                    <CardTitle className="text-cyan-300">Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-cyan-200/70">
                      Showcase your best work and build your professional
                      reputation in the community.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-cyan-950/20 border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-cyan-400 mb-2" />
                    <CardTitle className="text-cyan-300">Collaborate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-cyan-200/70">
                      Team up with other creators to build amazing games and
                      experiences together.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 lg:py-28">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-4xl font-bold text-cyan-300 mb-4">
                Your Roblox Career Starts Here
              </h2>
              <p className="text-lg text-cyan-100/80 mb-8">
                Join the professional community for Roblox developers. Connect,
                showcase, and grow.
              </p>
              <Button
                size="lg"
                className="bg-cyan-400 text-black shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:bg-cyan-300"
              >
                Start Your Profile
              </Button>

              {/* Creator Network CTAs */}
              <div className="mt-8 pt-8 border-t border-cyan-400/20">
                <p className="text-sm text-cyan-200/70 mb-4">
                  Explore our creator community:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10"
                    onClick={() => navigate("/creators")}
                  >
                    Browse All Creators
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10"
                    onClick={() => navigate("/opportunities")}
                  >
                    View All Opportunities
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
