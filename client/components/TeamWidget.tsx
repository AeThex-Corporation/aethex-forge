import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, ExternalLink } from "lucide-react";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title?: string;
  avatar_url?: string;
  status?: "online" | "offline" | "away";
  bio?: string;
  links?: Array<{ title: string; url: string }>;
}

interface TeamWidgetProps {
  members: TeamMember[];
  title?: string;
  description?: string;
  type?: "sprint" | "org" | "company";
  onViewProfile?: (memberId: string) => void;
  onMessage?: (memberId: string) => void;
  accentColor?: "green" | "blue" | "purple" | "cyan";
}

const colorMap = {
  green: {
    bg: "bg-gradient-to-br from-green-950/40 to-green-900/20",
    border: "border-green-500/20",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
    border: "border-blue-500/20",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-950/40 to-purple-900/20",
    border: "border-purple-500/20",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-950/40 to-cyan-900/20",
    border: "border-cyan-500/20",
  },
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-500",
  away: "bg-yellow-500",
};

export function TeamWidget({
  members,
  title = "Team Members",
  description = "Sprint team and collaborators",
  type = "sprint",
  onViewProfile,
  onMessage,
  accentColor = "green",
}: TeamWidgetProps) {
  const colors = colorMap[accentColor];

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
            <p className="text-gray-400">No team members</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 bg-black/30 rounded-lg border border-gray-500/10 hover:border-gray-500/30 transition space-y-3"
              >
                {/* Member Header */}
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-200">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {member.status && (
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                          statusColors[member.status]
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">
                      {member.name}
                    </h4>
                    <p className="text-xs text-gray-400">{member.role}</p>
                    {member.title && (
                      <p className="text-xs text-gray-500">{member.title}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {member.bio && (
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {member.bio}
                  </p>
                )}

                {/* Links */}
                {member.links && member.links.length > 0 && (
                  <div className="flex gap-1 flex-wrap pt-2 border-t border-gray-500/10">
                    {member.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 bg-gray-600/30 text-gray-300 rounded hover:bg-gray-600/50 transition inline-flex items-center gap-1"
                      >
                        {link.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-500/10">
                  {onViewProfile && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-500/20 text-gray-300 hover:bg-gray-500/10 text-xs"
                      onClick={() => onViewProfile(member.id)}
                    >
                      Profile
                    </Button>
                  )}
                  {onMessage && (
                    <Button
                      size="sm"
                      className="bg-gray-600 hover:bg-gray-700 text-xs"
                      onClick={() => onMessage(member.id)}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
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

export default TeamWidget;
