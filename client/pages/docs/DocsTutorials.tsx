import { useState } from "react";
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
import { Link } from "react-router-dom";
import DocsLayout from "@/components/docs/DocsLayout";
import {
  Play,
  Clock,
  User,
  Star,
  BookOpen,
  Code,
  Gamepad2,
  Database,
  Palette,
  Brain,
  Rocket,
  Filter,
  Search,
  ChevronRight,
  Eye,
  Heart,
} from "lucide-react";

interface DocsTutorial {
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
  isNew?: boolean;
  type: "video" | "article" | "interactive";
  path: string;
}

const docsTutorials: DocsTutorial[] = [
  {
    id: "1",
    title: "AeThex Platform Quick Start",
    description:
      "Get up and running with AeThex in under 10 minutes. Learn the basics of project creation, navigation, and core features.",
    category: "Getting Started",
    difficulty: "beginner",
    duration: "8 min",
    author: "AeThex Team",
    rating: 4.9,
    views: 5420,
    likes: 412,
    tags: ["platform", "basics", "quickstart"],
    isNew: true,
    type: "video",
    path: "/docs/getting-started",
  },
  {
    id: "2",
    title: "Project Setup and Configuration",
    description:
      "Deep dive into project configuration, environment setup, and best practices for organizing your AeThex projects.",
    category: "Setup",
    difficulty: "beginner",
    duration: "15 min",
    author: "Sarah Chen",
    rating: 4.8,
    views: 3240,
    likes: 287,
    tags: ["setup", "configuration", "projects"],
    type: "article",
    path: "/docs/getting-started#setup-workflow",
  },
  {
    id: "3",
    title: "Working with the AeThex API",
    description:
      "Comprehensive guide to integrating with AeThex APIs, authentication, rate limiting, and error handling.",
    category: "API Integration",
    difficulty: "intermediate",
    duration: "25 min",
    author: "Alex Rodriguez",
    rating: 4.7,
    views: 2156,
    likes: 198,
    tags: ["api", "integration", "authentication"],
    type: "interactive",
    path: "/docs/api",
  },
  {
    id: "4",
    title: "Building Games with AeThex Tools",
    description:
      "Step-by-step tutorial for creating your first game using AeThex development tools and frameworks.",
    category: "Game Development",
    difficulty: "intermediate",
    duration: "45 min",
    author: "Mike Johnson",
    rating: 4.9,
    views: 4567,
    likes: 523,
    tags: ["games", "development", "tools"],
    type: "video",
    path: "/docs/examples#code-gallery",
  },
  {
    id: "5",
    title: "Advanced Database Patterns",
    description:
      "Learn advanced database design patterns, optimization techniques, and performance tuning for AeThex applications.",
    category: "Database",
    difficulty: "advanced",
    duration: "35 min",
    author: "Emma Wilson",
    rating: 4.6,
    views: 1876,
    likes: 165,
    tags: ["database", "optimization", "patterns"],
    type: "article",
    path: "/docs/api#core-endpoints",
  },
  {
    id: "6",
    title: "AI Integration Workshop",
    description:
      "Hands-on workshop for integrating AI and machine learning capabilities into your AeThex projects.",
    category: "AI/ML",
    difficulty: "advanced",
    duration: "60 min",
    author: "Dr. Lisa Park",
    rating: 4.8,
    views: 2943,
    likes: 334,
    tags: ["ai", "machine-learning", "integration"],
    isNew: true,
    type: "interactive",
    path: "/docs/examples#templates",
  },
];

const categories = [
  { id: "all", name: "All", icon: BookOpen },
  { id: "getting-started", name: "Getting Started", icon: Rocket },
  { id: "setup", name: "Setup", icon: Code },
  { id: "api-integration", name: "API Integration", icon: Database },
  { id: "game-development", name: "Game Development", icon: Gamepad2 },
  { id: "database", name: "Database", icon: Database },
  { id: "ai-ml", name: "AI/ML", icon: Brain },
];

export default function DocsTutorials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play;
      case "article":
        return BookOpen;
      case "interactive":
        return Code;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "text-red-400";
      case "article":
        return "text-blue-400";
      case "interactive":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const filteredTutorials = docsTutorials.filter((tutorial) => {
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
    const matchesType =
      selectedType === "all" || tutorial.type === selectedType;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
  });

  return (
    <DocsLayout title="Tutorials" description="Step-by-step guides">
      <div>
        {/* Header */}
        <div className="mb-8 hidden">
          <h2 className="text-2xl font-bold text-white mb-4">
            Documentation Tutorials
          </h2>
          <p className="text-gray-300 mb-6">
            Step-by-step guides and interactive tutorials to help you master
            AeThex
          </p>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tutorials..."
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
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="video">Video</option>
                <option value="article">Article</option>
                <option value="interactive">Interactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
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
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? "bg-purple-600 text-white"
                          : "bg-slate-900/50 text-gray-300 hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Tutorials Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-gray-400">
                Showing {filteredTutorials.length} tutorials
              </p>
            </div>

            <div className="space-y-4">
              {filteredTutorials.map((tutorial) => {
                const TypeIcon = getTypeIcon(tutorial.type);
                return (
                  <Card
                    key={tutorial.id}
                    className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <TypeIcon
                              className={`h-5 w-5 ${getTypeColor(tutorial.type)}`}
                            />
                            <Badge variant="outline" className="text-xs">
                              {tutorial.category}
                            </Badge>
                            <Badge
                              className={`${getDifficultyColor(tutorial.difficulty)} text-white text-xs`}
                            >
                              {tutorial.difficulty}
                            </Badge>
                            {tutorial.isNew && (
                              <Badge className="bg-green-600 text-white text-xs">
                                New
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                            {tutorial.title}
                          </h3>

                          <p className="text-gray-400 mb-4">
                            {tutorial.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {tutorial.duration}
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {tutorial.author}
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                {tutorial.rating}
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {tutorial.views}
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {tutorial.likes}
                              </div>
                            </div>

                            <Button
                              asChild
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Link to={tutorial.path}>
                                Start Tutorial
                                <ChevronRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
    </DocsLayout>
  );
}
