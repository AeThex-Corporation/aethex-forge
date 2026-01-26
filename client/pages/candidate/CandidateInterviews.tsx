import { useState, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Video,
  Phone,
  MapPin,
  ArrowLeft,
  Clock,
  Loader2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { aethexToast } from "@/components/ui/aethex-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Interview {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link: string | null;
  meeting_type: string;
  status: string;
  notes: string | null;
  candidate_feedback: string | null;
  employer: {
    full_name: string;
    avatar_url: string | null;
    email: string;
  } | null;
}

interface GroupedInterviews {
  upcoming: Interview[];
  past: Interview[];
  cancelled: Interview[];
}

export default function CandidateInterviews() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [grouped, setGrouped] = useState<GroupedInterviews>({
    upcoming: [],
    past: [],
    cancelled: [],
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (session?.access_token) {
      fetchInterviews();
    }
  }, [session?.access_token]);

  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/candidate/interviews", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews || []);
        setGrouped(data.grouped || { upcoming: [], past: [], cancelled: [] });
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
      aethexToast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "in_person":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            Scheduled
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            Cancelled
          </Badge>
        );
      case "rescheduled":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Rescheduled
          </Badge>
        );
      case "no_show":
        return (
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
            No Show
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getFilteredInterviews = () => {
    switch (filter) {
      case "upcoming":
        return grouped.upcoming;
      case "past":
        return grouped.past;
      case "cancelled":
        return grouped.cancelled;
      default:
        return interviews;
    }
  };

  if (loading) {
    return (
      <Layout>
        <SEO title="Interviews" description="Manage your interview schedule" />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      </Layout>
    );
  }

  const filteredInterviews = getFilteredInterviews();

  return (
    <Layout>
      <SEO title="Interviews" description="Manage your interview schedule" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-4xl px-4 py-16">
            {/* Header */}
            <div className="mb-8">
              <Link href="/candidate">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-violet-300 hover:text-violet-200 hover:bg-violet-500/10 mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-violet-100">
                    Interviews
                  </h1>
                  <p className="text-violet-200/70">
                    Manage your interview schedule
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {grouped.upcoming.length}
                    </p>
                    <p className="text-sm text-slate-400">Upcoming</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {grouped.past.length}
                    </p>
                    <p className="text-sm text-slate-400">Completed</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-slate-400">
                      {interviews.length}
                    </p>
                    <p className="text-sm text-slate-400">Total</p>
                  </CardContent>
                </Card>
              </div>

              {/* Filter */}
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Filter interviews" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Interviews</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Interviews List */}
            <div className="space-y-4">
              {filteredInterviews.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-2">
                      No interviews found
                    </p>
                    <p className="text-slate-500 text-sm">
                      {filter === "all"
                        ? "You don't have any scheduled interviews yet"
                        : `No ${filter} interviews`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredInterviews.map((interview) => (
                  <Card
                    key={interview.id}
                    className="bg-slate-800/50 border-slate-700/50 hover:border-violet-500/30 transition-all"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={interview.employer?.avatar_url || ""}
                            />
                            <AvatarFallback className="bg-violet-500/20 text-violet-300">
                              {interview.employer?.full_name
                                ? getInitials(interview.employer.full_name)
                                : "E"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-violet-100">
                              Interview with{" "}
                              {interview.employer?.full_name || "Employer"}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(interview.scheduled_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatTime(interview.scheduled_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                {getMeetingIcon(interview.meeting_type)}
                                {interview.duration_minutes} min
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(interview.status)}
                          {interview.meeting_link &&
                            interview.status === "scheduled" && (
                              <a
                                href={interview.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Meeting
                                </Button>
                              </a>
                            )}
                        </div>
                      </div>

                      {interview.notes && (
                        <div className="mt-4 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                          <p className="text-sm text-slate-400">
                            <span className="font-medium text-slate-300">
                              Notes:
                            </span>{" "}
                            {interview.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Tips */}
            <Card className="mt-8 bg-slate-800/30 border-slate-700/30">
              <CardContent className="pt-6">
                <h3 className="font-medium text-violet-100 mb-3">
                  Interview Tips
                </h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                    Test your camera and microphone before video calls
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                    Join 5 minutes early to ensure everything works
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                    Have your resume and portfolio ready to share
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                    Prepare questions to ask the interviewer
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
