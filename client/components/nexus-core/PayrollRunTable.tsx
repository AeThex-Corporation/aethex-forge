import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Play, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { NexusPayout } from "@/lib/nexus-core-types";

interface PayrollRunTableProps {
  payouts: NexusPayout[];
  onProcessSelected?: (payoutIds: string[]) => void;
  onViewDetails?: (payout: NexusPayout) => void;
  loading?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  processing: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  completed: "bg-green-500/20 text-green-300 border-green-500/30",
  failed: "bg-red-500/20 text-red-300 border-red-500/30",
  cancelled: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  processing: <Play className="w-3 h-3 animate-pulse" />,
  completed: <CheckCircle className="w-3 h-3" />,
  failed: <AlertCircle className="w-3 h-3" />,
  cancelled: <AlertCircle className="w-3 h-3" />,
};

export function PayrollRunTable({
  payouts,
  onProcessSelected,
  onViewDetails,
  loading = false,
}: PayrollRunTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const pendingPayouts = payouts.filter((p) => p.status === "pending");
  const totalPending = pendingPayouts.reduce((sum, p) => sum + p.net_amount, 0);
  const selectedPayouts = payouts.filter((p) => selectedIds.has(p.id));
  const selectedTotal = selectedPayouts.reduce((sum, p) => sum + p.net_amount, 0);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAllPending = () => {
    setSelectedIds(new Set(pendingPayouts.map((p) => p.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleProcess = () => {
    if (onProcessSelected && selectedIds.size > 0) {
      onProcessSelected(Array.from(selectedIds));
      clearSelection();
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Payroll Queue
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-500/10">
              {pendingPayouts.length} pending • {formatCurrency(totalPending)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
            <span className="text-sm">
              <strong>{selectedIds.size}</strong> selected • Total: {formatCurrency(selectedTotal)}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={clearSelection}>
                Clear
              </Button>
              <Button 
                size="sm" 
                onClick={handleProcess} 
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Play className="w-4 h-4 mr-1" />
                Process Selected
              </Button>
            </div>
          </div>
        )}

        {pendingPayouts.length > 0 && selectedIds.size === 0 && (
          <Button size="sm" variant="outline" onClick={selectAllPending}>
            Select All Pending ({pendingPayouts.length})
          </Button>
        )}

        <div className="rounded-md border border-slate-700/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-800/50 hover:bg-slate-800/50">
                <TableHead className="w-10"></TableHead>
                <TableHead>Talent</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No payouts in queue
                  </TableCell>
                </TableRow>
              ) : (
                payouts.map((payout) => (
                  <TableRow 
                    key={payout.id} 
                    className={selectedIds.has(payout.id) ? "bg-emerald-500/5" : ""}
                  >
                    <TableCell>
                      {payout.status === "pending" && (
                        <Checkbox
                          checked={selectedIds.has(payout.id)}
                          onCheckedChange={() => toggleSelect(payout.id)}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        Talent #{payout.talent_profile_id.slice(0, 8)}
                      </div>
                      {payout.contract_id && (
                        <div className="text-xs text-muted-foreground">
                          Contract: {payout.contract_id.slice(0, 8)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(payout.gross_amount)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      -{formatCurrency(payout.platform_fee + payout.processing_fee)}
                    </TableCell>
                    <TableCell className="font-medium text-emerald-400">
                      {formatCurrency(payout.net_amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {payout.payout_method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[payout.status]} border`}>
                        <span className="flex items-center gap-1">
                          {statusIcons[payout.status]}
                          {payout.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewDetails?.(payout)}
                        className="h-7 w-7 p-0"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {payouts.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/30">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {formatCurrency(payouts.filter(p => p.status === "completed").reduce((s, p) => s + p.net_amount, 0))}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">
                {formatCurrency(totalPending)}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {formatCurrency(payouts.filter(p => p.status === "processing").reduce((s, p) => s + p.net_amount, 0))}
              </p>
              <p className="text-xs text-muted-foreground">Processing</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
