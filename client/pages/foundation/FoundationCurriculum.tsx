import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Search,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  instructor_id: string;
  instructor_name: string;
  instructor_avatar?: string;
  cover_image_url: string;
  estimated_hours: number;
}

const CATEGORIES = [
  { value: "game-dev", label: "Game Development" },
  { value: "web-dev", label: "Web Development" },
  { value: "ai-ml", label: "AI & Machine Learning" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
];

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-300",
  intermediate: "bg-amber-500/20 text-amber-300",
  advanced: "bg-red-500/20 text-red-300",
};

export default function FoundationCurriculum() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null,
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    searchParams.get("difficulty") || null,
  );

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedDifficulty) params.set("difficulty", selectedDifficulty);

        const response = await fetch(
          `${API_BASE}/api/foundation/courses?${params}`,
        );
        if (!response.ok) throw new Error("Failed to fetch courses");

        let data = await response.json();

        // Client-side filtering by search
        if (search) {
          data = data.filter(
            (course: Course) =>
              course.title.toLowerCase().includes(search.toLowerCase()) ||
              course.description.toLowerCase().includes(search.toLowerCase()),
          );
        }

        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, selectedDifficulty]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedDifficulty) params.set("difficulty", selectedDifficulty);
    setSearchParams(params);
  };

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
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-8 w-8 text-red-400" />
                <h1 className="text-3xl font-bold">Curriculum</h1>
              </div>
              <p className="text-slate-300">
                Learn from industry experts with free and premium courses
              </p>
            </div>
          </section>

          {/* Search & Filters */}
          <section className="border-b border-slate-800 py-6">
            <div className="container mx-auto max-w-7xl px-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    Search
                  </Button>
                </div>
              </form>

              {/* Category Filter */}
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-300 mb-2">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchParams({});
                    }}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedCategory === null
                        ? "bg-red-500/20 text-red-300 border border-red-500/50"
                        : "bg-slate-800/50 text-slate-400 border border-slate-700"
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(
                          selectedCategory === cat.value ? null : cat.value,
                        );
                      }}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedCategory === cat.value
                          ? "bg-red-500/20 text-red-300 border border-red-500/50"
                          : "bg-slate-800/50 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <p className="text-sm font-medium text-slate-300 mb-2">
                  Difficulty
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedDifficulty(null);
                      setSearchParams({});
                    }}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedDifficulty === null
                        ? "bg-red-500/20 text-red-300 border border-red-500/50"
                        : "bg-slate-800/50 text-slate-400 border border-slate-700"
                    }`}
                  >
                    All Levels
                  </button>
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => {
                        setSelectedDifficulty(
                          selectedDifficulty === diff.value ? null : diff.value,
                        );
                      }}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedDifficulty === diff.value
                          ? "bg-red-500/20 text-red-300 border border-red-500/50"
                          : "bg-slate-800/50 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Courses Grid */}
          <section className="py-12">
            <div className="container mx-auto max-w-7xl px-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-red-400" />
                </div>
              ) : courses.length === 0 ? (
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                      No courses found matching your criteria
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <Card
                      key={course.id}
                      className="bg-slate-800/30 border-slate-700 hover:border-red-500/50 transition overflow-hidden cursor-pointer"
                      onClick={() =>
                        navigate(`/foundation/curriculum/${course.slug}`)
                      }
                    >
                      {course.cover_image_url && (
                        <img
                          src={course.cover_image_url}
                          alt={course.title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-lg mb-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-2">
                              {course.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                          <Badge
                            className={difficultyColors[course.difficulty]}
                          >
                            {course.difficulty.charAt(0).toUpperCase() +
                              course.difficulty.slice(1)}
                          </Badge>
                          {course.category && (
                            <Badge className="bg-slate-700/50 text-gray-300">
                              {course.category}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 border-t border-slate-700 pt-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="h-4 w-4" />
                            <span>{course.estimated_hours} hours</span>
                          </div>
                          {course.instructor_name && (
                            <div className="flex items-center gap-2 text-slate-300">
                              <Users className="h-4 w-4" />
                              <span>{course.instructor_name}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          className="w-full mt-4 bg-red-500 hover:bg-red-600"
                          size="sm"
                        >
                          Enroll Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
