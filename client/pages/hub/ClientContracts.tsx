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
import { Input } from "@/components/ui/input";
import LoadingScreen from "@/components/LoadingScreen";
import {
  FileText,
  ArrowLeft,
  Search,
  Download,
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  FileSignature,
  History,
  Filter,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface Contract {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "completed" | "expired" | "cancelled";
  total_value: number;
  start_date: string;
  end_date: string;
  signed_date?: string;
  milestones: any[];
  documents: { name: string; url: string; type: string }[];
  amendments: { date: string; description: string; signed: boolean }[];
  created_at: string;
}

export default function ClientContracts() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadContracts();
    }
  }, [user, authLoading]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/corp/contracts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setContracts(Array.isArray(data) ? data : data.contracts || []);
      }
    } catch (error) {
      console.error("Failed to load contracts", error);
      aethexToast({ message: "Failed to load contracts", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading Contracts..." />;
  }

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 border-green-500/30 text-green-300";
      case "completed": return "bg-blue-500/20 border-blue-500/30 text-blue-300";
      case "draft": return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300";
      case "expired": return "bg-gray-500/20 border-gray-500/30 text-gray-300";
      case "cancelled": return "bg-red-500/20 border-red-500/30 text-red-300";
      default: return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "draft": return <Clock className="h-4 w-4" />;
      case "expired": return <AlertCircle className="h-4 w-4" />;
      case "cancelled": return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === "active").length,
    completed: contracts.filter(c => c.status === "completed").length,
    totalValue: contracts.reduce((acc, c) => acc + (c.total_value || 0), 0),
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden pb-12">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />

        <main className="relative z-10">
          <section className="border-b border-slate-800 py-8">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/hub/client")}
                className="mb-4 text-slate-400"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Button>
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-blue-400" />
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    Contracts
                  </h1>
                  <p className="text-gray-400">Manage your service agreements</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container mx-auto max-w-6xl px-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-6">
                    Contract management coming soon
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="bg-slate-800/50 border border-slate-700">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Contract List or Detail View */}
          {selectedContract ? (
            <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedContract.title}</CardTitle>
                    <CardDescription>{selectedContract.description}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedContract(null)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contract Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-black/30 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-gray-400 uppercase">Status</p>
                    <Badge className={`mt-2 ${getStatusColor(selectedContract.status)}`}>
                      {getStatusIcon(selectedContract.status)}
                      <span className="ml-1 capitalize">{selectedContract.status}</span>
                    </Badge>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-gray-400 uppercase">Total Value</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      ${selectedContract.total_value?.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-gray-400 uppercase">Start Date</p>
                    <p className="text-lg font-semibold text-white mt-1">
                      {new Date(selectedContract.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-gray-400 uppercase">End Date</p>
                    <p className="text-lg font-semibold text-white mt-1">
                      {new Date(selectedContract.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Milestones */}
                {selectedContract.milestones?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-cyan-400" />
                      Milestones
                    </h3>
                    <div className="space-y-2">
                      {selectedContract.milestones.map((milestone: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-black/30 rounded-lg border border-cyan-500/20 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {milestone.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-400" />
                            )}
                            <div>
                              <p className="font-semibold text-white">{milestone.title}</p>
                              <p className="text-sm text-gray-400">
                                Due: {new Date(milestone.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white">
                              ${milestone.amount?.toLocaleString()}
                            </p>
                            <Badge className={milestone.status === "completed"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-yellow-500/20 text-yellow-300"
                            }>
                              {milestone.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedContract.documents?.length > 0 ? (
                      selectedContract.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-black/30 rounded-lg border border-blue-500/20 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-400" />
                            <div>
                              <p className="font-semibold text-white">{doc.name}</p>
                              <p className="text-xs text-gray-400 uppercase">{doc.type}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 p-8 bg-black/30 rounded-lg border border-blue-500/20 text-center">
                        <FileText className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                        <p className="text-gray-400">No documents attached</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amendment History */}
                {selectedContract.amendments?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <History className="h-5 w-5 text-purple-400" />
                      Amendment History
                    </h3>
                    <div className="space-y-2">
                      {selectedContract.amendments.map((amendment, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-black/30 rounded-lg border border-purple-500/20 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-semibold text-white">{amendment.description}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(amendment.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={amendment.signed
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                          }>
                            {amendment.signed ? "Signed" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-blue-500/20">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Contract PDF
                  </Button>
                  {selectedContract.status === "draft" && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <FileSignature className="h-4 w-4 mr-2" />
                      Sign Contract
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredContracts.length === 0 ? (
                <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400 mb-4">
                      {searchQuery || statusFilter !== "all"
                        ? "No contracts match your filters"
                        : "No contracts yet"}
                    </p>
                    <Button variant="outline" onClick={() => navigate("/hub/client")}>
                      Back to Portal
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredContracts.map((contract) => (
                  <Card
                    key={contract.id}
                    className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20 hover:border-blue-500/40 transition cursor-pointer"
                    onClick={() => setSelectedContract(contract)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">
                              {contract.title}
                            </h3>
                            <Badge className={getStatusColor(contract.status)}>
                              {getStatusIcon(contract.status)}
                              <span className="ml-1 capitalize">{contract.status}</span>
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">
                            {contract.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              {contract.milestones?.filter((m: any) => m.status === "completed").length || 0} / {contract.milestones?.length || 0} milestones
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">
                            ${contract.total_value?.toLocaleString()}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
