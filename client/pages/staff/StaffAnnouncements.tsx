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
import { Bell, Star, Archive, Pin } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  date: string;
  isPinned: boolean;
  isArchived: boolean;
  priority: "High" | "Normal" | "Low";
}

const announcements: Announcement[] = [
  {
    id: "1",
    title: "Q1 2025 All-Hands Meeting Rescheduled",
    content:
      "The all-hands meeting has been moved to Friday at 2 PM PST. Please mark your calendars and join us for company updates.",
    category: "Company News",
    author: "Sarah Chen",
    date: "Today",
    isPinned: true,
    isArchived: false,
    priority: "High",
  },
  {
    id: "2",
    title: "New Benefits Portal is Live",
    content:
      "Welcome to our upgraded benefits portal! You can now view and manage your health insurance, retirement plans, and more.",
    category: "Benefits",
    author: "HR Team",
    date: "2 days ago",
    isPinned: true,
    isArchived: false,
    priority: "High",
  },
  {
    id: "3",
    title: "Summer Internship Program Open for Applications",
    content:
      "We're hiring summer interns across all departments. If you know someone talented, send them our way!",
    category: "Hiring",
    author: "Talent Team",
    date: "3 days ago",
    isPinned: false,
    isArchived: false,
    priority: "Normal",
  },
  {
    id: "4",
    title: "Server Maintenance Window This Weekend",
    content:
      "We'll be performing scheduled maintenance on Saturday evening. Services may be temporarily unavailable.",
    category: "Technical",
    author: "DevOps Team",
    date: "4 days ago",
    isPinned: false,
    isArchived: false,
    priority: "Normal",
  },
  {
    id: "5",
    title: "Welcome New Team Members!",
    content:
      "Please join us in welcoming 5 amazing new colleagues who started this week. Check out their profiles in the directory.",
    category: "Team",
    author: "HR Team",
    date: "1 week ago",
    isPinned: false,
    isArchived: false,
    priority: "Low",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "Normal":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "Low":
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

const categories = [
  "All",
  "Company News",
  "Benefits",
  "Hiring",
  "Technical",
  "Team",
];

export default function StaffAnnouncements() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showArchived, setShowArchived] = useState(false);

  const filtered = announcements.filter((ann) => {
    const matchesCategory =
      selectedCategory === "All" || ann.category === selectedCategory;
    const matchesArchived = showArchived ? ann.isArchived : !ann.isArchived;
    return matchesCategory && matchesArchived;
  });

  const pinnedAnnouncements = filtered.filter((a) => a.isPinned);
  const unpinnedAnnouncements = filtered.filter((a) => !a.isPinned);

  return (
    <Layout>
      <SEO title="Announcements" description="Company news and updates" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-rose-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto max-w-4xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/30">
                <Bell className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-rose-100">
                  Announcements
                </h1>
                <p className="text-rose-200/70">
                  Company news, updates, and important information
                </p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-8 space-y-4">
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
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowArchived(!showArchived)}
                className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
              >
                <Archive className="h-4 w-4 mr-2" />
                {showArchived ? "Show Active" : "Show Archived"}
              </Button>
            </div>

            {/* Pinned Announcements */}
            {pinnedAnnouncements.length > 0 && (
              <div className="mb-12">
                <h2 className="text-lg font-semibold text-rose-100 mb-4 flex items-center gap-2">
                  <Pin className="h-5 w-5" />
                  Pinned
                </h2>
                <div className="space-y-4">
                  {pinnedAnnouncements.map((announcement) => (
                    <Card
                      key={announcement.id}
                      className="bg-slate-800/50 border-rose-500/50 hover:border-rose-400/80 transition-all"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-rose-100">
                              {announcement.title}
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                              by {announcement.author} • {announcement.date}
                            </CardDescription>
                          </div>
                          <Badge
                            className={`border ${getPriorityColor(announcement.priority)}`}
                          >
                            {announcement.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 mb-3">
                          {announcement.content}
                        </p>
                        <Badge className="bg-slate-700 text-slate-300">
                          {announcement.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Announcements */}
            {unpinnedAnnouncements.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-rose-100 mb-4">
                  Recent Announcements
                </h2>
                <div className="space-y-4">
                  {unpinnedAnnouncements.map((announcement) => (
                    <Card
                      key={announcement.id}
                      className="bg-slate-800/50 border-slate-700/50 hover:border-rose-500/50 transition-all"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-rose-100">
                              {announcement.title}
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                              by {announcement.author} • {announcement.date}
                            </CardDescription>
                          </div>
                          <Badge
                            className={`border ${getPriorityColor(announcement.priority)}`}
                          >
                            {announcement.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 mb-3">
                          {announcement.content}
                        </p>
                        <Badge className="bg-slate-700 text-slate-300">
                          {announcement.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No announcements found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
