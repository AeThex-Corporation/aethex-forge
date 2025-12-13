import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Clock,
  DollarSign,
  Calendar,
  User,
  Building,
  ArrowRight,
} from "lucide-react";

interface ContractOverviewCardProps {
  contract: {
    id: string;
    title: string;
    status: string;
    contract_type: string;
    total_amount: number;
    creator_payout_amount: number;
    aethex_commission_amount: number;
    start_date?: string;
    end_date?: string;
    milestone_count: number;
    completed_milestones?: number;
  };
  role: "creator" | "client";
  onViewDetails?: () => void;
  onViewTimeLogs?: () => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  active: "bg-green-500/20 text-green-300 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  disputed: "bg-red-500/20 text-red-300 border-red-500/30",
  cancelled: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export function ContractOverviewCard({
  contract,
  role,
  onViewDetails,
  onViewTimeLogs,
}: ContractOverviewCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const completedMilestones = contract.completed_milestones || 0;
  const milestoneProgress = contract.milestone_count > 0 
    ? (completedMilestones / contract.milestone_count) * 100 
    : 0;

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-slate-700/50 hover:border-slate-600/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium truncate">
              {contract.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs capitalize">
                {contract.contract_type.replace("_", " ")}
              </Badge>
              <Badge className={`${statusColors[contract.status]} border text-xs`}>
                {contract.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-emerald-400">
              {formatCurrency(role === "creator" ? contract.creator_payout_amount : contract.total_amount)}
            </p>
            <p className="text-xs text-muted-foreground">
              {role === "creator" ? "Your Payout" : "Contract Value"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {contract.milestone_count > 1 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Milestones</span>
              <span>{completedMilestones}/{contract.milestone_count}</span>
            </div>
            <Progress value={milestoneProgress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          {contract.start_date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Start: {formatDate(contract.start_date)}</span>
            </div>
          )}
          {contract.end_date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>End: {formatDate(contract.end_date)}</span>
            </div>
          )}
        </div>

        {role === "client" && (
          <div className="flex justify-between text-sm pt-2 border-t border-slate-700/30">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="text-slate-400">
              {formatCurrency(contract.aethex_commission_amount)}
            </span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="flex-1"
            >
              <FileText className="w-3 h-3 mr-1" />
              Details
            </Button>
          )}
          {onViewTimeLogs && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewTimeLogs}
              className="flex-1"
            >
              <Clock className="w-3 h-3 mr-1" />
              Time Logs
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
