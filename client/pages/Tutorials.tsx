import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Play,
  Clock,
  User,
  Star,
  Search,
  Filter,
  Code,
  Gamepad2,
  Rocket,
  Database,
  Palette,
  Brain,
  Trophy,
  ChevronRight,
  Download,
  Heart,
  Eye,
} from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  author: string;
  rating: number;
  views: number;
  likes: number;
  tags: string[];
  thumbnail: string;
  isNew?: boolean;
  isPremium?: boolean;
}

const tutorials: Tutorial[] = [
  {
    id: "1",
    title: "Getting Started with AeThex Platform",
    description:
      "Complete beginner's guide to navigating and using the AeThex development platform",
    category: "Platform",
    difficulty: "beginner",
    duration: "15 min",
    author: "AeThex Team",
    rating: 4.9,
    views: 2847,
    likes: 234,
    tags: ["getting-started", "platform", "basics"],
    thumbnail:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
    isNew: true,
  },
  {
    id: "2",
    title: "Building Your First Game with Unity & AeThex",
    description:
      "Step-by-step tutorial for creating a 2D platformer game using Unity and AeThex tools",
    category: "Game Development",
    difficulty: "beginner",
    duration: "45 min",
    author: "Mike Johnson",
    rating: 4.8,
    views: 1923,
    likes: 187,
    tags: ["unity", "2d", "platformer", "game-dev"],
    thumbnail:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
  },
  {
    id: "3",
    title: "Advanced AI Integration Patterns",
    description:
      "Learn how to integrate advanced AI systems into your projects using AeThex AI tools",
    category: "AI/ML",
    difficulty: "advanced",
    duration: "60 min",
    author: "Dr. Sarah Chen",
    rating: 4.7,
    views: 856,
    likes: 98,
    tags: ["ai", "machine-learning", "integration", "advanced"],
    thumbnail:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400",
    isPremium: true,
  },
  {
    id: "4",
    title: "Database Design Best Practices",
    description:
      "Master database architecture and optimization for high-performance applications",
    category: "Backend",
    difficulty: "intermediate",
    duration: "35 min",
    author: "Alex Rodriguez",
    rating: 4.6,
    views: 1456,
    likes: 142,
    tags: ["database", "sql", "optimization", "backend"],
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
  },
  {
    id: "5",
    title: "UI/UX Design for Games",
    description:
      "Create compelling user interfaces and experiences for modern games",
    category: "Design",
    difficulty: "intermediate",
    duration: "40 min",
    author: "Emma Wilson",
    rating: 4.8,
    views: 2134,
    likes: 203,
    tags: ["ui", "ux", "design", "games"],
    thumbnail:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400",
  },
  {
    id: "6",
    title: "Performance Optimization Techniques",
    description:
      "Advanced strategies for optimizing application performance and reducing load times",
    category: "Performance",
    difficulty: "advanced",
    duration: "50 min",
    author: "David Kim",
    rating: 4.9,
    views: 987,
    likes: 124,
    tags: ["performance", "optimization", "advanced"],
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    isNew: true,
  },
];

const categories = [
  { id: "all", name: "All", icon: BookOpen, count: tutorials.length },
  { id: "platform", name: "Platform", icon: Rocket, count: 1 },
  { id: "game-development", name: "Game Dev", icon: Gamepad2, count: 1 },
  { id: "ai-ml", name: "AI/ML", icon: Brain, count: 1 },
  { id: "backend", name: "Backend", icon: Database, count: 1 },
  { id: "design", name: "Design", icon: Palette, count: 1 },
  { id: "performance", name: "Performance", icon: Trophy, count: 1 },
];

export default function Tutorials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDifficultyTextColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-400";
      case "intermediate":
        return "text-yellow-400";
      case "advanced":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" ||
      tutorial.category.toLowerCase().replace(/[\/\s]/g, "-") ===
        selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      tutorial.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              AeThex Tutorials
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Master cutting-edge development skills with our comprehensive
              tutorial library
            </p>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tutorials, topics, or technologies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800/50 border-slate-700 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                          selectedCategory === category.id
                            ? "bg-purple-600 text-white"
                            : "bg-slate-900/50 text-gray-300 hover:bg-slate-700/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Tutorials Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-400">
                  Showing {filteredTutorials.length} tutorials
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTutorials.map((tutorial) => (
                  <Card
                    key={tutorial.id}
                    className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
                  >
                    <div className="relative">
                      <img
                        src={tutorial.thumbnail}
                        alt={tutorial.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="lg"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Start Tutorial
                        </Button>
                      </div>
                      {tutorial.isNew && (
                        <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                          New
                        </Badge>
                      )}
                      {tutorial.isPremium && (
                        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          Premium
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {tutorial.category}
                        </Badge>
                        <Badge
                          className={`${getDifficultyColor(tutorial.difficulty)} text-white text-xs`}
                        >
                          {tutorial.difficulty}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {tutorial.title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {tutorial.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {tutorial.duration}
                          </div>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {tutorial.author}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-400" />
                            {tutorial.rating}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {tutorial.views}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {tutorial.likes}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {tutorial.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTutorials.length === 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No tutorials found
                    </h3>
                    <p className="text-gray-400">
                      Try adjusting your search terms or filters to find what
                      you're looking for.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
