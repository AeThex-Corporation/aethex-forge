import { useState } from "react";
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
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  duration: string;
  progress: number;
  status: "In Progress" | "Completed" | "Available";
  lessons: number;
  icon: React.ReactNode;
}

const courses: Course[] = [
  {
    id: "1",
    title: "Advanced TypeScript Patterns",
    instructor: "Sarah Chen",
    category: "Development",
    duration: "4 weeks",
    progress: 65,
    status: "In Progress",
    lessons: 12,
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "2",
    title: "Leadership Fundamentals",
    instructor: "Marcus Johnson",
    category: "Leadership",
    duration: "6 weeks",
    progress: 0,
    status: "Available",
    lessons: 15,
    icon: <Award className="h-5 w-5" />,
  },
  {
    id: "3",
    title: "AWS Solutions Architect",
    instructor: "David Lee",
    category: "Infrastructure",
    duration: "8 weeks",
    progress: 100,
    status: "Completed",
    lessons: 20,
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: "4",
    title: "Product Management Essentials",
    instructor: "Elena Rodriguez",
    category: "Product",
    duration: "5 weeks",
    progress: 40,
    status: "In Progress",
    lessons: 14,
    icon: <Video className="h-5 w-5" />,
  },
  {
    id: "5",
    title: "Security Best Practices",
    instructor: "Alex Kim",
    category: "Security",
    duration: "3 weeks",
    progress: 0,
    status: "Available",
    lessons: 10,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "6",
    title: "Effective Communication",
    instructor: "Patricia Martinez",
    category: "Skills",
    duration: "2 weeks",
    progress: 100,
    status: "Completed",
    lessons: 8,
    icon: <BookOpen className="h-5 w-5" />,
  },
];

export default function StaffLearningPortal() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Development",
    "Leadership",
    "Infrastructure",
    "Product",
    "Security",
    "Skills",
  ];

  const filtered =
    selectedCategory === "All"
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  const completed = courses.filter((c) => c.status === "Completed").length;
  const inProgress = courses.filter((c) => c.status === "In Progress").length;

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
                    {courses.length}
                  </p>
                  <p className="text-sm text-cyan-200/70">Total Courses</p>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-cyan-100">
                    {completed}
                  </p>
                  <p className="text-sm text-cyan-200/70">Completed</p>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-cyan-100">
                    {inProgress}
                  </p>
                  <p className="text-sm text-cyan-200/70">In Progress</p>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-cyan-100">
                    {Math.round((completed / courses.length) * 100)}%
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
                        {course.icon}
                      </div>
                      <Badge
                        className={
                          course.status === "Completed"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : course.status === "In Progress"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : "bg-slate-700 text-slate-300"
                        }
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-cyan-100">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      by {course.instructor}
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
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <FileText className="h-4 w-4" />
                        {course.lessons} lessons
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                    >
                      {course.status === "Completed"
                        ? "Review Course"
                        : course.status === "In Progress"
                          ? "Continue"
                          : "Enroll"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
