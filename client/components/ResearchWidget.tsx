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
  BookMarked,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export interface ResearchTrack {
  id: string;
  title: string;
  description?: string;
  status: "active" | "paused" | "completed" | "on_hold";
  category?: string;
  progress?: number;
  whitepaper_url?: string;
  publications?: number;
  team_members?: number;
  start_date?: string;
}

interface ResearchWidgetProps {
  tracks: ResearchTrack[];
  title?: string;
  description?: string;
  onViewDetails?: (trackId: string) => void;
  accentColor?: "yellow" | "blue" | "purple";
}

const colorMap = {
  yellow: {
    bg: "bg-gradient-to-br from-yellow-950/40 to-yellow-900/20",
    border: "border-yellow-500/20",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
    border: "border-blue-500/20",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-950/40 to-purple-900/20",
    border: "border-purple-500/20",
  },
};

const statusMap = {
  active: {
    label: "Active",
    color: "bg-green-600/50 text-green-100",
    icon: CheckCircle,
  },
  paused: {
    label: "Paused",
    color: "bg-yellow-600/50 text-yellow-100",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-600/50 text-blue-100",
    icon: CheckCircle,
  },
  on_hold: {
    label: "On Hold",
    color: "bg-red-600/50 text-red-100",
    icon: AlertCircle,
  },
};

export function ResearchWidget({
  tracks,
  title = "Active Research Tracks",
  description = "Current research initiatives and whitepapers",
  onViewDetails,
  accentColor = "yellow",
}: ResearchWidgetProps) {
  const colors = colorMap[accentColor];
  const activeCount = tracks.filter((t) => t.status === "active").length;
  const completedCount = tracks.filter((t) => t.status === "completed").length;

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {tracks.length === 0 ? (
          <div className="text-center py-12">
            <BookMarked className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
            <p className="text-gray-400">No active research tracks</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-black/20 rounded-lg mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-lg font-bold text-white">{tracks.length}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Active</p>
                <p className="text-lg font-bold text-green-400">
                  {activeCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Completed</p>
                <p className="text-lg font-bold text-blue-400">
                  {completedCount}
                </p>
              </div>
            </div>

            {/* Tracks List */}
            <div className="space-y-3">
              {tracks.map((track) => {
                const statusInfo = statusMap[track.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={track.id}
                    className="p-4 bg-black/30 rounded-lg border border-gray-500/10 hover:border-gray-500/30 transition space-y-3 cursor-pointer"
                    onClick={() => onViewDetails?.(track.id)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white">
                          {track.title}
                        </h4>
                        {track.category && (
                          <p className="text-xs text-gray-400">
                            {track.category}
                          </p>
                        )}
                      </div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>

                    {/* Description */}
                    {track.description && (
                      <p className="text-sm text-gray-400">
                        {track.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-400 py-2 border-t border-b border-gray-500/10">
                      {track.progress !== undefined && (
                        <span>{track.progress}% complete</span>
                      )}
                      {track.publications && track.publications > 0 && (
                        <span>📄 {track.publications} publications</span>
                      )}
                      {track.team_members && track.team_members > 0 && (
                        <span>👥 {track.team_members} members</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {track.whitepaper_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-500/20 text-gray-300 hover:bg-gray-500/10 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(track.whitepaper_url, "_blank");
                          }}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Whitepaper
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-500/20 text-gray-300 hover:bg-gray-500/10 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails?.(track.id);
                        }}
                      >
                        View Track
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ResearchWidget;
