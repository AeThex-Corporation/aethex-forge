import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";

export interface Contract {
  id: string;
  title: string;
  client_name?: string;
  creator_name?: string;
  status: "active" | "completed" | "paused" | "cancelled";
  total_amount: number;
  paid_amount?: number;
  start_date?: string;
  end_date?: string;
  description?: string;
  milestones?: Milestone[];
}

export interface Milestone {
  id: string;
  description: string;
  amount: number;
  status: "pending" | "approved" | "paid";
}

interface ContractsWidgetProps {
  contracts: Contract[];
  title?: string;
  description?: string;
  type?: "creator" | "client";
  accentColor?: "purple" | "blue" | "cyan" | "green" | "amber" | "red";
}

const colorMap = {
  purple: {
    bg: "bg-gradient-to-br from-purple-950/40 to-purple-900/20",
    border: "border-purple-500/20",
    text: "text-purple-300",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
    border: "border-blue-500/20",
    text: "text-blue-300",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-950/40 to-cyan-900/20",
    border: "border-cyan-500/20",
    text: "text-cyan-300",
  },
  green: {
    bg: "bg-gradient-to-br from-green-950/40 to-green-900/20",
    border: "border-green-500/20",
    text: "text-green-300",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-950/40 to-amber-900/20",
    border: "border-amber-500/20",
    text: "text-amber-300",
  },
  red: {
    bg: "bg-gradient-to-br from-red-950/40 to-red-900/20",
    border: "border-red-500/20",
    text: "text-red-300",
  },
};

const statusMap = {
  active: { color: "bg-green-600/50 text-green-100", icon: CheckCircle },
  completed: { color: "bg-blue-600/50 text-blue-100", icon: CheckCircle },
  paused: { color: "bg-yellow-600/50 text-yellow-100", icon: Clock },
  cancelled: { color: "bg-red-600/50 text-red-100", icon: AlertCircle },
};

export function ContractsWidget({
  contracts,
  title = "My Contracts",
  description = "Active and completed projects",
  type = "creator",
  accentColor = "purple",
}: ContractsWidgetProps) {
  const colors = colorMap[accentColor];
  const activeContracts = contracts.filter((c) => c.status === "active");

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
            <p className="text-gray-400">No contracts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => {
              const StatusIcon = statusMap[contract.status].icon;
              const progress =
                contract.paid_amount && contract.total_amount
                  ? Math.round(
                      (contract.paid_amount / contract.total_amount) * 100,
                    )
                  : 0;

              return (
                <div
                  key={contract.id}
                  className="p-4 bg-black/30 rounded-lg border border-gray-500/10 hover:border-gray-500/30 transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">
                        {contract.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {type === "creator" ? (
                          <>with {contract.client_name || "Client"}</>
                        ) : (
                          <>with {contract.creator_name || "Creator"}</>
                        )}
                      </p>
                    </div>
                    <Badge className={statusMap[contract.status].color}>
                      {contract.status}
                    </Badge>
                  </div>

                  {contract.description && (
                    <p className="text-sm text-gray-400">
                      {contract.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Total Value</p>
                      <p className="font-semibold text-white">
                        ${contract.total_amount.toLocaleString()}
                      </p>
                    </div>
                    {contract.paid_amount !== undefined && (
                      <div>
                        <p className="text-gray-400">Paid</p>
                        <p className="font-semibold text-green-400">
                          ${contract.paid_amount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {contract.milestones && contract.milestones.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray-500/10">
                      <p className="text-xs font-semibold text-gray-300 uppercase">
                        Milestones
                      </p>
                      <div className="space-y-2">
                        {contract.milestones.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div
                                className="h-2 w-2 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    m.status === "paid"
                                      ? "#22c55e"
                                      : m.status === "approved"
                                        ? "#3b82f6"
                                        : "#666",
                                }}
                              />
                              <span className="text-gray-300 truncate">
                                {m.description}
                              </span>
                            </div>
                            <span className="text-gray-400 flex-shrink-0">
                              ${m.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ContractsWidget;
