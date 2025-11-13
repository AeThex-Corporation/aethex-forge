import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Briefcase,
  AlertTriangle,
  TrendingUp,
  XCircle,
  CheckCircle,
  Search,
  Eye,
  Flag,
} from "lucide-react";
import { aethexToast } from "@/lib/aethex-toast";

interface Opportunity {
  id: string;
  title: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  status: "open" | "in_progress" | "filled" | "closed" | "cancelled";
  application_count: number;
  posted_by_email?: string;
  created_at: string;
  is_featured: boolean;
}

interface Dispute {
  id: string;
  contract_id: string;
  reported_by_email?: string;
  reason: string;
  status: "open" | "reviewing" | "resolved" | "escalated";
  created_at: string;
  resolution_notes?: string;
}

interface Commission {
  period_start: string;
  period_end: string;
  total_volume: number;
  total_commission: number;
  creator_payouts: number;
  aethex_revenue: number;
  status: "pending" | "settled" | "disputed";
}

export default function AdminNexusManager() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loadingOpp, setLoadingOpp] = useState(true);
  const [loadingDisputes, setLoadingDisputes] = useState(true);
  const [loadingCommissions, setLoadingCommissions] = useState(true);
  const [searchOpp, setSearchOpp] = useState("");
  const [disputeFilter, setDisputeFilter] = useState<
    "all" | "open" | "resolved"
  >("all");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [disputeResolution, setDisputeResolution] = useState("");
  const [disputeAction, setDisputeAction] = useState<"resolve" | "escalate">(
    "resolve",
  );

  useEffect(() => {
    fetchOpportunities();
    fetchDisputes();
    fetchCommissions();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoadingOpp(true);
      const response = await fetch(`${API_BASE}/api/admin/nexus/opportunities`);
      if (!response.ok) throw new Error("Failed to fetch opportunities");
      const data = await response.json();
      setOpportunities(data || []);
    } catch (error) {
      aethexToast.error("Failed to load opportunities");
      console.error(error);
    } finally {
      setLoadingOpp(false);
    }
  };

  const fetchDisputes = async () => {
    try {
      setLoadingDisputes(true);
      const response = await fetch(`${API_BASE}/api/admin/nexus/disputes`);
      if (!response.ok) throw new Error("Failed to fetch disputes");
      const data = await response.json();
      setDisputes(data || []);
    } catch (error) {
      aethexToast.error("Failed to load disputes");
      console.error(error);
    } finally {
      setLoadingDisputes(false);
    }
  };

  const fetchCommissions = async () => {
    try {
      setLoadingCommissions(true);
      const response = await fetch(`${API_BASE}/api/admin/nexus/commissions`);
      if (!response.ok) throw new Error("Failed to fetch commissions");
      const data = await response.json();
      setCommissions(data || []);
    } catch (error) {
      aethexToast.error("Failed to load commissions");
      console.error(error);
    } finally {
      setLoadingCommissions(false);
    }
  };

  const handleModerateOpportunity = async (
    opportunityId: string,
    status: "open" | "filled" | "closed" | "cancelled",
  ) => {
    try {
      const response = await fetch(
        `/api/admin/nexus/opportunities/${opportunityId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) throw new Error("Failed to update opportunity");
      aethexToast.success(`Opportunity marked as ${status}`);
      fetchOpportunities();
    } catch (error) {
      aethexToast.error("Failed to update opportunity");
      console.error(error);
    }
  };

  const handleFeatureOpportunity = async (
    opportunityId: string,
    featured: boolean,
  ) => {
    try {
      const response = await fetch(
        `/api/admin/nexus/opportunities/${opportunityId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_featured: featured }),
        },
      );

      if (!response.ok) throw new Error("Failed to update opportunity");
      aethexToast.success(
        `Opportunity ${featured ? "featured" : "unfeatured"}`,
      );
      fetchOpportunities();
    } catch (error) {
      aethexToast.error("Failed to update opportunity");
      console.error(error);
    }
  };

  const handleDisputeResolution = async () => {
    if (!selectedDispute) return;

    try {
      const response = await fetch(
        `/api/admin/nexus/disputes/${selectedDispute.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: disputeAction === "resolve" ? "resolved" : "escalated",
            resolution_notes: disputeResolution,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to update dispute");
      aethexToast.success(
        `Dispute ${disputeAction === "resolve" ? "resolved" : "escalated"}`,
      );
      setDisputeDialogOpen(false);
      setSelectedDispute(null);
      setDisputeResolution("");
      fetchDisputes();
    } catch (error) {
      aethexToast.error("Failed to update dispute");
      console.error(error);
    }
  };

  const filteredOpportunities = opportunities.filter((o) =>
    o.title.toLowerCase().includes(searchOpp.toLowerCase()),
  );

  const filteredDisputes = disputes.filter((d) => {
    if (disputeFilter === "all") return true;
    if (disputeFilter === "open") return d.status === "open";
    if (disputeFilter === "resolved") return d.status === "resolved";
    return true;
  });

  const openOpportunities = opportunities.filter(
    (o) => o.status === "open",
  ).length;
  const openDisputes = disputes.filter((d) => d.status === "open").length;
  const totalCommissionsRevenue = commissions.reduce(
    (sum, c) => sum + c.aethex_revenue,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {openOpportunities} open
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Disputes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {openDisputes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commission Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCommissionsRevenue.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              20% of marketplace
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ledger Periods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commissions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Commission records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="opportunities"
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="disputes" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Disputes
          </TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Commissions
          </TabsTrigger>
        </TabsList>

        {/* OPPORTUNITIES TAB */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchOpp}
                onChange={(e) => setSearchOpp(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loadingOpp ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Loading opportunities...
                </p>
              </CardContent>
            </Card>
          ) : filteredOpportunities.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No opportunities found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredOpportunities.map((opp) => (
                <Card key={opp.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-base">{opp.title}</h4>
                          {opp.is_featured && (
                            <Badge className="bg-yellow-600">Featured</Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={
                              opp.status === "open"
                                ? "bg-green-50"
                                : opp.status === "filled"
                                  ? "bg-blue-50"
                                  : "bg-gray-50"
                            }
                          >
                            {opp.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Category: {opp.category} • {opp.application_count}{" "}
                          applications
                        </p>
                        {opp.budget_min && opp.budget_max && (
                          <p className="text-sm font-medium">
                            ${opp.budget_min} - ${opp.budget_max}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {opp.status === "open" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeatureOpportunity(
                                  opp.id,
                                  !opp.is_featured,
                                )
                              }
                            >
                              {opp.is_featured ? "Unfeature" : "Feature"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleModerateOpportunity(opp.id, "filled")
                              }
                            >
                              Mark Filled
                            </Button>
                          </>
                        )}
                        {opp.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleModerateOpportunity(opp.id, "cancelled")
                            }
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* DISPUTES TAB */}
        <TabsContent value="disputes" className="space-y-4">
          <div className="flex gap-2">
            <Select
              value={disputeFilter}
              onValueChange={(v: any) => setDisputeFilter(v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Disputes</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loadingDisputes ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Loading disputes...</p>
              </CardContent>
            </Card>
          ) : filteredDisputes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No disputes found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredDisputes.map((dispute) => (
                <Card
                  key={dispute.id}
                  className={dispute.status === "open" ? "border-red-300" : ""}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Flag className="h-4 w-4 text-red-500" />
                          <h4 className="font-medium">{dispute.reason}</h4>
                          <Badge
                            variant="outline"
                            className={
                              dispute.status === "open"
                                ? "bg-red-50"
                                : dispute.status === "escalated"
                                  ? "bg-orange-50"
                                  : "bg-green-50"
                            }
                          >
                            {dispute.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          Reported by: {dispute.reported_by_email}
                        </p>
                        {dispute.resolution_notes && (
                          <p className="text-sm text-muted-foreground">
                            Resolution: {dispute.resolution_notes}
                          </p>
                        )}
                      </div>
                      {dispute.status === "open" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedDispute(dispute);
                            setDisputeAction("resolve");
                            setDisputeDialogOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* COMMISSIONS TAB */}
        <TabsContent value="commissions" className="space-y-4">
          {loadingCommissions ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Loading commissions...</p>
              </CardContent>
            </Card>
          ) : commissions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No commission records</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {commissions.map((commission, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Period</p>
                        <p className="font-medium text-sm">
                          {new Date(
                            commission.period_start,
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(commission.period_end).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total Volume
                        </p>
                        <p className="font-medium text-sm">
                          ${commission.total_volume.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          AeThex Revenue (20%)
                        </p>
                        <p className="font-medium text-sm text-green-600">
                          ${commission.aethex_revenue.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge
                          variant="outline"
                          className={
                            commission.status === "settled"
                              ? "bg-green-50"
                              : commission.status === "disputed"
                                ? "bg-red-50"
                                : "bg-yellow-50"
                          }
                        >
                          {commission.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dispute Resolution Dialog */}
      <AlertDialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogTitle>Resolve Dispute</AlertDialogTitle>
          <div className="space-y-4 my-4">
            <div>
              <label className="text-sm font-medium">Resolution Notes</label>
              <Textarea
                placeholder="Document how this dispute was resolved..."
                value={disputeResolution}
                onChange={(e) => setDisputeResolution(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Action</label>
              <Select
                value={disputeAction}
                onValueChange={(v: any) => setDisputeAction(v)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resolve">Resolve & Close</SelectItem>
                  <SelectItem value="escalate">
                    Escalate to Senior Team
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDisputeResolution}>
              {disputeAction === "resolve" ? "Resolve" : "Escalate"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
