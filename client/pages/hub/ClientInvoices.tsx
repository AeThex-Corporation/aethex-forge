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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Receipt,
  ArrowLeft,
  Search,
  Download,
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  FileText,
  ArrowUpRight,
  Filter,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface Invoice {
  id: string;
  invoice_number: string;
  description: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  amount: number;
  tax: number;
  total: number;
  issued_date: string;
  due_date: string;
  paid_date?: string;
  line_items: { description: string; quantity: number; unit_price: number; total: number }[];
  payment_method?: string;
  contract_id?: string;
  created_at: string;
}

export default function ClientInvoices() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadInvoices();
    }
  }, [user, authLoading]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/corp/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(Array.isArray(data) ? data : data.invoices || []);
      }
    } catch (error) {
      console.error("Failed to load invoices", error);
      aethexToast({ message: "Failed to load invoices", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (invoice: Invoice) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/corp/invoices/${invoice.id}/pay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          aethexToast({ message: "Payment initiated", type: "success" });
          loadInvoices();
        }
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Payment error", error);
      aethexToast({ message: "Failed to process payment", type: "error" });
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading Invoices..." />;
  }

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/20 border-green-500/30 text-green-300";
      case "pending": return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300";
      case "overdue": return "bg-red-500/20 border-red-500/30 text-red-300";
      case "cancelled": return "bg-gray-500/20 border-gray-500/30 text-gray-300";
      default: return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "overdue": return <AlertCircle className="h-4 w-4" />;
      case "cancelled": return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const stats = {
    total: invoices.reduce((acc, i) => acc + (i.total || i.amount || 0), 0),
    paid: invoices.filter(i => i.status === "paid").reduce((acc, i) => acc + (i.total || i.amount || 0), 0),
    pending: invoices.filter(i => i.status === "pending").reduce((acc, i) => acc + (i.total || i.amount || 0), 0),
    overdue: invoices.filter(i => i.status === "overdue").reduce((acc, i) => acc + (i.total || i.amount || 0), 0),
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-cyan-950/20 to-black py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/hub/client")}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portal
            </Button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Receipt className="h-10 w-10 text-cyan-400" />
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    Invoices & Billing
                  </h1>
                  <p className="text-gray-400">Manage payments and billing history</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-400 uppercase">Total Billed</p>
                  <p className="text-2xl font-bold text-white">${(stats.total / 1000).toFixed(1)}k</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-400 uppercase">Paid</p>
                  <p className="text-2xl font-bold text-green-400">${(stats.paid / 1000).toFixed(1)}k</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-950/40 to-yellow-900/20 border-yellow-500/20">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-400 uppercase">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">${(stats.pending / 1000).toFixed(1)}k</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-400 uppercase">Overdue</p>
                  <p className="text-2xl font-bold text-red-400">${(stats.overdue / 1000).toFixed(1)}k</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="bg-slate-800/50 border border-slate-700">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Invoice Detail or List */}
          {selectedInvoice ? (
            <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">Invoice {selectedInvoice.invoice_number}</CardTitle>
                    <CardDescription>{selectedInvoice.description}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedInvoice(null)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Invoice Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-black/30 rounded-lg border border-cyan-500/20">
                    <p className="text-xs text-gray-400 uppercase">Status</p>
                    <Badge className={`mt-2 ${getStatusColor(selectedInvoice.status)}`}>
                      {getStatusIcon(selectedInvoice.status)}
                      <span className="ml-1 capitalize">{selectedInvoice.status}</span>
                    </Badge>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-cyan-500/20">
                    <p className="text-xs text-gray-400 uppercase">Total Amount</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      ${(selectedInvoice.total || selectedInvoice.amount)?.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-cyan-500/20">
                    <p className="text-xs text-gray-400 uppercase">Issue Date</p>
                    <p className="text-lg font-semibold text-white mt-1">
                      {new Date(selectedInvoice.issued_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-cyan-500/20">
                    <p className="text-xs text-gray-400 uppercase">Due Date</p>
                    <p className="text-lg font-semibold text-white mt-1">
                      {new Date(selectedInvoice.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Line Items */}
                {selectedInvoice.line_items?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Line Items</h3>
                    <div className="bg-black/30 rounded-lg border border-cyan-500/20 overflow-x-auto">
                      <table className="w-full min-w-[500px]">
                        <thead className="bg-cyan-500/10">
                          <tr className="text-left text-xs text-gray-400 uppercase">
                            <th className="p-4">Description</th>
                            <th className="p-4 text-right">Qty</th>
                            <th className="p-4 text-right">Unit Price</th>
                            <th className="p-4 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.line_items.map((item, idx) => (
                            <tr key={idx} className="border-t border-cyan-500/10">
                              <td className="p-4 text-white">{item.description}</td>
                              <td className="p-4 text-right text-gray-300">{item.quantity}</td>
                              <td className="p-4 text-right text-gray-300">${item.unit_price?.toLocaleString()}</td>
                              <td className="p-4 text-right text-white font-semibold">${item.total?.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-cyan-500/10">
                          <tr className="border-t border-cyan-500/20">
                            <td colSpan={3} className="p-4 text-right text-gray-400">Subtotal</td>
                            <td className="p-4 text-right text-white font-semibold">
                              ${selectedInvoice.amount?.toLocaleString()}
                            </td>
                          </tr>
                          {selectedInvoice.tax > 0 && (
                            <tr>
                              <td colSpan={3} className="p-4 text-right text-gray-400">Tax</td>
                              <td className="p-4 text-right text-white font-semibold">
                                ${selectedInvoice.tax?.toLocaleString()}
                              </td>
                            </tr>
                          )}
                          <tr className="border-t border-cyan-500/20">
                            <td colSpan={3} className="p-4 text-right text-lg font-semibold text-white">Total</td>
                            <td className="p-4 text-right text-2xl font-bold text-cyan-400">
                              ${(selectedInvoice.total || selectedInvoice.amount)?.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                {selectedInvoice.status === "paid" && selectedInvoice.paid_date && (
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                      <div>
                        <p className="font-semibold text-green-300">Payment Received</p>
                        <p className="text-sm text-gray-400">
                          Paid on {new Date(selectedInvoice.paid_date).toLocaleDateString()}
                          {selectedInvoice.payment_method && ` via ${selectedInvoice.payment_method}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-cyan-500/20">
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  {(selectedInvoice.status === "pending" || selectedInvoice.status === "overdue") && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handlePayNow(selectedInvoice)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.length === 0 ? (
                <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                  <CardContent className="p-12 text-center">
                    <Receipt className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400 mb-4">
                      {searchQuery || statusFilter !== "all"
                        ? "No invoices match your filters"
                        : "No invoices yet"}
                    </p>
                    <Button variant="outline" onClick={() => navigate("/hub/client")}>
                      Back to Portal
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredInvoices.map((invoice) => (
                  <Card
                    key={invoice.id}
                    className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20 hover:border-cyan-500/40 transition cursor-pointer"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">
                              {invoice.invoice_number}
                            </h3>
                            <Badge className={getStatusColor(invoice.status)}>
                              {getStatusIcon(invoice.status)}
                              <span className="ml-1 capitalize">{invoice.status}</span>
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">
                            {invoice.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Issued: {new Date(invoice.issued_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Due: {new Date(invoice.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-2xl font-bold text-white">
                            ${(invoice.total || invoice.amount)?.toLocaleString()}
                          </p>
                          <div className="flex gap-2 justify-end">
                            {(invoice.status === "pending" || invoice.status === "overdue") && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePayNow(invoice);
                                }}
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Pay Now
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
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
