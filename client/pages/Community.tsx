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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  Coffee,
  Code,
  Flag,
  FolderGit2,
  Gamepad2,
  Gavel,
  Github,
  Hash,
  Headphones,
  Heart,
  Layers,
  Loader2,
  MapPin,
  MessageCircle,
  MessageSquare,
  MessageSquarePlus,
  MessageSquareText,
  Mic,
  Puzzle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Twitter,
  Users,
  UserCircle,
  Vote,
  type LucideIcon,
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

type ForumSpace = {
  id: string;
  name: string;
  description: string;
  threads: number;
  activeToday: number;
  latestThread: {
    title: string;
    author: string;
    timeAgo: string;
  };
  icon: LucideIcon;
};

type FeedbackChannel = {
  id: string;
  title: string;
  description: string;
  submissionsThisWeek: number;
  statuses: {
    label: string;
    count: number;
    tone: "neutral" | "positive" | "warning";
  }[];
  owner: string;
  icon: LucideIcon;
};

type PollTrend = "up" | "steady" | "down";

type PollOption = {
  id: string;
  label: string;
  votes: number;
  trend: PollTrend;
};

type CommunityPoll = {
  id: string;
  question: string;
  closesIn: string;
  options: PollOption[];
};

type ChatChannel = {
  id: string;
  name: string;
  description: string;
  participants: number;
  activeNow: number;
  icon: LucideIcon;
};

type ProfileHighlight = {
  id: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  icon: LucideIcon;
};

type WorkshopItem = {
  id: string;
  title: string;
  description: string;
  downloads: number;
  rating: number;
  author: string;
  icon: LucideIcon;
};

type MediaItem = {
  id: string;
  title: string;
  type: "Screenshot" | "Artwork" | "Video";
  thumbnail: string;
  author: string;
  likes: number;
};

type SpotlightCreator = {
  id: string;
  name: string;
  role: string;
  highlight: string;
  link: string;
  avatar: string;
  metrics: {
    label: string;
    value: string;
  }[];
};

type FeaturedContributor = {
  name: string;
  avatar: string;
  title: string;
  contributions: number;
  badge: string;
  speciality: string;
  bio: string;
  recentContribution: string;
  reputation: string;
  profileUrl: string;
};

type ModerationTool = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type ReportReason = {
  id: string;
  label: string;
  description: string;
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
    "Registration Open":
      "bg-gradient-to-r from-emerald-500/20 to-aethex-500/30 text-emerald-200 border border-emerald-400/40",
    Recurring: "bg-blue-500/10 text-blue-200 border border-blue-400/40",
    Upcoming: "bg-orange-500/10 text-orange-200 border border-orange-400/40",
    Waitlist: "bg-amber-500/10 text-amber-200 border border-amber-400/40",
  };

  const buttonLabel = isRegistered ? "Manage Registration" : "Register";
  const submitLabel = isRegistered
    ? "Update Registration"
    : "Confirm Registration";

  return (
    <Card
      className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-slide-right"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-gradient">
                {event.title}
              </h3>
              <Badge
                className={cn(
                  "uppercase tracking-wide",
                  statusStyles[event.status],
                )}
              >
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
                  disabled={
                    !event.registrationEnabled && !event.registrationUrl
                  }
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
                        setForm((prev) => ({
                          ...prev,
                          name: eventChange.target.value,
                        }))
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
                        setForm((prev) => ({
                          ...prev,
                          email: eventChange.target.value,
                        }))
                      }
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`team-${event.id}`}>
                      Team or studio (optional)
                    </Label>
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
                    <Label htmlFor={`notes-${event.id}`}>
                      Notes for the organizers
                    </Label>
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
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full"
                    >
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
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                >
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
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
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

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description: string;
  align?: "center" | "left";
}

function SectionHeader({
  badge,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const containerClass =
    align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div
      className={cn(
        "space-y-4 mb-16 animate-slide-up max-w-3xl",
        containerClass,
      )}
    >
      {badge && (
        <Badge
          variant="outline"
          className={cn(
            "w-fit border-aethex-400/50 text-aethex-300 bg-aethex-500/10",
            align === "center" ? "mx-auto" : "",
          )}
        >
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl lg:text-4xl font-bold text-gradient">{title}</h2>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
  );
}

interface PollCardProps {
  poll: CommunityPoll;
  selectedOption?: string;
  onSelect: (optionId: string) => void;
}

function PollCard({ poll, selectedOption, onSelect }: PollCardProps) {
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0,
  );

  return (
    <Card className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-2">
            <Vote className="h-4 w-4 text-aethex-400" />
            Community Poll
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {poll.closesIn}
          </span>
        </div>
        <CardTitle className="text-xl text-foreground">
          {poll.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage =
              totalVotes === 0
                ? 0
                : Math.round((option.votes / totalVotes) * 100);
            const isSelected = selectedOption === option.id;
            const TrendIcon =
              option.trend === "up"
                ? TrendingUp
                : option.trend === "down"
                  ? ArrowDown
                  : ArrowRight;

            return (
              <Button
                key={option.id}
                type="button"
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "relative w-full justify-between overflow-hidden border border-border/50 bg-background/80 text-left",
                  isSelected
                    ? "bg-gradient-to-r from-aethex-500/20 to-neon-blue/20 border-aethex-400/60"
                    : "hover:border-aethex-400/40",
                )}
                onClick={() => onSelect(option.id)}
              >
                {percentage > 0 && (
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 -z-10 bg-aethex-500/10"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                <span className="flex items-center gap-2 text-sm font-medium">
                  <TrendIcon className="h-4 w-4" />
                  {option.label}
                </span>
                <span className="text-sm font-semibold">{percentage}%</span>
              </Button>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{totalVotes} votes recorded</span>
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-aethex-400/40 bg-aethex-500/10 text-aethex-300"
          >
            <Sparkles className="h-3 w-3" /> Live insight
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Community() {
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);
  const [registeredEvents, setRegisteredEvents] = useState<
    Record<string, EventRegistrationPayload>
  >({});
  const [polls, setPolls] = useState<CommunityPoll[]>(() => [
    {
      id: "winter-cosmetic",
      question:
        "Which cosmetic drop should we fast-track for the winter update?",
      closesIn: "Closes in 3 days",
      options: [
        {
          id: "frostbyte-operative",
          label: "Frostbyte Operative Skin",
          votes: 342,
          trend: "up",
        },
        {
          id: "aurora-trails",
          label: "Aurora Hover Trails",
          votes: 287,
          trend: "steady",
        },
        {
          id: "synthwave-lobby",
          label: "Synthwave Lobby Music Pack",
          votes: 198,
          trend: "down",
        },
      ],
    },
    {
      id: "platform-priority",
      question: "What should the team prioritise next for the companion app?",
      closesIn: "Closes in 6 days",
      options: [
        {
          id: "build-tracker",
          label: "Squad build tracking & loadouts",
          votes: 264,
          trend: "up",
        },
        {
          id: "voice-integrations",
          label: "Native voice channel integration",
          votes: 192,
          trend: "steady",
        },
        {
          id: "marketplace",
          label: "Creator marketplace beta",
          votes: 148,
          trend: "up",
        },
      ],
    },
  ]);
  const [pollSelections, setPollSelections] = useState<Record<string, string>>(
    {},
  );
  const [reportForm, setReportForm] = useState({ reason: "", details: "" });

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

  const stats = [
    { label: "Community Members", value: "50K+", icon: Users },
    { label: "Daily Messages", value: "2K+", icon: MessageCircle },
    { label: "Open Source Projects", value: "200+", icon: Code },
    { label: "Games Created", value: "1K+", icon: Gamepad2 },
  ];

  const devConnectHighlights = [
    {
      title: "Unified Developer Profiles",
      description:
        "Showcase your AeThex achievements, GitHub contributions, and live projects in one public developer hub.",
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

  const forumSpaces: ForumSpace[] = [
    {
      id: "strategy-lab",
      name: "Strategy Lab",
      description:
        "Break down balance changes and evolving metas with systems designers.",
      threads: 182,
      activeToday: 46,
      latestThread: {
        title: "Season 4 economy tuning notes",
        author: "PixelPilot",
        timeAgo: "1h ago",
      },
      icon: Hash,
    },
    {
      id: "build-clinic",
      name: "Build Clinic",
      description:
        "Share pipelines, CI setups, and performance wins with fellow builders.",
      threads: 241,
      activeToday: 63,
      latestThread: {
        title: "Optimising shader hot reloads in WebGPU",
        author: "LunaDev",
        timeAgo: "3h ago",
      },
      icon: MessageSquarePlus,
    },
    {
      id: "playtest-reports",
      name: "Playtest Reports",
      description:
        "Swap qualitative feedback, telemetry, and next-step experiments.",
      threads: 96,
      activeToday: 22,
      latestThread: {
        title: "Week 18 retention snapshot",
        author: "DataForge",
        timeAgo: "30m ago",
      },
      icon: ClipboardList,
    },
  ];

  const feedbackChannels: FeedbackChannel[] = [
    {
      id: "bug-reports",
      title: "Bug Reports",
      description:
        "Track crashes, blockers, and gameplay issues spotted by players.",
      submissionsThisWeek: 52,
      statuses: [
        { label: "New", count: 7, tone: "warning" },
        { label: "Triaged", count: 28, tone: "neutral" },
        { label: "Resolved", count: 17, tone: "positive" },
      ],
      owner: "QA Vanguard",
      icon: AlertTriangle,
    },
    {
      id: "balance-insights",
      title: "Balance Insights",
      description:
        "Surface tuning feedback for weapons, archetypes, and encounters.",
      submissionsThisWeek: 38,
      statuses: [
        { label: "In Review", count: 15, tone: "neutral" },
        { label: "Next Patch", count: 9, tone: "positive" },
        { label: "Released", count: 14, tone: "positive" },
      ],
      owner: "Combat Council",
      icon: BarChart3,
    },
    {
      id: "feature-ideas",
      title: "Ideas & Features",
      description:
        "Prioritise new systems, cosmetics, and social tools suggested by the community.",
      submissionsThisWeek: 61,
      statuses: [
        { label: "Ideation", count: 24, tone: "neutral" },
        { label: "Planned", count: 10, tone: "positive" },
        { label: "Backlog", count: 27, tone: "warning" },
      ],
      owner: "Product Guild",
      icon: Sparkles,
    },
  ];

  const chatChannels: ChatChannel[] = [
    {
      id: "squad-voice",
      name: "Squad Voice Lounge",
      description:
        "Hop into matchmaking-ready rooms with spatial audio support.",
      participants: 640,
      activeNow: 132,
      icon: Headphones,
    },
    {
      id: "build-help",
      name: "Build Help Desk",
      description: "Pair programming office hours and live debugging streams.",
      participants: 420,
      activeNow: 94,
      icon: MessageSquareText,
    },
    {
      id: "playtest-queue",
      name: "Live Playtest Queue",
      description: "Coordinate session times and share immediate reactions.",
      participants: 310,
      activeNow: 57,
      icon: Mic,
    },
  ];

  const profileHighlights: ProfileHighlight[] = [
    {
      id: "portfolio",
      title: "Unified Portfolio",
      description:
        "Link GitHub, AeThex achievements, and live builds in one developer profile.",
      metricLabel: "Portfolio views",
      metricValue: "3.2K / wk",
      icon: Layers,
    },
    {
      id: "streaks",
      title: "Contribution Streaks",
      description:
        "Track commits, bug reports, and mentoring sessions automatically.",
      metricLabel: "Longest streak",
      metricValue: "48 days",
      icon: Sparkles,
    },
    {
      id: "reputation",
      title: "Reputation Signals",
      description:
        "Surface kudos, endorsements, and verified roles in the community.",
      metricLabel: "Reputation",
      metricValue: "4.9 ★",
      icon: UserCircle,
    },
  ];

  const contributors: FeaturedContributor[] = [
    {
      name: "Alex Developer",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
      title: "Community Leader",
      contributions: 156,
      badge: "🏆 Top Contributor",
      speciality: "Game Development",
      bio: "Hosts the weekly build clinics and mentors new squads shipping co-op missions.",
      recentContribution:
        "Rolled out the Adaptive Matchmaking toolkit for Season 4.",
      reputation: "4.9/5 player rating",
      profileUrl: "/passport/alex-developer",
    },
    {
      name: "Sarah Coder",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b029?w=120&h=120&fit=crop&crop=face",
      title: "Documentation Expert",
      contributions: 89,
      badge: "📚 Knowledge Hero",
      speciality: "Technical Writing",
      bio: "Maintains the AeThex SDK quickstarts and keeps localisation packs up to date.",
      recentContribution:
        "Launched the multiplayer onboarding walkthrough in seven languages.",
      reputation: "4.8/5 creator rating",
      profileUrl: "/passport/sarah-coder",
    },
    {
      name: "Jordan AI",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
      title: "AI Researcher",
      contributions: 134,
      badge: "🧠 AI Pioneer",
      speciality: "Machine Learning",
      bio: "Builds guardrailed inference pipelines and shares evaluation playbooks weekly.",
      recentContribution:
        "Released the Procedural Dialogue orchestrator adopted by 40+ teams.",
      reputation: "4.9/5 mentor rating",
      profileUrl: "/passport/jordan-ai",
    },
  ];

  const workshopItems: WorkshopItem[] = [
    {
      id: "photon-ridge",
      title: "Photon Ridge Raid",
      description:
        "Modded endgame encounter balancing puzzle mechanics with co-op combat.",
      downloads: 12045,
      rating: 4.8,
      author: "NebulaFox",
      icon: FolderGit2,
    },
    {
      id: "neon-run",
      title: "Neon Run Track Pack",
      description:
        "Five synthwave-inspired courses with dynamic weather scripting.",
      downloads: 8742,
      rating: 4.7,
      author: "CircuitBreaker",
      icon: Puzzle,
    },
    {
      id: "dynamic-hubs",
      title: "Dynamic Hub Templates",
      description:
        "Drop-in lobby layouts with reactive NPC chatter and map voting.",
      downloads: 6403,
      rating: 4.9,
      author: "Astra",
      icon: Layers,
    },
  ];

  const mediaGallery: MediaItem[] = [
    {
      id: "screenshot-1",
      title: "Aurora Rift",
      type: "Screenshot",
      thumbnail:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
      author: "Nova",
      likes: 684,
    },
    {
      id: "artwork-1",
      title: "Character concept: Vox",
      type: "Artwork",
      thumbnail:
        "https://images.unsplash.com/photo-1604079628040-94301bb21b11?w=600&h=400&fit=crop",
      author: "Sketchbyte",
      likes: 542,
    },
    {
      id: "video-1",
      title: "Speedrun showcase",
      type: "Video",
      thumbnail:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
      author: "Dash",
      likes: 452,
    },
    {
      id: "screenshot-2",
      title: "Photon Ridge sunset",
      type: "Screenshot",
      thumbnail:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      author: "NebulaFox",
      likes: 398,
    },
    {
      id: "artwork-2",
      title: "Kairos armor set",
      type: "Artwork",
      thumbnail:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
      author: "Synth",
      likes: 356,
    },
    {
      id: "video-2",
      title: "Live jam timelapse",
      type: "Video",
      thumbnail:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
      author: "BeatSync",
      likes: 312,
    },
  ];

  const spotlightCreators: SpotlightCreator[] = [
    {
      id: "nebulafox",
      name: "NebulaFox",
      role: "Systems Designer",
      highlight:
        "Created the Photon Ridge raid encounter adopted by 54% of squads.",
      link: "/community/spotlight/nebulafox",
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&h=120&fit=crop&crop=face",
      metrics: [
        { label: "Downloads", value: "12K" },
        { label: "Avg Rating", value: "4.8" },
        { label: "Featured Weeks", value: "6" },
      ],
    },
    {
      id: "lunatech",
      name: "LunaTech",
      role: "Technical Artist",
      highlight:
        "Delivered the AeThex holographic shader pack powering six community events.",
      link: "/community/spotlight/lunatech",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&h=120&fit=crop&crop=face",
      metrics: [
        { label: "Adopted Studios", value: "32" },
        { label: "Workshop Forks", value: "210" },
        { label: "Tutorial Views", value: "18K" },
      ],
    },
  ];

  const roadmapSnapshot = [
    {
      id: "roadmap-1",
      title: "Patch 3.6 — Balance refresh",
      status: "In QA",
      statusTone: "positive" as const,
      eta: "Shipping Nov 16",
    },
    {
      id: "roadmap-2",
      title: "Creator economy beta",
      status: "Planning",
      statusTone: "neutral" as const,
      eta: "Sprint 47",
    },
    {
      id: "roadmap-3",
      title: "Voice presence improvements",
      status: "Investigating",
      statusTone: "warning" as const,
      eta: "Discovery ongoing",
    },
  ];

  const chatFeatures = [
    "Discord bridge keeps roles in sync across text, voice, and forums",
    "Threaded replies are archived to knowledge bases automatically",
    "Temporary strike teams spin up with stage, video, and whiteboard tools",
  ];

  const moderationGuidelines = [
    {
      title: "Respect every player",
      description:
        "Harassment, hate speech, and discrimination are removed without debate.",
    },
    {
      title: "Keep feedback actionable",
      description: "Aim critiques at builds and behaviours, never at people.",
    },
    {
      title: "Collaborate transparently",
      description:
        "Disclose monetisation, affiliations, or sensitive data sources when sharing work.",
    },
  ];

  const moderationTools: ModerationTool[] = [
    {
      id: "auto-shields",
      title: "Automated Shields",
      description:
        "Realtime filters flag slurs, spam, and phishing before they hit the feed.",
      icon: Shield,
    },
    {
      id: "casebook",
      title: "Casebook Workflows",
      description:
        "Escalate complex cases with evidence bundles and audit trails.",
      icon: Gavel,
    },
    {
      id: "report-routing",
      title: "Report Routing",
      description:
        "Route player reports to dedicated channel owners for rapid follow-up.",
      icon: Flag,
    },
  ];

  const reportReasons: ReportReason[] = [
    {
      id: "harassment",
      label: "Harassment or hateful content",
      description:
        "Toxic language, slurs, or targeted harassment toward a player or group.",
    },
    {
      id: "cheating",
      label: "Cheating or exploit",
      description:
        "Sharing hacks, stolen assets, or instructions to bypass fair play.",
    },
    {
      id: "inappropriate",
      label: "Inappropriate media",
      description:
        "Adult content, personal data leaks, or otherwise unsafe material.",
    },
  ];

  const feedbackToneStyles: Record<"neutral" | "positive" | "warning", string> =
    {
      neutral: "bg-blue-500/10 text-blue-200 border border-blue-400/40",
      positive:
        "bg-emerald-500/10 text-emerald-200 border border-emerald-400/40",
      warning: "bg-amber-500/10 text-amber-200 border border-amber-400/40",
    };

  const selectedReportReason = reportReasons.find(
    (reason) => reason.id === reportForm.reason,
  );

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

  const handlePollVote = useCallback(
    (pollId: string, optionId: string) => {
      setPolls((prevPolls) =>
        prevPolls.map((poll) => {
          if (poll.id !== pollId) {
            return poll;
          }

          const previousSelection = pollSelections[pollId];
          if (previousSelection === optionId) {
            return poll;
          }

          return {
            ...poll,
            options: poll.options.map((option) => {
              if (option.id === optionId) {
                return { ...option, votes: option.votes + 1 };
              }
              if (previousSelection && option.id === previousSelection) {
                return { ...option, votes: Math.max(0, option.votes - 1) };
              }
              return option;
            }),
          };
        }),
      );

      setPollSelections((prev) => ({
        ...prev,
        [pollId]: optionId,
      }));
    },
    [pollSelections],
  );

  const handleReportSubmit = useCallback(
    (submitEvent: FormEvent<HTMLFormElement>) => {
      submitEvent.preventDefault();
      const trimmedDetails = reportForm.details.trim();

      if (!reportForm.reason) {
        aethexToast.system("Select a reason before submitting a report.");
        return;
      }

      if (!trimmedDetails) {
        aethexToast.system(
          "Add a brief description so moderators can respond quickly.",
        );
        return;
      }

      aethexToast.system(
        "Report submitted. Our moderation team will review shortly.",
      );
      setReportForm({ reason: "", details: "" });
    },
    [reportForm],
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
                  DevConnect is our dedicated hub for platform teams building
                  the next wave of AeThex experiences. Launch collabs, monitor
                  live services, and activate the Studio network — all from one
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
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-border/60"
                  >
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
                    DevConnect syncs directly with AeThex developer profiles, so
                    your activity, streaks, and achievements follow you across
                    every build.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Forums & Discussion */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Forums & Discussions"
              title="Deep-dive with peers in dedicated boards"
              description="Launch structured conversations for strategy, support, and storytelling."
              align="left"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {forumSpaces.map((space, index) => {
                const Icon = space.icon;
                return (
                  <Card
                    key={space.id}
                    className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-aethex-500/10 text-aethex-300">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {space.name}
                            </CardTitle>
                            <CardDescription>
                              {space.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-border/50">
                          {space.threads} threads
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wide">
                        <span>{space.activeToday} active today</span>
                        <span className="flex items-center gap-2">
                          <MessageCircle className="h-3.5 w-3.5" /> Latest
                        </span>
                      </div>
                      <div className="rounded-lg border border-border/40 bg-background/80 p-4">
                        <p className="text-sm font-medium text-foreground">
                          {space.latestThread.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          by {space.latestThread.author} •{" "}
                          {space.latestThread.timeAgo}
                        </p>
                      </div>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-between text-sm"
                      >
                        <Link to={`/forums/${space.id}`}>
                          Enter space
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feedback & Roadmap */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Feedback & Roadmap"
              title="Collect insights and close the loop with players"
              description="Organise bug reports, balance discussions, and feature ideas in a transparent queue."
              align="left"
            />
            <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
              <div className="space-y-6">
                {feedbackChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <Card
                      key={channel.id}
                      className="border-border/50 bg-background/80 backdrop-blur"
                    >
                      <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-aethex-500/10 text-aethex-300">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {channel.title}
                              </CardTitle>
                              <CardDescription>
                                {channel.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-aethex-400/40 text-aethex-200"
                          >
                            {channel.submissionsThisWeek} this week
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Stewarded by {channel.owner}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {channel.statuses.map((status) => (
                            <Badge
                              key={status.label}
                              className={cn(
                                "text-xs",
                                feedbackToneStyles[status.tone],
                              )}
                            >
                              {status.label}: {status.count}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-between text-sm"
                        >
                          <Link to="/feedback">
                            Submit feedback
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <Card className="border-border/50 bg-background/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Live roadmap snapshot</CardTitle>
                  <CardDescription>
                    Track what the team is shipping next based on player
                    momentum.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roadmapSnapshot.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-lg border border-border/40 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.eta}
                        </p>
                      </div>
                      <Badge className={feedbackToneStyles[item.statusTone]}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-aethex-400/40"
                  >
                    <Link to="/roadmap">Open public roadmap</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Community Polls */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Community Polls"
              title="Let players steer the next big moves"
              description="Run lightweight polls to validate cosmetics, roadmap priorities, and upcoming events."
              align="center"
            />
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {polls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  selectedOption={pollSelections[poll.id]}
                  onSelect={(optionId) => handlePollVote(poll.id, optionId)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Real-time Collaboration */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Real-time Collaboration"
              title="Integrated chat with Discord-style presence"
              description="Spin up voice, text, and co-working rooms that bridge seamlessly with our forums and developer hubs."
              align="left"
            />
            <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
              <Card className="border-border/50 bg-background/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Active channels</CardTitle>
                  <CardDescription>
                    See who’s online and jump into the conversations that matter
                    right now.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {chatChannels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <div
                        key={channel.id}
                        className="rounded-lg border border-border/40 bg-background/80 p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-aethex-500/10 text-aethex-300">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {channel.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {channel.description}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-aethex-400/40 text-aethex-200"
                          >
                            {channel.participants} members
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Synced with Discord</span>
                          <span className="flex items-center gap-1 text-emerald-200">
                            <Sparkles className="h-3 w-3" /> {channel.activeNow}{" "}
                            live now
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Why players love integrated chat</CardTitle>
                  <CardDescription>
                    Keep every squad aligned across devices with presence,
                    threads, and recordings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {chatFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-aethex-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link to="/chat">Launch real-time hub</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Events"
              title="Upcoming events"
              description="Join our community events and level up your skills."
              align="center"
            />
            <div className="max-w-4xl mx-auto space-y-6">
              {events.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  animationDelay={index * 0.12}
                  isRegistered={Boolean(registeredEvents[event.id])}
                  registrant={registeredEvents[event.id]}
                  onRegister={(payload) =>
                    handleEventRegistration(event, payload)
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* Developer Profile Highlights */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Developer Profiles"
              title="Showcase your journey across AeThex"
              description="Developer profiles blend achievements, portfolio pieces, and social proof so collaborators can find you fast."
              align="left"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {profileHighlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <Card
                    key={highlight.id}
                    className="border-border/50 bg-background/80 backdrop-blur"
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-aethex-500/10 text-aethex-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">
                        {highlight.title}
                      </CardTitle>
                      <CardDescription>{highlight.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border border-border/40 bg-background/80 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {highlight.metricLabel}
                        </p>
                        <p className="text-2xl font-semibold text-gradient-purple">
                          {highlight.metricValue}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Developers */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Community Leaders"
              title="Featured developers"
              description="Highlighting builders who mentor others, ship mods, and level up the entire network."
              align="center"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contributors.map((contributor, index) => (
                <Card
                  key={contributor.name}
                  className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-scale-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-6 space-y-4 text-center">
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="w-20 h-20 rounded-full mx-auto ring-4 ring-aethex-400/20"
                    />
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-gradient">
                        {contributor.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {contributor.title}
                      </p>
                    </div>
                    <Badge variant="outline" className="mx-auto">
                      {contributor.speciality}
                    </Badge>
                    <p className="text-sm text-muted-foreground text-left">
                      {contributor.bio}
                    </p>
                    <div className="rounded-lg border border-border/40 bg-background/80 p-4 space-y-2 text-left">
                      <p className="text-sm font-medium text-foreground">
                        {contributor.recentContribution}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{contributor.reputation}</span>
                        <span>{contributor.contributions} contributions</span>
                      </div>
                    </div>
                    <Badge className="bg-aethex-500/10 text-aethex-200 border border-aethex-400/40">
                      {contributor.badge}
                    </Badge>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-aethex-400/40"
                    >
                      <Link to={contributor.profileUrl}>View passport</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Workshop & Mod Support */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Workshop & Mods"
              title="Build, share, and iterate with the community workshop"
              description="Mods, templates, and toolkits come with analytics so teams can iterate quickly."
              align="left"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {workshopItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.id}
                    className="border-border/50 bg-background/80 backdrop-blur"
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-aethex-500/10 text-aethex-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Downloads</span>
                        <span className="font-semibold text-aethex-200">
                          {item.downloads.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Rating</span>
                        <span className="font-semibold text-aethex-200">
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created by {item.author}
                      </p>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-between text-sm"
                      >
                        <Link to={`/workshop/${item.id}`}>
                          View asset
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Media Galleries */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Media Galleries"
              title="Show off your best captures and recaps"
              description="Screenshots, artwork, and videos are curated into themed galleries to inspire the community."
              align="left"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {mediaGallery.map((item) => (
                <Card
                  key={item.id}
                  className="border-border/40 bg-background/80 backdrop-blur overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-48 w-full object-cover"
                      loading="lazy"
                    />
                    <Badge className="absolute left-4 top-4 bg-background/80 backdrop-blur border-border/60">
                      {item.type}
                    </Badge>
                  </div>
                  <CardContent className="space-y-3 p-5">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {item.author}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-aethex-400" />
                        {item.likes}
                      </span>
                      <Button asChild variant="ghost" className="px-0 text-sm">
                        <Link to={`/gallery/${item.id}`}>Open gallery</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Creator Spotlight */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Creator Spotlight"
              title="Recognising standout community creators"
              description="Spotlight creators whose mods, art, and systems elevate the AeThex ecosystem."
              align="center"
            />
            <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
              {spotlightCreators.map((creator) => (
                <Card
                  key={creator.id}
                  className="border-border/50 bg-background/80 backdrop-blur"
                >
                  <CardContent className="p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="h-14 w-14 rounded-full ring-4 ring-aethex-400/20"
                        />
                        <div>
                          <p className="text-lg font-semibold text-gradient">
                            {creator.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {creator.role}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-aethex-500/10 border-aethex-400/40 text-aethex-200">
                        Featured creator
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {creator.highlight}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {creator.metrics.map((metric) => (
                        <div
                          key={`${creator.id}-${metric.label}`}
                          className="rounded-lg border border-border/40 bg-background/80 p-3 text-center"
                        >
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {metric.label}
                          </p>
                          <p className="text-lg font-semibold text-foreground">
                            {metric.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full">
                      <Link to={creator.link}>View creator profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Governance */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Community Governance"
              title="Clear guidelines, empowered moderators"
              description="We invest in tools and processes so every player feels safe, heard, and respected."
              align="left"
            />
            <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
              <Card className="border-border/50 bg-background/80 backdrop-blur">
                <CardHeader className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>Community guidelines</CardTitle>
                    <CardDescription>
                      Expectations for every player and contributor.
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-aethex-400/40 text-aethex-200"
                  >
                    Updated weekly
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {moderationGuidelines.map((guideline) => (
                      <li
                        key={guideline.title}
                        className="flex items-start gap-3"
                      >
                        <Shield className="mt-0.5 h-4 w-4 text-aethex-400" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {guideline.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {guideline.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <div className="grid gap-8">
                <Card className="border-border/50 bg-background/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Moderation toolkit</CardTitle>
                    <CardDescription>
                      Equip community managers with actionable, auditable
                      controls.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-3">
                    {moderationTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <div
                          key={tool.id}
                          className="rounded-lg border border-border/40 bg-background/80 p-4 space-y-3"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-aethex-500/10 text-aethex-300">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {tool.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-background/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Submit a report</CardTitle>
                    <CardDescription>
                      Reports are routed to the right channel owners for fast
                      follow-up.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleReportSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="report-reason">Reason</Label>
                        <select
                          id="report-reason"
                          value={reportForm.reason}
                          onChange={(event) =>
                            setReportForm((prev) => ({
                              ...prev,
                              reason: event.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2 text-sm focus:border-aethex-400 focus:outline-none focus:ring-2 focus:ring-aethex-400/40"
                        >
                          <option value="">Select a reason</option>
                          {reportReasons.map((reason) => (
                            <option key={reason.id} value={reason.id}>
                              {reason.label}
                            </option>
                          ))}
                        </select>
                        {selectedReportReason && (
                          <p className="text-xs text-muted-foreground">
                            {selectedReportReason.description}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="report-details">Details</Label>
                        <Textarea
                          id="report-details"
                          value={reportForm.details}
                          onChange={(event) =>
                            setReportForm((prev) => ({
                              ...prev,
                              details: event.target.value,
                            }))
                          }
                          placeholder="Share links, timestamps, or context so moderators can follow up quickly."
                          rows={4}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Submit report
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
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
