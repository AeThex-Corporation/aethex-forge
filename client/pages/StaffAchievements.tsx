import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, ExternalLink } from "lucide-react";

const ACHIEVEMENTS = [
  {
    id: 1,
    name: "Developer Leader",
    description: "Lead 5+ engineering projects",
    progress: 3,
    total: 5,
    icon: "👨‍💻",
    unlocked: false,
  },
  {
    id: 2,
    name: "Community Builder",
    description: "Mentor 10+ team members",
    progress: 8,
    total: 10,
    icon: "🤝",
    unlocked: false,
  },
  {
    id: 3,
    name: "Innovator",
    description: "Launch 3 new features",
    progress: 2,
    total: 3,
    icon: "💡",
    unlocked: false,
  },
  {
    id: 4,
    name: "Excellence",
    description: "Maintain 95%+ team satisfaction",
    progress: 92,
    total: 95,
    icon: "⭐",
    unlocked: false,
  },
];

const MILESTONES = [
  {
    id: 1,
    title: "1 Year Anniversary",
    description: "Celebrate 1 year with the team",
    date: "2025-06-15",
    achieved: false,
    daysLeft: 145,
  },
  {
    id: 2,
    title: "100 Mentorship Sessions",
    description: "Complete 100 one-on-one mentorship sessions",
    date: "2025-03-20",
    achieved: false,
    daysLeft: 58,
  },
  {
    id: 3,
    title: "First Leadership Role",
    description: "Lead your first major team initiative",
    date: "2024-12-01",
    achieved: true,
    daysLeft: 0,
  },
  {
    id: 4,
    title: "5 Successful Launches",
    description: "Ship 5 major features to production",
    date: "2025-04-10",
    achieved: false,
    daysLeft: 79,
  },
];

export default function StaffAchievements() {
  const navigate = useNavigate();
  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(
    null,
  );

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const achievedMilestones = MILESTONES.filter((m) => m.achieved).length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Achievements
              </h1>
              <p className="text-gray-300 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Track your progress and accomplishments
              </p>
            </div>
            <Button
              onClick={() => navigate("/staff/dashboard")}
              variant="outline"
              className="border-purple-500/30 hover:bg-purple-500/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Achievements Unlocked</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {unlockedCount}/{ACHIEVEMENTS.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Milestones Completed</p>
                  <p className="text-3xl font-bold text-green-400">
                    {achievedMilestones}/{MILESTONES.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Total Points</p>
                  <p className="text-3xl font-bold text-blue-400">2,480</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Level</p>
                  <p className="text-3xl font-bold text-purple-400">12</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              <Trophy className="w-6 h-6 inline mr-2" />
              Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="bg-slate-900/50 border-purple-500/20 cursor-pointer hover:border-purple-500/50 transition-all"
                  onClick={() =>
                    setExpandedAchievement(
                      expandedAchievement === achievement.id
                        ? null
                        : achievement.id,
                    )
                  }
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-3xl">{achievement.icon}</span>
                          <div>
                            <h3 className="text-white font-bold">
                              {achievement.name}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                        {achievement.unlocked && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 ml-2">
                            Unlocked
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-purple-400">
                            {achievement.progress}/{achievement.total}
                          </span>
                        </div>
                        <Progress
                          value={
                            (achievement.progress / achievement.total) * 100
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              <Target className="w-6 h-6 inline mr-2" />
              Milestones
            </h2>
            <div className="space-y-3">
              {MILESTONES.map((milestone) => (
                <Card
                  key={milestone.id}
                  className={`${
                    milestone.achieved
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-slate-900/50 border-purple-500/20"
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold">
                            {milestone.title}
                          </h3>
                          {milestone.achieved && (
                            <Badge className="bg-green-500/20 text-green-300">
                              Achieved
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          {milestone.description}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        {milestone.achieved ? (
                          <p className="text-green-400 font-semibold">
                            Completed ✓
                          </p>
                        ) : (
                          <>
                            <p className="text-gray-400 text-sm">
                              {milestone.daysLeft} days left
                            </p>
                            <p className="text-gray-500 text-xs">
                              {milestone.date}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Top Achievers This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Sarah Dev", points: 2850, rank: 1 },
                  { name: "You", points: 2480, rank: 2 },
                  { name: "Mike Operations", points: 2340, rank: 3 },
                  { name: "Emma Design", points: 2100, rank: 4 },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between py-2 border-b border-purple-500/10 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${
                          user.rank === 1
                            ? "bg-yellow-500/20 text-yellow-300"
                            : user.rank === 2
                              ? "bg-gray-400/20 text-gray-300"
                              : "bg-orange-500/20 text-orange-300"
                        }`}
                      >
                        #{user.rank}
                      </Badge>
                      <span className="text-white">{user.name}</span>
                    </div>
                    <span className="text-purple-400 font-semibold">
                      {user.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
