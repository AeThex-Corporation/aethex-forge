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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Shield,
  AlertTriangle,
  Flag,
  UserX,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Ban,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface Report {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  details?: string;
  status: string;
  created_at: string;
  reporter?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface Dispute {
  id: string;
  contract_id: string;
  reason: string;
  status: string;
  resolution_notes?: string;
  created_at: string;
  reporter?: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface FlaggedUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  is_banned: boolean;
  warning_count: number;
  created_at: string;
}

interface Stats {
  openReports: number;
  openDisputes: number;
  resolvedToday: number;
  flaggedUsers: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "resolved":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "ignored":
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "post":
      return "bg-blue-500/20 text-blue-300";
    case "comment":
      return "bg-purple-500/20 text-purple-300";
    case "user":
      return "bg-amber-500/20 text-amber-300";
    case "project":
      return "bg-cyan-500/20 text-cyan-300";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

export default function AdminModeration() {
  const { session } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [flaggedUsers, setFlaggedUsers] = useState<FlaggedUser[]>([]);
  const [stats, setStats] = useState<Stats>({ openReports: 0, openDisputes: 0, resolvedToday: 0, flaggedUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("open");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [selectedUser, setSelectedUser] = useState<FlaggedUser | null>(null);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    if (session?.access_token) {
      fetchModeration();
    }
  }, [session?.access_token, statusFilter]);

  const fetchModeration = async () => {
    try {
      const res = await fetch(`/api/admin/moderation?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setReports(data.reports || []);
        setDisputes(data.disputes || []);
        setFlaggedUsers(data.flaggedUsers || []);
        setStats(data.stats || { openReports: 0, openDisputes: 0, resolvedToday: 0, flaggedUsers: 0 });
      } else {
        aethexToast.error(data.error || "Failed to load moderation data");
      }
    } catch (err) {
      aethexToast.error("Failed to load moderation data");
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (reportId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          action: "update_report",
          report_id: reportId,
          status,
          resolution_notes: resolution
        }),
      });
      if (res.ok) {
        aethexToast.success(`Report ${status}`);
        setSelectedReport(null);
        setResolution("");
        fetchModeration();
      }
    } catch (err) {
      aethexToast.error("Failed to update report");
    }
  };

  const updateDispute = async (disputeId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          action: "update_dispute",
          dispute_id: disputeId,
          status,
          resolution_notes: resolution
        }),
      });
      if (res.ok) {
        aethexToast.success(`Dispute ${status}`);
        setSelectedDispute(null);
        setResolution("");
        fetchModeration();
      }
    } catch (err) {
      aethexToast.error("Failed to update dispute");
    }
  };

  const moderateUser = async (userId: string, actionType: string) => {
    const reason = prompt(`Enter reason for ${actionType}:`);
    if (!reason && actionType !== "unban") return;

    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          action: "moderate_user",
          user_id: userId,
          action_type: actionType,
          reason
        }),
      });
      if (res.ok) {
        aethexToast.success(`User ${actionType}ned successfully`);
        setSelectedUser(null);
        fetchModeration();
      }
    } catch (err) {
      aethexToast.error(`Failed to ${actionType} user`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Moderation Dashboard" description="Admin content moderation" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-7xl px-4 py-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                  <Shield className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-red-100">Moderation</h1>
                  <p className="text-red-200/70 text-sm sm:text-base">Content moderation and user management</p>
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="ignored">Ignored</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-red-950/30 border-red-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-200/70">Open Reports</p>
                      <p className="text-3xl font-bold text-red-100">{stats.openReports}</p>
                    </div>
                    <Flag className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-red-950/30 border-red-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-200/70">Open Disputes</p>
                      <p className="text-3xl font-bold text-red-100">{stats.openDisputes}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-red-950/30 border-red-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-200/70">Resolved Today</p>
                      <p className="text-3xl font-bold text-red-100">{stats.resolvedToday}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-red-950/30 border-red-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-200/70">Flagged Users</p>
                      <p className="text-3xl font-bold text-red-100">{stats.flaggedUsers}</p>
                    </div>
                    <UserX className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="reports" className="space-y-6">
              <TabsList className="bg-slate-800">
                <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
                <TabsTrigger value="disputes">Disputes ({disputes.length})</TabsTrigger>
                <TabsTrigger value="users">Flagged Users ({flaggedUsers.length})</TabsTrigger>
              </TabsList>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id} className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`border ${getStatusColor(report.status)}`}>
                              {report.status}
                            </Badge>
                            <Badge className={getTypeColor(report.target_type)}>
                              {report.target_type}
                            </Badge>
                          </div>
                          <p className="text-slate-200 font-medium mb-1">{report.reason}</p>
                          {report.details && (
                            <p className="text-sm text-slate-400 mb-2">{report.details}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>By: {report.reporter?.full_name || report.reporter?.email || "Unknown"}</span>
                            <span>{new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {report.status === "open" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => setSelectedReport(report)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateReport(report.id, "ignored")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Ignore
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {reports.length === 0 && (
                  <div className="text-center py-12 text-slate-400">No reports found</div>
                )}
              </TabsContent>

              {/* Disputes Tab */}
              <TabsContent value="disputes" className="space-y-4">
                {disputes.map((dispute) => (
                  <Card key={dispute.id} className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`border ${getStatusColor(dispute.status)}`}>
                              {dispute.status}
                            </Badge>
                            <Badge className="bg-purple-500/20 text-purple-300">
                              Contract Dispute
                            </Badge>
                          </div>
                          <p className="text-slate-200 font-medium mb-1">{dispute.reason}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Contract: {dispute.contract_id?.slice(0, 8)}...</span>
                            <span>By: {dispute.reporter?.full_name || dispute.reporter?.email || "Unknown"}</span>
                            <span>{new Date(dispute.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {dispute.status === "open" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => setSelectedDispute(dispute)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {disputes.length === 0 && (
                  <div className="text-center py-12 text-slate-400">No disputes found</div>
                )}
              </TabsContent>

              {/* Flagged Users Tab */}
              <TabsContent value="users" className="space-y-4">
                {flaggedUsers.map((user) => (
                  <Card key={user.id} className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                            ) : (
                              <span className="text-slate-400">{user.full_name?.[0] || "?"}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-slate-200 font-medium">{user.full_name || "Unknown"}</p>
                            <p className="text-sm text-slate-400">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {user.is_banned && (
                              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                                Banned
                              </Badge>
                            )}
                            {user.warning_count > 0 && (
                              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                                {user.warning_count} Warnings
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {user.is_banned ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => moderateUser(user.id, "unban")}
                              >
                                Unban
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-amber-500/30 text-amber-300"
                                  onClick={() => moderateUser(user.id, "warn")}
                                >
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Warn
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => moderateUser(user.id, "ban")}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Ban
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {flaggedUsers.length === 0 && (
                  <div className="text-center py-12 text-slate-400">No flagged users</div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Resolve Report Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-red-100">Resolve Report</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded">
                <p className="text-sm text-slate-400 mb-1">Reason</p>
                <p className="text-slate-200">{selectedReport.reason}</p>
                {selectedReport.details && (
                  <>
                    <p className="text-sm text-slate-400 mb-1 mt-3">Details</p>
                    <p className="text-slate-300 text-sm">{selectedReport.details}</p>
                  </>
                )}
              </div>
              <Textarea
                placeholder="Resolution notes (optional)"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateReport(selectedReport.id, "resolved")}
                >
                  Resolve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dispute Dialog */}
      <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-red-100">Review Dispute</DialogTitle>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded">
                <p className="text-sm text-slate-400 mb-1">Contract</p>
                <p className="text-slate-200 font-mono text-sm">{selectedDispute.contract_id}</p>
                <p className="text-sm text-slate-400 mb-1 mt-3">Dispute Reason</p>
                <p className="text-slate-200">{selectedDispute.reason}</p>
              </div>
              <Textarea
                placeholder="Resolution notes"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedDispute(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateDispute(selectedDispute.id, "resolved")}
                >
                  Resolve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
