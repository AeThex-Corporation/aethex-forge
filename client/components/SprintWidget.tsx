import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, TrendingUp } from "lucide-react";

interface SprintWidget {
  id: string;
  project_name?: string;
  sprint_number?: number;
  start_date: string;
  end_date: string;
  status: "planning" | "active" | "completed";
  scope?: string;
  team_size?: number;
  tasks_total?: number;
  tasks_completed?: number;
}

interface SprintWidgetProps {
  sprint: SprintWidget | null;
  accentColor?: "green" | "blue" | "purple";
}

const colorMap = {
  green: {
    bg: "bg-gradient-to-br from-green-950/40 to-green-900/20",
    border: "border-green-500/20",
    accent: "text-green-400",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
    border: "border-blue-500/20",
    accent: "text-blue-400",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-950/40 to-purple-900/20",
    border: "border-purple-500/20",
    accent: "text-purple-400",
  },
};

export function SprintWidgetComponent({
  sprint,
  accentColor = "green",
}: SprintWidgetProps) {
  const colors = colorMap[accentColor];

  if (!sprint) {
    return (
      <Card className={`${colors.bg} border ${colors.border}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Active Sprint
          </CardTitle>
          <CardDescription>Sprint timeline and countdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Zap className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
            <p className="text-gray-400">No active sprint</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const now = new Date();
  const endDate = new Date(sprint.end_date);
  const daysRemaining = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const isActive = sprint.status === "active";
  const progress =
    sprint.tasks_total && sprint.tasks_total > 0
      ? Math.round(((sprint.tasks_completed || 0) / sprint.tasks_total) * 100)
      : 0;

  const formatCountdown = (days: number) => {
    if (days < 0) return "Sprint Over";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days left`;
  };

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {sprint.project_name || "Sprint"}
              {sprint.sprint_number && (
                <span className="text-sm font-normal text-gray-400">
                  #{sprint.sprint_number}
                </span>
              )}
            </CardTitle>
            <CardDescription>Sprint timeline and progress</CardDescription>
          </div>
          <Badge
            className={
              isActive
                ? "bg-green-600/50 text-green-100"
                : "bg-blue-600/50 text-blue-100"
            }
          >
            {sprint.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Countdown */}
        <div className="p-4 bg-gradient-to-br from-black/50 to-black/30 rounded-lg border border-gray-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Days Remaining</p>
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <div className={`text-3xl font-bold ${colors.accent}`}>
            {daysRemaining > 0 ? daysRemaining : 0} days
          </div>
          <p className="text-sm text-gray-400">
            {formatCountdown(daysRemaining)}
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-300 uppercase">
            Timeline
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 bg-black/30 rounded border border-gray-500/10">
              <p className="text-xs text-gray-400">Start</p>
              <p className="text-sm font-semibold text-white">
                {new Date(sprint.start_date).toLocaleDateString()}
              </p>
            </div>
            <div className="p-2 bg-black/30 rounded border border-gray-500/10">
              <p className="text-xs text-gray-400">End</p>
              <p className="text-sm font-semibold text-white">
                {new Date(sprint.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Task Progress */}
        {sprint.tasks_total && sprint.tasks_total > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-300 uppercase">
                Task Progress
              </p>
              <p className="text-sm font-bold text-white">{progress}%</p>
            </div>
            <div className="w-full bg-black/50 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {sprint.tasks_completed || 0} of {sprint.tasks_total} tasks
              completed
            </p>
          </div>
        )}

        {/* Scope */}
        {sprint.scope && (
          <div className="p-3 bg-black/30 rounded-lg border border-gray-500/10 space-y-2">
            <p className="text-xs font-semibold text-gray-300 uppercase">
              Scope
            </p>
            <p className="text-sm text-gray-300">{sprint.scope}</p>
          </div>
        )}

        {/* Team */}
        {sprint.team_size && (
          <div className="p-3 bg-black/30 rounded-lg border border-gray-500/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-300 uppercase">
                Team Size
              </p>
              <p className="text-sm text-gray-300 mt-1">
                {sprint.team_size} members
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-gray-500" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SprintWidgetComponent;
