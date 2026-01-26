import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Award,
  Zap,
  Video,
  FileText,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_weeks: number;
  lesson_count: number;
  is_required: boolean;
  progress: number;
  status: string;
  started_at?: string;
  completed_at?: string;
}

interface Stats {
  total: number;
  completed: number;
  in_progress: number;
  required: number;
}

const getCourseIcon = (category: string) => {
  switch (category) {
    case "Development":
      return <BookOpen className="h-5 w-5" />;
    case "Leadership":
      return <Award className="h-5 w-5" />;
    case "Infrastructure":
      return <Zap className="h-5 w-5" />;
    case "Product":
      return <Video className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export default function StaffLearningPortal() {
  const { session } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, in_progress: 0, required: 0 });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.access_token) {
      fetchCourses();
    }
  }, [session?.access_token]);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/staff/courses", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || []);
        setStats(data.stats || { total: 0, completed: 0, in_progress: 0, required: 0 });
      }
    } catch (err) {
      aethexToast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const startCourse = async (courseId: string) => {
    try {
      const res = await fetch("/api/staff/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ course_id: courseId, action: "start" }),
      });
      if (res.ok) {
        aethexToast.success("Course started!");
        fetchCourses();
      }
    } catch (err) {
      aethexToast.error("Failed to start course");
    }
  };

  const categories = ["All", ...new Set(courses.map((c) => c.category))];

  const filtered =
    selectedCategory === "All"
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Learning Portal"
        description="AeThex training courses and certifications"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <BookOpen className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-cyan-100">
                  Learning Portal
                </h1>
                <p className="text-cyan-200/70">
                  Training courses, certifications, and skill development
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-cyan-100">
                    {stats.total}
                  </p>
                  <p className="text-sm text-cyan-200/70">Total Courses</p>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-cyan-100">
                    {stats.completed}
                  </p>
                  <p className="text-sm text-cyan-200/70">Completed</p>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-cyan-100">
                    {stats.in_progress}
                  </p>
                  <p className="text-sm text-cyan-200/70">In Progress</p>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-cyan-100">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </p>
                  <p className="text-sm text-cyan-200/70">Completion Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-cyan-600 hover:bg-cyan-700"
                        : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((course) => (
                <Card
                  key={course.id}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded bg-cyan-500/20 text-cyan-400">
                        {getCourseIcon(course.category)}
                      </div>
                      <Badge
                        className={
                          course.status === "completed"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : course.status === "in_progress"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : "bg-slate-700 text-slate-300"
                        }
                      >
                        {course.status === "completed" ? "Completed" : course.status === "in_progress" ? "In Progress" : "Available"}
                      </Badge>
                    </div>
                    <CardTitle className="text-cyan-100">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-cyan-300">
                            {course.progress}%
                          </span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-4 w-4" />
                        {course.duration_weeks} weeks
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <FileText className="h-4 w-4" />
                        {course.lesson_count} lessons
                      </div>
                      {course.is_required && (
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                          Required
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                      onClick={() => course.status === "available" && startCourse(course.id)}
                    >
                      {course.status === "completed"
                        ? "Review Course"
                        : course.status === "in_progress"
                          ? "Continue"
                          : "Enroll"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No courses found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
