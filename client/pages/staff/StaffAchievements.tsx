import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Users, Target } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
}

export default function StaffAchievements() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Team Contributor",
      description: "Contribute to 5 team projects",
      icon: "Users",
      earned: true,
      earnedDate: "2025-01-15",
    },
    {
      id: "2",
      title: "Code Master",
      description: "100+ commits to main repository",
      icon: "Zap",
      earned: false,
      progress: 67,
    },
    {
      id: "3",
      title: "Documentation Champion",
      description: "Complete internal documentation setup",
      icon: "Target",
      earned: true,
      earnedDate: "2025-01-10",
    },
    {
      id: "4",
      title: "Mentor",
      description: "Mentor 3 team members",
      icon: "Trophy",
      earned: false,
      progress: 33,
    },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/staff/login");
    }
  }, [user, loading, navigate]);

  if (loading)
    return (
      <Layout>
        <div className="container py-20">Loading...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Achievements</h1>
            <p className="text-slate-400">
              Track team accomplishments and milestones
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-2">
                  Total Achievements
                </div>
                <div className="text-3xl font-bold text-white">4</div>
              </CardContent>
            </Card>

            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-2">Earned</div>
                <div className="text-3xl font-bold text-green-400">2</div>
              </CardContent>
            </Card>

            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-2">In Progress</div>
                <div className="text-3xl font-bold text-blue-400">2</div>
              </CardContent>
            </Card>

            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-2">
                  Completion Rate
                </div>
                <div className="text-3xl font-bold text-purple-400">50%</div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`border-slate-700/50 backdrop-blur transition-colors ${
                  achievement.earned
                    ? "bg-green-500/5 border-green-500/30"
                    : "bg-slate-900/50 border-slate-700/50"
                } hover:border-slate-600/50`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          achievement.earned
                            ? "bg-green-500/20"
                            : "bg-slate-700/50"
                        }`}
                      >
                        <Trophy
                          className={`h-6 w-6 ${
                            achievement.earned
                              ? "text-green-400"
                              : "text-slate-400"
                          }`}
                        />
                      </div>
                      <div>
                        <CardTitle
                          className={
                            achievement.earned ? "text-green-300" : "text-white"
                          }
                        >
                          {achievement.title}
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                    {achievement.earned && (
                      <Badge className="bg-green-500/30 text-green-300 border-green-500/50">
                        Earned
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!achievement.earned &&
                    achievement.progress !== undefined && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-slate-400">
                            Progress
                          </span>
                          <span className="text-xs text-slate-300 font-medium">
                            {achievement.progress}%
                          </span>
                        </div>
                        <Progress
                          value={achievement.progress}
                          className="h-2"
                        />
                      </div>
                    )}
                  {achievement.earnedDate && (
                    <p className="text-xs text-slate-500">
                      Earned on{" "}
                      {new Date(achievement.earnedDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
