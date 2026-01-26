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
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
  Target,
  Plus,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface KeyResult {
  id: string;
  title: string;
  description?: string;
  metric_type: string;
  start_value: number;
  current_value: number;
  target_value: number;
  unit?: string;
  progress: number;
  status: string;
  due_date?: string;
}

interface OKR {
  id: string;
  objective: string;
  description?: string;
  status: string;
  quarter: number;
  year: number;
  progress: number;
  team?: string;
  owner_type: string;
  key_results: KeyResult[];
  created_at: string;
}

interface Stats {
  total: number;
  active: number;
  completed: number;
  avgProgress: number;
}

const currentYear = new Date().getFullYear();
const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "active":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "draft":
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    case "on_track":
      return "bg-green-500/20 text-green-300";
    case "at_risk":
      return "bg-amber-500/20 text-amber-300";
    case "behind":
      return "bg-red-500/20 text-red-300";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

export default function StaffOKRs() {
  const { session } = useAuth();
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, completed: 0, avgProgress: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedOkr, setExpandedOkr] = useState<string | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // Dialog states
  const [createOkrDialog, setCreateOkrDialog] = useState(false);
  const [addKrDialog, setAddKrDialog] = useState<string | null>(null);
  const [updateKrDialog, setUpdateKrDialog] = useState<KeyResult | null>(null);

  // Form states
  const [newOkr, setNewOkr] = useState({ objective: "", description: "", quarter: currentQuarter, year: currentYear });
  const [newKr, setNewKr] = useState({ title: "", description: "", target_value: 100, metric_type: "percentage", unit: "", due_date: "" });
  const [krUpdate, setKrUpdate] = useState({ current_value: 0 });

  useEffect(() => {
    if (session?.access_token) {
      fetchOkrs();
    }
  }, [session?.access_token, selectedQuarter, selectedYear]);

  const fetchOkrs = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedQuarter !== "all") params.append("quarter", selectedQuarter);
      if (selectedYear !== "all") params.append("year", selectedYear);

      const res = await fetch(`/api/staff/okrs?${params}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOkrs(data.okrs || []);
        setStats(data.stats || { total: 0, active: 0, completed: 0, avgProgress: 0 });
      }
    } catch (err) {
      aethexToast.error("Failed to load OKRs");
    } finally {
      setLoading(false);
    }
  };

  const createOkr = async () => {
    if (!newOkr.objective) return;
    try {
      const res = await fetch("/api/staff/okrs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ action: "create_okr", ...newOkr }),
      });
      if (res.ok) {
        aethexToast.success("OKR created!");
        setCreateOkrDialog(false);
        setNewOkr({ objective: "", description: "", quarter: currentQuarter, year: currentYear });
        fetchOkrs();
      }
    } catch (err) {
      aethexToast.error("Failed to create OKR");
    }
  };

  const addKeyResult = async () => {
    if (!addKrDialog || !newKr.title) return;
    try {
      const res = await fetch("/api/staff/okrs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ action: "add_key_result", okr_id: addKrDialog, ...newKr }),
      });
      if (res.ok) {
        aethexToast.success("Key Result added!");
        setAddKrDialog(null);
        setNewKr({ title: "", description: "", target_value: 100, metric_type: "percentage", unit: "", due_date: "" });
        fetchOkrs();
      }
    } catch (err) {
      aethexToast.error("Failed to add Key Result");
    }
  };

  const updateKeyResult = async () => {
    if (!updateKrDialog) return;
    try {
      const res = await fetch("/api/staff/okrs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ action: "update_key_result", key_result_id: updateKrDialog.id, ...krUpdate }),
      });
      if (res.ok) {
        aethexToast.success("Progress updated!");
        setUpdateKrDialog(null);
        fetchOkrs();
      }
    } catch (err) {
      aethexToast.error("Failed to update progress");
    }
  };

  const activateOkr = async (okrId: string) => {
    try {
      const res = await fetch("/api/staff/okrs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ id: okrId, status: "active" }),
      });
      if (res.ok) {
        aethexToast.success("OKR activated!");
        fetchOkrs();
      }
    } catch (err) {
      aethexToast.error("Failed to activate OKR");
    }
  };

  const deleteOkr = async (okrId: string) => {
    if (!confirm("Delete this OKR and all its key results?")) return;
    try {
      const res = await fetch(`/api/staff/okrs?id=${okrId}&type=okr`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) {
        aethexToast.success("OKR deleted");
        fetchOkrs();
      }
    } catch (err) {
      aethexToast.error("Failed to delete OKR");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="OKRs" description="Set and track your objectives and key results" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-emerald-100">OKRs</h1>
                  <p className="text-emerald-200/70 text-sm sm:text-base">Objectives and Key Results</p>
                </div>
              </div>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                onClick={() => setCreateOkrDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New OKR
              </Button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-emerald-950/30 border-emerald-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-200/70">Total OKRs</p>
                      <p className="text-3xl font-bold text-emerald-100">{stats.total}</p>
                    </div>
                    <Target className="h-8 w-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-950/30 border-emerald-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-200/70">Active</p>
                      <p className="text-3xl font-bold text-emerald-100">{stats.active}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-950/30 border-emerald-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-200/70">Completed</p>
                      <p className="text-3xl font-bold text-emerald-100">{stats.completed}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-950/30 border-emerald-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-200/70">Avg Progress</p>
                      <p className="text-3xl font-bold text-emerald-100">{stats.avgProgress}%</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger className="w-full sm:w-32 bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quarters</SelectItem>
                  <SelectItem value="1">Q1</SelectItem>
                  <SelectItem value="2">Q2</SelectItem>
                  <SelectItem value="3">Q3</SelectItem>
                  <SelectItem value="4">Q4</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full sm:w-32 bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                  <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                  <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* OKRs List */}
            <div className="space-y-6">
              {okrs.map((okr) => (
                <Card key={okr.id} className="bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 transition-all">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setExpandedOkr(expandedOkr === okr.id ? null : okr.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`border ${getStatusColor(okr.status)}`}>
                            {okr.status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          <Badge className="bg-slate-700 text-slate-300">
                            Q{okr.quarter} {okr.year}
                          </Badge>
                        </div>
                        <CardTitle className="text-emerald-100">{okr.objective}</CardTitle>
                        {okr.description && (
                          <CardDescription className="text-slate-400 mt-1">
                            {okr.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                          <p className="text-2xl font-bold text-emerald-300">{okr.progress}%</p>
                          <p className="text-xs text-slate-500">{okr.key_results?.length || 0} Key Results</p>
                        </div>
                        {expandedOkr === okr.id ? (
                          <ChevronUp className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-emerald-400" />
                        )}
                      </div>
                    </div>
                    <Progress value={okr.progress} className="h-2 mt-4" />
                  </CardHeader>

                  {expandedOkr === okr.id && (
                    <CardContent className="pt-0">
                      <div className="border-t border-slate-700 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-emerald-100">Key Results</h4>
                          <div className="flex gap-2">
                            {okr.status === "draft" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-emerald-500/30 text-emerald-300"
                                onClick={() => activateOkr(okr.id)}
                              >
                                Activate
                              </Button>
                            )}
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => setAddKrDialog(okr.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add KR
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              onClick={() => deleteOkr(okr.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {okr.key_results?.map((kr) => (
                            <div
                              key={kr.id}
                              className="p-4 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors"
                              onClick={() => {
                                setUpdateKrDialog(kr);
                                setKrUpdate({ current_value: kr.current_value });
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-slate-200 font-medium">{kr.title}</p>
                                <Badge className={getStatusColor(kr.status)}>
                                  {kr.status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4">
                                <Progress value={kr.progress} className="flex-1 h-2" />
                                <span className="text-sm text-emerald-300 w-24 text-right">
                                  {kr.current_value} / {kr.target_value} {kr.unit}
                                </span>
                              </div>
                              {kr.due_date && (
                                <p className="text-xs text-slate-500 mt-2">
                                  Due: {new Date(kr.due_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ))}
                          {(!okr.key_results || okr.key_results.length === 0) && (
                            <p className="text-slate-500 text-center py-4">No key results yet. Add one to track progress.</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {okrs.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No OKRs found for this period</p>
                <Button
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setCreateOkrDialog(true)}
                >
                  Create Your First OKR
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create OKR Dialog */}
      <Dialog open={createOkrDialog} onOpenChange={setCreateOkrDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-emerald-100">Create New OKR</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Objective"
              value={newOkr.objective}
              onChange={(e) => setNewOkr({ ...newOkr, objective: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newOkr.description}
              onChange={(e) => setNewOkr({ ...newOkr, description: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                value={newOkr.quarter.toString()}
                onValueChange={(v) => setNewOkr({ ...newOkr, quarter: parseInt(v) })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Q1</SelectItem>
                  <SelectItem value="2">Q2</SelectItem>
                  <SelectItem value="3">Q3</SelectItem>
                  <SelectItem value="4">Q4</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newOkr.year.toString()}
                onValueChange={(v) => setNewOkr({ ...newOkr, year: parseInt(v) })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                  <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                  <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOkrDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={createOkr}>
                Create OKR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Key Result Dialog */}
      <Dialog open={!!addKrDialog} onOpenChange={() => setAddKrDialog(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-emerald-100">Add Key Result</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Key Result title"
              value={newKr.title}
              onChange={(e) => setNewKr({ ...newKr, title: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newKr.description}
              onChange={(e) => setNewKr({ ...newKr, description: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Target Value</label>
                <Input
                  type="number"
                  value={newKr.target_value}
                  onChange={(e) => setNewKr({ ...newKr, target_value: parseFloat(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Unit (optional)</label>
                <Input
                  placeholder="e.g., %, users, $"
                  value={newKr.unit}
                  onChange={(e) => setNewKr({ ...newKr, unit: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Due Date (optional)</label>
              <Input
                type="date"
                value={newKr.due_date}
                onChange={(e) => setNewKr({ ...newKr, due_date: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddKrDialog(null)}>
                Cancel
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={addKeyResult}>
                Add Key Result
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Key Result Dialog */}
      <Dialog open={!!updateKrDialog} onOpenChange={() => setUpdateKrDialog(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-emerald-100">Update Progress</DialogTitle>
          </DialogHeader>
          {updateKrDialog && (
            <div className="space-y-4">
              <p className="text-slate-300">{updateKrDialog.title}</p>
              <div className="p-4 bg-slate-700/50 rounded">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Current Progress</span>
                  <span className="text-emerald-300">{updateKrDialog.progress}%</span>
                </div>
                <Progress value={updateKrDialog.progress} className="h-2" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  New Value (Target: {updateKrDialog.target_value} {updateKrDialog.unit})
                </label>
                <Input
                  type="number"
                  value={krUpdate.current_value}
                  onChange={(e) => setKrUpdate({ current_value: parseFloat(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUpdateKrDialog(null)}>
                  Cancel
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={updateKeyResult}>
                  Update
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
