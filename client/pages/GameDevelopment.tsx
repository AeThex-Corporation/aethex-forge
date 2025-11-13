import { useState, useEffect, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  Code,
  Sparkles,
  Zap,
  Users,
  Trophy,
  Rocket,
  Target,
  Star,
  Play,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Cpu,
  Palette,
  Volume2,
  Globe,
  Smartphone,
} from "lucide-react";

export default function GameDevelopment() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeService, setActiveService] = useState(0);

  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("Game Development services loaded successfully");
        toastShownRef.current = true;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      title: "Custom Game Development",
      description: "End-to-end game creation from concept to deployment",
      icon: Gamepad2,
      features: [
        "Full-stack development",
        "Multi-platform support",
        "Performance optimization",
        "Live deployment",
      ],
      timeline: "3-12 months",
      price: "Custom pricing",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Roblox Development",
      description: "Specialized Roblox game creation and scripting",
      icon: Code,
      features: [
        "Lua scripting",
        "UI/UX design",
        "Monetization setup",
        "Analytics integration",
      ],
      timeline: "2-8 weeks",
      price: "Starting at $2,500",
      color: "from-green-500 to-blue-600",
    },
    {
      title: "Game Porting",
      description: "Adapt existing games to new platforms and devices",
      icon: Smartphone,
      features: [
        "Cross-platform compatibility",
        "Performance tuning",
        "Platform-specific features",
        "Quality assurance",
      ],
      timeline: "4-16 weeks",
      price: "Starting at $5,000",
      color: "from-orange-500 to-red-600",
    },
    {
      title: "Game Optimization",
      description: "Enhance performance and user experience of existing games",
      icon: Zap,
      features: [
        "Performance profiling",
        "Memory optimization",
        "Load time reduction",
        "Frame rate improvement",
      ],
      timeline: "2-6 weeks",
      price: "Starting at $1,500",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const technologies = [
    { name: "Unity 3D", icon: Cpu, category: "Engine" },
    { name: "Unreal Engine", icon: Cpu, category: "Engine" },
    { name: "Roblox Studio", icon: Code, category: "Platform" },
    { name: "C#", icon: Code, category: "Language" },
    { name: "Lua", icon: Code, category: "Language" },
    { name: "JavaScript", icon: Code, category: "Language" },
    { name: "Blender", icon: Palette, category: "3D Modeling" },
    { name: "Photoshop", icon: Palette, category: "Graphics" },
    { name: "FMOD", icon: Volume2, category: "Audio" },
  ];

  const portfolio = [
    {
      title: "Neural Combat Arena",
      description:
        "AI-powered multiplayer battle arena with dynamic environments",
      tech: ["Unity", "C#", "Photon"],
      players: "10K+ active",
      rating: 4.8,
      category: "Action",
    },
    {
      title: "Quantum Puzzle Lab",
      description: "Mind-bending puzzle game with quantum mechanics simulation",
      tech: ["Custom Engine", "C++", "OpenGL"],
      players: "25K+ downloads",
      rating: 4.9,
      category: "Puzzle",
    },
    {
      title: "Roblox Tycoon Empire",
      description: "Business simulation with advanced economy systems",
      tech: ["Roblox Studio", "Lua", "DataStore"],
      players: "1B+ visits",
      rating: 4.7,
      category: "Simulation",
    },
  ];

  type Studio = {
    name: string;
    tagline?: string;
    metrics?: string;
    specialties?: string[];
  };

  const defaultStudios: Studio[] = [
    {
      name: "Lone Star Studio",
      tagline: "Indie craftsmanship with AAA polish",
      metrics: "Top-rated indie hits",
      specialties: ["Unity", "Unreal", "Pixel Art"],
    },
    {
      name: "AeThex | GameForge",
      tagline: "High-performance cross-platform experiences",
      metrics: "Billions of player sessions",
      specialties: ["Roblox", "Backend", "LiveOps"],
    },
    {
      name: "Gaming Control",
      tagline: "Strategy, simulation, and systems-first design",
      metrics: "Award-winning franchises",
      specialties: ["Simulation", "AI/ML", "Economy"],
    },
  ];

  const [studios, setStudios] = useState<Studio[]>([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/featured-studios`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => (Array.isArray(data) ? setStudios(data) : undefined))
      .catch(() => undefined);
  }, []);

  const process = [
    {
      step: 1,
      title: "Discovery & Planning",
      description:
        "We analyze your vision, target audience, and technical requirements",
      duration: "1-2 weeks",
      deliverables: [
        "Project roadmap",
        "Technical specifications",
        "Art direction",
      ],
    },
    {
      step: 2,
      title: "Prototyping",
      description: "Create playable prototypes to validate core mechanics",
      duration: "2-4 weeks",
      deliverables: [
        "Playable prototype",
        "Mechanics validation",
        "User feedback analysis",
      ],
    },
    {
      step: 3,
      title: "Production",
      description:
        "Full development with regular milestones and client reviews",
      duration: "8-40 weeks",
      deliverables: ["Weekly builds", "Progress reports", "Quality assurance"],
    },
    {
      step: 4,
      title: "Launch & Support",
      description: "Deployment, marketing support, and ongoing maintenance",
      duration: "Ongoing",
      deliverables: [
        "Live deployment",
        "Performance monitoring",
        "Update releases",
      ],
    },
  ];

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Game Development services..."
        showProgress={true}
        duration={1000}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute text-aethex-400 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  fontSize: `${8 + Math.random() * 6}px`,
                }}
              >
                {"🎮🕹️🎯🏆".charAt(Math.floor(Math.random() * 4))}
              </div>
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge
                variant="outline"
                className="border-aethex-400/50 text-aethex-400 animate-bounce-gentle"
              >
                <Gamepad2 className="h-3 w-3 mr-1" />
                Game Development Division
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient-purple">
                  Crafting Digital Worlds
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From concept to launch, we create immersive gaming experiences
                that captivate players and push the boundaries of interactive
                entertainment.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift"
                >
                  <Link
                    to="/engage#game-development"
                    className="flex items-center space-x-2"
                  >
                    <Rocket className="h-5 w-5" />
                    <span>Start Your Project</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-border/50 hover-lift"
                >
                  <Link to="/docs">View Portfolio</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Our Game Development Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive solutions for every stage of game development
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = activeService === index;
                return (
                  <Card
                    key={index}
                    className={`relative overflow-hidden transition-all duration-500 hover-lift cursor-pointer animate-scale-in ${
                      isActive
                        ? "border-aethex-500 glow-blue scale-105"
                        : "border-border/50 hover:border-aethex-400/50"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setActiveService(index)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-r ${service.color} transition-all duration-300 hover:scale-110`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle
                              className={`text-xl ${isActive ? "text-gradient" : ""}`}
                            >
                              {service.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {service.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <CheckCircle className="h-3 w-3 text-aethex-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-border/30">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{service.timeline}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-semibold text-aethex-400">
                          <DollarSign className="h-4 w-4" />
                          <span>{service.price}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Technologies We Master
              </h2>
              <p className="text-lg text-muted-foreground">
                Cutting-edge tools and frameworks for modern game development
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {technologies.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <Card
                    key={index}
                    className="bg-card/30 border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-sm">{tech.name}</h3>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {tech.category}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Studios Section */}
        <section className="py-16 sm:py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Featured Studios
              </h2>
              <p className="text-lg text-muted-foreground">
                Hand-picked studios powering AeThex game development
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {studios.map((studio, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{studio.name}</CardTitle>
                      {studio.tagline && (
                        <CardDescription>{studio.tagline}</CardDescription>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {studio.specialties?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {studio.specialties.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    {studio.metrics ? (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{studio.metrics}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">Top Rated</span>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Development Process */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Our Development Process
              </h2>
              <p className="text-lg text-muted-foreground">
                Structured approach ensuring quality and timely delivery
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {process.map((phase, index) => (
                <div
                  key={index}
                  className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-12 animate-slide-right"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-aethex-500 to-neon-blue flex items-center justify-center text-white font-bold glow-blue sm:mr-6">
                    {phase.step}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Card className="bg-card/50 border-border/50 hover:border-aethex-400/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <h3 className="text-xl font-semibold text-gradient mb-2">
                              {phase.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {phase.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {phase.deliverables.map(
                                (deliverable, delIndex) => (
                                  <Badge
                                    key={delIndex}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {deliverable}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge className="bg-gradient-to-r from-aethex-500/20 to-neon-blue/20 text-aethex-300 border-aethex-400/50">
                              <Clock className="h-3 w-3 mr-1" />
                              {phase.duration}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Connector Line */}
                  {index < process.length - 1 && (
                    <div className="absolute left-6 top-14 hidden sm:block w-0.5 h-12 bg-gradient-to-b from-aethex-400 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-background/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8 animate-scale-in">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient-purple">
                Ready to Build Your Game?
              </h2>
              <p className="text-xl text-muted-foreground">
                Let's transform your vision into an engaging gaming experience
                that players will love.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
                >
                  <Link
                    to="/engage#game-development"
                    className="flex items-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Start Your Project</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-aethex-400/50 hover:border-aethex-400 hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
                >
                  <Link to="/onboarding">Join Our Team</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Enterprise Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your IP is protected
                  </p>
                </div>
                <div className="text-center">
                  <Globe className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Global Reach</h3>
                  <p className="text-sm text-muted-foreground">
                    Worldwide deployment
                  </p>
                </div>
                <div className="text-center">
                  <Trophy className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Award Winning</h3>
                  <p className="text-sm text-muted-foreground">
                    Industry recognition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
