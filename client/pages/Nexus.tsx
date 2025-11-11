import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  Zap,
  Target,
  Network,
  Sparkles,
  ArrowRight,
  Music,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";

export default function Nexus() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("Nexus talent marketplace connected");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Initializing Talent Nexus..."
        showProgress={true}
        duration={900}
        accentColor="from-purple-500 to-purple-400"
      />
    );
  }

  const features = [
    {
      icon: Users,
      title: "Discover Talent",
      description:
        "Browse creators across all AeThex arms with powerful filters and search.",
    },
    {
      icon: Briefcase,
      title: "Post Opportunities",
      description:
        "Create job postings and collaboration requests for your team or studio.",
    },
    {
      icon: Network,
      title: "Cross-Arm Integration",
      description:
        "Find talent from Labs, GameForge, Corp, Foundation, and DevConnect.",
    },
    {
      icon: Sparkles,
      title: "Hybrid Marketplace",
      description:
        "Access both AeThex creators and DevConnect developers in one place.",
    },
    {
      icon: Target,
      title: "Smart Matching",
      description:
        "Match opportunities with creators based on skills, experience, and interests.",
    },
    {
      icon: Zap,
      title: "Instant Apply",
      description:
        "Apply for opportunities directly or track your applications in real-time.",
    },
  ];

  const stats = [
    { label: "Active Creators", value: "1000+" },
    { label: "Opportunities", value: "500+" },
    { label: "Arms Connected", value: "5" },
    { label: "Success Rate", value: "92%" },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds - Purple theme */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#a855f7_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(168,85,247,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(168,85,247,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Badge
                  variant="outline"
                  className="border-purple-400/40 bg-purple-500/10 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F6df123b87a144b1fb99894d94198d97b?format=webp&width=800"
                    alt="Nexus"
                    className="h-5 w-5 mr-2"
                  />
                  AeThex Nexus
                </Badge>

                <h1 className="text-4xl font-black tracking-tight text-purple-300 sm:text-5xl lg:text-6xl">
                  The Talent Nexus
                </h1>

                <p className="text-lg text-purple-100/90 sm:text-xl">
                  Connect creators with opportunities across all AeThex arms.
                  Find talent, post jobs, and build amazing teams in a unified
                  marketplace powered by both AeThex and DevConnect.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-purple-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] transition hover:bg-purple-600"
                    onClick={() => navigate("/creators")}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Browse Creators
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-400/40 text-purple-300 hover:bg-purple-500/10"
                    onClick={() => navigate("/opportunities")}
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    Find Opportunities
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="border-y border-purple-400/10 bg-black/80 py-12">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-purple-400">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-purple-200/60 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-purple-300 mb-4">
                  Everything You Need
                </h2>
                <p className="text-purple-200/70">
                  Connect creators with opportunities in a single, unified
                  marketplace
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={feature.title}
                      className="bg-purple-950/20 border-purple-400/30 hover:border-purple-400/60 transition-colors"
                    >
                      <CardHeader>
                        <Icon className="h-8 w-8 text-purple-400 mb-2" />
                        <CardTitle className="text-purple-300">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-purple-200/70">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Ethos Audio Production Section */}
          <section className="border-t border-purple-400/10 bg-purple-950/10 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-12">
                <Badge className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white mb-4">
                  <Sparkles className="h-3 w-3" />
                  New: Audio Production
                </Badge>
                <h2 className="text-3xl font-bold text-purple-300 mb-4">
                  Ethos Guild - Audio & SFX Artists
                </h2>
                <p className="text-purple-200/70 max-w-2xl mx-auto">
                  Discover original music, sound effects, and audio composition services from Ethos Guild artists. Perfect for games, films, and commercial projects.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-purple-950/20 border-purple-400/30 hover:border-purple-400/60 transition-colors">
                  <CardHeader>
                    <Music className="h-8 w-8 text-pink-400 mb-2" />
                    <CardTitle className="text-purple-300">
                      Browse Track Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-purple-200/70">
                      Access thousands of original tracks, SFX, and compositions available under ecosystem (free) or commercial licenses.
                    </p>
                    <Button
                      onClick={() => navigate("/ethos/library")}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    >
                      Explore Library
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-purple-950/20 border-purple-400/30 hover:border-purple-400/60 transition-colors">
                  <CardHeader>
                    <Users className="h-8 w-8 text-pink-400 mb-2" />
                    <CardTitle className="text-purple-300">
                      Hire Ethos Artists
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-purple-200/70">
                      Work with verified Ethos artists for custom compositions, game audio, and SFX design with transparent pricing and fast turnaround.
                    </p>
                    <Button
                      onClick={() => navigate("/community/groups/ethos")}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Arms Integration Section */}
          <section className="border-t border-purple-400/10 bg-purple-950/10 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-purple-300 mb-4">
                  Multi-Arm Marketplace
                </h2>
                <p className="text-purple-200/70">
                  Access talent and opportunities from all AeThex arms in one
                  place
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { name: "Labs", emoji: "🔬", color: "yellow" },
                  { name: "GameForge", emoji: "🎮", color: "green" },
                  { name: "Corp", emoji: "💼", color: "blue" },
                  { name: "Foundation", emoji: "🎓", color: "red" },
                  { name: "DevConnect", emoji: "🌐", color: "purple" },
                ].map((arm) => (
                  <div
                    key={arm.name}
                    className="p-4 rounded-lg border border-purple-400/20 bg-black/40 text-center hover:border-purple-400/50 transition-colors"
                  >
                    <p className="text-3xl mb-2">{arm.emoji}</p>
                    <p className="font-semibold text-purple-300">{arm.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative py-20">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <div className="rounded-lg border border-purple-400/30 bg-purple-950/30 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-purple-300 mb-4">
                  Ready to Connect?
                </h2>
                <p className="text-purple-200/80 mb-8">
                  Join the Nexus today and find your next opportunity or team
                  member
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:bg-purple-600"
                    onClick={() => navigate("/creators")}
                  >
                    Explore Creators
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-400/40 text-purple-300 hover:bg-purple-500/10"
                    onClick={() => navigate("/opportunities")}
                  >
                    View Opportunities
                    <ArrowRight className="ml-2 h-4 w-4" />
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
