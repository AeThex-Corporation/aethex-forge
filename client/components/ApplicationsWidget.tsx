import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Application {
  id: string;
  title?: string;
  opportunity?: {
    id: string;
    title: string;
    description?: string;
    category?: string;
    budget?: number;
  };
  status: "submitted" | "accepted" | "rejected" | "interview" | "pending";
  proposed_rate?: number;
  proposed_rate_type?: "hourly" | "fixed" | "percentage";
  cover_letter?: string;
  created_at?: string;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

interface ApplicationsWidgetProps {
  applications: Application[];
  title?: string;
  description?: string;
  accentColor?: "purple" | "blue" | "cyan" | "green" | "amber" | "red";
  onViewDetails?: (application: Application) => void;
  showCTA?: boolean;
  ctaText?: string;
  onCTA?: () => void;
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
  submitted: {
    color: "bg-blue-600/50 text-blue-100",
    icon: Clock,
    label: "Submitted",
  },
  pending: {
    color: "bg-yellow-600/50 text-yellow-100",
    icon: Clock,
    label: "Pending",
  },
  accepted: {
    color: "bg-green-600/50 text-green-100",
    icon: CheckCircle,
    label: "Accepted",
  },
  rejected: {
    color: "bg-red-600/50 text-red-100",
    icon: AlertCircle,
    label: "Rejected",
  },
  interview: {
    color: "bg-purple-600/50 text-purple-100",
    icon: Briefcase,
    label: "Interview",
  },
};

export function ApplicationsWidget({
  applications,
  title = "My Applications",
  description = "Track all your job applications and bids",
  accentColor = "purple",
  onViewDetails,
  showCTA = false,
  ctaText = "Browse More Opportunities",
  onCTA,
}: ApplicationsWidgetProps) {
  const colors = colorMap[accentColor];
  const statusCounts = {
    submitted: applications.filter((a) => a.status === "submitted").length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    interview: applications.filter((a) => a.status === "interview").length,
  };

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
            <p className="text-gray-400 mb-4">No applications yet</p>
            {showCTA && onCTA && (
              <Button
                onClick={onCTA}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                {ctaText}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status Summary */}
            {Object.entries(statusCounts).filter(([_, count]) => count > 0)
              .length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 p-3 bg-black/20 rounded-lg">
                {statusCounts.submitted > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Submitted</p>
                    <p className="text-lg font-bold text-blue-400">
                      {statusCounts.submitted}
                    </p>
                  </div>
                )}
                {statusCounts.interview > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Interview</p>
                    <p className="text-lg font-bold text-purple-400">
                      {statusCounts.interview}
                    </p>
                  </div>
                )}
                {statusCounts.accepted > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Accepted</p>
                    <p className="text-lg font-bold text-green-400">
                      {statusCounts.accepted}
                    </p>
                  </div>
                )}
                {statusCounts.pending > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Pending</p>
                    <p className="text-lg font-bold text-yellow-400">
                      {statusCounts.pending}
                    </p>
                  </div>
                )}
                {statusCounts.rejected > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Rejected</p>
                    <p className="text-lg font-bold text-red-400">
                      {statusCounts.rejected}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Applications List */}
            <div className="space-y-3">
              {applications.map((app) => {
                const statusInfo = statusMap[app.status];
                const StatusIcon = statusInfo.icon;
                const rateDisplay = app.proposed_rate
                  ? `$${app.proposed_rate.toLocaleString()}${app.proposed_rate_type === "hourly" ? "/hr" : ""}`
                  : "N/A";

                return (
                  <div
                    key={app.id}
                    className="p-4 bg-black/30 rounded-lg border border-gray-500/10 hover:border-gray-500/30 transition space-y-3 cursor-pointer"
                    onClick={() => onViewDetails?.(app)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">
                          {app.opportunity?.title ||
                            app.title ||
                            "Untitled Opportunity"}
                        </h4>
                        {app.opportunity?.category && (
                          <p className="text-sm text-gray-400 mt-1">
                            {app.opportunity.category}
                          </p>
                        )}
                      </div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>

                    {app.opportunity?.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {app.opportunity.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Proposed: {rateDisplay}
                      </span>
                      {app.created_at && (
                        <span className="text-gray-500">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {app.cover_letter && (
                      <p className="text-xs text-gray-500 italic">
                        "{app.cover_letter.substring(0, 100)}..."
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {showCTA && onCTA && applications.length > 0 && (
              <Button onClick={onCTA} variant="outline" className="w-full mt-4">
                <ArrowRight className="h-4 w-4 mr-2" />
                {ctaText}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ApplicationsWidget;
