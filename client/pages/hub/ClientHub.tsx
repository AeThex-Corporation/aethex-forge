import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
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
import {
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Clock,
  ArrowRight,
  MessageSquare,
  Phone,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function ClientHub() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = (await (window as any).supabaseClient.auth.getSession()).data?.session?.access_token;
      if (!token) throw new Error("No auth token");

      // Load opportunities
      const oppRes = await fetch(`${API_BASE}/api/nexus/client/opportunities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (oppRes.ok) {
        const data = await oppRes.json();
        setOpportunities(data.opportunities || []);
      }

      // Load contracts
      const contractRes = await fetch(`${API_BASE}/api/nexus/client/contracts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (contractRes.ok) {
        const data = await contractRes.json();
        setContracts(data.contracts || []);
      }
    } catch (error: any) {
      console.error("Failed to load hub data", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading Client Hub..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/30 to-black flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Client Hub
            </h1>
            <p className="text-gray-400">Enterprise collaboration & hiring</p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const openOpportunities = opportunities.filter((o: any) => o.status === "open");
  const totalSpent = contracts.reduce((sum: number, c: any) => sum + (c.total_amount || 0), 0);
  const activeContracts = contracts.filter((c: any) => c.status === "active");
  const pendingApplications = openOpportunities.reduce((sum: number, o: any) => sum + (o.application_count || 0), 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-slide-down">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Client Hub
                </h1>
                <p className="text-gray-400 text-lg">
                  Enterprise hiring & project management
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate("/nexus/post")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Post Opportunity
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Open Opportunities</p>
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-white">{openOpportunities.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Applications</p>
                    <Users className="h-5 w-5 text-cyan-500" />
                  </div>
                  <p className="text-3xl font-bold text-white">{pendingApplications}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-950/40 to-teal-900/20 border-teal-500/20">
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Active Contracts</p>
                    <CheckCircle className="h-5 w-5 text-teal-500" />
                  </div>
                  <p className="text-3xl font-bold text-white">{activeContracts.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Total Spent</p>
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-white">
                    ${totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-blue-950/30 border border-blue-500/20 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              {/* Account Manager Card */}
              <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Your AeThex Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Account Manager */}
                    <div className="p-4 bg-black/30 rounded-lg border border-blue-500/10">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Account Manager</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">AC</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Account Manager</p>
                          <p className="text-xs text-gray-400">account@aethex.dev</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3 border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>

                    {/* Solutions Architect */}
                    <div className="p-4 bg-black/30 rounded-lg border border-blue-500/10">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Solutions Architect</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">SA</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Solutions Architect</p>
                          <p className="text-xs text-gray-400">architect@aethex.dev</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Schedule Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Opportunities */}
                <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                  <CardHeader>
                    <CardTitle>Recent Opportunities</CardTitle>
                    <CardDescription>Latest job postings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {openOpportunities.length === 0 ? (
                      <div className="text-center py-8 space-y-4">
                        <AlertCircle className="h-12 w-12 mx-auto text-gray-500 opacity-50" />
                        <p className="text-gray-400">No opportunities posted yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {openOpportunities.slice(0, 3).map((opp: any) => (
                          <div key={opp.id} className="p-3 bg-black/30 rounded-lg border border-blue-500/10 hover:border-blue-500/30 transition">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="font-semibold text-white text-sm">{opp.title}</p>
                              <Badge variant="outline" className="text-xs">{opp.status}</Badge>
                            </div>
                            <p className="text-xs text-gray-400">{opp.application_count} applications</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Contracts */}
                <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle>Active Contracts</CardTitle>
                    <CardDescription>Your current projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {contracts.length === 0 ? (
                      <div className="text-center py-8 space-y-4">
                        <AlertCircle className="h-12 w-12 mx-auto text-gray-500 opacity-50" />
                        <p className="text-gray-400">No active contracts</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {contracts.slice(0, 3).map((contract: any) => (
                          <div key={contract.id} className="p-3 bg-black/30 rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="font-semibold text-white text-sm">{contract.title}</p>
                              <Badge className="text-xs bg-green-600/50 text-green-100">{contract.status}</Badge>
                            </div>
                            <p className="text-xs text-gray-400">${contract.total_amount?.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Opportunities</CardTitle>
                      <CardDescription>Job postings and projects</CardDescription>
                    </div>
                    <Button
                      onClick={() => navigate("/nexus/post")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      Post New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {opportunities.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <FileText className="h-12 w-12 mx-auto text-gray-500 opacity-50" />
                      <p className="text-gray-400">No opportunities posted yet</p>
                      <Button onClick={() => navigate("/nexus/post")}>
                        Post First Opportunity
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {opportunities.map((opp: any) => (
                        <div key={opp.id} className="p-4 bg-black/30 rounded-lg border border-blue-500/10 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{opp.title}</h4>
                              <p className="text-sm text-gray-400">{opp.description?.substring(0, 100)}...</p>
                            </div>
                            <Badge>{opp.status}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">${opp.budget_min?.toLocaleString()} - ${opp.budget_max?.toLocaleString()}</span>
                            <span className="text-gray-500">{opp.application_count} applications</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                <CardHeader>
                  <CardTitle>Contracts & Invoices</CardTitle>
                  <CardDescription>Payment history and status</CardDescription>
                </CardHeader>
                <CardContent>
                  {contracts.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
                      <p className="text-gray-400">No contracts yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contracts.map((contract: any) => (
                        <div key={contract.id} className="p-4 bg-black/30 rounded-lg border border-cyan-500/10 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{contract.title}</h4>
                              <p className="text-sm text-gray-400">Contract Type: {contract.contract_type}</p>
                            </div>
                            <Badge className="bg-green-600/50 text-green-100">{contract.status}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className="text-gray-400">Total Amount</p>
                              <p className="font-semibold text-white">${contract.total_amount?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Your Cost</p>
                              <p className="font-semibold text-white">${(contract.total_amount - (contract.aethex_commission_amount || 0))?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Creator Payout</p>
                              <p className="font-semibold text-white">${contract.creator_payout_amount?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                <CardHeader>
                  <CardTitle>Support & Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-500/30 text-blue-300 hover:bg-blue-500/10 h-auto py-3"
                  >
                    <MessageSquare className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Chat Support</div>
                      <div className="text-xs text-gray-400">Talk to our support team</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-500/30 text-blue-300 hover:bg-blue-500/10 h-auto py-3"
                  >
                    <Phone className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Schedule a Call</div>
                      <div className="text-xs text-gray-400">Book time with your account manager</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-500/30 text-blue-300 hover:bg-blue-500/10 h-auto py-3"
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Documentation</div>
                      <div className="text-xs text-gray-400">Learn how to use the platform</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Request New SOW */}
              <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/30">
                <CardHeader>
                  <CardTitle>Request New Scope</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Need a new Statement of Work (SOW) or to modify an existing contract? Contact your account manager.
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                  >
                    Request New SOW
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
