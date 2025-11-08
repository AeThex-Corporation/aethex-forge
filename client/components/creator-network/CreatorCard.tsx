import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArmBadge } from "./ArmBadge";
import { MapPin, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Creator } from "@/api/creators";

export interface CreatorCardProps {
  creator: Creator;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden bg-slate-800/50 border-slate-700">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={creator.avatar_url} alt={creator.username} />
            <AvatarFallback>
              {creator.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {creator.devconnect_linked && (
            <div className="text-xs bg-cyan-500/10 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/20">
              On DevConnect
            </div>
          )}
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-bold text-white mb-1 truncate">
            @{creator.username}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {creator.bio || "No bio provided"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {creator.primary_arm && (
            <ArmBadge arm={creator.primary_arm} size="sm" />
          )}
          {creator.arm_affiliations && creator.arm_affiliations.length > 0 && (
            <>
              {creator.arm_affiliations.slice(0, 2).map((arm) => (
                <ArmBadge key={arm} arm={arm} size="sm" />
              ))}
              {creator.arm_affiliations.length > 2 && (
                <div className="text-xs bg-slate-600/50 text-gray-300 px-2 py-1 rounded-full">
                  +{creator.arm_affiliations.length - 2} more
                </div>
              )}
            </>
          )}
        </div>

        {creator.skills && creator.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {creator.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-slate-700/50 text-gray-300 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
              {creator.skills.length > 3 && (
                <span className="text-xs bg-slate-700/50 text-gray-400 px-2 py-1 rounded">
                  +{creator.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-700">
          <Button
            onClick={() => navigate(`/creators/${creator.username}`)}
            className="w-full"
            variant="outline"
          >
            View Profile <MapPin className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
