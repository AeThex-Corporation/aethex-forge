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
  Loader2,
  ThumbsUp,
  Eye,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  views: number;
  helpful_count: number;
  updated_at: string;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Onboarding":
      return <Zap className="h-5 w-5" />;
    case "Support":
      return <AlertCircle className="h-5 w-5" />;
    case "Development":
      return <Code className="h-5 w-5" />;
    case "Process":
      return <Users className="h-5 w-5" />;
    case "Security":
      return <Settings className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export default function StaffKnowledgeBase() {
  const { session } = useAuth();
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.access_token) {
      fetchArticles();
    }
  }, [session?.access_token, selectedCategory, searchQuery]);

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/staff/knowledge-base?${params}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setArticles(data.articles || []);
        setCategories(data.categories || []);
      }
    } catch (err) {
      aethexToast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (articleId: string) => {
    try {
      await fetch("/api/staff/knowledge-base", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ action: "view", id: articleId }),
      });
    } catch (err) {
      // Silent fail for analytics
    }
  };

  const markHelpful = async (articleId: string) => {
    try {
      await fetch("/api/staff/knowledge-base", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ action: "helpful", id: articleId }),
      });
      aethexToast.success("Marked as helpful!");
      fetchArticles();
    } catch (err) {
      aethexToast.error("Failed to mark as helpful");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </Layout>
    );
  }

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
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={
                  selectedCategory === "all"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                }
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
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
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer group"
                  onClick={() => trackView(article.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 rounded bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                        {getCategoryIcon(article.category)}
                      </div>
                      <Badge className="bg-slate-700 text-slate-300 text-xs">
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-slate-100">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {article.content.substring(0, 150)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {article.tags && article.tags.length > 0 && (
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
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {article.helpful_count}
                          </span>
                          <span>{formatDate(article.updated_at)}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            markHelpful(article.id);
                          }}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {articles.length === 0 && (
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
