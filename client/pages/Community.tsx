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
  Image,
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
  Video,
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

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description: string;
  align?: "center" | "left";
}

function SectionHeader({ badge, title, description, align = "center" }: SectionHeaderProps) {
  const containerClass = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div className={cn("space-y-4 mb-16 animate-slide-up max-w-3xl", containerClass)}>
      {badge && (
        <Badge
          variant="outline"
          className={cn(
            "w-fit border-aethex-400/50 text-aethex-300 bg-aethex-500/10",
            align === "center" ? "mx-auto" : ""
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
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

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
        <CardTitle className="text-xl text-foreground">{poll.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
            const isSelected = selectedOption === option.id;
            const TrendIcon = option.trend === "up" ? TrendingUp : option.trend === "down" ? ArrowDown : ArrowRight;

            return (
              <Button
                key={option.id}
                type="button"
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "relative w-full justify-between overflow-hidden border border-border/50 bg-background/80 text-left",
                  isSelected
                    ? "bg-gradient-to-r from-aethex-500/20 to-neon-blue/20 border-aethex-400/60"
                    : "hover:border-aethex-400/40"
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
                <span className="text-sm font-semibold">
                  {percentage}%
                </span>
              </Button>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{totalVotes} votes recorded</span>
          <Badge variant="outline" className="flex items-center gap-1 border-aethex-400/40 bg-aethex-500/10 text-aethex-300">
            <Sparkles className="h-3 w-3" /> Live insight
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Community() {