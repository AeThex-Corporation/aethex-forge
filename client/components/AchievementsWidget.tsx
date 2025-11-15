import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Lock, Star, ArrowRight } from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  icon_url?: string;
  category?: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  earned_at?: string;
  progress?: number;
  max_progress?: number;
}

interface AchievementsWidgetProps {
  achievements: Achievement[];
  title?: string;
  description?: string;
  onViewAll?: () => void;
  maxDisplay?: number;
  accentColor?: "red" | "blue" | "purple" | "gold";
}

const rarityMap = {
  common: {
    color: "bg-gray-600/50 text-gray-100",
    border: "border-gray-500/30",
  },
  uncommon: {
    color: "bg-green-600/50 text-green-100",
    border: "border-green-500/30",
  },
  rare: { color: "bg-blue-600/50 text-blue-100", border: "border-blue-500/30" },
  epic: {
    color: "bg-purple-600/50 text-purple-100",
    border: "border-purple-500/30",
  },
  legendary: {
    color: "bg-yellow-600/50 text-yellow-100",
    border: "border-yellow-500/30",
  },
};

const colorMap = {
  red: {
    bg: "bg-gradient-to-br from-red-950/40 to-red-900/20",
    border: "border-red-500/20",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
    border: "border-blue-500/20",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-950/40 to-purple-900/20",
    border: "border-purple-500/20",
  },
  gold: {
    bg: "bg-gradient-to-br from-amber-950/40 to-amber-900/20",
    border: "border-amber-500/20",
  },
};

export function AchievementsWidget({
  achievements,
  title = "My Achievements",
  description = "Trophy case of earned badges",
  onViewAll,
  maxDisplay = 5,
  accentColor = "gold",
}: AchievementsWidgetProps) {
  const colors = colorMap[accentColor];
  const displayedAchievements = achievements.slice(0, maxDisplay);
  const hasMore = achievements.length > maxDisplay;

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "👑";
      case "epic":
        return "⭐";
      case "rare":
        return "✨";
      case "uncommon":
        return "🌟";
      default:
        return "🏅";
    }
  };

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Trophy className="h-12 w-12 mx-auto text-gray-500 opacity-50" />
            <p className="text-gray-400">No achievements yet</p>
            <p className="text-sm text-gray-500">
              Complete courses and challenges to earn badges
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Trophy Case Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {displayedAchievements.map((achievement) => {
                const rarityInfo = rarityMap[achievement.rarity];
                const icon = getRarityIcon(achievement.rarity);

                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${rarityInfo.border} bg-black/30 hover:bg-black/50 transition text-center space-y-2`}
                  >
                    {/* Badge Icon */}
                    <div className="flex justify-center">
                      {achievement.icon_url ? (
                        <img
                          src={achievement.icon_url}
                          alt={achievement.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center text-xl">
                          {icon}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                      <p className="font-semibold text-white text-xs line-clamp-2">
                        {achievement.title}
                      </p>
                      <Badge className={`${rarityInfo.color} text-xs`}>
                        {achievement.rarity}
                      </Badge>
                    </div>

                    {/* Earned Date */}
                    {achievement.earned_at && (
                      <p className="text-xs text-gray-400">
                        {new Date(achievement.earned_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Locked Achievements Placeholder */}
              {hasMore && (
                <div className="p-3 rounded-lg border border-gray-600/30 bg-black/30 text-center space-y-2 opacity-50">
                  <div className="flex justify-center">
                    <Lock className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="font-semibold text-gray-400 text-xs">
                    +{achievements.length - maxDisplay} more
                  </p>
                </div>
              )}
            </div>

            {/* View All Button */}
            {onViewAll && (
              <Button
                onClick={onViewAll}
                variant="outline"
                className="w-full border-gray-500/20 text-gray-300 hover:bg-gray-500/10"
              >
                View All Achievements ({achievements.length})
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AchievementsWidget;
