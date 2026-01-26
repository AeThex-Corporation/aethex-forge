import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  ExternalLink,
  ArrowRight,
  Gamepad2,
  Users,
  Code,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function Foundation() {
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "https://aethex.foundation";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleRedirect = () => {
    window.location.href = "https://aethex.foundation";
  };

  if (isLoading) {
    return (
      <LoadingScreen
        message="Connecting Foundation Network..."
        showProgress={true}
        duration={900}
        accentColor="from-red-500 to-red-400"
        armLogo="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800"
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Main Card */}
          <Card className="bg-gradient-to-br from-red-950/40 via-red-900/20 to-red-950/40 border-red-500/30 overflow-hidden">
            <CardContent className="p-8 md:p-12 space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-red-500/20 border border-red-500/30">
                    <Heart className="h-12 w-12 text-red-400" />
                  </div>
                </div>
                <Badge className="bg-red-600/50 text-red-100">
                  Non-Profit Guardian
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-300 via-pink-300 to-red-300 bg-clip-text text-transparent">
                  AeThex Foundation
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  The heart of our ecosystem. Dedicated to community, mentorship,
                  and advancing game development through open-source innovation.
                </p>
              </div>

              {/* Redirect Notice */}
              <div className="bg-black/40 rounded-xl p-6 border border-red-500/20 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-red-300">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">Foundation Has Moved</span>
                </div>
                <p className="text-gray-300">
                  The AeThex Foundation now has its own dedicated home. Visit our
                  new site for programs, resources, and community updates.
                </p>
                <Button
                  onClick={handleRedirect}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 h-12 px-8 text-base"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Visit aethex.foundation
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <p className="text-sm text-gray-500">
                  Redirecting automatically in {countdown} seconds...
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white text-center">
                  Foundation Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="https://aethex.foundation/gameforge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg bg-black/30 border border-green-500/20 hover:border-green-500/40 transition-all group"
                  >
                    <div className="p-2 rounded bg-green-500/20 text-green-400">
                      <Gamepad2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-green-300 transition-colors">
                        GameForge Program
                      </p>
                      <p className="text-sm text-gray-400">
                        30-day mentorship sprints
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-green-400" />
                  </a>

                  <a
                    href="https://aethex.foundation/mentorship"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg bg-black/30 border border-red-500/20 hover:border-red-500/40 transition-all group"
                  >
                    <div className="p-2 rounded bg-red-500/20 text-red-400">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-red-300 transition-colors">
                        Mentorship Network
                      </p>
                      <p className="text-sm text-gray-400">
                        Learn from industry veterans
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-red-400" />
                  </a>

                  <a
                    href="https://aethex.foundation/community"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg bg-black/30 border border-blue-500/20 hover:border-blue-500/40 transition-all group"
                  >
                    <div className="p-2 rounded bg-blue-500/20 text-blue-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                        Community Hub
                      </p>
                      <p className="text-sm text-gray-400">
                        Connect with developers
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400" />
                  </a>

                  <a
                    href="https://aethex.foundation/axiom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg bg-black/30 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                  >
                    <div className="p-2 rounded bg-purple-500/20 text-purple-400">
                      <Code className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                        Axiom Protocol
                      </p>
                      <p className="text-sm text-gray-400">
                        Open-source innovation
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400" />
                  </a>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-4 border-t border-red-500/10">
                <p className="text-sm text-gray-500">
                  The AeThex Foundation is a 501(c)(3) non-profit organization
                  dedicated to advancing game development education and community.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
