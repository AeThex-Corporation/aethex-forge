import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Lock, ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LearningPath {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completed: number;
  icon: React.ReactNode;
}

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 1,
    title: "Game Dev Fundamentals",
    description: "Master the core concepts of game development",
    duration: "4 weeks",
    lessons: 12,
    difficulty: "Beginner",
    completed: 0,
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "Building Your First Game",
    description: "Create a complete 2D platformer from scratch",
    duration: "6 weeks",
    lessons: 18,
    difficulty: "Beginner",
    completed: 8,
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Advanced Game Physics",
    description: "Implement realistic physics and collision systems",
    duration: "5 weeks",
    lessons: 15,
    difficulty: "Advanced",
    completed: 0,
    icon: <ArrowRight className="h-6 w-6" />,
  },
  {
    id: 4,
    title: "Multiplayer Game Architecture",
    description: "Build networked games with real-time synchronization",
    duration: "7 weeks",
    lessons: 20,
    difficulty: "Advanced",
    completed: 0,
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    id: 5,
    title: "Game Art & Animation",
    description: "Create stunning visuals and smooth animations",
    duration: "6 weeks",
    lessons: 16,
    difficulty: "Intermediate",
    completed: 0,
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    id: 6,
    title: "Monetization & Publishing",
    description: "Launch your game and start earning revenue",
    duration: "3 weeks",
    lessons: 10,
    difficulty: "Intermediate",
    completed: 0,
    icon: <Zap className="h-6 w-6" />,
  },
];

export default function GameForgeStartBuilding() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative py-16 lg:py-20">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
                onClick={() => navigate("/gameforge")}
              >
                ← Back to GameForge
              </Button>

              <div className="flex items-start justify-between gap-8">
                <div className="flex-1">
                  <Badge className="border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] mb-4">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Learning Academy
                  </Badge>
                  <h1 className="text-4xl font-black text-green-300 mb-4 lg:text-5xl">
                    Master Game Development
                  </h1>
                  <p className="text-lg text-green-100/80 max-w-2xl">
                    Structured learning paths designed to take you from beginner
                    to expert. Learn at your own pace with hands-on projects.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Learning Paths Grid */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid lg:grid-cols-2 gap-6">
                {LEARNING_PATHS.map((path) => (
                  <Card
                    key={path.id}
                    className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-all hover:shadow-lg hover:shadow-green-500/20"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-green-400">{path.icon}</div>
                        <Badge
                          variant="outline"
                          className={
                            path.difficulty === "Beginner"
                              ? "border-green-400/40 bg-green-500/10 text-green-300"
                              : path.difficulty === "Intermediate"
                                ? "border-yellow-400/40 bg-yellow-500/10 text-yellow-300"
                                : "border-red-400/40 bg-red-500/10 text-red-300"
                          }
                        >
                          {path.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-green-300 text-xl">
                        {path.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-green-200/70">
                        {path.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-green-300/80">
                        <span>{path.lessons} lessons</span>
                        <span>•</span>
                        <span>{path.duration}</span>
                      </div>

                      {path.completed > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-green-300">
                            <span>Progress</span>
                            <span>
                              {path.completed}/{path.lessons}
                            </span>
                          </div>
                          <div className="w-full bg-green-950/40 rounded-full h-2">
                            <div
                              className="bg-green-400 h-2 rounded-full transition-all"
                              style={{
                                width: `${(path.completed / path.lessons) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full bg-green-400 text-black hover:bg-green-300 mt-4"
                        onClick={() => navigate(`/gameforge/learning/${path.id}`)}
                      >
                        {path.completed > 0 ? "Continue Learning" : "Start Path"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Project Section */}
          <section className="py-16 border-t border-green-400/10">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-8">
                Build Projects
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-green-950/30 border-green-400/40">
                  <CardHeader>
                    <CardTitle className="text-green-300">
                      Code Along Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70 mb-4">
                      Follow along with our experts as they build games from
                      scratch. Interactive and hands-on.
                    </p>
                    <Button
                      variant="ghost"
                      className="text-green-300 hover:bg-green-500/10"
                    >
                      View Sessions →
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-green-950/30 border-green-400/40">
                  <CardHeader>
                    <CardTitle className="text-green-300">
                      Mini Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70 mb-4">
                      Test your skills with weekly challenges. Get feedback from
                      the community and improve faster.
                    </p>
                    <Button
                      variant="ghost"
                      className="text-green-300 hover:bg-green-500/10"
                    >
                      View Challenges →
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-green-950/30 border-green-400/40">
                  <CardHeader>
                    <CardTitle className="text-green-300">
                      Templates Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70 mb-4">
                      Clone fully functional game templates and modify them to
                      learn how things work.
                    </p>
                    <Button
                      variant="ghost"
                      className="text-green-300 hover:bg-green-500/10"
                    >
                      Browse Templates →
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
