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
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
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

function EventCard({
  event,
  animationDelay,
  isRegistered,
  registrant,
  onRegister,
}: EventCardProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: registrant?.name ?? "",
    email: registrant?.email ?? "",
    teamName: registrant?.teamName ?? "",
    message: registrant?.message ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (registrant) {
      setForm({
        name: registrant.name,
        email: registrant.email,
        teamName: registrant.teamName ?? "",
        message: registrant.message ?? "",
      });
    }
  }, [registrant]);

  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);

  const handleSubmit = (eventSubmit: FormEvent<HTMLFormElement>) => {
    eventSubmit.preventDefault();
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedTeam = form.teamName.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Please provide both your name and email to register.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setSubmitting(true);

    setTimeout(() => {
      onRegister({
        name: trimmedName,
        email: trimmedEmail,
        teamName: trimmedTeam || undefined,
        message: trimmedMessage || undefined,
      });
      setSubmitting(false);
      setOpen(false);
    }, 600);
  };

  const statusStyles: Record<EventStatus, string> = {
    "Registration Open": "bg-gradient-to-r from-emerald-500/20 to-aethex-500/30 text-emerald-200 border border-emerald-400/40",
    Recurring: "bg-blue-500/10 text-blue-200 border border-blue-400/40",
    Upcoming: "bg-orange-500/10 text-orange-200 border border-orange-400/40",
    Waitlist: "bg-amber-500/10 text-amber-200 border border-amber-400/40",
  };

  const buttonLabel = isRegistered ? "Manage Registration" : "Register";
  const submitLabel = isRegistered ? "Update Registration" : "Confirm Registration";

  return (
    <Card
      className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-slide-right"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-gradient">{event.title}</h3>
              <Badge className={cn("uppercase tracking-wide", statusStyles[event.status])}>
                {event.status}
              </Badge>
              {isRegistered && (
                <Badge className="border border-emerald-400/40 bg-emerald-500/10 text-emerald-200">
                  <CheckCircle className="mr-1 h-3.5 w-3.5" /> Registered
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {event.description}
            </p>
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
                <span>{event.participants} spots</span>
              </div>
              {event.prize && (
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>{event.prize}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 min-w-[200px]">
            <Badge variant="outline" className="w-fit">
              {event.type}
            </Badge>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant={isRegistered ? "outline" : "default"}
                  disabled={!event.registrationEnabled && !event.registrationUrl}
                >
                  {buttonLabel}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{event.title}</DialogTitle>
                  <DialogDescription>
                    Reserve your spot by sharing your details. We'll send a
                    confirmation to your inbox.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`name-${event.id}`}>Full name</Label>
                    <Input
                      id={`name-${event.id}`}
                      value={form.name}
                      onChange={(eventChange) =>
                        setForm((prev) => ({ ...prev, name: eventChange.target.value }))
                      }
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`email-${event.id}`}>Email</Label>
                    <Input
                      id={`email-${event.id}`}
                      type="email"
                      value={form.email}
                      onChange={(eventChange) =>
                        setForm((prev) => ({ ...prev, email: eventChange.target.value }))
                      }
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`team-${event.id}`}>Team or studio (optional)</Label>
                    <Input
                      id={`team-${event.id}`}
                      value={form.teamName}
                      onChange={(eventChange) =>
                        setForm((prev) => ({
                          ...prev,
                          teamName: eventChange.target.value,
                        }))
                      }
                      placeholder="Who are you building with?"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`notes-${event.id}`}>Notes for the organizers</Label>
                    <Textarea
                      id={`notes-${event.id}`}
                      value={form.message}
                      onChange={(eventChange) =>
                        setForm((prev) => ({
                          ...prev,
                          message: eventChange.target.value,
                        }))
                      }
                      placeholder="Let us know about accessibility or collaboration needs"
                      rows={3}
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}
                  <DialogFooter>
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting…
                        </span>
                      ) : (
                        submitLabel
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {event.registrationUrl && (
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <a href={event.registrationUrl} target="_blank" rel="noreferrer">
                  Event details
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Session outline
          </p>
          <ul className="space-y-2">
            {event.agenda.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <ArrowRight className="mt-1 h-3.5 w-3.5 text-aethex-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
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

  const events: CommunityEvent[] = [
    {
      id: "aethex-game-jam-2025",
      title: "AeThex Game Jam 2025",
      date: "January 17-19, 2025",
      location: "Online",
      type: "Competition",
      participants: 500,
      prize: "$10,000 grand prize",
      status: "Registration Open",
      description:
        "A 48-hour remote jam where cross-discipline teams ship a playable build and pitch their live-ops plan to AeThex Studios.",
      agenda: [
        "Day 1, 9:00 AM PST — Theme reveal, team sync, and tech check",
        "Day 2, 12:00 PM PST — Mentor office hours and vertical slice review",
        "Day 3, 3:00 PM PST — Final submissions, judging, and community showcase",
      ],
      registrationEnabled: true,
      registrationUrl: "https://devconnect.sbs/events/game-jam-2025",
    },
    {
      id: "weekly-developer-meetup",
      title: "Weekly Developer Meetup",
      date: "Every Wednesday, 7:00 PM PST",
      location: "DevConnect Studio Lounge",
      type: "Meetup",
      participants: 80,
      prize: null,
      status: "Recurring",
      description:
        "An ongoing roundtable for sharing progress, pairing on blockers, and highlighting new community tools across AeThex projects.",
      agenda: [
        "15 min — Lightning updates from active squads",
        "30 min — Deep-dive breakout rooms hosted by AeThex mentors",
        "15 min — Open Q&A and contributor shout-outs",
      ],
      registrationEnabled: true,
      registrationUrl: "https://devconnect.sbs/events/weekly-meetup",
    },
    {
      id: "ai-in-games-workshop",
      title: "AI in Games Workshop",
      date: "December 20, 2024",
      location: "San Francisco HQ + Live Stream",
      type: "Workshop",
      participants: 120,
      prize: null,
      status: "Upcoming",
      description:
        "Hands-on sessions covering inference optimization, procedural storytelling, and guardrailed AI systems for live games.",
      agenda: [
        "Session 1 — Deploying performant ML models on AeThex Edge",
        "Session 2 — Narrative design with adaptive dialogue tooling",
        "Session 3 — Compliance, telemetry, and post-launch monitoring",
      ],
      registrationEnabled: true,
      registrationUrl: "https://devconnect.sbs/events/ai-games",
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

  const [registeredEvents, setRegisteredEvents] = useState<Record<string, EventRegistrationPayload>>({});

  const handleEventRegistration = useCallback(
    (eventData: CommunityEvent, payload: EventRegistrationPayload) => {
      setRegisteredEvents((prev) => ({
        ...prev,
        [eventData.id]: payload,
      }));

      const firstName = payload.name.split(" ")[0] || payload.name;
      aethexToast.system(
        `${firstName}, you're registered for ${eventData.title}. Confirmation sent to ${payload.email}.`,
      );
    },
    [],
  );

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
                <EventCard
                  key={event.id}
                  event={event}
                  animationDelay={index * 0.12}
                  isRegistered={Boolean(registeredEvents[event.id])}
                  registrant={registeredEvents[event.id]}
                  onRegister={(payload) => handleEventRegistration(event, payload)}
                />
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
