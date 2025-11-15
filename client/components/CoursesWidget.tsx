import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Clock, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  progress?: number;
  status: "not_started" | "in_progress" | "completed";
  duration?: string;
  lessons_total?: number;
  lessons_completed?: number;
  instructor?: string;
  thumbnail_url?: string;
}

interface CoursesWidgetProps {
  courses: Course[];
  title?: string;
  description?: string;
  onViewCourse?: (courseId: string) => void;
  accentColor?: "red" | "blue" | "purple" | "green";
}

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
  green: {
    bg: "bg-gradient-to-br from-green-950/40 to-green-900/20",
    border: "border-green-500/20",
  },
};

const statusMap = {
  not_started: {
    label: "Not Started",
    color: "bg-gray-600/50 text-gray-100",
    icon: Lock,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-600/50 text-blue-100",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-green-600/50 text-green-100",
    icon: CheckCircle,
  },
};

export function CoursesWidget({
  courses,
  title = "My Courses & Curriculum",
  description = "Track your learning progress",
  onViewCourse,
  accentColor = "red",
}: CoursesWidgetProps) {
  const colors = colorMap[accentColor];
  const completedCount = courses.filter((c) => c.status === "completed").length;
  const inProgressCount = courses.filter(
    (c) => c.status === "in_progress",
  ).length;

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
            <p className="text-gray-400 mb-4">No courses yet</p>
            <p className="text-sm text-gray-500">
              Start your learning journey today
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-black/20 rounded-lg mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-lg font-bold text-white">{courses.length}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">In Progress</p>
                <p className="text-lg font-bold text-blue-400">
                  {inProgressCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Completed</p>
                <p className="text-lg font-bold text-green-400">
                  {completedCount}
                </p>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => {
                const statusInfo = statusMap[course.status];
                const StatusIcon = statusInfo.icon;
                const progress = course.progress || 0;

                return (
                  <div
                    key={course.id}
                    className="p-4 bg-black/30 rounded-lg border border-gray-500/10 hover:border-gray-500/30 transition space-y-3 cursor-pointer"
                    onClick={() => onViewCourse?.(course.id)}
                  >
                    {/* Course Header */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-white">
                          {course.title}
                        </h4>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      {course.description && (
                        <p className="text-xs text-gray-400">
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* Course Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-400 py-2 border-y border-gray-500/10">
                      {course.instructor && <span>{course.instructor}</span>}
                      {course.duration && <span>{course.duration}</span>}
                    </div>

                    {/* Progress */}
                    {course.lessons_total && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-gray-300 font-semibold">
                            {course.lessons_completed || 0}/
                            {course.lessons_total}
                          </span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all"
                            style={{
                              width:
                                course.lessons_total > 0
                                  ? `${((course.lessons_completed || 0) / course.lessons_total) * 100}%`
                                  : "0%",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-gray-500/20 text-gray-300 hover:bg-gray-500/10 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCourse?.(course.id);
                      }}
                    >
                      {course.status === "completed"
                        ? "Review Course"
                        : "Continue Learning"}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CoursesWidget;
