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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ClipboardCheck,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  Trophy,
  Sun,
  Briefcase,
  Target,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface ChecklistItem {
  id: string;
  checklist_item: string;
  phase: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
}

interface OnboardingData {
  progress: {
    day1: ChecklistItem[];
    week1: ChecklistItem[];
    month1: ChecklistItem[];
  };
  metadata: {
    start_date: string;
    onboarding_completed: boolean;
  };
  summary: {
    completed: number;
    total: number;
    percentage: number;
  };
}

const PHASE_INFO = {
  day1: {
    label: "Day 1",
    icon: Sun,
    description: "First day essentials - get set up and meet the team",
    color: "emerald",
  },
  week1: {
    label: "Week 1",
    icon: Briefcase,
    description: "Dive into tools, processes, and your first tasks",
    color: "blue",
  },
  month1: {
    label: "Month 1",
    icon: Target,
    description: "Build momentum and complete your onboarding journey",
    color: "purple",
  },
};

export default function StaffOnboardingChecklist() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [data, setData] = useState<OnboardingData | null>(null);
  const [activeTab, setActiveTab] = useState("day1");

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

      // Set active tab to current phase
      const day1Complete = result.progress.day1.every(
        (i: ChecklistItem) => i.completed,
      );
      const week1Complete = result.progress.week1.every(
        (i: ChecklistItem) => i.completed,
      );
      if (!day1Complete) setActiveTab("day1");
      else if (!week1Complete) setActiveTab("week1");
      else setActiveTab("month1");
    } catch (error) {
      console.error("Error fetching onboarding:", error);
      aethexToast.error("Failed to load onboarding data");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (item: ChecklistItem) => {
    if (!session?.access_token) return;
    setSaving(item.id);

    try {
      const response = await fetch("/api/staff/onboarding", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checklist_item: item.checklist_item,
          completed: !item.completed,
        }),
      });

      if (!response.ok) throw new Error("Failed to update item");

      const result = await response.json();

      // Update local state
      if (data) {
        const phase = item.phase as keyof typeof data.progress;
        const updatedItems = data.progress[phase].map((i) =>
          i.id === item.id
            ? { ...i, completed: !item.completed, completed_at: !item.completed ? new Date().toISOString() : null }
            : i,
        );

        const newCompleted = Object.values({
          ...data.progress,
          [phase]: updatedItems,
        }).flat().filter((i) => i.completed).length;

        setData({
          ...data,
          progress: {
            ...data.progress,
            [phase]: updatedItems,
          },
          summary: {
            ...data.summary,
            completed: newCompleted,
            percentage: Math.round((newCompleted / data.summary.total) * 100),
          },
        });
      }

      if (result.all_completed) {
        aethexToast.success(
          "Congratulations! You've completed all onboarding tasks!",
        );
      } else if (!item.completed) {
        aethexToast.success("Task completed!");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      aethexToast.error("Failed to update task");
    } finally {
      setSaving(null);
    }
  };

  const getPhaseProgress = (phase: keyof typeof data.progress) => {
    if (!data) return { completed: 0, total: 0, percentage: 0 };
    const items = data.progress[phase];
    const completed = items.filter((i) => i.completed).length;
    return {
      completed,
      total: items.length,
      percentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0,
    };
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout>
        <SEO
          title="Onboarding Checklist"
          description="Track your onboarding progress"
        />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Onboarding Checklist"
        description="Track your onboarding progress"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-4xl px-4 py-16">
            {/* Header */}
            <div className="mb-8">
              <Link href="/staff/onboarding">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Onboarding
                </Button>
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <ClipboardCheck className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-emerald-100">
                    Onboarding Checklist
                  </h1>
                  <p className="text-emerald-200/70">
                    Track and complete your onboarding tasks
                  </p>
                </div>
              </div>

              {/* Overall Progress */}
              <Card className="bg-slate-800/50 border-emerald-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-emerald-100 font-medium">
                      Overall Progress
                    </span>
                    <span className="text-emerald-300 font-bold">
                      {data?.summary?.completed || 0}/{data?.summary?.total || 0}{" "}
                      tasks ({data?.summary?.percentage || 0}%)
                    </span>
                  </div>
                  <Progress
                    value={data?.summary?.percentage || 0}
                    className="h-3"
                  />
                  {data?.summary?.percentage === 100 && (
                    <div className="flex items-center gap-2 mt-3 text-green-400">
                      <Trophy className="h-5 w-5" />
                      <span className="font-medium">
                        All tasks completed! Welcome to the team!
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full bg-slate-800/50 border border-slate-700/50 p-1 mb-6">
                {(["day1", "week1", "month1"] as const).map((phase) => {
                  const info = PHASE_INFO[phase];
                  const progress = getPhaseProgress(phase);
                  const Icon = info.icon;

                  return (
                    <TabsTrigger
                      key={phase}
                      value={phase}
                      className="flex-1 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {info.label}
                      {progress.percentage === 100 && (
                        <CheckCircle2 className="h-4 w-4 ml-2 text-green-400" />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {(["day1", "week1", "month1"] as const).map((phase) => {
                const info = PHASE_INFO[phase];
                const progress = getPhaseProgress(phase);
                const items = data?.progress[phase] || [];

                return (
                  <TabsContent key={phase} value={phase}>
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-emerald-100 flex items-center gap-2">
                              {info.label}
                              {progress.percentage === 100 && (
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                  Complete
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                              {info.description}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-100">
                              {progress.percentage}%
                            </p>
                            <p className="text-sm text-slate-400">
                              {progress.completed}/{progress.total} done
                            </p>
                          </div>
                        </div>
                        <Progress
                          value={progress.percentage}
                          className="h-2 mt-2"
                        />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                                item.completed
                                  ? "bg-green-500/10 border border-green-500/20"
                                  : "bg-slate-700/30 border border-slate-600/30 hover:border-emerald-500/30"
                              }`}
                            >
                              <div className="pt-0.5">
                                {saving === item.id ? (
                                  <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                                ) : (
                                  <Checkbox
                                    checked={item.completed}
                                    onCheckedChange={() => toggleItem(item)}
                                    className={`h-5 w-5 ${
                                      item.completed
                                        ? "border-green-500 bg-green-500 data-[state=checked]:bg-green-500"
                                        : "border-slate-500"
                                    }`}
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-medium ${
                                    item.completed
                                      ? "text-slate-400 line-through"
                                      : "text-emerald-100"
                                  }`}
                                >
                                  {item.checklist_item}
                                </p>
                                {item.completed && item.completed_at && (
                                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                    <Clock className="h-3 w-3" />
                                    Completed {formatDate(item.completed_at)}
                                  </div>
                                )}
                              </div>
                              {item.completed && (
                                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>

                        {progress.percentage === 100 && (
                          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                            <Trophy className="h-8 w-8 text-green-400 mx-auto mb-2" />
                            <p className="font-medium text-green-300">
                              {info.label} Complete!
                            </p>
                            <p className="text-sm text-slate-400">
                              Great job completing all {info.label.toLowerCase()}{" "}
                              tasks
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>

            {/* Help Section */}
            <Card className="mt-6 bg-slate-800/30 border-slate-700/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded bg-blue-500/20 text-blue-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-100 mb-1">
                      Need Help?
                    </h3>
                    <p className="text-sm text-slate-400">
                      If you're stuck on any task or need clarification, don't
                      hesitate to reach out to your manager or team members. You
                      can also check the{" "}
                      <Link
                        href="/staff/knowledge-base"
                        className="text-emerald-400 hover:underline"
                      >
                        Knowledge Base
                      </Link>{" "}
                      for detailed guides.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
