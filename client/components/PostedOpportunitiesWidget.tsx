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
  Briefcase,
  AlertCircle,
  BarChart3,
  Clock,
  Users,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export interface PostedOpportunity {
  id: string;
  title: string;
  description?: string;
  category?: string;
  budget?: number;
  status: "open" | "in_progress" | "closed" | "paused";
  applications_count?: number;
  created_at?: string;
  deadline?: string;
  required_skills?: string[];
  experience_level?: string;
}

interface PostedOpportunitiesWidgetProps {
  opportunities: PostedOpportunity[];
  title?: string;
  description?: string;
  onViewDetails?: (oppId: string) => void;
  onEdit?: (oppId: string) => void;
  onViewApplications?: (oppId: string) => void;
  accentColor?: "blue" | "purple" | "cyan" | "green" | "amber" | "red";
}

const colorMap = {
  purple: {
    bg: "bg-gradient-to-br from-purple-950/40 to-purple-900/20",
    border: "border-purple-500/20",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
    border: "border-blue-500/20",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-950/40 to-cyan-900/20",
    border: "border-cyan-500/20",
  },
  green: {
    bg: "bg-gradient-to-br from-green-950/40 to-green-900/20",
    border: "border-green-500/20",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-950/40 to-amber-900/20",
    border: "border-amber-500/20",
  },
  red: {
    bg: "bg-gradient-to-br from-red-950/40 to-red-900/20",
    border: "border-red-500/20",
  },
};

const statusBadge = {
  open: "bg-green-600/50 text-green-100",
  in_progress: "bg-blue-600/50 text-blue-100",
  paused: "bg-yellow-600/50 text-yellow-100",
  closed: "bg-gray-600/50 text-gray-100",
};

export function PostedOpportunitiesWidget({
  opportunities,
  title = "My Posted Opportunities",
  description = "Manage your job postings",
  onViewDetails,
  onEdit,
  onViewApplications,
  accentColor = "blue",
}: PostedOpportunitiesWidgetProps) {
  const colors = colorMap[accentColor];

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
        {opportunities.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
            <p className="text-gray-400 mb-4">No opportunities posted yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Start by posting a job opportunity to find talented creators
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-black/20 rounded-lg mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Posted</p>
                <p className="text-lg font-bold text-white">
                  {opportunities.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Open</p>
                <p className="text-lg font-bold text-green-400">
                  {opportunities.filter((o) => o.status === "open").length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">In Progress</p>
                <p className="text-lg font-bold text-blue-400">
                  {
                    opportunities.filter((o) => o.status === "in_progress")
                      .length
                  }
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Applicants</p>
                <p className="text-lg font-bold text-purple-400">
                  {opportunities.reduce(
                    (sum, o) => sum + (o.applications_count || 0),
                    0,
                  )}
                </p>
              </div>
            </div>

            {/* Opportunities List */}
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 bg-black/30 rounded-lg border border-gray-500/10 hover:border-gray-500/30 transition space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">
                        {opp.title}
                      </h4>
                      {opp.category && (
                        <p className="text-xs text-gray-400 mt-1">
                          {opp.category}
                        </p>
                      )}
                    </div>
                    <Badge className={statusBadge[opp.status]}>
                      {opp.status}
                    </Badge>
                  </div>

                  {/* Description */}
                  {opp.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {opp.description}
                    </p>
                  )}

                  {/* Skills */}
                  {opp.required_skills && opp.required_skills.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {opp.required_skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-gray-600/30 text-gray-200 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {opp.required_skills.length > 3 && (
                        <Badge className="bg-gray-600/30 text-gray-200 text-xs">
                          +{opp.required_skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Meta Information */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-2 border-t border-gray-500/10">
                    {opp.budget && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>${opp.budget.toLocaleString()}</span>
                      </div>
                    )}
                    {opp.experience_level && (
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>{opp.experience_level}</span>
                      </div>
                    )}
                    {opp.deadline && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          Due {new Date(opp.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {opp.applications_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>
                          {opp.applications_count}{" "}
                          {opp.applications_count === 1
                            ? "application"
                            : "applications"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 flex-wrap">
                    {onViewApplications && opp.applications_count! > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-500/20 text-gray-300 hover:bg-gray-500/10"
                        onClick={() => onViewApplications(opp.id)}
                      >
                        <Users className="h-3 w-3 mr-1" />
                        {opp.applications_count} Applications
                      </Button>
                    )}
                    {onViewDetails && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-500/20 text-gray-300 hover:bg-gray-500/10"
                        onClick={() => onViewDetails(opp.id)}
                      >
                        View
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => onEdit(opp.id)}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PostedOpportunitiesWidget;
