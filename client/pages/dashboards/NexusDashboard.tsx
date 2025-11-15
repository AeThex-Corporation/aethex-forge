import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingScreen from "@/components/LoadingScreen";
import ContractsWidget from "@/components/ContractsWidget";
import ApplicationsWidget from "@/components/ApplicationsWidget";
import PostedOpportunitiesWidget from "@/components/PostedOpportunitiesWidget";
import {
  Briefcase,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
  Heart,
  Star,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

type ViewMode = "creator" | "client";

export default function NexusDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("creator");
  const [activeTab, setActiveTab] = useState("overview");
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [payoutInfo, setPayoutInfo] = useState<any>(null);
  const [postedOpportunities, setPostedOpportunities] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      // Load creator profile
      const profileRes = await fetch(`${API_BASE}/api/nexus/creator/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        setCreatorProfile(await profileRes.json());
      }

      // Load applications
      const appRes = await fetch(`${API_BASE}/api/nexus/creator/applications?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (appRes.ok) {
        const data = await appRes.json();
        setApplications(data.applications || []);
      }

      // Load contracts
      const contractRes = await fetch(`${API_BASE}/api/nexus/creator/contracts?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (contractRes.ok) {
        const data = await contractRes.json();
        setContracts(data.contracts || []);
      }

      // Load payout info
      const payoutRes = await fetch(`${API_BASE}/api/nexus/creator/payouts?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (payoutRes.ok) {
        const data = await payoutRes.json();
        setPayoutInfo(data.summary);
      }

      // Load client data (posted opportunities)
      const oppRes = await fetch(`${API_BASE}/api/nexus/client/opportunities?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (oppRes.ok) {
        const data = await oppRes.json();
        setPostedOpportunities(data.opportunities || []);
      }

      // Load applicants
      const appliRes = await fetch(`${API_BASE}/api/nexus/client/applicants?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (appliRes.ok) {
        const data = await appliRes.json();
        setApplicants(data.applicants || []);
      }

      // Load payment history
      const payHistRes = await fetch(`${API_BASE}/api/nexus/client/payment-history?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (payHistRes.ok) {
        const data = await payHistRes.json();
        setPaymentHistory(data.payments || []);
      }
    } catch (error: any) {
      aethexToast({
        message: "Failed to load dashboard data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading NEXUS Dashboard..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              Sign In to NEXUS
            </h1>
            <p className="text-gray-400">Access the marketplace and start earning</p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isProfileComplete = creatorProfile?.verified || (creatorProfile?.headline && creatorProfile?.skills?.length > 0);
  const pendingApplications = applications.filter((a) => a.status === "submitted").length;
  const activeContracts = contracts.filter((c) => c.status === "active").length;
  const openOpportunities = postedOpportunities.filter((o) => o.status === "open").length;
  const applicantStats = {
    applied: applicants.filter((a) => a.status === "applied").length,
    interviewing: applicants.filter((a) => a.status === "interviewing").length,
    hired: applicants.filter((a) => a.status === "hired").length,
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Header with View Toggle */}
          <div className="space-y-4 animate-slide-down">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  NEXUS Marketplace
                </h1>
                <p className="text-gray-400 text-lg">
                  {viewMode === "creator"
                    ? "Showcase your skills and land paid opportunities"
                    : "Hire talent and manage your team"}
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 rounded-lg p-1">
                <Button
                  variant={viewMode === "creator" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setViewMode("creator");
                    setActiveTab("overview");
                  }}
                  className={viewMode === "creator" ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {viewMode === "creator" ? <ToggleRight className="h-4 w-4 mr-1" /> : <ToggleLeft className="h-4 w-4 mr-1" />}
                  Creator
                </Button>
                <Button
                  variant={viewMode === "client" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setViewMode("client");
                    setActiveTab("overview");
                  }}
                  className={viewMode === "client" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {viewMode === "client" ? <ToggleRight className="h-4 w-4 mr-1" /> : <ToggleLeft className="h-4 w-4 mr-1" />}
                  Client
                </Button>
              </div>
            </div>

            {/* Setup Banner (Creator View) */}
            {viewMode === "creator" && !isProfileComplete && (
              <Card className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-white flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Complete Your NEXUS Profile
                      </p>
                      <p className="text-sm text-orange-200">
                        Add a headline, skills, and hourly rate to attract clients and start bidding on opportunities
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("profile")}
                      className="bg-orange-600 hover:bg-orange-700 shrink-0"
                    >
                      Setup Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Creator View */}
          {viewMode === "creator" && (
            <>
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-purple-950/30 border border-purple-500/20 p-1">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="contracts">Contracts</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat: Total Earnings */}
                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardContent className="p-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Total Earnings</p>
                          <DollarSign className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">
                          ${(payoutInfo?.total_earnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Stat: Pending Payouts */}
                    <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                      <CardContent className="p-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Pending Payouts</p>
                          <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">
                          ${(payoutInfo?.pending_payouts || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Stat: Pending Applications */}
                    <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                      <CardContent className="p-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Pending Applications</p>
                          <Briefcase className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">{pendingApplications}</p>
                      </CardContent>
                    </Card>

                    {/* Stat: Active Contracts */}
                    <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                      <CardContent className="p-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Active Contracts</p>
                          <CheckCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">{activeContracts}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Applications */}
                  <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                    <CardHeader>
                      <CardTitle>Recent Applications</CardTitle>
                      <CardDescription>Your most recent bids</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {applications.length === 0 ? (
                        <div className="text-center py-8 space-y-4">
                          <AlertCircle className="h-12 w-12 mx-auto text-gray-500 opacity-50" />
                          <p className="text-gray-400">No applications yet. Browse opportunities to get started!</p>
                          <Button
                            onClick={() => navigate("/nexus")}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Browse Opportunities
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {applications.slice(0, 5).map((app: any) => (
                            <div key={app.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition">
                              <div className="space-y-1 flex-1">
                                <p className="font-semibold text-white">{app.opportunity?.title}</p>
                                <p className="text-sm text-gray-400">{app.opportunity?.category}</p>
                              </div>
                              <Badge variant={
                                app.status === "accepted" ? "default" :
                                app.status === "rejected" ? "destructive" :
                                "secondary"
                              }>
                                {app.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* CTA Section */}
                  <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/40">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-bold text-white">Maximize Your Earnings</h3>
                          <p className="text-gray-300">Complete your profile and start bidding on opportunities</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button
                            onClick={() => navigate("/ethos")}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-base"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Upload Track to ETHOS
                          </Button>
                          <Button
                            onClick={() => navigate("/nexus")}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-12 text-base"
                          >
                            <Briefcase className="h-4 w-4 mr-2" />
                            Browse Job Board
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Applications Tab */}
                <TabsContent value="applications" className="space-y-4 animate-fade-in">
                  <ApplicationsWidget
                    applications={applications.map((a: any) => ({
                      id: a.id,
                      opportunity: a.opportunity,
                      status: a.status || "submitted",
                      proposed_rate: a.proposed_rate,
                      proposed_rate_type: a.proposed_rate_type || "hourly",
                      cover_letter: a.cover_letter,
                      created_at: a.created_at,
                    }))}
                    title="My Job Applications"
                    description="Track all your bids and applications"
                    accentColor="purple"
                    onViewDetails={(app) => {
                      if (app.opportunity?.id) {
                        navigate(`/opportunities/${app.opportunity.id}`);
                      }
                    }}
                    showCTA={applications.length < 5}
                    ctaText="Browse More Opportunities"
                    onCTA={() => navigate("/nexus")}
                  />
                </TabsContent>

                {/* Contracts Tab */}
                <TabsContent value="contracts" className="space-y-4 animate-fade-in">
                  <ContractsWidget
                    contracts={contracts.map((c: any) => ({
                      id: c.id,
                      title: c.title || "Untitled Contract",
                      client_name: c.client?.full_name || "Client",
                      status: c.status || "active",
                      total_amount: c.total_amount || 0,
                      paid_amount: c.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0,
                      start_date: c.start_date,
                      end_date: c.end_date,
                      description: c.description,
                      milestones: c.milestones || [],
                    }))}
                    title="My Active Contracts"
                    description="Manage your ongoing work and track payments"
                    type="creator"
                    accentColor="purple"
                  />
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6 animate-fade-in">
                  <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                    <CardHeader>
                      <CardTitle>Your NEXUS Profile</CardTitle>
                      <CardDescription>Your marketplace identity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-300">Headline</label>
                          <input
                            type="text"
                            value={creatorProfile?.headline || ""}
                            placeholder="E.g., Senior Game Developer | Unreal Engine Specialist"
                            className="w-full px-4 py-2 bg-black/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-500"
                            disabled
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-300">Experience Level</label>
                          <select
                            value={creatorProfile?.experience_level || "intermediate"}
                            className="w-full px-4 py-2 bg-black/30 border border-purple-500/20 rounded-lg text-white disabled:opacity-50"
                            disabled
                          >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                            <option>Expert</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-300">Hourly Rate</label>
                          <input
                            type="number"
                            value={creatorProfile?.hourly_rate || ""}
                            placeholder="$50"
                            className="w-full px-4 py-2 bg-black/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 disabled:opacity-50"
                            disabled
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-300">Availability</label>
                          <select
                            value={creatorProfile?.availability_status || "available"}
                            className="w-full px-4 py-2 bg-black/30 border border-purple-500/20 rounded-lg text-white disabled:opacity-50"
                            disabled
                          >
                            <option>Available</option>
                            <option>Busy</option>
                            <option>Unavailable</option>
                          </select>
                        </div>
                      </div>

                      {/* Verification Status */}
                      {creatorProfile?.verified && (
                        <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-200">Profile Verified ✓</span>
                        </div>
                      )}

                      <p className="text-sm text-gray-400">
                        To edit your profile, go to Dashboard → Profile Settings
                      </p>
                    </CardContent>
                  </Card>

                  {/* Payout Setup */}
                  <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                    <CardHeader>
                      <CardTitle>Payout Information</CardTitle>
                      <CardDescription>Manage how you receive payments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Connect Stripe Account
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                      <p className="text-sm text-gray-400">
                        Connect your Stripe account to receive payouts for completed contracts
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}

          {/* Client View */}
          {viewMode === "client" && (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-blue-950/30 border border-blue-500/20 p-1">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                  <TabsTrigger value="applicants">Applicants</TabsTrigger>
                  <TabsTrigger value="contracts">Contracts</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat: Open Opportunities */}
                    <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                      <CardContent className="p-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Open Opportunities</p>
                          <Briefcase className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">{openOpportunities}</p>
                      </CardContent>
                    </Card>

                    {/* Stat: Total Applicants */}
                    <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                      <CardContent className="p-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Total Applicants</p>
                          <Users className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">{applicants.length}</p>
                      </CardContent>
                    </Card>

                    {/* Stat: Active Contracts */}
                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardContent className="p-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Active Contracts</p>
                          <FileText className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">{contracts.filter(c => c.status === "active").length}</p>
                      </CardContent>
                    </Card>

                    {/* Stat: Total Spent */}
                    <Card className="bg-gradient-to-br from-orange-950/40 to-orange-900/20 border-orange-500/20">
                      <CardContent className="p-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Total Spent</p>
                          <DollarSign className="h-5 w-5 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">
                          ${(paymentHistory.reduce((acc, p) => acc + (p.amount || 0), 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                      <CardContent className="p-4 text-center space-y-2">
                        <p className="text-sm text-gray-400">Reviewing</p>
                        <p className="text-2xl font-bold text-blue-400">{applicantStats.applied}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                      <CardContent className="p-4 text-center space-y-2">
                        <p className="text-sm text-gray-400">Interviewing</p>
                        <p className="text-2xl font-bold text-purple-400">{applicantStats.interviewing}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardContent className="p-4 text-center space-y-2">
                        <p className="text-sm text-gray-400">Hired</p>
                        <p className="text-2xl font-bold text-green-400">{applicantStats.hired}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* CTA Section */}
                  <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/40">
                    <CardContent className="p-8 text-center space-y-4">
                      <h3 className="text-2xl font-bold text-white">Hire Top Talent</h3>
                      <p className="text-gray-300 max-w-md mx-auto">
                        Post opportunities and find the perfect creators for your projects
                      </p>
                      <Button
                        onClick={() => navigate("/opportunities/post")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
                      >
                        Post New Opportunity
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Opportunities Tab */}
                <TabsContent value="opportunities" className="space-y-4 animate-fade-in">
                  <PostedOpportunitiesWidget
                    opportunities={postedOpportunities.map((o: any) => ({
                      id: o.id,
                      title: o.title,
                      description: o.description,
                      category: o.category,
                      budget: o.budget,
                      status: o.status || "open",
                      applications_count: o.applications_count,
                      created_at: o.created_at,
                      deadline: o.deadline,
                      required_skills: o.required_skills,
                      experience_level: o.experience_level,
                    }))}
                    title="My Posted Opportunities"
                    description="Manage your job postings and track applications"
                    accentColor="blue"
                    onViewApplications={(oppId) => {
                      navigate(`/opportunities/${oppId}/applications`);
                    }}
                    onViewDetails={(oppId) => {
                      navigate(`/opportunities/${oppId}`);
                    }}
                    onEdit={(oppId) => {
                      navigate(`/opportunities/${oppId}/edit`);
                    }}
                  />

                  {postedOpportunities.length === 0 && (
                    <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/40">
                      <CardContent className="p-8 text-center space-y-4">
                        <h3 className="text-2xl font-bold text-white">Start Hiring Talent</h3>
                        <p className="text-gray-300">Post opportunities and find the perfect creators for your projects</p>
                        <Button
                          onClick={() => navigate("/opportunities/post")}
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        >
                          Post an Opportunity
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Applicants Tab - Kanban Style */}
                <TabsContent value="applicants" className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Applied Column */}
                    <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Applied ({applicantStats.applied})</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {applicants.filter(a => a.status === "applied").length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-4">No applicants</p>
                        ) : (
                          applicants.filter(a => a.status === "applied").map((app: any) => (
                            <div key={app.id} className="p-3 bg-black/30 rounded-lg border border-blue-500/20 cursor-move hover:border-blue-500/40 transition">
                              <p className="font-semibold text-white text-sm">{app.user?.name}</p>
                              <p className="text-xs text-gray-400 mt-1">{app.opportunity?.title}</p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    {/* Interviewing Column */}
                    <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Interviewing ({applicantStats.interviewing})</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {applicants.filter(a => a.status === "interviewing").length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-4">No applicants</p>
                        ) : (
                          applicants.filter(a => a.status === "interviewing").map((app: any) => (
                            <div key={app.id} className="p-3 bg-black/30 rounded-lg border border-purple-500/20 cursor-move hover:border-purple-500/40 transition">
                              <p className="font-semibold text-white text-sm">{app.user?.name}</p>
                              <p className="text-xs text-gray-400 mt-1">{app.opportunity?.title}</p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    {/* Hired Column */}
                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Hired ({applicantStats.hired})</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {applicants.filter(a => a.status === "hired").length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-4">No applicants</p>
                        ) : (
                          applicants.filter(a => a.status === "hired").map((app: any) => (
                            <div key={app.id} className="p-3 bg-black/30 rounded-lg border border-green-500/20 cursor-move hover:border-green-500/40 transition">
                              <p className="font-semibold text-white text-sm">{app.user?.name}</p>
                              <p className="text-xs text-gray-400 mt-1">{app.opportunity?.title}</p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Contracts Tab */}
                <TabsContent value="contracts" className="space-y-4 animate-fade-in">
                  <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                    <CardHeader>
                      <CardTitle>My Active Contracts & Payment History</CardTitle>
                      <CardDescription>Track your active work and payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {contracts.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
                          <p className="text-gray-400">No contracts yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {contracts.map((contract: any) => (
                            <div key={contract.id} className="p-4 bg-black/30 rounded-lg border border-blue-500/10 space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h4 className="font-semibold text-white">{contract.title}</h4>
                                  <p className="text-sm text-gray-400">with {contract.creator?.name}</p>
                                </div>
                                <Badge className="bg-blue-600/50 text-blue-100">{contract.status}</Badge>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-400">Total Value</p>
                                  <p className="font-semibold text-white">${contract.total_amount?.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Paid</p>
                                  <p className="font-semibold text-green-400">${(contract.paid_amount || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Remaining</p>
                                  <p className="font-semibold text-orange-400">${((contract.total_amount || 0) - (contract.paid_amount || 0)).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Payment History */}
                  {paymentHistory.length > 0 && (
                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                        <CardDescription>Recent payments made</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {paymentHistory.map((payment: any) => (
                            <div key={payment.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-green-500/10">
                              <div className="space-y-1">
                                <p className="font-semibold text-white text-sm">{payment.description}</p>
                                <p className="text-xs text-gray-400">{new Date(payment.created_at).toLocaleDateString()}</p>
                              </div>
                              <p className="font-semibold text-green-400">${payment.amount?.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
