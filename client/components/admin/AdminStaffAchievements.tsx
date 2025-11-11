import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Star } from "lucide-react";
import { useState } from "react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
  earnedBy: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export default function AdminStaffAchievements() {
  const [filterRarity, setFilterRarity] = useState<string>("all");

  const achievements: Achievement[] = [
    {
      id: "first-step",
      name: "First Step",
      description: "Complete your first task",
      icon: "👣",
      progress: 1,
      target: 1,
      completed: true,
      earnedBy: 12,
      rarity: "common",
    },
    {
      id: "community-champion",
      name: "Community Champion",
      description: "Help 10 community members",
      icon: "🏆",
      progress: 7,
      target: 10,
      completed: false,
      earnedBy: 3,
      rarity: "epic",
    },
    {
      id: "code-master",
      name: "Code Master",
      description: "Contribute 50 code reviews",
      icon: "💻",
      progress: 25,
      target: 50,
      completed: false,
      earnedBy: 2,
      rarity: "legendary",
    },
    {
      id: "documentation-king",
      name: "Documentation King",
      description: "Write 20 documentation entries",
      icon: "📚",
      progress: 15,
      target: 20,
      completed: false,
      earnedBy: 4,
      rarity: "rare",
    },
    {
      id: "bug-squasher",
      name: "Bug Squasher",
      description: "Fix 25 reported bugs",
      icon: "🐛",
      progress: 12,
      target: 25,
      completed: false,
      earnedBy: 5,
      rarity: "rare",
    },
    {
      id: "mentor",
      name: "Mentor",
      description: "Mentor 5 junior developers",
      icon: "🎓",
      progress: 2,
      target: 5,
      completed: false,
      earnedBy: 1,
      rarity: "epic",
    },
  ];

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    const colors: Record<Achievement["rarity"], string> = {
      common: "bg-gray-100 text-gray-900 dark:bg-gray-900/30",
      rare: "bg-blue-100 text-blue-900 dark:bg-blue-900/30",
      epic: "bg-purple-100 text-purple-900 dark:bg-purple-900/30",
      legendary: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30",
    };
    return colors[rarity];
  };

  const filteredAchievements =
    filterRarity === "all"
      ? achievements
      : achievements.filter((a) => a.rarity === filterRarity);

  const completedCount = achievements.filter((a) => a.completed).length;
  const totalProgress = achievements.reduce((acc, a) => acc + a.progress, 0);
  const totalTarget = achievements.reduce((acc, a) => acc + a.target, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Achievement Tracking</h2>
        <p className="text-muted-foreground">
          Team achievements and progress tracking
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              of {achievements.length} achievements
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((totalProgress / totalTarget) * 100)}%
            </div>
            <Progress
              value={(totalProgress / totalTarget) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              Team Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(
                achievements.reduce((acc, a) => acc + a.earnedBy, 0) /
                achievements.length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              members per achievement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterRarity("all")}
          className={`px-4 py-2 rounded-lg transition ${
            filterRarity === "all"
              ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30"
              : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          All
        </button>
        {["common", "rare", "epic", "legendary"].map((rarity) => (
          <button
            key={rarity}
            onClick={() => setFilterRarity(rarity)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              filterRarity === rarity
                ? getRarityColor(rarity as Achievement["rarity"])
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {rarity}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {filteredAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={
              achievement.completed
                ? "border-green-200 dark:border-green-900"
                : ""
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {achievement.name}
                    </CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </div>
                </div>
                <Badge className={getRarityColor(achievement.rarity)}>
                  {achievement.rarity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span className="font-medium">
                    {achievement.progress}/{achievement.target}
                  </span>
                </div>
                <Progress
                  value={(achievement.progress / achievement.target) * 100}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Earned by {achievement.earnedBy} members</span>
                {achievement.completed && (
                  <Badge className="bg-green-100 text-green-900 dark:bg-green-900/30">
                    ✓ Completed
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-muted-foreground">
            No achievements with this rarity level
          </p>
        </Card>
      )}
    </div>
  );
}
