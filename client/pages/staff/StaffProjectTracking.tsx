import { useState } from "react";
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
import {
  BarChart,
  Target,
  TrendingUp,
  Zap,
  Users,
  CheckCircle,
} from "lucide-react";

interface OKR {
  id: string;
  title: string;
  description: string;
  owner: string;
  progress: number;
  status: "On Track" | "At Risk" | "Completed";
  quarter: string;
  team: string;
}

const okrs: OKR[] = [
  {
    id: "1",
    title: "Improve Platform Performance by 40%",
    description: "Reduce page load time and increase throughput",
    owner: "Engineering",
    progress: 75,
    status: "On Track",
    quarter: "Q1 2025",
    team: "DevOps",
  },
  {
    id: "2",
    title: "Expand Creator Network to 5K Members",
    description: "Grow creator base through partnerships and incentives",
    owner: "Community",
    progress: 62,
    status: "On Track",
    quarter: "Q1 2025",
    team: "Growth",
  },
  {
    id: "3",
    title: "Launch New Learning Curriculum",
    description: "Complete redesign of Foundation learning paths",
    owner: "Foundation",
    progress: 45,
    status: "At Risk",
    quarter: "Q1 2025",
    team: "Education",
  },
  {
    id: "4",
    title: "Achieve 99.99% Uptime",
    description: "Maintain service reliability and reduce downtime",
    owner: "Infrastructure",
    progress: 88,
    status: "On Track",
    quarter: "Q1 2025",
    team: "Ops",
  },
  {
    id: "5",
    title: "Launch Roblox Game Studio Partnership",
    description: "Formalize GameForge partnerships with major studios",
    owner: "GameForge",
    progress: 30,
    status: "On Track",
    quarter: "Q1 2025",
    team: "Partnerships",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "On Track":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "At Risk":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "Completed":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
};

export default function StaffProjectTracking() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const teams = Array.from(new Set(okrs.map((okr) => okr.team)));

  const filtered = selectedTeam
    ? okrs.filter((okr) => okr.team === selectedTeam)
    : okrs;

  const avgProgress =
    Math.round(
      filtered.reduce((sum, okr) => sum + okr.progress, 0) / filtered.length,
    ) || 0;

  return (
    <Layout>
      <SEO
        title="Project Tracking"
        description="AeThex OKRs, initiatives, and roadmap"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <Target className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-indigo-100">
                  Project Tracking
                </h1>
                <p className="text-indigo-200/70">
                  OKRs, initiatives, and company-wide roadmap
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <Card className="bg-indigo-950/30 border-indigo-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-200/70">Active OKRs</p>
                      <p className="text-3xl font-bold text-indigo-100">
                        {filtered.length}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-indigo-950/30 border-indigo-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-200/70">Avg Progress</p>
                      <p className="text-3xl font-bold text-indigo-100">
                        {avgProgress}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-indigo-950/30 border-indigo-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-200/70">On Track</p>
                      <p className="text-3xl font-bold text-indigo-100">
                        {filtered.filter((o) => o.status === "On Track").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Filter */}
            <div className="mb-8">
              <p className="text-sm text-indigo-200/70 mb-3">Filter by Team:</p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedTeam === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTeam(null)}
                  className={
                    selectedTeam === null
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                  }
                >
                  All Teams
                </Button>
                {teams.map((team) => (
                  <Button
                    key={team}
                    variant={selectedTeam === team ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTeam(team)}
                    className={
                      selectedTeam === team
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                    }
                  >
                    {team}
                  </Button>
                ))}
              </div>
            </div>

            {/* OKRs */}
            <div className="space-y-6">
              {filtered.map((okr) => (
                <Card
                  key={okr.id}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-indigo-100">
                          {okr.title}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {okr.description}
                        </CardDescription>
                      </div>
                      <Badge className={`border ${getStatusColor(okr.status)}`}>
                        {okr.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-indigo-300 font-semibold">
                          {okr.progress}%
                        </span>
                      </div>
                      <Progress value={okr.progress} className="h-2" />
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <div>
                        <p className="text-xs text-slate-500">Owner</p>
                        <p className="text-sm text-indigo-300">{okr.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Quarter</p>
                        <p className="text-sm text-indigo-300">{okr.quarter}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Team</p>
                        <p className="text-sm text-indigo-300">{okr.team}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
