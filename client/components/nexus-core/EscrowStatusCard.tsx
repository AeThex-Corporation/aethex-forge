import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, DollarSign, Lock, Unlock, AlertTriangle } from "lucide-react";
import type { NexusEscrowLedger } from "@/lib/nexus-core-types";

interface EscrowStatusCardProps {
  escrow: NexusEscrowLedger;
  isClient?: boolean;
  onFundEscrow?: () => void;
  onReleaseRequest?: () => void;
}

const statusColors: Record<string, string> = {
  unfunded: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  funded: "bg-green-500/20 text-green-300 border-green-500/30",
  partially_funded: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  released: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  disputed: "bg-red-500/20 text-red-300 border-red-500/30",
  refunded: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  unfunded: <Lock className="w-4 h-4" />,
  funded: <Shield className="w-4 h-4" />,
  partially_funded: <AlertTriangle className="w-4 h-4" />,
  released: <Unlock className="w-4 h-4" />,
  disputed: <AlertTriangle className="w-4 h-4" />,
  refunded: <DollarSign className="w-4 h-4" />,
};

export function EscrowStatusCard({
  escrow,
  isClient = false,
  onFundEscrow,
  onReleaseRequest,
}: EscrowStatusCardProps) {
  const releasePercent = escrow.funds_deposited > 0 
    ? (escrow.funds_released / escrow.funds_deposited) * 100 
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Escrow Account
          </CardTitle>
          <Badge className={`${statusColors[escrow.status]} border`}>
            <span className="flex items-center gap-1">
              {statusIcons[escrow.status]}
              {escrow.status.replace("_", " ")}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-2xl font-bold text-emerald-400">
              {formatCurrency(escrow.escrow_balance)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Deposited</p>
            <p className="text-xl font-semibold text-slate-300">
              {formatCurrency(escrow.funds_deposited)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Released</span>
            <span>{formatCurrency(escrow.funds_released)} ({releasePercent.toFixed(0)}%)</span>
          </div>
          <Progress value={releasePercent} className="h-2" />
        </div>

        {escrow.aethex_fees > 0 && (
          <div className="flex justify-between text-sm pt-2 border-t border-slate-700/50">
            <span className="text-muted-foreground">Platform Fees</span>
            <span className="text-slate-400">{formatCurrency(escrow.aethex_fees)}</span>
          </div>
        )}

        {escrow.funds_refunded > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Refunded</span>
            <span className="text-amber-400">{formatCurrency(escrow.funds_refunded)}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {isClient && escrow.status === "unfunded" && onFundEscrow && (
            <Button onClick={onFundEscrow} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <DollarSign className="w-4 h-4 mr-2" />
              Fund Escrow
            </Button>
          )}
          {!isClient && escrow.status === "funded" && onReleaseRequest && (
            <Button onClick={onReleaseRequest} variant="outline" className="flex-1">
              <Unlock className="w-4 h-4 mr-2" />
              Request Release
            </Button>
          )}
        </div>

        {escrow.funded_at && (
          <p className="text-xs text-muted-foreground text-center">
            Funded on {new Date(escrow.funded_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
