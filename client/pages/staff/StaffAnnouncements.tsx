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
import { Bell, Pin, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  is_pinned: boolean;
  is_read: boolean;
  published_at: string;
  author?: { full_name: string; avatar_url: string };
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent": return "bg-red-500/20 text-red-300 border-red-500/30";
    case "high": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    case "normal": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "low": return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    default: return "bg-slate-500/20 text-slate-300";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "urgent": return "bg-red-600";
    case "policy": return "bg-purple-600";
    case "event": return "bg-blue-600";
    case "celebration": return "bg-green-600";
    default: return "bg-slate-600";
  }
};

export default function StaffAnnouncements() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showRead, setShowRead] = useState(true);

  useEffect(() => {
    if (session?.access_token) fetchAnnouncements();
  }, [session?.access_token]);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/staff/announcements", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      aethexToast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/staff/announcements", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "mark_read", id }),
      });
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  const categories = ["all", ...new Set(announcements.map(a => a.category))];

  const filtered = announcements.filter(a => {
    const matchesCategory = selectedCategory === "all" || a.category === selectedCategory;
    const matchesRead = showRead || !a.is_read;
    return matchesCategory && matchesRead;
  });

  const pinned = filtered.filter(a => a.is_pinned);
  const unpinned = filtered.filter(a => !a.is_pinned);

  if (loading) {
    return (
      <Layout>
        <SEO title="Announcements" description="Company news and updates" />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Announcements" description="Company news and updates" />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-rose-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-4xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/30">
                <Bell className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-rose-100">Announcements</h1>
                <p className="text-rose-200/70">Company news, updates, and important information</p>
              </div>
            </div>

            <div className="mb-8 space-y-4">
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? "bg-rose-600 hover:bg-rose-700" : "border-rose-500/30 text-rose-300 hover:bg-rose-500/10"}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRead(!showRead)}
                className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
              >
                {showRead ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showRead ? "Hide Read" : "Show All"}
              </Button>
            </div>

            {pinned.length > 0 && (
              <div className="mb-12">
                <h2 className="text-lg font-semibold text-rose-100 mb-4 flex items-center gap-2">
                  <Pin className="h-5 w-5" /> Pinned
                </h2>
                <div className="space-y-4">
                  {pinned.map(ann => (
                    <Card
                      key={ann.id}
                      className={`bg-slate-800/50 border-rose-500/50 hover:border-rose-400/80 transition-all ${!ann.is_read ? "ring-2 ring-rose-500/30" : ""}`}
                      onClick={() => !ann.is_read && markAsRead(ann.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-rose-100">{ann.title}</CardTitle>
                            <CardDescription className="text-slate-400">
                              by {ann.author?.full_name || "Staff"} • {formatDate(ann.published_at)}
                            </CardDescription>
                          </div>
                          <Badge className={`border ${getPriorityColor(ann.priority)}`}>
                            {ann.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 mb-3">{ann.content}</p>
                        <Badge className={getCategoryColor(ann.category)}>{ann.category}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {unpinned.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-rose-100 mb-4">Recent Announcements</h2>
                <div className="space-y-4">
                  {unpinned.map(ann => (
                    <Card
                      key={ann.id}
                      className={`bg-slate-800/50 border-slate-700/50 hover:border-rose-500/50 transition-all cursor-pointer ${!ann.is_read ? "ring-2 ring-rose-500/30" : ""}`}
                      onClick={() => !ann.is_read && markAsRead(ann.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-rose-100">{ann.title}</CardTitle>
                            <CardDescription className="text-slate-400">
                              by {ann.author?.full_name || "Staff"} • {formatDate(ann.published_at)}
                            </CardDescription>
                          </div>
                          <Badge className={`border ${getPriorityColor(ann.priority)}`}>
                            {ann.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 mb-3">{ann.content}</p>
                        <Badge className={getCategoryColor(ann.category)}>{ann.category}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No announcements found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
