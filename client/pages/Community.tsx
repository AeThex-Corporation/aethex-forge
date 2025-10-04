import { useState, useEffect, useRef, useCallback } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { FormEvent } from "react";
import {
  Users,
  MessageCircle,
  Github,
  MessageSquare,
  Twitter,
  ArrowRight,
  Star,
  Calendar,
  MapPin,
  Award,
  TrendingUp,
  Heart,
  Coffee,
  Code,
  Gamepad2,
  CheckCircle,
  Loader2,
} from "lucide-react";

type EventStatus = "Registration Open" | "Recurring" | "Upcoming" | "Waitlist";

type CommunityEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  participants: number;
  prize?: string | null;
  status: EventStatus;
  description: string;
  agenda: string[];
  registrationEnabled: boolean;
  registrationUrl?: string;
};

type EventRegistrationPayload = {
  name: string;
  email: string;
  teamName?: string;
  message?: string;
};

interface EventCardProps {
  event: CommunityEvent;
  animationDelay: number;
  isRegistered: boolean;
  registrant?: EventRegistrationPayload;
  onRegister: (payload: EventRegistrationPayload) => void;
}

export default function Community() {
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("Community hub connected");
        toastShownRef.current = true;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const platforms = [
    {
      name: "Discord Server",
      description: "Real-time chat with developers and get instant help",
      icon: MessageSquare,
      members: "15K+ members",
      activity: "500+ daily active",
      link: "/discord",
      color: "from-purple-500 to-indigo-600",
    },
    {
      name: "GitHub Community",
      description: "Contribute to open source projects and share code",
      icon: Github,
      members: "8K+ contributors",
      activity: "200+ repositories",
      link: "/github",
      color: "from-gray-700 to-gray-900",
    },
    {
      name: "Twitter Community",
      description: "Follow the latest updates and join conversations",
      icon: Twitter,
      members: "25K+ followers",
      activity: "Daily updates",
      link: "/twitter",
      color: "from-blue-400 to-blue-600",
    },
  ];

  const events = [
    {
      title: "AeThex Game Jam 2024",
      date: "January 15-17, 2025",
      location: "Online",
      type: "Competition",
      participants: 500,
      prize: "$10,000",
      status: "Registration Open",
    },
    {
      title: "Weekly Developer Meetup",
      date: "Every Wednesday, 7 PM PST",
      location: "Discord Voice Chat",
      type: "Meetup",
      participants: 50,
      prize: null,
      status: "Recurring",
    },
    {
      title: "AI in Games Workshop",
      date: "December 20, 2024",
      location: "San Francisco & Online",
      type: "Workshop",
      participants: 100,
      prize: null,
      status: "Upcoming",
    },
  ];

  const contributors = [
    {
      name: "Alex Developer",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      title: "Community Leader",
      contributions: 156,
      badge: "🏆 Top Contributor",
      speciality: "Game Development",
    },
    {
      name: "Sarah Coder",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b029?w=100&h=100&fit=crop&crop=face",
      title: "Documentation Expert",
      contributions: 89,
      badge: "📚 Knowledge Hero",
      speciality: "Technical Writing",
    },
    {
      name: "Jordan AI",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      title: "AI Researcher",
      contributions: 134,
      badge: "🧠 AI Pioneer",
      speciality: "Machine Learning",
    },
  ];

  const stats = [
    { label: "Community Members", value: "50K+", icon: Users },
    { label: "Daily Messages", value: "2K+", icon: MessageCircle },
    { label: "Open Source Projects", value: "200+", icon: Code },
    { label: "Games Created", value: "1K+", icon: Gamepad2 },
  ];

  const devConnectHighlights = [
    {
      title: "Unified Creator Profiles",
      description:
        "Showcase your AeThex achievements, GitHub contributions, and live projects in one public hub.",
      icon: Users,
    },
    {
      title: "Real-time Collaboration Rooms",
      description:
        "Spin up focused channels with voice, video, and whiteboards tailored for each build sprint.",
      icon: MessageCircle,
    },
    {
      title: "Integrated Delivery Pipeline",
      description:
        "Track deployments, alerts, and community feedback with automated insights across your stack.",
      icon: TrendingUp,
    },
  ];

  if (isLoading) {
    return (
      <LoadingScreen
        message="Connecting to Community..."
        showProgress={true}
        duration={1000}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge
                variant="outline"
                className="border-aethex-400/50 text-aethex-400 animate-bounce-gentle"
              >
                <Users className="h-3 w-3 mr-1" />
                AeThex Community
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient-purple">
                  Join the Innovation Network
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Connect with developers, creators, and innovators from around
                the world. Share knowledge, collaborate on projects, and grow
                together.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift"
                >
                  <Link to="/discord" className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Join Discord</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-border/50 hover-lift"
                >
                  <Link to="/github">View Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-16 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="text-center space-y-3 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-center">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-aethex-500/20 to-neon-blue/20 border border-aethex-400/20">
                        <Icon className="h-6 w-6 text-aethex-400" />
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gradient">
                        {stat.value}
                      </div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Community Platforms */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Connect on Your Favorite Platform
              </h2>
              <p className="text-lg text-muted-foreground">
                Multiple ways to engage with the AeThex community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {platforms.map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <Card
                    key={platform.name}
                    className="text-center border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CardHeader>
                      <div
                        className={`mx-auto w-16 h-16 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{platform.name}</CardTitle>
                      <CardDescription>{platform.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Members:</span>
                          <span className="font-semibold text-aethex-400">
                            {platform.members}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Activity:</span>
                          <span className="font-semibold text-aethex-400">
                            {platform.activity}
                          </span>
                        </div>
                      </div>

                      <Button asChild className="w-full">
                        <Link to={platform.link}>
                          Join Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* DevConnect Spotlight */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-aethex-900/40 via-transparent to-neon-blue/30" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-[2fr_3fr] gap-10 items-center">
              <div className="space-y-6 animate-slide-left">
                <Badge className="bg-gradient-to-r from-aethex-500 to-neon-blue w-fit">
                  New Platform
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
                  Introducing DevConnect
                </h2>
                <p className="text-lg text-muted-foreground">
                  DevConnect is our dedicated hub for platform teams building the
                  next wave of AeThex experiences. Launch collabs, monitor live
                  services, and activate the Studio network — all from one
                  command center.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-neon-blue to-aethex-500 hover:from-neon-blue/90 hover:to-aethex-500/90 glow-blue hover-lift"
                  >
                    <a
                      href="https://devconnect.sbs"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <span>Launch DevConnect</span>
                      <ArrowRight className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-border/60">
                    <Link to="/contact">Talk with AeThex Team</Link>
                  </Button>
                </div>
              </div>
              <Card className="border-border/40 bg-background/80 backdrop-blur-xl shadow-lg shadow-aethex-500/10 animate-slide-right">
                <CardContent className="p-8 space-y-6">
                  <div className="grid gap-4">
                    {devConnectHighlights.map((highlight, index) => {
                      const Icon = highlight.icon;
                      return (
                        <div
                          key={highlight.title}
                          className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-background/60"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-aethex-500/20 to-neon-blue/20 text-aethex-300">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground">
                              {highlight.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {highlight.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-lg border border-aethex-400/40 bg-gradient-to-r from-aethex-500/10 to-neon-blue/10 p-4 text-sm text-muted-foreground">
                    DevConnect syncs directly with AeThex profiles, so your
                    activity, streaks, and achievements follow you across every
                    build.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Upcoming Events
              </h2>
              <p className="text-lg text-muted-foreground">
                Join our community events and level up your skills
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {events.map((event, index) => (
                <Card
                  key={event.title}
                  className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-slide-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-semibold text-gradient">
                            {event.title}
                          </h3>
                          <Badge
                            variant={
                              event.status === "Registration Open"
                                ? "default"
                                : "outline"
                            }
                            className={
                              event.status === "Registration Open"
                                ? "animate-pulse"
                                : ""
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{event.participants} participants</span>
                          </div>
                          {event.prize && (
                            <div className="flex items-center space-x-1">
                              <Award className="h-4 w-4" />
                              <span>{event.prize} prize pool</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{event.type}</Badge>
                        <Button size="sm">
                          {event.status === "Registration Open"
                            ? "Register"
                            : "Learn More"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Top Contributors */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Community Heroes
              </h2>
              <p className="text-lg text-muted-foreground">
                Recognizing our most active and helpful community members
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contributors.map((contributor, index) => (
                <Card
                  key={contributor.name}
                  className="text-center border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-scale-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-6">
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-aethex-400/20"
                    />
                    <h3 className="font-semibold text-lg text-gradient">
                      {contributor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {contributor.title}
                    </p>
                    <Badge variant="outline" className="mb-4">
                      {contributor.speciality}
                    </Badge>

                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-aethex-400">
                        {contributor.contributions}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Contributions
                      </div>
                      <div className="text-sm font-medium">
                        {contributor.badge}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8 animate-scale-in">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient-purple">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-muted-foreground">
                Connect with thousands of developers, share your projects, and
                grow your skills in our supportive and innovative community.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift text-lg px-8 py-6"
                >
                  <Link to="/discord" className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Join Community</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-aethex-400/50 hover:border-aethex-400 hover-lift text-lg px-8 py-6"
                >
                  <Link to="/events">View All Events</Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <Coffee className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Weekly Meetups</h3>
                  <p className="text-sm text-muted-foreground">
                    Virtual coffee chats
                  </p>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    Contributor rewards
                  </p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-aethex-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Growth</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn & advance
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
