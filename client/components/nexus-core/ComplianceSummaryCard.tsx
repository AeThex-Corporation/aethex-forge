import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  CreditCard,
  MapPin,
} from "lucide-react";
import type { TalentComplianceSummary, ComplianceStatus } from "@/lib/nexus-core-types";

interface ComplianceSummaryCardProps {
  summary: TalentComplianceSummary;
  onCompleteProfile?: () => void;
  onSubmitW9?: () => void;
  onConnectBank?: () => void;
}

const statusConfig: Record<ComplianceStatus, { color: string; icon: React.ReactNode; label: string }> = {
  pending: { color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: <Clock className="w-4 h-4" />, label: "Pending Review" },
  verified: { color: "bg-green-500/20 text-green-300 border-green-500/30", icon: <CheckCircle className="w-4 h-4" />, label: "Verified" },
  expired: { color: "bg-red-500/20 text-red-300 border-red-500/30", icon: <AlertCircle className="w-4 h-4" />, label: "Expired" },
  rejected: { color: "bg-red-500/20 text-red-300 border-red-500/30", icon: <AlertCircle className="w-4 h-4" />, label: "Rejected" },
  review_needed: { color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: <AlertCircle className="w-4 h-4" />, label: "Review Needed" },
};

export function ComplianceSummaryCard({
  summary,
  onCompleteProfile,
  onSubmitW9,
  onConnectBank,
}: ComplianceSummaryCardProps) {
  const status = statusConfig[summary.compliance_status];
  
  const completionSteps = [
    { done: summary.profile_complete, label: "Profile Complete", action: onCompleteProfile },
    { done: summary.w9_submitted, label: "W-9 Submitted", action: onSubmitW9 },
    { done: summary.bank_connected, label: "Bank Connected", action: onConnectBank },
  ];
  
  const completedCount = completionSteps.filter((s) => s.done).length;
  const completionPercent = (completedCount / completionSteps.length) * 100;

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Compliance Status
          </CardTitle>
          <Badge className={`${status.color} border`}>
            <span className="flex items-center gap-1">
              {status.icon}
              {status.label}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Setup Progress</span>
            <span>{completedCount}/{completionSteps.length} complete</span>
          </div>
          <Progress value={completionPercent} className="h-2" />
        </div>

        <div className="space-y-2">
          {completionSteps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-2 rounded-lg ${
                step.done ? "bg-green-500/10" : "bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2">
                {step.done ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                <span className={step.done ? "text-slate-300" : "text-slate-400"}>
                  {step.label}
                </span>
              </div>
              {!step.done && step.action && (
                <Button size="sm" variant="ghost" onClick={step.action} className="h-7 text-xs">
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/30">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Clock className="w-3 h-3" />
              Hours This Month
            </div>
            <p className="text-xl font-bold">{summary.total_hours_this_month}h</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin className="w-3 h-3" />
              AZ Hours
            </div>
            <p className="text-xl font-bold text-emerald-400">{summary.az_hours_this_month}h</p>
          </div>
        </div>

        {summary.pending_time_logs > 0 && (
          <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300">
              {summary.pending_time_logs} time log(s) pending review
            </span>
          </div>
        )}

        {summary.az_eligible && (
          <Badge className="w-full justify-center bg-emerald-500/20 text-emerald-300 border-emerald-500/30 py-1">
            <MapPin className="w-3 h-3 mr-1" />
            AZ Tax Credit Eligible
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
