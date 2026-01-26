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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  FileText,
  Calendar,
  Star,
  ArrowRight,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  Send,
  Gift,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface ProfileData {
  profile: {
    headline: string;
    bio: string;
    skills: string[];
    profile_completeness: number;
    availability: string;
  } | null;
  user: {
    full_name: string;
    avatar_url: string;
    email: string;
  } | null;
  stats: {
    total_applications: number;
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  };
}

interface Interview {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_type: string;
  status: string;
  employer: {
    full_name: string;
    avatar_url: string;
  };
}

interface Offer {
  id: string;
  position_title: string;
  company_name: string;
  salary_amount: number;
  salary_type: string;
  offer_expiry: string;
  status: string;
}

export default function CandidatePortal() {
  const { session, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [pendingOffers, setPendingOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (session?.access_token) {
      fetchData();
    }
  }, [session?.access_token]);

  const fetchData = async () => {
    try {
      const [profileRes, interviewsRes, offersRes] = await Promise.all([
        fetch("/api/candidate/profile", {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }),
        fetch("/api/candidate/interviews?upcoming=true", {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }),
        fetch("/api/candidate/offers", {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfileData(data);
      }
      if (interviewsRes.ok) {
        const data = await interviewsRes.json();
        setUpcomingInterviews(data.grouped?.upcoming || []);
      }
      if (offersRes.ok) {
        const data = await offersRes.json();
        setPendingOffers(data.grouped?.pending || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityLabel = (availability: string) => {
    const labels: Record<string, string> = {
      immediate: "Available Immediately",
      "2_weeks": "Available in 2 Weeks",
      "1_month": "Available in 1 Month",
      "3_months": "Available in 3 Months",
      not_looking: "Not Currently Looking",
    };
    return labels[availability] || availability;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
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

  if (loading) {
    return (
      <Layout>
        <SEO
          title="Candidate Portal"
          description="Manage your job applications and career"
        />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      </Layout>
    );
  }

  const stats = profileData?.stats || {
    total_applications: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  };

  return (
    <Layout>
      <SEO
        title="Candidate Portal"
        description="Manage your job applications and career"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-violet-500/30">
                  <AvatarImage src={profileData?.user?.avatar_url || ""} />
                  <AvatarFallback className="bg-violet-500/20 text-violet-300 text-lg">
                    {profileData?.user?.full_name
                      ? getInitials(profileData.user.full_name)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-violet-100">
                    Welcome back
                    {profileData?.user?.full_name
                      ? `, ${profileData.user.full_name.split(" ")[0]}`
                      : ""}
                    !
                  </h1>
                  <p className="text-violet-200/70">
                    {profileData?.profile?.headline || "Your career dashboard"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/opportunities">
                  <Button className="bg-violet-600 hover:bg-violet-700">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Opportunities
                  </Button>
                </Link>
                <Link href="/candidate/profile">
                  <Button
                    variant="outline"
                    className="border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Profile Completeness Alert */}
            {profileData?.profile?.profile_completeness !== undefined &&
              profileData.profile.profile_completeness < 80 && (
                <Card className="bg-violet-500/10 border-violet-500/30 mb-8">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-violet-100 font-medium mb-2">
                          Complete your profile to stand out
                        </p>
                        <Progress
                          value={profileData.profile.profile_completeness}
                          className="h-2"
                        />
                        <p className="text-sm text-violet-200/70 mt-1">
                          {profileData.profile.profile_completeness}% complete
                        </p>
                      </div>
                      <Link href="/candidate/profile">
                        <Button
                          size="sm"
                          className="bg-violet-600 hover:bg-violet-700"
                        >
                          Complete Profile
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-violet-500/20 text-violet-400">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-violet-100">
                        {stats.total_applications}
                      </p>
                      <p className="text-xs text-slate-400">Applications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-yellow-500/20 text-yellow-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-violet-100">
                        {stats.pending}
                      </p>
                      <p className="text-xs text-slate-400">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-blue-500/20 text-blue-400">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-violet-100">
                        {stats.reviewed}
                      </p>
                      <p className="text-xs text-slate-400">In Review</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-green-500/20 text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-violet-100">
                        {stats.accepted}
                      </p>
                      <p className="text-xs text-slate-400">Accepted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-red-500/20 text-red-400">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-violet-100">
                        {stats.rejected}
                      </p>
                      <p className="text-xs text-slate-400">Rejected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Actions & Upcoming */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href="/candidate/applications">
                    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50 transition-all cursor-pointer h-full">
                      <CardContent className="pt-6">
                        <div className="p-2 rounded bg-violet-500/20 text-violet-400 w-fit mb-3">
                          <FileText className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-violet-100 mb-1">
                          My Applications
                        </h3>
                        <p className="text-sm text-slate-400">
                          Track all your job applications
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/candidate/interviews">
                    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50 transition-all cursor-pointer h-full">
                      <CardContent className="pt-6">
                        <div className="p-2 rounded bg-blue-500/20 text-blue-400 w-fit mb-3">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-violet-100 mb-1">
                          Interviews
                        </h3>
                        <p className="text-sm text-slate-400">
                          View and manage scheduled interviews
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/candidate/offers">
                    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50 transition-all cursor-pointer h-full">
                      <CardContent className="pt-6">
                        <div className="p-2 rounded bg-green-500/20 text-green-400 w-fit mb-3">
                          <Gift className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-violet-100 mb-1">
                          Offers
                        </h3>
                        <p className="text-sm text-slate-400">
                          Review and respond to job offers
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/opportunities">
                    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50 transition-all cursor-pointer h-full">
                      <CardContent className="pt-6">
                        <div className="p-2 rounded bg-orange-500/20 text-orange-400 w-fit mb-3">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-violet-100 mb-1">
                          Browse Jobs
                        </h3>
                        <p className="text-sm text-slate-400">
                          Find new opportunities
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>

                {/* Upcoming Interviews */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-violet-100 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-violet-400" />
                      Upcoming Interviews
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Your scheduled interviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingInterviews.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">
                        No upcoming interviews scheduled
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingInterviews.slice(0, 3).map((interview) => (
                          <div
                            key={interview.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/30"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
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
                                <p className="text-sm text-slate-400">
                                  {formatDate(interview.scheduled_at)} -{" "}
                                  {interview.duration_minutes} min
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={
                                interview.meeting_type === "video"
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : "bg-slate-700 text-slate-300"
                              }
                            >
                              {interview.meeting_type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    {upcomingInterviews.length > 0 && (
                      <Link href="/candidate/interviews">
                        <Button
                          variant="ghost"
                          className="w-full mt-4 text-violet-300 hover:text-violet-200 hover:bg-violet-500/10"
                        >
                          View All Interviews
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Pending Offers */}
                {pendingOffers.length > 0 && (
                  <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-100 text-lg flex items-center gap-2">
                        <Gift className="h-5 w-5 text-green-400" />
                        Pending Offers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {pendingOffers.slice(0, 2).map((offer) => (
                        <div
                          key={offer.id}
                          className="p-3 rounded-lg bg-slate-800/50 border border-green-500/20"
                        >
                          <p className="font-medium text-green-100">
                            {offer.position_title}
                          </p>
                          <p className="text-sm text-slate-400">
                            {offer.company_name}
                          </p>
                          {offer.offer_expiry && (
                            <p className="text-xs text-yellow-400 mt-1">
                              Expires {new Date(offer.offer_expiry).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                      <Link href="/candidate/offers">
                        <Button
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Review Offers
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Profile Summary */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-violet-100 text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-violet-400" />
                      Your Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Completeness</p>
                      <Progress
                        value={profileData?.profile?.profile_completeness || 0}
                        className="h-2"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {profileData?.profile?.profile_completeness || 0}%
                      </p>
                    </div>
                    {profileData?.profile?.availability && (
                      <div>
                        <p className="text-sm text-slate-400">Availability</p>
                        <Badge className="mt-1 bg-violet-500/20 text-violet-300 border-violet-500/30">
                          {getAvailabilityLabel(profileData.profile.availability)}
                        </Badge>
                      </div>
                    )}
                    {profileData?.profile?.skills &&
                      profileData.profile.skills.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {profileData.profile.skills.slice(0, 5).map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs border-slate-600 text-slate-300"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {profileData.profile.skills.length > 5 && (
                              <Badge
                                variant="outline"
                                className="text-xs border-slate-600 text-slate-400"
                              >
                                +{profileData.profile.skills.length - 5}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    <Link href="/candidate/profile">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Tips Card */}
                <Card className="bg-slate-800/30 border-slate-700/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded bg-yellow-500/20 text-yellow-400">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-violet-100 mb-1">
                          Pro Tip
                        </h3>
                        <p className="text-sm text-slate-400">
                          Candidates with complete profiles get 3x more
                          interview invitations. Make sure to add your skills
                          and work history!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
