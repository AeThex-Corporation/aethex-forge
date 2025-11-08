import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArmBadge } from "./ArmBadge";
import { DollarSign, Clock, Briefcase, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Opportunity } from "@/api/opportunities";

export interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const navigate = useNavigate();
  const poster = opportunity.aethex_creators;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}m ago`;
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max)
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden bg-slate-800/50 border-slate-700">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={poster.avatar_url} alt={poster.username} />
              <AvatarFallback>
                {poster.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-gray-400">Posted by</p>
              <p className="text-sm font-semibold text-white">
                @{poster.username}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-400 whitespace-nowrap">
            {formatDate(opportunity.created_at)}
          </div>
        </div>

        <div className="mb-3">
          <ArmBadge arm={opportunity.arm_affiliation} size="sm" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {opportunity.title}
        </h3>

        <p className="text-sm text-gray-300 mb-4 line-clamp-3">
          {opportunity.description}
        </p>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-400">
            <Briefcase className="h-4 w-4 mr-2 text-yellow-400" />
            {opportunity.job_type}
            {opportunity.experience_level && (
              <>
                <span className="mx-2">•</span>
                {opportunity.experience_level}
              </>
            )}
          </div>
          {(opportunity.salary_min || opportunity.salary_max) && (
            <div className="flex items-center text-gray-400">
              <DollarSign className="h-4 w-4 mr-2 text-green-400" />
              {formatSalary(opportunity.salary_min, opportunity.salary_max)}
            </div>
          )}
          {opportunity.aethex_applications && (
            <div className="flex items-center text-gray-400">
              <Clock className="h-4 w-4 mr-2 text-blue-400" />
              {opportunity.aethex_applications.count}{" "}
              {opportunity.aethex_applications.count === 1
                ? "applicant"
                : "applicants"}
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-700">
          <Button
            onClick={() => navigate(`/opportunities/${opportunity.id}`)}
            className="w-full"
            variant="outline"
          >
            View Details <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
