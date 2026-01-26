import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, FileText, Calendar, CheckCircle, AlertCircle, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  status: string;
  receipt_url: string;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  reimbursed: number;
  total_amount: number;
  pending_amount: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "reimbursed": return "bg-green-500/20 text-green-300 border-green-500/30";
    case "approved": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "pending": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "rejected": return "bg-red-500/20 text-red-300 border-red-500/30";
    default: return "bg-slate-500/20 text-slate-300";
  }
};

const categories = ["travel", "equipment", "software", "meals", "office", "training", "other"];

export default function StaffExpenseReports() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: "", description: "", amount: "", category: "other", receipt_url: "" });

  useEffect(() => {
    if (session?.access_token) fetchExpenses();
  }, [session?.access_token]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/staff/expenses", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
        setStats(data.stats);
      }
    } catch (err) {
      aethexToast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const submitExpense = async () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.category) {
      aethexToast.error("Please fill in required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/staff/expenses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newExpense, amount: parseFloat(newExpense.amount) }),
      });
      if (res.ok) {
        aethexToast.success("Expense submitted!");
        setShowNewDialog(false);
        setNewExpense({ title: "", description: "", amount: "", category: "other", receipt_url: "" });
        fetchExpenses();
      }
    } catch (err) {
      aethexToast.error("Failed to submit expense");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const filtered = filterStatus ? expenses.filter(e => e.status === filterStatus) : expenses;

  if (loading) {
    return (
      <Layout>
        <SEO title="Expense Reports" description="Reimbursement requests and budget tracking" />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Expense Reports" description="Reimbursement requests and budget tracking" />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-green-100">Expense Reports</h1>
                <p className="text-green-200/70">Reimbursement requests and budget tracking</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <Card className="bg-green-950/30 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-200/70">Total Submitted</p>
                      <p className="text-3xl font-bold text-green-100">${stats?.total_amount?.toFixed(2) || "0.00"}</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-950/30 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-200/70">Approved</p>
                      <p className="text-3xl font-bold text-green-100">{stats?.approved || 0} reports</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-950/30 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-200/70">Pending Amount</p>
                      <p className="text-3xl font-bold text-green-100">${stats?.pending_amount?.toFixed(2) || "0.00"}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-amber-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-100">Expense Reports</h2>
              <Button onClick={() => setShowNewDialog(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" /> New Expense
              </Button>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {[null, "pending", "approved", "reimbursed", "rejected"].map(status => (
                <Button
                  key={status || "all"}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? "bg-green-600 hover:bg-green-700" : "border-green-500/30 text-green-300 hover:bg-green-500/10"}
                >
                  {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No expenses found</p>
                </div>
              ) : (
                filtered.map(expense => (
                  <Card key={expense.id} className="bg-slate-800/50 border-slate-700/50 hover:border-green-500/50 transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-green-100">{expense.title}</p>
                          {expense.description && <p className="text-sm text-slate-400 mt-1">{expense.description}</p>}
                          <div className="flex gap-4 text-sm text-slate-400 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(expense.created_at)}
                            </span>
                            <Badge className="bg-slate-700 text-slate-300">{expense.category}</Badge>
                            {expense.receipt_url && <span className="text-green-400">✓ Receipt</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-100">${expense.amount.toFixed(2)}</p>
                          <Badge className={`border ${getStatusColor(expense.status)} mt-2`}>{expense.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-green-100">Submit New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-green-200">Title *</Label>
              <Input
                value={newExpense.title}
                onChange={e => setNewExpense(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Conference registration"
                className="bg-slate-700/50 border-slate-600 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-green-200">Amount *</Label>
                <Input
                  type="number"
                  value={newExpense.amount}
                  onChange={e => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="bg-slate-700/50 border-slate-600 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-200">Category *</Label>
                <Select value={newExpense.category} onValueChange={v => setNewExpense(prev => ({ ...prev, category: v }))}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-green-200">Description</Label>
              <Textarea
                value={newExpense.description}
                onChange={e => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details..."
                className="bg-slate-700/50 border-slate-600 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-green-200">Receipt URL</Label>
              <Input
                value={newExpense.receipt_url}
                onChange={e => setNewExpense(prev => ({ ...prev, receipt_url: e.target.value }))}
                placeholder="https://..."
                className="bg-slate-700/50 border-slate-600 text-slate-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)} className="border-slate-600 text-slate-300">Cancel</Button>
            <Button onClick={submitExpense} disabled={submitting} className="bg-green-600 hover:bg-green-700">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
