import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  MessageSquare,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface Analytics {
  users: {
    total: number;
    new: number;
    active: number;
    creators: number;
  };
  opportunities: {
    total: number;
    open: number;
    new: number;
  };
  applications: {
    total: number;
    new: number;
  };
  contracts: {
    total: number;
    active: number;
  };
  community: {
    posts: number;
    newPosts: number;
  };
  revenue: {
    total: number;
    period: string;
  };
  trends: {
    dailySignups: Array<{ date: string; count: number }>;
    topOpportunities: Array<{ id: string; title: string; applications: number }>;
  };
  period: number;
}

export default function AdminAnalytics() {
  const { session } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    if (session?.access_token) {
      fetchAnalytics();
    }
  }, [session?.access_token, period]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAnalytics(data);
      } else {
        aethexToast.error(data.error || "Failed to load analytics");
      }
    } catch (err) {
      aethexToast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const maxSignups = analytics?.trends.dailySignups
    ? Math.max(...analytics.trends.dailySignups.map(d => d.count), 1)
    : 1;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Analytics Dashboard" description="Platform analytics and insights" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-7xl px-4 py-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                  <BarChart3 className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-cyan-100">Analytics</h1>
                  <p className="text-cyan-200/70 text-sm sm:text-base">Platform insights and metrics</p>
                </div>
              </div>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Overview Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-cyan-200/70">Total Users</p>
                      <p className="text-3xl font-bold text-cyan-100">{analytics?.users.total.toLocaleString()}</p>
                      <div className="flex items-center gap-1 mt-1 text-green-400 text-sm">
                        <ArrowUpRight className="h-4 w-4" />
                        +{analytics?.users.new} this period
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-cyan-200/70">Active Users</p>
                      <p className="text-3xl font-bold text-cyan-100">{analytics?.users.active.toLocaleString()}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {analytics?.users.total ? Math.round((analytics.users.active / analytics.users.total) * 100) : 0}% of total
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-cyan-200/70">Opportunities</p>
                      <p className="text-3xl font-bold text-cyan-100">{analytics?.opportunities.open}</p>
                      <div className="flex items-center gap-1 mt-1 text-green-400 text-sm">
                        <ArrowUpRight className="h-4 w-4" />
                        +{analytics?.opportunities.new} new
                      </div>
                    </div>
                    <Briefcase className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-cyan-200/70">Revenue</p>
                      <p className="text-3xl font-bold text-cyan-100">{formatCurrency(analytics?.revenue.total || 0)}</p>
                      <p className="text-sm text-slate-400 mt-1">Last {period} days</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Applications */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-400" />
                    Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total</span>
                      <span className="text-xl font-bold text-cyan-100">{analytics?.applications.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">This Period</span>
                      <span className="text-xl font-bold text-green-400">+{analytics?.applications.new}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Avg per Opportunity</span>
                      <span className="text-xl font-bold text-cyan-100">
                        {analytics?.opportunities.total
                          ? (analytics.applications.total / analytics.opportunities.total).toFixed(1)
                          : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contracts */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total</span>
                      <span className="text-xl font-bold text-cyan-100">{analytics?.contracts.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Active</span>
                      <span className="text-xl font-bold text-green-400">{analytics?.contracts.active}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Completion Rate</span>
                      <span className="text-xl font-bold text-cyan-100">
                        {analytics?.contracts.total
                          ? Math.round(((analytics.contracts.total - analytics.contracts.active) / analytics.contracts.total) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-cyan-400" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Posts</span>
                      <span className="text-xl font-bold text-cyan-100">{analytics?.community.posts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">New Posts</span>
                      <span className="text-xl font-bold text-green-400">+{analytics?.community.newPosts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Creators</span>
                      <span className="text-xl font-bold text-cyan-100">{analytics?.users.creators}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Signup Trend */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-100">Daily Signups</CardTitle>
                  <CardDescription className="text-slate-400">User registrations over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end gap-1">
                    {analytics?.trends.dailySignups.slice(-30).map((day, i) => (
                      <div
                        key={day.date}
                        className="flex-1 bg-cyan-500/30 hover:bg-cyan-500/50 transition-colors rounded-t"
                        style={{ height: `${(day.count / maxSignups) * 100}%`, minHeight: "4px" }}
                        title={`${day.date}: ${day.count} signups`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>30 days ago</span>
                    <span>Today</span>
                  </div>
                </CardContent>
              </Card>

              {/* Top Opportunities */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-100">Top Opportunities</CardTitle>
                  <CardDescription className="text-slate-400">By number of applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.trends.topOpportunities.map((opp, i) => (
                      <div key={opp.id} className="flex items-center gap-4">
                        <span className="text-lg font-bold text-cyan-400 w-6">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 truncate">{opp.title}</p>
                          <p className="text-sm text-slate-500">{opp.applications} applications</p>
                        </div>
                      </div>
                    ))}
                    {(!analytics?.trends.topOpportunities || analytics.trends.topOpportunities.length === 0) && (
                      <p className="text-slate-500 text-center py-4">No opportunities yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
