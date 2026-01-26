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
  Trophy,
  Compass,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function Foundation() {
  const [isLoading, setIsLoading] = useState(true);
  const [showTldr, setShowTldr] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const toastShownRef = useRef(false);

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

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitModal) {
        setShowExitModal(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showExitModal]);

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
      <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black">
        {/* Persistent Info Banner */}
        <div className="bg-red-500/10 border-b border-red-400/30 py-3 sticky top-0 z-50 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-200">
                  Foundation is hosted at{" "}
                  <a href="https://aethex.foundation" className="underline font-semibold hover:text-red-300">
                    aethex.foundation
                  </a>
                </p>
              </div>
              <Button
                size="sm"
                className="bg-red-400 text-black hover:bg-red-300"
                onClick={() => window.location.href = 'https://aethex.foundation'}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Foundation
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl space-y-20 py-16 lg:py-24">
          {/* Hero Section */}
          <div className="text-center space-y-8 animate-slide-down">
            <div className="flex justify-center mb-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800"
                alt="Foundation Logo"
                className="h-32 w-32 object-contain drop-shadow-[0_0_50px_rgba(239,68,68,0.5)]"
              />
            </div>

            <div className="space-y-6 max-w-5xl mx-auto">
              <Badge className="border-red-400/50 bg-red-500/10 text-red-100 text-base px-4 py-1.5">
                <Heart className="h-5 w-5 mr-2" />
                501(c)(3) Non-Profit Organization
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-red-300 via-pink-300 to-red-300 bg-clip-text text-transparent">
                AeThex Foundation
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Building community, empowering developers, and advancing game development through open-source innovation and mentorship.
              </p>

              {/* TL;DR Section */}
              <div className="max-w-3xl mx-auto">
                <button
                  onClick={() => setShowTldr(!showTldr)}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors mx-auto"
                >
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">{showTldr ? 'Hide' : 'Show'} Quick Summary</span>
                  <ArrowRight className={`h-4 w-4 transition-transform ${showTldr ? 'rotate-90' : ''}`} />
                </button>
                {showTldr && (
                  <div className="mt-4 p-6 bg-red-950/40 border border-red-400/30 rounded-lg text-left space-y-3 animate-slide-down">
                    <h3 className="text-lg font-bold text-red-300">TL;DR</h3>
                    <ul className="space-y-2 text-red-100/90">
                      <li className="flex gap-3"><span className="text-red-400">✦</span> <span>501(c)(3) non-profit focused on game development</span></li>
                      <li className="flex gap-3"><span className="text-red-400">✦</span> <span>GameForge flagship program (30-day sprints)</span></li>
                      <li className="flex gap-3"><span className="text-red-400">✦</span> <span>Open-source Axiom Protocol for game dev</span></li>
                      <li className="flex gap-3"><span className="text-red-400">✦</span> <span>Master-apprentice mentorship model</span></li>
                      <li className="flex gap-3"><span className="text-red-400">✦</span> <span>Community hub at aethex.foundation</span></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-[0_0_40px_rgba(239,68,68,0.3)] h-14 px-8 text-lg"
                onClick={() => window.location.href = 'https://aethex.foundation'}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Visit Foundation Platform
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14 px-8 text-lg"
                onClick={() => window.location.href = 'https://aethex.foundation/gameforge'}
              >
                <Gamepad2 className="h-5 w-5 mr-2" />
                Join GameForge
              </Button>
            </div>
          </div>

          {/* Flagship: GameForge Section */}
          <Card className="bg-gradient-to-br from-green-950/40 via-emerald-950/30 to-green-950/40 border-green-500/40 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-8 w-8 text-green-400" />
                <div>
                  <CardTitle className="text-2xl text-white">
                    🚀 GameForge: Our Flagship Program
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">
                    30-day mentorship sprints where developers ship real games
                  </p>
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

      {/* Exit Intent Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-red-950 to-black border-2 border-red-400/50 rounded-xl p-8 max-w-lg mx-4 shadow-2xl shadow-red-500/20 animate-slide-up">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-red-400/20 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-red-400" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-red-300">Join Our Community</h3>
                <p className="text-red-100/80">
                  Be part of the AeThex Foundation 501(c)(3) - where developers learn, grow, and ship together.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 h-12"
                  onClick={() => window.location.href = 'https://aethex.foundation'}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Visit Foundation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-red-400/50 text-red-300 hover:bg-red-500/10 h-12"
                  onClick={() => setShowExitModal(false)}
                >
                  Keep Reading
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
