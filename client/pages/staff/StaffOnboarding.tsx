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
  Rocket,
  CheckCircle2,
  Clock,
  Users,
  BookOpen,
  MessageSquare,
  Calendar,
  ArrowRight,
  Sparkles,
  Target,
  Coffee,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface OnboardingData {
  progress: {
    day1: ChecklistItem[];
    week1: ChecklistItem[];
    month1: ChecklistItem[];
  };
  metadata: {
    start_date: string;
    manager_id: string | null;
    department: string | null;
    role_title: string | null;
    onboarding_completed: boolean;
  };
  staff_member: {
    full_name: string;
    department: string;
    role: string;
    avatar_url: string | null;
  } | null;
  manager: {
    full_name: string;
    email: string;
    avatar_url: string | null;
  } | null;
  summary: {
    completed: number;
    total: number;
    percentage: number;
  };
}

interface ChecklistItem {
  id: string;
  checklist_item: string;
  phase: string;
  completed: boolean;
  completed_at: string | null;
}

export default function StaffOnboarding() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    if (session?.access_token) {
      fetchOnboardingData();
    }
  }, [session?.access_token]);

  const fetchOnboardingData = async () => {
    try {
      const response = await fetch("/api/staff/onboarding", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch onboarding data");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching onboarding:", error);
      aethexToast.error("Failed to load onboarding data");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPhase = () => {
    if (!data) return "day1";
    const { day1, week1 } = data.progress;
    const day1Complete = day1.every((item) => item.completed);
    const week1Complete = week1.every((item) => item.completed);
    if (!day1Complete) return "day1";
    if (!week1Complete) return "week1";
    return "month1";
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "day1":
        return "Day 1";
      case "week1":
        return "Week 1";
      case "month1":
        return "Month 1";
      default:
        return phase;
    }
  };

  const getDaysSinceStart = () => {
    if (!data?.metadata?.start_date) return 0;
    const start = new Date(data.metadata.start_date);
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
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
          title="Staff Onboarding"
          description="Welcome to AeThex - Your onboarding journey"
        />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      </Layout>
    );
  }

  const currentPhase = getCurrentPhase();
  const daysSinceStart = getDaysSinceStart();

  return (
    <Layout>
      <SEO
        title="Staff Onboarding"
        description="Welcome to AeThex - Your onboarding journey"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            {/* Welcome Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <Rocket className="h-6 w-6 text-emerald-400" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  {currentPhase === "day1"
                    ? "Getting Started"
                    : currentPhase === "week1"
                      ? "Week 1"
                      : "Month 1"}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold text-emerald-100 mb-2">
                Welcome to AeThex
                {data?.staff_member?.full_name
                  ? `, ${data.staff_member.full_name.split(" ")[0]}!`
                  : "!"}
              </h1>
              <p className="text-emerald-200/70 text-lg">
                {data?.summary?.percentage === 100
                  ? "Congratulations! You've completed your onboarding journey."
                  : `Day ${daysSinceStart + 1} of your onboarding journey. Let's make it great!`}
              </p>
            </div>

            {/* Progress Overview */}
            <Card className="bg-slate-800/50 border-emerald-500/30 mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* Progress Ring */}
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          className="text-slate-700"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="48"
                          cy="48"
                        />
                        <circle
                          className="text-emerald-500"
                          strokeWidth="8"
                          strokeDasharray={251.2}
                          strokeDashoffset={
                            251.2 - (251.2 * (data?.summary?.percentage || 0)) / 100
                          }
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="48"
                          cy="48"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-emerald-100">
                        {data?.summary?.percentage || 0}%
                      </span>
                    </div>
                    <div>
                      <p className="text-emerald-100 font-semibold text-lg">
                        Onboarding Progress
                      </p>
                      <p className="text-slate-400">
                        {data?.summary?.completed || 0} of{" "}
                        {data?.summary?.total || 0} tasks completed
                      </p>
                    </div>
                  </div>

                  {/* Phase Progress */}
                  <div className="flex gap-4">
                    {["day1", "week1", "month1"].map((phase) => {
                      const items = data?.progress?.[phase as keyof typeof data.progress] || [];
                      const completed = items.filter((i) => i.completed).length;
                      const total = items.length;
                      const isComplete = completed === total && total > 0;
                      const isCurrent = phase === currentPhase;

                      return (
                        <div
                          key={phase}
                          className={`text-center p-3 rounded-lg ${
                            isCurrent
                              ? "bg-emerald-500/20 border border-emerald-500/30"
                              : isComplete
                                ? "bg-green-500/10 border border-green-500/20"
                                : "bg-slate-700/30 border border-slate-600/30"
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-1" />
                          ) : (
                            <Clock className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                          )}
                          <p className="text-sm font-medium text-emerald-100">
                            {getPhaseLabel(phase)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {completed}/{total}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Link href="/staff/onboarding/checklist">
                <Card className="bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 transition-all cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="p-2 rounded bg-emerald-500/20 text-emerald-400 w-fit mb-3">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-emerald-100 mb-1">
                      Complete Checklist
                    </h3>
                    <p className="text-sm text-slate-400">
                      Track your onboarding tasks
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/staff/directory">
                <Card className="bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 transition-all cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="p-2 rounded bg-blue-500/20 text-blue-400 w-fit mb-3">
                      <Users className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-emerald-100 mb-1">
                      Meet Your Team
                    </h3>
                    <p className="text-sm text-slate-400">
                      Browse the staff directory
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/staff/learning">
                <Card className="bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 transition-all cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="p-2 rounded bg-purple-500/20 text-purple-400 w-fit mb-3">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-emerald-100 mb-1">
                      Learning Portal
                    </h3>
                    <p className="text-sm text-slate-400">
                      Training courses & resources
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/staff/handbook">
                <Card className="bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 transition-all cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="p-2 rounded bg-orange-500/20 text-orange-400 w-fit mb-3">
                      <Target className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-emerald-100 mb-1">
                      Team Handbook
                    </h3>
                    <p className="text-sm text-slate-400">
                      Policies & guidelines
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Current Phase Tasks */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-emerald-100 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-400" />
                      Current Tasks - {getPhaseLabel(currentPhase)}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Focus on completing these tasks first
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data?.progress?.[currentPhase as keyof typeof data.progress]
                        ?.slice(0, 5)
                        .map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 p-3 rounded-lg ${
                              item.completed
                                ? "bg-green-500/10 border border-green-500/20"
                                : "bg-slate-700/30 border border-slate-600/30"
                            }`}
                          >
                            {item.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-slate-500 flex-shrink-0" />
                            )}
                            <span
                              className={
                                item.completed
                                  ? "text-slate-400 line-through"
                                  : "text-emerald-100"
                              }
                            >
                              {item.checklist_item}
                            </span>
                          </div>
                        ))}
                    </div>
                    <Link href="/staff/onboarding/checklist">
                      <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                        View Full Checklist
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Manager Card */}
                {data?.manager && (
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-emerald-100 text-lg flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-emerald-400" />
                        Your Manager
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={data.manager.avatar_url || ""} />
                          <AvatarFallback className="bg-emerald-500/20 text-emerald-300">
                            {getInitials(data.manager.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-emerald-100">
                            {data.manager.full_name}
                          </p>
                          <p className="text-sm text-slate-400">
                            {data.manager.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Important Links */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-emerald-100 text-lg">
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <a
                      href="https://discord.gg/aethex"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded hover:bg-slate-700/50 text-slate-300 hover:text-emerald-300 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Join Discord Server
                    </a>
                    <Link
                      href="/staff/knowledge-base"
                      className="flex items-center gap-2 p-2 rounded hover:bg-slate-700/50 text-slate-300 hover:text-emerald-300 transition-colors"
                    >
                      <BookOpen className="h-4 w-4" />
                      Knowledge Base
                    </Link>
                    <Link
                      href="/documentation"
                      className="flex items-center gap-2 p-2 rounded hover:bg-slate-700/50 text-slate-300 hover:text-emerald-300 transition-colors"
                    >
                      <Target className="h-4 w-4" />
                      Documentation
                    </Link>
                    <Link
                      href="/staff/announcements"
                      className="flex items-center gap-2 p-2 rounded hover:bg-slate-700/50 text-slate-300 hover:text-emerald-300 transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      Announcements
                    </Link>
                  </CardContent>
                </Card>

                {/* Achievement */}
                {data?.summary?.percentage === 100 && (
                  <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
                    <CardContent className="pt-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-8 w-8 text-emerald-400" />
                      </div>
                      <h3 className="font-bold text-emerald-100 text-lg mb-1">
                        Onboarding Complete!
                      </h3>
                      <p className="text-sm text-emerald-200/70">
                        You've completed all onboarding tasks. Welcome to the
                        team!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
