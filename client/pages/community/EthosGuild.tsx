import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Music,
  Users,
  Sparkles,
  TrendingUp,
  Award,
  Heart,
  Zap,
  Radio,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface GuildMember {
  id: string;
  name: string;
  avatar: string;
  role: "artist" | "composer" | "sound-designer";
  speciality: string;
  trackCount: number;
  verified: boolean;
}

interface FeaturedTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  featured: boolean;
}

export default function EthosGuild() {
  const [activeTab, setActiveTab] = useState("overview");

  const guildStats = [
    {
      label: "Guild Members",
      value: "Coming soon",
      icon: Users,
      description: "Artists and composers",
    },
    {
      label: "Tracks in Library",
      value: "Coming soon",
      icon: Music,
      description: "Original compositions",
    },
    {
      label: "Licensed for Games",
      value: "Coming soon",
      icon: Zap,
      description: "In production",
    },
    {
      label: "Avg. Artist Rating",
      value: "Coming soon",
      icon: Award,
      description: "Quality verified",
    },
  ];

  const upcomingFeatures = [
    {
      id: "upload",
      title: "Upload & Share Tracks",
      description: "Submit your synthwave, SFX, and original compositions.",
      icon: Music,
      status: "Coming Soon",
    },
    {
      id: "licensing",
      title: "Flexible Licensing",
      description:
        "Choose between ecosystem (free) or commercial (paid) licensing.",
      icon: Award,
      status: "Coming Soon",
    },
    {
      id: "marketplace",
      title: "NEXUS Marketplace",
      description:
        "List your services on the AeThex talent marketplace (Audio category).",
      icon: Sparkles,
      status: "Phase 2",
    },
    {
      id: "curriculum",
      title: "Production Curriculum",
      description:
        "Learn synthwave, SFX design, and music theory from mentors.",
      icon: TrendingUp,
      status: "Coming Soon",
    },
  ];

  const missionHighlights = [
    {
      title: "The Sound of AeThex",
      description:
        "Provide high-quality, original music and sound design for all AeThex projects.",
      color: "from-pink-500/20 to-purple-500/20",
    },
    {
      title: "Talent Incubator",
      description:
        "Grow a vibrant community of musicians ready for paid commercial work.",
      color: "from-purple-500/20 to-cyan-500/20",
    },
    {
      title: "Synthwave Aesthetic",
      description:
        "Celebrate the retro-futuristic '80s sound that powers AeThex innovation.",
      color: "from-cyan-500/20 to-pink-500/20",
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Synthwave gradient backgrounds */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ec4899_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(236,72,153,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(236,72,153,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />

      {/* Synthwave glow orbs */}
      <div className="pointer-events-none absolute top-40 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-40 left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-blob animation-delay-2000" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* Hero Section */}
        <section className="space-y-6 text-center animate-slide-up">
          <div className="space-y-3">
            <Badge className="mx-auto bg-gradient-to-r from-pink-600 to-purple-600 text-white border-0 text-sm font-semibold px-4 py-1">
              ✨ ETHOS GUILD ✨
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              The Sound of AeThex
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Welcome to the official audio identity program for the AeThex
              ecosystem. A community of musicians, composers, and sound
              designers collaborating on synthwave, SFX, and original scores.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border-0"
            >
              <Link to="/ethos/library">
                Browse Ethos Library <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2 border-pink-500/50 text-pink-300 hover:bg-pink-500/10"
            >
              <Link to="/docs/curriculum/ethos">
                Explore Curriculum <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2 border-pink-500/50 text-pink-300 hover:bg-pink-500/10"
            >
              <Link to="/ethos/settings">
                Artist Settings <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Guild Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {guildStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="border-pink-500/30 bg-black/50 backdrop-blur hover:border-pink-500/60 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-gray-300">
                      {stat.label}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-pink-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-400">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Mission & Values */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Guild Mission</h2>
            <p className="text-gray-400 mt-2">
              Three pillars guiding Ethos forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {missionHighlights.map((highlight) => (
              <Card
                key={highlight.title}
                className={`bg-gradient-to-br ${highlight.color} border-pink-500/20 hover:border-pink-500/60 transition-all`}
              >
                <CardHeader>
                  <CardTitle className="text-white">
                    {highlight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tabs: Overview, Features, Curriculum, etc */}
        <section>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-pink-500/30">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-pink-600/30 data-[state=active]:text-pink-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="data-[state=active]:bg-pink-600/30 data-[state=active]:text-pink-300"
              >
                Features
              </TabsTrigger>
              <TabsTrigger
                value="roadmap"
                className="data-[state=active]:bg-pink-600/30 data-[state=active]:text-pink-300"
              >
                Roadmap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card className="border-pink-500/30 bg-black/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Radio className="h-5 w-5 text-pink-400" />
                    Welcome to the Ethos Guild
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    The official audio identity program of AeThex Foundation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <p>
                    Ethos is not a separate label or business—it's a vibrant
                    community guild living within the Foundation arm of
                    aethex.dev. We exist to create the sound of AeThex.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-pink-300 font-semibold mb-1">
                        For Musicians & Producers
                      </h3>
                      <p className="text-sm">
                        Join a collaborative space to build your portfolio,
                        access paid commercial work, and get your music into
                        real games and products.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-purple-300 font-semibold mb-1">
                        For GameForge & Foundation
                      </h3>
                      <p className="text-sm">
                        Access free, high-quality, original music and SFX for
                        your non-commercial projects. Ethos artists are your
                        dedicated "Sound Designer" team.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-cyan-300 font-semibold mb-1">
                        For CORP Clients
                      </h3>
                      <p className="text-sm">
                        Need a custom score, jingle, or SFX pack for your client
                        project? Hire an Ethos artist directly via the NEXUS
                        marketplace.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-pink-500/20 pt-4">
                    <p className="text-sm italic text-gray-400">
                      "Synthwave aesthetics. Retro-futuristic vibes. The '80s
                      sound of tomorrow."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={feature.id}
                      className="border-pink-500/30 bg-black/50 backdrop-blur hover:border-pink-500/60 transition-all"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-white flex items-center gap-2">
                              <Icon className="h-5 w-5 text-pink-400" />
                              {feature.title}
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                              {feature.description}
                            </CardDescription>
                          </div>
                          <Badge className="bg-pink-600/50 text-pink-100 text-xs">
                            {feature.status}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-6 mt-6">
              <Card className="border-pink-500/30 bg-black/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">
                    Ethos Guild Development Roadmap
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Three phases to build the complete Ethos ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-pink-300 font-semibold mb-3">
                      Phase 1: Foundation (Current)
                    </h3>
                    <ul className="space-y-2 text-sm ml-4">
                      <li className="flex gap-2">
                        <span className="text-pink-400">✓</span>
                        Database schema for tracks & artist profiles
                      </li>
                      <li className="flex gap-2">
                        <span className="text-pink-400">✓</span>
                        Community group page (you are here!)
                      </li>
                      <li className="flex gap-2">
                        <span className="text-pink-400">✓</span>
                        Curriculum structure for music production
                      </li>
                      <li className="flex gap-2">
                        <span className="text-pink-400">✓</span>
                        Legal licensing templates (via CEO)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-purple-300 font-semibold mb-3">
                      Phase 2: MVP Build
                    </h3>
                    <ul className="space-y-2 text-sm ml-4">
                      <li className="flex gap-2">
                        <span className="text-purple-400">→</span>
                        Track upload & library interface
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-400">→</span>
                        Artist profile pages & portfolio
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-400">→</span>
                        NEXUS "Audio Production" category integration
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-400">→</span>
                        Licensing agreement workflow
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-cyan-300 font-semibold mb-3">
                      Phase 3: Content & Community
                    </h3>
                    <ul className="space-y-2 text-sm ml-4">
                      <li className="flex gap-2">
                        <span className="text-cyan-400">→</span>
                        Music production curriculum (written by community)
                      </li>
                      <li className="flex gap-2">
                        <span className="text-cyan-400">→</span>
                        Founding artists onboarding
                      </li>
                      <li className="flex gap-2">
                        <span className="text-cyan-400">→</span>
                        Guild leadership & curator roles
                      </li>
                      <li className="flex gap-2">
                        <span className="text-cyan-400">→</span>
                        Monthly artist spotlight & events
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Call to Action */}
        <section className="rounded-2xl border border-pink-500/40 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Ready to Make AeThex Sound?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            The Ethos Guild is being built right now. The legal framework, UI
            skeleton, and database are ready. Soon you'll be able to upload
            tracks, list services, and join the community.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border-0"
            >
              <Link to="/docs/curriculum/ethos">
                Learn Music Production <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-pink-500/50 text-pink-300 hover:bg-pink-500/10"
            >
              <a href="mailto:community@aethex.dev">
                Contact the team <Heart className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
