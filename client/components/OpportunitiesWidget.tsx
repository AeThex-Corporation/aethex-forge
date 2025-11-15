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
  MapPin,
  DollarSign,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export interface Opportunity {
  id: string;
  title: string;
  category?: string;
  budget?: number;
  timeline?: string;
  status: "open" | "in_progress" | "closed";
  description?: string;
  applications_count?: number;
  posted_by?: string;
  location?: string;
  skills_required?: string[];
}

interface OpportunitiesWidgetProps {
  opportunities: Opportunity[];
  title?: string;
  description?: string;
  onViewDetails?: (oppId: string) => void;
  onApply?: (oppId: string) => void;
  showApplyButton?: boolean;
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

const statusBadge = {
  open: "bg-green-600/50 text-green-100",
  in_progress: "bg-blue-600/50 text-blue-100",
  closed: "bg-gray-600/50 text-gray-100",
};

export function OpportunitiesWidget({
  opportunities,
  title = "Opportunities",
  description = "Available jobs and projects",
  onViewDetails,
  onApply,
  showApplyButton = true,
  accentColor = "purple",
}: OpportunitiesWidgetProps) {
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
            <AlertCircle className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
            <p className="text-gray-400">No opportunities available</p>
          </div>
        ) : (
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
                {opp.skills_required && opp.skills_required.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {opp.skills_required.slice(0, 3).map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-gray-600/30 text-gray-200 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {opp.skills_required.length > 3 && (
                      <Badge className="bg-gray-600/30 text-gray-200 text-xs">
                        +{opp.skills_required.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-2 border-t border-gray-500/10">
                  {opp.budget && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${opp.budget.toLocaleString()}</span>
                    </div>
                  )}
                  {opp.timeline && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{opp.timeline}</span>
                    </div>
                  )}
                  {opp.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{opp.location}</span>
                    </div>
                  )}
                  {opp.applications_count !== undefined && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{opp.applications_count} applications</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {onViewDetails && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-500/20 text-gray-300 hover:bg-gray-500/10"
                      onClick={() => onViewDetails(opp.id)}
                    >
                      View Details
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                  {showApplyButton && onApply && (
                    <Button
                      size="sm"
                      className={colors.accent}
                      onClick={() => onApply(opp.id)}
                    >
                      Apply
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default OpportunitiesWidget;
