import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

export interface PayoutData {
  available_for_payout: number;
  pending_30_day_clearance: number;
  total_earned: number;
  stripe_connected: boolean;
  stripe_account_id?: string;
  last_payout_date?: string;
  next_payout_date?: string;
  payout_history?: PayoutRecord[];
}

export interface PayoutRecord {
  id: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description?: string;
}

interface PayoutsWidgetProps {
  data: PayoutData;
  onConnectStripe?: () => void;
  onRequestPayout?: () => void;
  accentColor?: "purple" | "blue" | "cyan" | "green" | "amber" | "red";
}

const colorMap = {
  purple: {
    bg: "bg-gradient-to-br from-purple-950/40 to-purple-900/20",
    border: "border-purple-500/20",
    accent: "bg-purple-600 hover:bg-purple-700",
    text: "text-purple-300",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
    border: "border-blue-500/20",
    accent: "bg-blue-600 hover:bg-blue-700",
    text: "text-blue-300",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-950/40 to-cyan-900/20",
    border: "border-cyan-500/20",
    accent: "bg-cyan-600 hover:bg-cyan-700",
    text: "text-cyan-300",
  },
  green: {
    bg: "bg-gradient-to-br from-green-950/40 to-green-900/20",
    border: "border-green-500/20",
    accent: "bg-green-600 hover:bg-green-700",
    text: "text-green-300",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-950/40 to-amber-900/20",
    border: "border-amber-500/20",
    accent: "bg-amber-600 hover:bg-amber-700",
    text: "text-amber-300",
  },
  red: {
    bg: "bg-gradient-to-br from-red-950/40 to-red-900/20",
    border: "border-red-500/20",
    accent: "bg-red-600 hover:bg-red-700",
    text: "text-red-300",
  },
};

export function PayoutsWidget({
  data,
  onConnectStripe,
  onRequestPayout,
  accentColor = "purple",
}: PayoutsWidgetProps) {
  const colors = colorMap[accentColor];

  if (!data.stripe_connected) {
    return (
      <Card className={`${colors.bg} border ${colors.border}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payout Information
          </CardTitle>
          <CardDescription>Manage how you receive payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-black/30 rounded-lg border border-yellow-500/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-white">Connect Stripe Account</p>
              <p className="text-sm text-gray-400 mt-1">
                To receive payouts for completed contracts, you need to connect
                your Stripe account.
              </p>
            </div>
          </div>
          <Button onClick={onConnectStripe} className={colors.accent}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Connect Stripe Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payout Information
        </CardTitle>
        <CardDescription>
          {data.stripe_account_id && (
            <>Connected to {data.stripe_account_id} • </>
          )}
          Manage your earnings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Available for Payout */}
          <div className="p-4 bg-black/30 rounded-lg border border-green-500/20 space-y-2">
            <p className="text-sm text-gray-400">Available for Payout</p>
            <p className="text-3xl font-bold text-green-400">
              $
              {data.available_for_payout.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 flex-1"
                onClick={onRequestPayout}
              >
                Request Payout
              </Button>
            </div>
          </div>

          {/* Pending Clearance */}
          <div className="p-4 bg-black/30 rounded-lg border border-yellow-500/20 space-y-2">
            <p className="text-sm text-gray-400">Pending (30-day Clearance)</p>
            <p className="text-3xl font-bold text-yellow-400">
              $
              {data.pending_30_day_clearance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500">
              Next payout:{" "}
              {data.next_payout_date
                ? new Date(data.next_payout_date).toLocaleDateString()
                : "TBD"}
            </p>
          </div>

          {/* Total Earned */}
          <div className="p-4 bg-black/30 rounded-lg border border-blue-500/20 space-y-2">
            <p className="text-sm text-gray-400">Total Earned (All-Time)</p>
            <p className="text-3xl font-bold text-blue-400">
              $
              {data.total_earned.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500">
              Last payout:{" "}
              {data.last_payout_date
                ? new Date(data.last_payout_date).toLocaleDateString()
                : "Never"}
            </p>
          </div>
        </div>

        {/* Payout History */}
        {data.payout_history && data.payout_history.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Payout History</h3>
            <div className="space-y-2">
              {data.payout_history.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-500/10 hover:border-gray-500/30 transition"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {payout.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : payout.status === "pending" ? (
                      <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">
                        $
                        {payout.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      {payout.description && (
                        <p className="text-xs text-gray-400 truncate">
                          {payout.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(payout.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      payout.status === "completed"
                        ? "bg-green-600/50 text-green-100"
                        : payout.status === "pending"
                          ? "bg-yellow-600/50 text-yellow-100"
                          : "bg-red-600/50 text-red-100"
                    }
                  >
                    {payout.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-black/40 rounded-lg border border-gray-500/20 space-y-2">
          <p className="text-sm font-semibold text-white">How Payouts Work</p>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Earnings are available 30 days after contract completion</li>
            <li>Payouts are processed on Mondays (if minimum balance met)</li>
            <li>Stripe processes payments to your connected bank account</li>
            <li>Check your Stripe dashboard for payment tracking</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default PayoutsWidget;
