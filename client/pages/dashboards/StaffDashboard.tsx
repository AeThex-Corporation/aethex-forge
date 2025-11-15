import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useArmTheme } from "@/contexts/ArmThemeContext";
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
import {
  Shield,
  Target,
  DollarSign,
  FileText,
  Users,
  Link as LinkIcon,
  Calendar,
  Book,
  AlertCircle,
  Search,
  ExternalLink,
} from "lucide-react";
import { DirectoryWidget } from "@/components/DirectoryWidget";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useArmTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [staffMember, setStaffMember] = useState<any>(null);
  const [okrs, setOkrs] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [directory, setDirectory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

      try {
        const memberRes = await fetch(`${API_BASE}/api/staff/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          memberRes.ok &&
          memberRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await memberRes.json();
          setStaffMember(data);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const okrRes = await fetch(`${API_BASE}/api/staff/okrs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          okrRes.ok &&
          okrRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await okrRes.json();
          setOkrs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const invRes = await fetch(`${API_BASE}/api/staff/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          invRes.ok &&
          invRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await invRes.json();
          setInvoices(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const dirRes = await fetch(`${API_BASE}/api/staff/directory`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          dirRes.ok &&
          dirRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await dirRes.json();
          setDirectory(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        // Silently ignore API errors
      }
    } catch (error) {
      // Silently ignore errors
    } finally {
      setLoading(false);
    }
  };

  const isEmployee = staffMember?.employment_type === "employee";
  const isContractor = staffMember?.employment_type === "contractor";
  const filteredDirectory = directory.filter(
    (member) =>
      member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (authLoading || loading) {
    return <LoadingScreen message="Loading STAFF Portal..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              STAFF Portal
            </h1>
            <p className="text-gray-400">Employee & Contractor Hub</p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className={`min-h-screen bg-gradient-to-b from-black to-black py-8 ${theme.fontClass}`}
        style={{ backgroundImage: theme.wallpaperPattern }}
      >
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-slide-down">
            <h1
              className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${theme.accentColor} bg-clip-text text-transparent`}
            >
              STAFF Portal
            </h1>
            <p className="text-gray-400 text-lg">
              Employee & Contractor Management | Professional Utility Purple
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className="grid w-full grid-cols-5 bg-purple-950/30 border border-purple-500/20 p-1"
              style={{ fontFamily: theme.fontFamily }}
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {isEmployee && <TabsTrigger value="okrs">OKRs</TabsTrigger>}
              {isEmployee && (
                <TabsTrigger value="benefits">Pay & Benefits</TabsTrigger>
              )}
              {isContractor && (
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
              )}
              <TabsTrigger value="directory">Directory</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-sm text-gray-400">Employment Type</p>
                    <p className="text-2xl font-bold text-white capitalize">
                      {staffMember?.employment_type || "—"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-pink-950/40 to-pink-900/20 border-pink-500/20">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-sm text-gray-400">Department</p>
                    <p className="text-2xl font-bold text-white">
                      {staffMember?.department || "—"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="text-2xl font-bold text-white">
                      {staffMember?.start_date
                        ? new Date(staffMember.start_date).toLocaleDateString()
                        : "—"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Links */}
              <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle style={{ fontFamily: theme.fontFamily }}>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    onClick={() => navigate("/staff/expenses")}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 justify-start"
                    style={{ fontFamily: theme.fontFamily }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    File an Expense (SOP-302)
                  </Button>
                  <Button
                    onClick={() => navigate("/staff/pto")}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 justify-start"
                    style={{ fontFamily: theme.fontFamily }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Request PTO (KND-300)
                  </Button>
                  <Button
                    onClick={() => navigate("/staff/docs")}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 justify-start"
                    style={{ fontFamily: theme.fontFamily }}
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Internal Doc Hub
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* OKRs Tab - Employee Only */}
            {isEmployee && (
              <TabsContent value="okrs" className="space-y-4 animate-fade-in">
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle>My OKRs</CardTitle>
                    <CardDescription>
                      Quarterly Objectives & Key Results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {okrs.length === 0 ? (
                      <div className="text-center py-12">
                        <Target className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
                        <p className="text-gray-400">
                          No OKRs set for this quarter
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {okrs.map((okr: any) => (
                          <div
                            key={okr.id}
                            className="p-4 bg-black/30 rounded-lg border border-purple-500/10 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white">
                                  {okr.objective}
                                </h4>
                                <p className="text-sm text-gray-400 mt-1">
                                  {okr.description}
                                </p>
                              </div>
                              <Badge
                                className={
                                  okr.status === "achieved"
                                    ? "bg-green-600/50 text-green-100"
                                    : "bg-blue-600/50 text-blue-100"
                                }
                              >
                                {okr.status}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {okr.key_results?.map((kr: any) => (
                                <div
                                  key={kr.id}
                                  className="flex items-start gap-3 text-sm"
                                >
                                  <span className="text-purple-400 mt-1">
                                    •
                                  </span>
                                  <div className="flex-1">
                                    <p className="text-white">{kr.title}</p>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                      <span>Progress</span>
                                      <span>{kr.progress}%</span>
                                    </div>
                                    <div className="w-full bg-black/50 rounded-full h-2 mt-1">
                                      <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: `${kr.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Pay & Benefits Tab - Employee Only */}
            {isEmployee && (
              <TabsContent
                value="benefits"
                className="space-y-4 animate-fade-in"
              >
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle>Pay & Benefits</CardTitle>
                    <CardDescription>
                      Payroll and compensation information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-black/30 rounded-lg border border-purple-500/20 space-y-2">
                      <p className="text-sm text-gray-400">Base Salary</p>
                      <p className="text-3xl font-bold text-white">
                        ${staffMember?.salary?.toLocaleString() || "—"}
                      </p>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Rippling (Payroll System)
                    </Button>
                    <p className="text-xs text-gray-400">
                      View your paystubs, tax documents, and benefits in the
                      Rippling employee portal.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Invoices Tab - Contractor Only */}
            {isContractor && (
              <TabsContent
                value="invoices"
                className="space-y-4 animate-fade-in"
              >
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle>My Invoices</CardTitle>
                    <CardDescription>
                      SOP-301: Contractor Invoice Portal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {invoices.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
                        <p className="text-gray-400">No invoices submitted</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {invoices.map((invoice: any) => (
                          <div
                            key={invoice.id}
                            className="p-4 bg-black/30 rounded-lg border border-purple-500/10 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="font-semibold text-white">
                                  {invoice.invoice_number}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(invoice.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-white">
                                  ${invoice.amount?.toLocaleString()}
                                </p>
                                <Badge
                                  className={
                                    invoice.status === "paid"
                                      ? "bg-green-600/50 text-green-100"
                                      : invoice.status === "pending"
                                        ? "bg-yellow-600/50 text-yellow-100"
                                        : "bg-blue-600/50 text-blue-100"
                                  }
                                >
                                  {invoice.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Directory Tab */}
            <TabsContent
              value="directory"
              className="space-y-4 animate-fade-in"
            >
              <DirectoryWidget
                members={directory.map((m: any) => ({
                  id: m.id,
                  name: m.full_name,
                  role: m.role || "Team Member",
                  department: m.department,
                  email: m.email,
                  phone: m.phone,
                  location: m.location,
                  avatar_url: m.avatar_url,
                  employment_type:
                    m.employment_type === "employee"
                      ? "employee"
                      : "contractor",
                }))}
                title="Internal Directory"
                description="Find employees and contractors"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
