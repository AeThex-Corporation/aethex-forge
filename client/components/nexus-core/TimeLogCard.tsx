import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, CheckCircle, XCircle, Send, Edit, Trash2 } from "lucide-react";
import type { NexusTimeLog } from "@/lib/nexus-core-types";

interface TimeLogCardProps {
  timeLog: NexusTimeLog;
  onEdit?: () => void;
  onDelete?: () => void;
  onSubmit?: () => void;
  showActions?: boolean;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  submitted: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  approved: "bg-green-500/20 text-green-300 border-green-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
  exported: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  draft: <Edit className="w-3 h-3" />,
  submitted: <Send className="w-3 h-3" />,
  approved: <CheckCircle className="w-3 h-3" />,
  rejected: <XCircle className="w-3 h-3" />,
  exported: <CheckCircle className="w-3 h-3" />,
};

export function TimeLogCard({
  timeLog,
  onEdit,
  onDelete,
  onSubmit,
  showActions = true,
}: TimeLogCardProps) {
  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString([], { 
      weekday: "short", 
      month: "short", 
      day: "numeric" 
    });
  };

  const canEdit = timeLog.submission_status === "draft" || timeLog.submission_status === "rejected";
  const canDelete = timeLog.submission_status === "draft";
  const canSubmit = timeLog.submission_status === "draft" || timeLog.submission_status === "rejected";

  return (
    <Card className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 border-slate-700/30 hover:border-slate-600/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="font-medium">{timeLog.hours_worked}h</span>
              <span className="text-muted-foreground text-sm">
                {formatTime(timeLog.start_time)} - {formatTime(timeLog.end_time)}
              </span>
              <span className="text-muted-foreground text-sm">
                • {formatDate(timeLog.log_date)}
              </span>
            </div>

            {timeLog.description && (
              <p className="text-sm text-slate-300 line-clamp-2">{timeLog.description}</p>
            )}

            <div className="flex items-center gap-3 text-sm">
              {timeLog.location_state && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {timeLog.location_city && `${timeLog.location_city}, `}
                  {timeLog.location_state}
                </span>
              )}
              {timeLog.task_category && (
                <Badge variant="outline" className="text-xs">
                  {timeLog.task_category}
                </Badge>
              )}
              {timeLog.az_eligible_hours > 0 && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                  AZ Eligible: {timeLog.az_eligible_hours}h
                </Badge>
              )}
              {timeLog.location_verified && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                  GPS Verified
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge className={`${statusColors[timeLog.submission_status]} border`}>
              <span className="flex items-center gap-1">
                {statusIcons[timeLog.submission_status]}
                {timeLog.submission_status}
              </span>
            </Badge>

            {showActions && (
              <div className="flex items-center gap-1">
                {canSubmit && onSubmit && (
                  <Button size="sm" variant="ghost" onClick={onSubmit} className="h-7 px-2">
                    <Send className="w-3 h-3" />
                  </Button>
                )}
                {canEdit && onEdit && (
                  <Button size="sm" variant="ghost" onClick={onEdit} className="h-7 px-2">
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
                {canDelete && onDelete && (
                  <Button size="sm" variant="ghost" onClick={onDelete} className="h-7 px-2 text-red-400 hover:text-red-300">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {timeLog.billable && !timeLog.billed && (
          <div className="mt-2 pt-2 border-t border-slate-700/30">
            <span className="text-xs text-amber-400">Billable • Not yet invoiced</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
