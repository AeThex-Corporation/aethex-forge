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
import { Input } from "@/components/ui/input";
import {
  Book,
  Search,
  FileText,
  AlertCircle,
  Zap,
  Users,
  Settings,
  Code,
} from "lucide-react";

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  views: number;
  updated: string;
  icon: React.ReactNode;
}

const articles: KnowledgeArticle[] = [
  {
    id: "1",
    title: "Getting Started with AeThex Platform",
    category: "Onboarding",
    description: "Complete guide for new team members to get up to speed",
    tags: ["onboarding", "setup", "beginner"],
    views: 324,
    updated: "2 days ago",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: "2",
    title: "Troubleshooting Common Issues",
    category: "Support",
    description: "Step-by-step guides for resolving frequent problems",
    tags: ["troubleshooting", "support", "faq"],
    views: 156,
    updated: "1 week ago",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    id: "3",
    title: "API Integration Guide",
    category: "Development",
    description: "How to integrate with AeThex APIs from your applications",
    tags: ["api", "development", "technical"],
    views: 89,
    updated: "3 weeks ago",
    icon: <Code className="h-5 w-5" />,
  },
  {
    id: "4",
    title: "Team Communication Standards",
    category: "Process",
    description: "Best practices for internal communications and channel usage",
    tags: ["communication", "process", "standards"],
    views: 201,
    updated: "4 days ago",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "5",
    title: "Security & Access Control",
    category: "Security",
    description:
      "Security policies, password management, and access procedures",
    tags: ["security", "access", "compliance"],
    views: 112,
    updated: "1 day ago",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    id: "6",
    title: "Release Management Process",
    category: "Operations",
    description: "How to manage releases, deployments, and rollbacks",
    tags: ["devops", "release", "operations"],
    views: 67,
    updated: "2 weeks ago",
    icon: <FileText className="h-5 w-5" />,
  },
];

const categories = [
  "All",
  "Onboarding",
  "Support",
  "Development",
  "Process",
  "Security",
  "Operations",
];

export default function StaffKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <SEO title="Knowledge Base" description="AeThex internal documentation" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Book className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-purple-100">
                  Knowledge Base
                </h1>
                <p className="text-purple-200/70">
                  Internal documentation, SOPs, and troubleshooting guides
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-8 flex-wrap">
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
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((article) => (
                <Card
                  key={article.id}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 rounded bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                        {article.icon}
                      </div>
                      <Badge className="bg-slate-700 text-slate-300 text-xs">
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-slate-100">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2 flex-wrap">
                        {article.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-slate-700/50 text-slate-300 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <span className="text-xs text-slate-500">
                          {article.views} views • {article.updated}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                        >
                          Read
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No articles found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
