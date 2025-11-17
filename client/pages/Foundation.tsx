import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useArmTheme } from "@/contexts/ArmThemeContext";
import {
  Heart,
  BookOpen,
  Code,
  Users,
  Zap,
  ArrowRight,
  GraduationCap,
  Gamepad2,
  Sparkles,
  Trophy,
  Compass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useArmToast } from "@/hooks/use-arm-toast";

export default function Foundation() {
  const navigate = useNavigate();
  const { theme } = useArmTheme();
  const armToast = useArmToast();
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        armToast.system("Foundation network connected");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [armToast]);

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
        <div className="container mx-auto px-4 max-w-7xl space-y-12">
          {/* Hero Section */}
          <div className="space-y-6 animate-slide-down">
            <div className="space-y-2">
              <Badge className="w-fit bg-red-600/50 text-red-100">
                Non-Profit Guardian
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-300 via-pink-300 to-red-300 bg-clip-text text-transparent">
                AeThex Foundation
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              The heart of our ecosystem. We believe in building community,
              empowering developers, and advancing game development through
              open-source innovation and mentorship.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/gameforge")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-base"
              >
                <Gamepad2 className="h-5 w-5 mr-2" />
                Join GameForge
              </Button>
              <Button
                onClick={() => navigate("/mentorship")}
                variant="outline"
                className="border-red-500/30 text-red-300 hover:bg-red-500/10 h-12 text-base"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                Explore Programs
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
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* What is GameForge? */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Compass className="h-5 w-5 text-green-400" />
                  What is GameForge?
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  GameForge is the Foundation's flagship "master-apprentice"
                  mentorship program. It's our "gym" where developers
                  collaborate on focused, high-impact game projects within
                  30-day sprints. Teams of 5 (1 mentor + 4 mentees) tackle real
                  game development challenges and ship playable games to our
                  community arcade.
                </p>
              </div>

              {/* The Triple Win */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-400" />
                  Why GameForge Matters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 bg-black/40 rounded-lg border border-green-500/20 space-y-2">
                    <p className="font-semibold text-green-300">
                      Role 1: Community
                    </p>
                    <p className="text-sm text-gray-400">
                      Our "campfire" where developers meet, collaborate, and
                      build their `aethex.me` passports through real project
                      work.
                    </p>
                  </div>
                  <div className="p-4 bg-black/40 rounded-lg border border-green-500/20 space-y-2">
                    <p className="font-semibold text-green-300">
                      Role 2: Education
                    </p>
                    <p className="text-sm text-gray-400">
                      Learn professional development practices: Code Review
                      (SOP-102), Scope Management (KND-001), and shipping
                      excellence.
                    </p>
                  </div>
                  <div className="p-4 bg-black/40 rounded-lg border border-green-500/20 space-y-2">
                    <p className="font-semibold text-green-300">
                      Role 3: Pipeline
                    </p>
                    <p className="text-sm text-gray-400">
                      Top performers become "Architects" ready to work on
                      high-value projects. Your GameForge portfolio proves you
                      can execute.
                    </p>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-400" />
                  How It Works
                </h3>
                <div className="space-y-2">
                  <div className="flex gap-3 p-3 bg-black/30 rounded-lg border border-green-500/10">
                    <span className="text-green-400 font-bold shrink-0">
                      1.
                    </span>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        Join a 5-Person Team
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        1 Forge Master (Mentor) + 4 Apprentices (Scripter,
                        Builder, Sound, Narrative)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-black/30 rounded-lg border border-green-500/10">
                    <span className="text-green-400 font-bold shrink-0">
                      2.
                    </span>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        Ship in 30 Days
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Focused sprint with a strict 1-paragraph GDD. No scope
                        creep. Execute with excellence.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-black/30 rounded-lg border border-green-500/10">
                    <span className="text-green-400 font-bold shrink-0">
                      3.
                    </span>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        Ship to the Arcade
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Your finished game goes live on aethex.fun. Add it to
                        your Passport portfolio.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-black/30 rounded-lg border border-green-500/10">
                    <span className="text-green-400 font-bold shrink-0">
                      4.
                    </span>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        Level Up Your Career
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        3 shipped games = Architect status. Qualify for premium
                        opportunities on NEXUS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => navigate("/gameforge")}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-base font-semibold"
              >
                <Gamepad2 className="h-5 w-5 mr-2" />
                Join the Next GameForge Cohort
                <ArrowRight className="h-5 w-5 ml-auto" />
              </Button>
            </CardContent>
          </Card>

          {/* Foundation Mission & Values */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-400" />
              Our Mission
            </h2>
            <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  The AeThex Foundation is a non-profit organization dedicated
                  to advancing game development through community-driven
                  mentorship, open-source innovation, and educational
                  excellence. We believe that great developers are built, not
                  born—and that the future of gaming lies in collaboration,
                  transparency, and shared knowledge.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-300 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Community is Our Core
                    </h3>
                    <p className="text-sm text-gray-400">
                      Building lasting relationships and support networks within
                      game development.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-300 flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Open Innovation
                    </h3>
                    <p className="text-sm text-gray-400">
                      Advancing the industry through open-source Axiom Protocol
                      and shared tools.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-300 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Excellence & Growth
                    </h3>
                    <p className="text-sm text-gray-400">
                      Mentoring developers to ship real products and achieve
                      their potential.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Programs */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-red-400" />
              Foundation Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mentorship Program */}
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20 hover:border-red-500/40 transition">
                <CardHeader>
                  <CardTitle className="text-xl">Mentorship Network</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Learn from industry veterans. Our mentors bring real-world
                    experience from studios, indie teams, and AAA development.
                  </p>
                  <Button
                    onClick={() => navigate("/mentorship")}
                    variant="outline"
                    className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
                  >
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Open Source */}
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20 hover:border-red-500/40 transition">
                <CardHeader>
                  <CardTitle className="text-xl">Axiom Protocol</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Our open-source protocol for game development. Contribute,
                    learn, and help shape the future of the industry.
                  </p>
                  <Button
                    onClick={() => navigate("/docs")}
                    variant="outline"
                    className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
                  >
                    Explore Protocol <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Courses */}
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20 hover:border-red-500/40 transition">
                <CardHeader>
                  <CardTitle className="text-xl">Learning Paths</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Structured curricula covering game design, programming, art,
                    sound, and narrative design from basics to advanced.
                  </p>
                  <Button
                    onClick={() => navigate("/docs/curriculum")}
                    variant="outline"
                    className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
                  >
                    Start Learning <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Community */}
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20 hover:border-red-500/40 transition">
                <CardHeader>
                  <CardTitle className="text-xl">Community Hub</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Connect with developers, share projects, get feedback, and
                    build lasting professional relationships.
                  </p>
                  <Button
                    onClick={() => navigate("/community")}
                    variant="outline"
                    className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
                  >
                    Join Community <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-red-600/20 via-pink-600/10 to-red-600/20 border-red-500/40">
            <CardContent className="p-12 text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">
                  Ready to Join the Foundation?
                </h2>
                <p className="text-gray-300 text-lg">
                  Whether you're looking to learn, mentor others, or contribute
                  to open-source game development, there's a place for you here.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/gameforge")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 px-8 text-base"
                >
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  Join GameForge Now
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="border-red-500/30 text-red-300 hover:bg-red-500/10 h-12 px-8 text-base"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
