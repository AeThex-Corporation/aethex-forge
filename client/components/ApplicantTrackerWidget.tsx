import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export interface Applicant {
  id: string;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  opportunity?: {
    id: string;
    title: string;
  };
  status: "applied" | "interviewing" | "hired";
  rating?: number;
  notes?: string;
  applied_at?: string;
}

interface ApplicantTrackerWidgetProps {
  applicants: Applicant[];
  title?: string;
  description?: string;
  onViewProfile?: (applicantId: string) => void;
  onMessage?: (applicantId: string) => void;
  onUpdateStatus?: (
    applicantId: string,
    newStatus: "applied" | "interviewing" | "hired",
  ) => void;
  accentColor?: "blue" | "purple" | "cyan" | "green";
}

const statusColors = {
  applied: {
    bg: "bg-blue-950/40",
    border: "border-blue-500/20",
    badge: "bg-blue-600/50 text-blue-100",
    label: "Applied",
    icon: Clock,
  },
  interviewing: {
    bg: "bg-purple-950/40",
    border: "border-purple-500/20",
    badge: "bg-purple-600/50 text-purple-100",
    label: "Interviewing",
    icon: MessageCircle,
  },
  hired: {
    bg: "bg-green-950/40",
    border: "border-green-500/20",
    badge: "bg-green-600/50 text-green-100",
    label: "Hired",
    icon: CheckCircle,
  },
};

const nextStatusMap: Record<string, "applied" | "interviewing" | "hired"> = {
  applied: "interviewing",
  interviewing: "hired",
  hired: "applied",
};

export function ApplicantTrackerWidget({
  applicants,
  title = "Applicant Tracker",
  description = "Track applicants through your hiring pipeline",
  onViewProfile,
  onMessage,
  onUpdateStatus,
  accentColor = "blue",
}: ApplicantTrackerWidgetProps) {
  const [draggedApplicant, setDraggedApplicant] = useState<string | null>(null);

  const statusCounts = {
    applied: applicants.filter((a) => a.status === "applied").length,
    interviewing: applicants.filter((a) => a.status === "interviewing").length,
    hired: applicants.filter((a) => a.status === "hired").length,
  };

  const allStatuses: Array<"applied" | "interviewing" | "hired"> = [
    "applied",
    "interviewing",
    "hired",
  ];

  const handleDragStart = (applicantId: string) => {
    setDraggedApplicant(applicantId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: "applied" | "interviewing" | "hired") => {
    if (draggedApplicant) {
      onUpdateStatus?.(draggedApplicant, status);
      setDraggedApplicant(null);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {applicants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
            <p className="text-gray-400">No applicants yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allStatuses.map((status) => {
              const statusInfo = statusColors[status];
              const StatusIcon = statusInfo.icon;
              const statusApplicants = applicants.filter(
                (a) => a.status === status,
              );

              return (
                <div
                  key={status}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(status)}
                  className={`p-4 rounded-lg border-2 border-dashed transition ${statusInfo.border} ${statusInfo.bg}`}
                >
                  {/* Column Header */}
                  <div className="mb-4 pb-3 border-b border-gray-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIcon className="h-4 w-4" />
                      <span className="font-semibold text-white">
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-100">
                      {statusApplicants.length}
                    </p>
                  </div>

                  {/* Applicants List */}
                  <div className="space-y-2">
                    {statusApplicants.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        Drag applicants here
                      </div>
                    ) : (
                      statusApplicants.map((app) => (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={() => handleDragStart(app.id)}
                          className="p-3 bg-black/40 rounded-lg border border-gray-500/10 cursor-move hover:border-gray-500/30 hover:bg-black/50 transition space-y-2"
                        >
                          {/* Applicant Info */}
                          <div className="flex items-start gap-2">
                            {app.user?.avatar_url && (
                              <img
                                src={app.user.avatar_url}
                                alt={app.user.name}
                                className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-white text-sm truncate">
                                {app.user?.name || "Unknown"}
                              </p>
                              {app.opportunity?.title && (
                                <p className="text-xs text-gray-400 truncate">
                                  {app.opportunity.title}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Rating */}
                          {app.rating && (
                            <div className="flex items-center gap-1">
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-xs ${
                                      i < Math.floor(app.rating || 0)
                                        ? "text-yellow-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {app.notes && (
                            <p className="text-xs text-gray-400 line-clamp-2 italic">
                              "{app.notes}"
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex gap-1 pt-2 border-t border-gray-500/10">
                            {onViewProfile && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 h-7 text-xs border-gray-500/20 text-gray-300 hover:bg-gray-500/10"
                                onClick={() => onViewProfile(app.id)}
                              >
                                View
                              </Button>
                            )}
                            {onMessage && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 border-gray-500/20 text-gray-300 hover:bg-gray-500/10"
                                onClick={() => onMessage(app.id)}
                              >
                                <MessageCircle className="h-3 w-3" />
                              </Button>
                            )}
                          </div>

                          {/* Applied Date */}
                          {app.applied_at && (
                            <p className="text-xs text-gray-500 text-right">
                              {new Date(app.applied_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ApplicantTrackerWidget;
