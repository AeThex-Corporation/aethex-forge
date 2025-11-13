import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Code,
  Video,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface CourseDownload {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  duration: number;
  chapters: number;
  formats: string[];
  description: string;
}

const courses: CourseDownload[] = [
  {
    id: "1",
    title: "Introduction to Game Development",
    slug: "intro-game-dev",
    category: "game-dev",
    difficulty: "beginner",
    duration: 12,
    chapters: 10,
    formats: ["markdown", "pdf", "code"],
    description:
      "Learn game development fundamentals including game loops, physics, input handling, and asset management.",
  },
  {
    id: "2",
    title: "Advanced React & State Management",
    slug: "react-advanced",
    category: "web-dev",
    difficulty: "advanced",
    duration: 20,
    chapters: 10,
    formats: ["markdown", "pdf", "code"],
    description:
      "Master advanced React patterns, hooks, state management solutions, and performance optimization.",
  },
  {
    id: "3",
    title: "Advanced Unreal Engine Development",
    slug: "advanced-unreal-engine",
    category: "game-dev",
    difficulty: "advanced",
    duration: 24,
    chapters: 8,
    formats: ["markdown", "code"],
    description:
      "Deep dive into Unreal Engine 5 optimization, C++ integration, networking, and advanced features.",
  },
  {
    id: "4",
    title: "Web Development Fundamentals",
    slug: "web-dev-fundamentals",
    category: "web-dev",
    difficulty: "beginner",
    duration: 16,
    chapters: 8,
    formats: ["markdown", "pdf", "code"],
    description:
      "Master HTML, CSS, JavaScript, and modern web development tools.",
  },
  {
    id: "5",
    title: "AI & Machine Learning Beginners",
    slug: "ai-ml-beginners",
    category: "ai-ml",
    difficulty: "beginner",
    duration: 14,
    chapters: 7,
    formats: ["markdown", "pdf", "code"],
    description:
      "Introduction to machine learning concepts, algorithms, and practical implementation.",
  },
  {
    id: "6",
    title: "NLP with Transformers & LLMs",
    slug: "nlp-transformers",
    category: "ai-ml",
    difficulty: "advanced",
    duration: 18,
    chapters: 9,
    formats: ["markdown", "pdf", "code"],
    description:
      "Master natural language processing with transformer models and large language models.",
  },
  {
    id: "7",
    title: "UI/UX Design Principles",
    slug: "ui-design-principles",
    category: "design",
    difficulty: "beginner",
    duration: 10,
    chapters: 6,
    formats: ["markdown", "pdf"],
    description:
      "Learn user-centered design, color theory, typography, and user testing.",
  },
  {
    id: "8",
    title: "Building Design Systems at Scale",
    slug: "design-systems",
    category: "design",
    difficulty: "advanced",
    duration: 16,
    chapters: 8,
    formats: ["markdown", "pdf"],
    description:
      "Create and maintain enterprise-grade design systems and component libraries.",
  },
  {
    id: "9",
    title: "Startup Fundamentals",
    slug: "startup-fundamentals",
    category: "business",
    difficulty: "beginner",
    duration: 8,
    chapters: 5,
    formats: ["markdown", "pdf"],
    description:
      "Learn how to launch and scale startups from ideation to fundraising.",
  },
  {
    id: "10",
    title: "Product Strategy & Roadmapping",
    slug: "product-strategy",
    category: "business",
    difficulty: "intermediate",
    duration: 12,
    chapters: 7,
    formats: ["markdown", "pdf"],
    description:
      "Master product thinking, prioritization, and roadmap creation.",
  },
  {
    id: "11",
    title: "Python for Game Development",
    slug: "python-intermediate",
    category: "game-dev",
    difficulty: "intermediate",
    duration: 15,
    chapters: 8,
    formats: ["markdown", "pdf", "code"],
    description:
      "Build games using Python and Pygame with practical examples.",
  },
  {
    id: "12",
    title: "Backend Architecture & Systems Design",
    slug: "backend-architecture",
    category: "web-dev",
    difficulty: "advanced",
    duration: 22,
    chapters: 9,
    formats: ["markdown", "pdf", "code"],
    description:
      "Design scalable backend systems, databases, APIs, and microservices.",
  },
];

const categoryColors: Record<string, string> = {
  "game-dev": "from-orange-500 to-red-500",
  "web-dev": "from-blue-500 to-cyan-500",
  "ai-ml": "from-purple-500 to-pink-500",
  design: "from-indigo-500 to-purple-500",
  business: "from-green-500 to-emerald-500",
};

const formatIcons: Record<string, React.ReactNode> = {
  markdown: <FileText className="h-4 w-4" />,
  pdf: <BookOpen className="h-4 w-4" />,
  code: <Code className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
};

export default function FoundationDownloadCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  const filteredCourses = courses.filter((course) => {
    if (selectedCategory && course.category !== selectedCategory) return false;
    if (selectedDifficulty && course.difficulty !== selectedDifficulty)
      return false;
    return true;
  });

  const downloadCourse = (slug: string, format: string) => {
    const link = document.createElement("a");
    link.href = `/api/courses/download?course=${slug}&format=${format}`;
    link.download = `${slug}-guide.${format === "markdown" ? "md" : format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Foundation Learning Center
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Download comprehensive course materials across multiple formats.
              Full-length guides with chapters, code samples, and practice
              projects.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-400">
                  {courses.length}
                </div>
                <p className="text-gray-300 mt-2">Complete Courses</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-400">82+</div>
                <p className="text-gray-300 mt-2">Total Chapters</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-400">186</div>
                <p className="text-gray-300 mt-2">Hours of Content</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-pink-400">Free</div>
                <p className="text-gray-300 mt-2">All Courses</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-8 p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Filter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-3 font-medium">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Button>
                  {["game-dev", "web-dev", "ai-ml", "design", "business"].map(
                    (cat) => (
                      <Button
                        key={cat}
                        variant={
                          selectedCategory === cat ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </Button>
                    )
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-3 font-medium">
                  Difficulty
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDifficulty === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(null)}
                  >
                    All
                  </Button>
                  {["beginner", "intermediate", "advanced"].map((diff) => (
                    <Button
                      key={diff}
                      variant={
                        selectedDifficulty === diff ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedDifficulty(diff)}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all overflow-hidden"
              >
                {/* Category Header */}
                <div
                  className={`h-1 bg-gradient-to-r ${
                    categoryColors[course.category]
                  }`}
                />

                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge className="bg-purple-500/20 text-purple-300">
                        {course.chapters} Chapters
                      </Badge>
                      <Badge
                        className={
                          course.difficulty === "beginner"
                            ? "bg-green-500/20 text-green-300"
                            : course.difficulty === "intermediate"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                        }
                      >
                        {course.difficulty.charAt(0).toUpperCase() +
                          course.difficulty.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-white">{course.title}</CardTitle>
                  <p className="text-sm text-gray-400 mt-2">
                    {course.duration} hours of comprehensive learning material
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300">{course.description}</p>

                  {/* Download Options */}
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs text-gray-400 font-medium mb-3 uppercase">
                      Available Formats
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {course.formats.map((format) => (
                        <Button
                          key={format}
                          size="sm"
                          variant="outline"
                          className="text-xs justify-center"
                          onClick={() => downloadCourse(course.slug, format)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* View Details */}
                  <Button
                    variant="ghost"
                    className="w-full text-purple-400 hover:bg-purple-500/10"
                  >
                    View Details <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No courses match your filters. Try adjusting your selection.
              </p>
            </div>
          )}

          {/* Info */}
          <div className="mt-12 p-6 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <p className="text-blue-200 text-sm">
              💡 All course materials are regularly updated and include code
              samples, exercises, and real-world projects. Download today and
              start learning at your own pace!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
