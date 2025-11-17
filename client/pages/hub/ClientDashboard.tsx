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
import { Progress } from "@/components/ui/progress";
import LoadingScreen from "@/components/LoadingScreen";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Github,
  ExternalLink,
} from "lucide-react";

const getApiBase = () =>
  typeof window !== "undefined" ? window.location.origin : "";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in-progress" | "in-review" | "completed";
  progress: number;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  team_lead: string;
}

interface Contract {
  id: string;
  title: string;
  client: string;
  amount: number;
  status: "draft" | "active" | "completed" | "archived";
  start_date: string;
  end_date: string;
  milestones: any[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: "active" | "inactive";
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  issued_date: string;
  due_date: string;
  client: string;
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    } else if (!authLoading && !user) {
      setLoading(false);
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

      const apiBase = getApiBase();

      // Load projects
      try {
        const projectRes = await fetch(
          `${apiBase}/api/corp/projects?limit=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (projectRes.ok) {
          const data = await projectRes.json();
          setProjects(Array.isArray(data) ? data : data.projects || []);
        }
      } catch {
        // Silently ignore
      }

      // Load contracts
      try {
        const contractRes = await fetch(
          `${apiBase}/api/corp/contracts?limit=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (contractRes.ok) {
          const data = await contractRes.json();
          setContracts(Array.isArray(data) ? data : data.contracts || []);
        }
      } catch {
        // Silently ignore
      }

      // Load invoices
      try {
        const invoiceRes = await fetch(
          `${apiBase}/api/corp/invoices/list?limit=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (invoiceRes.ok) {
          const data = await invoiceRes.json();
          setInvoices(Array.isArray(data) ? data : data.invoices || []);
        }
      } catch {
        // Silently ignore
      }

      // Load team
      try {
        const teamRes = await fetch(`${apiBase}/api/corp/team?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (teamRes.ok) {
          const data = await teamRes.json();
          setTeamMembers(Array.isArray(data) ? data : data.team || []);
        }
      } catch {
        // Silently ignore
      }
    } catch (error) {
      aethexToast({
        message: "Failed to load dashboard data",
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
              CORP Dashboard
            </h1>
            <p className="text-gray-400">
              Enterprise services & project management
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

  const totalProjectValue = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const activeProjects = projects.filter(
    (p) => p.status === "in-progress",
  ).length;
  const overdueInvoices = invoices.filter((i) => i.status === "overdue").length;
  const totalRevenue = invoices.reduce((acc, i) => acc + i.amount, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-slide-down">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/hub/client")}
              className="mb-2 text-gray-400"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Portal
            </Button>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Manage projects, contracts, team, and invoicing
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Project Value</p>
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  ${(totalProjectValue / 1000).toFixed(0)}k
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Active Projects</p>
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {activeProjects}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Total Revenue</p>
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  ${(totalRevenue / 1000).toFixed(0)}k
                </p>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br ${
                overdueInvoices > 0
                  ? "from-red-950/40 to-red-900/20 border-red-500/20"
                  : "from-gray-950/40 to-gray-900/20 border-gray-500/20"
              }`}
            >
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Overdue Invoices</p>
                  <AlertCircle
                    className={`h-5 w-5 ${
                      overdueInvoices > 0 ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                </div>
                <p className="text-3xl font-bold text-white">
                  {overdueInvoices}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-blue-950/30 border border-blue-500/20 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              {/* Active Projects */}
              {projects.filter((p) => p.status === "in-progress").length >
                0 && (
                <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                  <CardHeader>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Currently in development</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projects
                      .filter((p) => p.status === "in-progress")
                      .slice(0, 3)
                      .map((project) => (
                        <div
                          key={project.id}
                          className="p-4 bg-black/30 rounded-lg border border-blue-500/10 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">
                                {project.name}
                              </h4>
                              <p className="text-sm text-gray-400 mt-1">
                                {project.description}
                              </p>
                            </div>
                            <Badge className="bg-blue-600/50 text-blue-100 shrink-0">
                              {project.progress}%
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-blue-300">
                                ${project.spent.toLocaleString()} / $
                                {project.budget.toLocaleString()}
                              </span>
                            </div>
                            <Progress
                              value={project.progress}
                              className="h-2"
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              Due:{" "}
                              {new Date(project.end_date).toLocaleDateString()}
                            </span>
                            <span>Lead: {project.team_lead}</span>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {/* Recent Invoices */}
              {invoices.length > 0 && (
                <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                  <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>Latest billing activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-green-500/10"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-white text-sm">
                            Invoice {invoice.number}
                          </p>
                          <p className="text-xs text-gray-400">
                            {invoice.client} •{" "}
                            {new Date(invoice.issued_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-300">
                            ${invoice.amount.toLocaleString()}
                          </p>
                          <Badge
                            className={
                              invoice.status === "paid"
                                ? "bg-green-600/50 text-green-100 text-xs"
                                : invoice.status === "overdue"
                                  ? "bg-red-600/50 text-red-100 text-xs"
                                  : "bg-yellow-600/50 text-yellow-100 text-xs"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Team Summary */}
              {teamMembers.length > 0 && (
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      {teamMembers.length} active team members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {teamMembers.slice(0, 6).map((member) => (
                        <div
                          key={member.id}
                          className="p-3 bg-black/30 rounded-lg border border-purple-500/10"
                        >
                          <p className="font-semibold text-white text-sm">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-400">{member.role}</p>
                          <Badge
                            className={
                              member.status === "active"
                                ? "bg-green-600/50 text-green-100 text-xs mt-2"
                                : "bg-gray-600/50 text-gray-100 text-xs mt-2"
                            }
                          >
                            {member.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4 animate-fade-in">
              {projects.length === 0 ? (
                <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                  <CardContent className="p-12 text-center space-y-4">
                    <FileText className="h-12 w-12 mx-auto text-blue-500 opacity-50" />
                    <p className="text-gray-400">No projects yet</p>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      Create New Project
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20 hover:border-blue-500/40 transition"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">
                              {project.name}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {project.description}
                            </p>
                          </div>
                          <Badge className="capitalize shrink-0">
                            {project.status.replace("-", " ")}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase">
                              Budget
                            </p>
                            <p className="font-semibold text-white">
                              ${(project.budget / 1000).toFixed(0)}k
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase">
                              Spent
                            </p>
                            <p className="font-semibold text-white">
                              ${(project.spent / 1000).toFixed(0)}k
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase">
                              Progress
                            </p>
                            <p className="font-semibold text-white">
                              {project.progress}%
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase">
                              Due
                            </p>
                            <p className="font-semibold text-white">
                              {new Date(project.end_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <Progress
                          value={project.progress}
                          className="h-2 mb-4"
                        />

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                        >
                          View Details <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent
              value="contracts"
              className="space-y-4 animate-fade-in"
            >
              {contracts.length === 0 ? (
                <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                  <CardContent className="p-12 text-center space-y-4">
                    <FileText className="h-12 w-12 mx-auto text-blue-500 opacity-50" />
                    <p className="text-gray-400">No contracts yet</p>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      Create New Contract
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {contracts.map((contract) => (
                    <Card
                      key={contract.id}
                      className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20 hover:border-blue-500/40 transition"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">
                              {contract.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              Client: {contract.client}
                            </p>
                          </div>
                          <Badge className="capitalize shrink-0">
                            {contract.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase">
                              Amount
                            </p>
                            <p className="font-semibold text-white">
                              ${contract.amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase">
                              Start
                            </p>
                            <p className="text-sm text-white">
                              {new Date(
                                contract.start_date,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase">
                              End
                            </p>
                            <p className="text-sm text-white">
                              {new Date(contract.end_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                        >
                          View Contract <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices" className="space-y-4 animate-fade-in">
              {invoices.length === 0 ? (
                <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                  <CardContent className="p-12 text-center space-y-4">
                    <DollarSign className="h-12 w-12 mx-auto text-green-500 opacity-50" />
                    <p className="text-gray-400">No invoices yet</p>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      Create Invoice
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <Card
                      key={invoice.id}
                      className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20 hover:border-green-500/40 transition"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-white">
                                Invoice {invoice.number}
                              </h3>
                              <Badge
                                className={
                                  invoice.status === "paid"
                                    ? "bg-green-600/50 text-green-100"
                                    : invoice.status === "overdue"
                                      ? "bg-red-600/50 text-red-100"
                                      : "bg-yellow-600/50 text-yellow-100"
                                }
                              >
                                {invoice.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">
                              {invoice.client}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-300">
                              ${invoice.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Due:{" "}
                              {new Date(invoice.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/40">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Need Help Managing Your Projects?
              </h3>
              <p className="text-gray-300 max-w-md mx-auto">
                Contact our CORP team for consultation, dedicated support, or
                custom development services
              </p>
              <Button
                onClick={() => navigate("/corp/contact-us")}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-12 px-8 text-base"
              >
                Get Support <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
