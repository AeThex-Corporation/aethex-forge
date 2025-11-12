import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Loader2, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  difficulty: "bronze" | "silver" | "gold" | "platinum";
  category: string;
  earned_count: number;
}

const difficultyColors: Record<
  "bronze" | "silver" | "gold" | "platinum",
  string
> = {
  bronze: "bg-amber-700/20 text-amber-600",
  silver: "bg-slate-400/20 text-slate-300",
  gold: "bg-yellow-500/20 text-yellow-400",
  platinum: "bg-purple-500/20 text-purple-400",
};

const mockAchievements: Achievement[] = [
  {
    id: "1",
    name: "First Course Completed",
    description: "Complete your first Foundation course",
    icon: "🎓",
    points: 50,
    difficulty: "bronze",
    category: "Learning",
    earned_count: 1240,
  },
  {
    id: "2",
    name: "Master Mathematician",
    description: "Complete all mathematics courses",
    icon: "🧮",
    points: 200,
    difficulty: "silver",
    category: "Specialty",
    earned_count: 342,
  },
  {
    id: "3",
    name: "Game Developer Pro",
    description: "Complete all game development courses",
    icon: "🎮",
    points: 300,
    difficulty: "gold",
    category: "Specialty",
    earned_count: 234,
  },
  {
    id: "4",
    name: "Knowledge Keeper",
    description: "Contribute 50 hours of learning content",
    icon: "📚",
    points: 150,
    difficulty: "silver",
    category: "Community",
    earned_count: 156,
  },
  {
    id: "5",
    name: "Legendary Mentor",
    description: "Mentor 10 students to course completion",
    icon: "👨‍🏫",
    points: 400,
    difficulty: "platinum",
    category: "Mentorship",
    earned_count: 45,
  },
  {
    id: "6",
    name: "Code Reviewer",
    description: "Review 100 pieces of student code",
    icon: "👀",
    points: 200,
    difficulty: "gold",
    category: "Community",
    earned_count: 89,
  },
  {
    id: "7",
    name: "Weekend Warrior",
    description: "Complete a course in 7 days or less",
    icon: "⚡",
    points: 100,
    difficulty: "bronze",
    category: "Speed",
    earned_count: 567,
  },
  {
    id: "8",
    name: "Perfect Score",
    description: "Achieve 100% on all course assessments",
    icon: "💯",
    points: 250,
    difficulty: "gold",
    category: "Excellence",
    earned_count: 123,
  },
];

const CATEGORIES = [
  "All",
  "Learning",
  "Specialty",
  "Community",
  "Mentorship",
  "Speed",
  "Excellence",
];

export default function FoundationAchievements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userAchievements, setUserAchievements] = useState<string[]>([
    "1",
    "3",
    "7",
  ]); // Mock data

  const filteredAchievements =
    selectedCategory === "All"
      ? mockAchievements
      : mockAchievements.filter((a) => a.category === selectedCategory);

  const totalPoints = mockAchievements
    .filter((a) => userAchievements.includes(a.id))
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden pb-12">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ef4444_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(239,68,68,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="border-b border-slate-800 py-8">
            <div className="container mx-auto max-w-7xl px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/foundation")}
                className="mb-4 text-slate-400"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Foundation
              </Button>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-red-400" />
                  <div>
                    <h1 className="text-3xl font-bold">Achievements</h1>
                    <p className="text-slate-300">
                      Earn badges and unlock rewards
                    </p>
                  </div>
                </div>

                {user && (
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Total Points</p>
                    <p className="text-3xl font-bold text-red-400">
                      {totalPoints}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          {user && (
            <section className="border-b border-slate-800 py-6">
              <div className="container mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-slate-800/30 border-slate-700">
                    <CardContent className="p-6">
                      <p className="text-sm text-slate-400 mb-1">Achieved</p>
                      <p className="text-2xl font-bold text-red-400">
                        {userAchievements.length}/{mockAchievements.length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/30 border-slate-700">
                    <CardContent className="p-6">
                      <p className="text-sm text-slate-400 mb-1">
                        Total Points
                      </p>
                      <p className="text-2xl font-bold text-red-400">
                        {totalPoints}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/30 border-slate-700">
                    <CardContent className="p-6">
                      <p className="text-sm text-slate-400 mb-1">
                        Rarest Badge
                      </p>
                      <p className="text-2xl font-bold text-red-400">
                        Platinum
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          )}

          {/* Category Filter */}
          <section className="border-b border-slate-800 py-6">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedCategory === category
                        ? "bg-red-500/20 text-red-300 border border-red-500/50"
                        : "bg-slate-800/50 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Achievements Grid */}
          <section className="py-12">
            <div className="container mx-auto max-w-7xl px-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-red-400" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredAchievements.map((achievement) => {
                    const isEarned = userAchievements.includes(achievement.id);

                    return (
                      <Card
                        key={achievement.id}
                        className={`border-slate-700 transition cursor-pointer ${
                          isEarned
                            ? "bg-slate-800/50 hover:border-red-500/50"
                            : "bg-slate-900/50 opacity-60 hover:opacity-80"
                        }`}
                      >
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          <div className="text-5xl mb-4">
                            {achievement.icon}
                          </div>

                          <h3 className="font-bold text-white mb-2">
                            {achievement.name}
                          </h3>

                          <p className="text-sm text-slate-400 mb-4">
                            {achievement.description}
                          </p>

                          <div className="flex items-center justify-center gap-2 mb-4">
                            <Badge
                              className={
                                difficultyColors[achievement.difficulty]
                              }
                            >
                              {achievement.difficulty.toUpperCase()}
                            </Badge>
                            <Badge className="bg-slate-700/50 text-gray-300">
                              +{achievement.points} pts
                            </Badge>
                          </div>

                          <div className="text-xs text-slate-500">
                            {achievement.earned_count} earned
                          </div>

                          {isEarned && (
                            <div className="mt-4 pt-4 border-t border-slate-700 w-full">
                              <Badge className="bg-green-500/20 text-green-300">
                                <Award className="h-3 w-3 mr-1 inline" />
                                Unlocked
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          {!user && (
            <section className="py-12 border-t border-slate-800">
              <div className="container mx-auto max-w-7xl px-4">
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-12 text-center">
                    <Trophy className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Start Earning Badges
                    </h3>
                    <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                      Sign in to track your achievements, earn points, and
                      unlock exclusive rewards as you progress through
                      Foundation courses.
                    </p>
                    <Button
                      onClick={() => navigate("/login")}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </main>
      </div>
    </Layout>
  );
}
