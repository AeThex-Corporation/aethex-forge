import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
} from "lucide-react";

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  due_date: string;
  value?: number;
  progress?: number;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: "active" | "completed" | "paused" | "cancelled";
  start_date: string;
  end_date: string;
  total_value?: number;
  milestones?: Milestone[];
}

interface ProjectStatusWidgetProps {
  project: Project | null;
  accentColor?: "blue" | "cyan" | "purple";
}

const colorMap = {
  blue: {
    bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
    border: "border-blue-500/20",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-950/40 to-cyan-900/20",
    border: "border-cyan-500/20",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-950/40 to-purple-900/20",
    border: "border-purple-500/20",
  },
};

export function ProjectStatusWidget({
  project,
  accentColor = "cyan",
}: ProjectStatusWidgetProps) {
  const colors = colorMap[accentColor];

  if (!project) {
    return (
      <Card className={`${colors.bg} border ${colors.border}`}>
        <CardHeader>
          <CardTitle>Project Status</CardTitle>
          <CardDescription>Timeline and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
            <p className="text-gray-400">No active project</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedMilestones =
    project.milestones?.filter((m) => m.status === "completed").length || 0;
  const totalMilestones = project.milestones?.length || 0;
  const completionPercentage =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <CardTitle>Project Status & Timeline</CardTitle>
        <CardDescription>Track milestones and project progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Header */}
        <div className="border-b border-gray-500/20 pb-4">
          <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-gray-400 mb-4">{project.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase">Start</p>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <p className="font-semibold text-white">
                  {new Date(project.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">End</p>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <p className="font-semibold text-white">
                  {new Date(project.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Value</p>
              <div className="flex items-center gap-1 mt-1">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <p className="font-semibold text-white">
                  ${(project.total_value || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Status</p>
              <Badge className="bg-blue-600/50 text-blue-100 mt-1">
                {project.status}
              </Badge>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Overall Progress</span>
              <span className="font-semibold text-white">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {completedMilestones} of {totalMilestones} milestones completed
            </p>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white">Milestones</h4>
          {project.milestones && project.milestones.length > 0 ? (
            <div className="space-y-3">
              {project.milestones.map((milestone, idx) => {
                const daysRemaining = getDaysRemaining(milestone.due_date);
                const isOverdue =
                  daysRemaining < 0 && milestone.status !== "completed";

                return (
                  <div key={milestone.id} className="space-y-2">
                    {/* Milestone Header */}
                    <div className="flex items-start gap-3">
                      {getStatusIcon(milestone.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-white">
                              {milestone.title}
                            </p>
                            {milestone.description && (
                              <p className="text-xs text-gray-400 mt-1">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            {milestone.value && (
                              <p className="text-sm font-semibold text-white">
                                ${milestone.value.toLocaleString()}
                              </p>
                            )}
                            <p
                              className={`text-xs ${isOverdue ? "text-red-400" : "text-gray-400"}`}
                            >
                              {isOverdue
                                ? `${Math.abs(daysRemaining)} days overdue`
                                : `${daysRemaining} days remaining`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Milestone Progress Bar */}
                    <div className="ml-8 space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{milestone.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-black/50 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getStatusColor(milestone.status)}`}
                          style={{ width: `${milestone.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-4">
              No milestones defined
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectStatusWidget;
