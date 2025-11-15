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
import ProjectStatusWidget from "@/components/ProjectStatusWidget";
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
  Briefcase,
  ArrowDown,
  MapPin,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function ClientHub() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [contracts, setContracts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      // Load contracts for milestone tracking
      const contractRes = await fetch(
        `${API_BASE}/api/corp/contracts?limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (contractRes.ok) {
        const data = await contractRes.json();
        setContracts(Array.isArray(data) ? data : data.contracts || []);
      }

      // Load invoices
      const invoiceRes = await fetch(`${API_BASE}/api/corp/invoices?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (invoiceRes.ok) {
        const data = await invoiceRes.json();
        setInvoices(Array.isArray(data) ? data : data.invoices || []);
      }

      // Load team members (Account Manager, Solutions Architect)
      const teamRes = await fetch(`${API_BASE}/api/corp/team`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (teamRes.ok) {
        const data = await teamRes.json();
        setTeamMembers(Array.isArray(data) ? data : data.team || []);
      }
    } catch (error: any) {
      console.error("Failed to load CORP dashboard data", error);
      aethexToast({
        message: "Failed to load some dashboard data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading CORP Dashboard..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/30 to-black flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              CORP Client Portal
            </h1>
            <p className="text-gray-400">
              Enterprise solutions for your business
            </p>
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

  const activeContract = contracts.find((c) => c.status === "active");
  const completedMilestones =
    activeContract?.milestones?.filter((m: any) => m.status === "completed")
      .length || 0;
  const totalMilestones = activeContract?.milestones?.length || 0;
  const outstandingInvoices = invoices.filter(
    (i: any) => i.status === "pending" || i.status === "overdue",
  ).length;
  const totalInvoiceValue = invoices.reduce(
    (acc, inv) => acc + (inv.amount || 0),
    0,
  );
  const accountManager = teamMembers.find((t) => t.role === "account_manager");
  const solutionsArchitect = teamMembers.find(
    (t) => t.role === "solutions_architect",
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-slide-down">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  CORP Client Portal
                </h1>
                <p className="text-gray-400 text-lg">
                  Enterprise solutions, project status, and billing management
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Active Projects
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {contracts.filter((c) => c.status === "active").length}
                      </p>
                    </div>
                    <Briefcase className="h-6 w-6 text-blue-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Total Invoices
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        ${(totalInvoiceValue / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <DollarSign className="h-6 w-6 text-cyan-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`bg-gradient-to-br ${outstandingInvoices > 0 ? "from-orange-950/40 to-orange-900/20 border-orange-500/20" : "from-green-950/40 to-green-900/20 border-green-500/20"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Outstanding
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {outstandingInvoices}
                      </p>
                    </div>
                    <FileText
                      className="h-6 w-6"
                      style={{
                        color: outstandingInvoices > 0 ? "#f97316" : "#22c55e",
                        opacity: 0.5,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Team Members
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {teamMembers.length}
                      </p>
                    </div>
                    <Users className="h-6 w-6 text-purple-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-blue-950/30 border border-blue-500/20 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="project">Project Status</TabsTrigger>
              <TabsTrigger value="invoices">Invoices & Billing</TabsTrigger>
              <TabsTrigger value="team">My AeThex Team</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              {/* QuantumLeap Dashboard */}
              <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                <CardHeader>
                  <CardTitle>My QuantumLeap Dashboard</CardTitle>
                  <CardDescription>
                    Live AI analytics and insights for your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black/50 rounded-lg border border-blue-500/20 flex items-center justify-center">
                    <iframe
                      src="https://quantumleap.aethex.dev/embed"
                      className="w-full h-full rounded-lg border-0"
                      title="QuantumLeap Analytics"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    Embedded QuantumLeap analytics dashboard. Real-time data
                    about your project performance.
                  </p>
                </CardContent>
              </Card>

              {/* Active Contract Overview */}
              {activeContract ? (
                <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle>Project: {activeContract.title}</CardTitle>
                    <CardDescription>Main engagement overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase">
                          Total Value
                        </p>
                        <p className="text-2xl font-bold text-white">
                          ${(activeContract.total_value / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase">
                          Status
                        </p>
                        <Badge className="bg-blue-600/50 text-blue-100">
                          {activeContract.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase">
                          Completion
                        </p>
                        <p className="text-2xl font-bold text-cyan-400">
                          {Math.round(
                            (completedMilestones / totalMilestones) * 100,
                          )}
                          %
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Milestone Progress</span>
                        <span>
                          {completedMilestones} of {totalMilestones}
                        </span>
                      </div>
                      <div className="w-full bg-black/50 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full"
                          style={{
                            width: `${(completedMilestones / totalMilestones) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setActiveTab("project")}
                        variant="outline"
                        className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                      >
                        View Full Timeline
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                  <CardContent className="p-8 text-center space-y-4">
                    <Briefcase className="h-12 w-12 mx-auto text-blue-500 opacity-50" />
                    <p className="text-gray-400">
                      No active projects at this time
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Invoices */}
              <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>
                    Your latest billing activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {invoices.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
                      <p className="text-gray-400">No invoices yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {invoices.slice(0, 5).map((invoice: any) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/10"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm">
                              {invoice.invoice_number}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(
                                invoice.created_at,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white">
                              ${invoice.amount?.toLocaleString()}
                            </p>
                            <Badge
                              variant="outline"
                              className={
                                invoice.status === "paid"
                                  ? "bg-green-500/20 border-green-500/30 text-green-300"
                                  : invoice.status === "overdue"
                                    ? "bg-red-500/20 border-red-500/30 text-red-300"
                                    : ""
                              }
                            >
                              {invoice.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Status Tab - Gantt Style */}
            <TabsContent value="project" className="space-y-4 animate-fade-in">
              <ProjectStatusWidget
                project={
                  activeContract
                    ? {
                        id: activeContract.id,
                        title: activeContract.title,
                        description: activeContract.description,
                        status: activeContract.status || "active",
                        start_date: activeContract.start_date,
                        end_date: activeContract.end_date,
                        total_value: activeContract.total_value,
                        milestones: activeContract.milestones || [],
                      }
                    : null
                }
                accentColor="cyan"
              />
            </TabsContent>

            {/* Invoices & Billing Tab */}
            <TabsContent value="invoices" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                <CardHeader>
                  <CardTitle>Invoices & Billing</CardTitle>
                  <CardDescription>
                    Secure portal to manage all invoices and payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Billing Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-black/30 rounded-lg border border-cyan-500/20 space-y-1">
                      <p className="text-xs text-gray-400 uppercase">
                        Total Invoices
                      </p>
                      <p className="text-3xl font-bold text-white">
                        ${(totalInvoiceValue / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg border border-green-500/20 space-y-1">
                      <p className="text-xs text-gray-400 uppercase">Paid</p>
                      <p className="text-3xl font-bold text-green-400">
                        $
                        {(
                          invoices
                            .filter((i) => i.status === "paid")
                            .reduce((acc, i) => acc + (i.amount || 0), 0) / 1000
                        ).toFixed(0)}
                        k
                      </p>
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg border border-orange-500/20 space-y-1">
                      <p className="text-xs text-gray-400 uppercase">
                        Outstanding
                      </p>
                      <p className="text-3xl font-bold text-orange-400">
                        $
                        {(
                          invoices
                            .filter((i) => i.status !== "paid")
                            .reduce((acc, i) => acc + (i.amount || 0), 0) / 1000
                        ).toFixed(0)}
                        k
                      </p>
                    </div>
                  </div>

                  {/* Invoices List */}
                  {invoices.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
                      <p className="text-gray-400">No invoices to display</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {invoices.map((invoice: any) => (
                        <div
                          key={invoice.id}
                          className="p-4 bg-black/30 rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">
                                {invoice.invoice_number}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {invoice.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-white">
                                ${invoice.amount?.toLocaleString()}
                              </p>
                              <Badge
                                className={
                                  invoice.status === "paid"
                                    ? "bg-green-500/20 border-green-500/30 text-green-300"
                                    : invoice.status === "overdue"
                                      ? "bg-red-500/20 border-red-500/30 text-red-300"
                                      : "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
                                }
                              >
                                {invoice.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                            <div>
                              <span>Issued:</span>
                              <p className="text-white font-semibold">
                                {new Date(
                                  invoice.issued_date,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span>Due:</span>
                              <p className="text-white font-semibold">
                                {new Date(
                                  invoice.due_date,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {invoice.status !== "paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                            >
                              Pay Now
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* My AeThex Team Tab */}
            <TabsContent value="team" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle>Your Dedicated AeThex Team</CardTitle>
                  <CardDescription>
                    White-glove service with personalized support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Account Manager */}
                    {accountManager ? (
                      <div className="p-6 bg-black/30 rounded-lg border border-blue-500/20 space-y-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={
                              accountManager.avatar_url ||
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                            }
                            alt={accountManager.full_name}
                            className="w-16 h-16 rounded-full border-2 border-blue-500/40 object-cover"
                          />
                          <div className="flex-1">
                            <Badge className="bg-blue-600/50 text-blue-100 mb-2">
                              Account Manager
                            </Badge>
                            <h3 className="text-lg font-semibold text-white">
                              {accountManager.full_name}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">
                              {accountManager.title}
                            </p>
                            <p className="text-sm text-gray-300 mb-4">
                              {accountManager.bio}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </Button>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Book Meeting
                              </Button>
                            </div>
                          </div>
                        </div>
                        {accountManager.contact_info && (
                          <div className="pt-4 border-t border-blue-500/20 space-y-2 text-sm">
                            <p className="text-gray-400">
                              <span className="font-semibold">Email:</span>{" "}
                              {accountManager.contact_info.email}
                            </p>
                            {accountManager.contact_info.phone && (
                              <p className="text-gray-400">
                                <span className="font-semibold">Phone:</span>{" "}
                                {accountManager.contact_info.phone}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 bg-black/30 rounded-lg border border-blue-500/20 text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-blue-500 opacity-50 mb-4" />
                        <p className="text-gray-400">Account Manager TBA</p>
                      </div>
                    )}

                    {/* Solutions Architect */}
                    {solutionsArchitect ? (
                      <div className="p-6 bg-black/30 rounded-lg border border-purple-500/20 space-y-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={
                              solutionsArchitect.avatar_url ||
                              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                            }
                            alt={solutionsArchitect.full_name}
                            className="w-16 h-16 rounded-full border-2 border-purple-500/40 object-cover"
                          />
                          <div className="flex-1">
                            <Badge className="bg-purple-600/50 text-purple-100 mb-2">
                              Solutions Architect
                            </Badge>
                            <h3 className="text-lg font-semibold text-white">
                              {solutionsArchitect.full_name}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">
                              {solutionsArchitect.title}
                            </p>
                            <p className="text-sm text-gray-300 mb-4">
                              {solutionsArchitect.bio}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </Button>
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Book Meeting
                              </Button>
                            </div>
                          </div>
                        </div>
                        {solutionsArchitect.contact_info && (
                          <div className="pt-4 border-t border-purple-500/20 space-y-2 text-sm">
                            <p className="text-gray-400">
                              <span className="font-semibold">Email:</span>{" "}
                              {solutionsArchitect.contact_info.email}
                            </p>
                            {solutionsArchitect.contact_info.phone && (
                              <p className="text-gray-400">
                                <span className="font-semibold">Phone:</span>{" "}
                                {solutionsArchitect.contact_info.phone}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 bg-black/30 rounded-lg border border-purple-500/20 text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-purple-500 opacity-50 mb-4" />
                        <p className="text-gray-400">Solutions Architect TBA</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Support Card */}
              <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                <CardHeader>
                  <CardTitle>Need Support?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Open Support Ticket
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Support Call
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
