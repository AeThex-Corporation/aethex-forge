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
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Bug,
  Zap,
  Shield,
  Code,
  Database,
  Users,
  Settings,
  Globe,
  BookOpen,
  Monitor,
  Network,
  Palette,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowUpRight,
  Github,
  ExternalLink,
  Bell,
} from "lucide-react";

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  category: string;
  title: string;
  description: string;
  changes: ChangelogItem[];
  author: string;
  pullRequest?: string;
}

interface ChangelogItem {
  type: "added" | "improved" | "fixed" | "removed" | "security";
  description: string;
  impact: "high" | "medium" | "low";
}

export const changelogEntries: ChangelogEntry[] = [
  {
    id: "v1.3.0",
    version: "1.3.0",
    date: "2025-10-18",
    type: "major",
    category: "Platform Enhancement",
    title:
      "Realms consolidation, live Status, feed upgrades, and Investors revamp",
    description:
      "Introduces a dedicated Realms management page with realm-aware dashboards, a live system Status page backed by a real API, improved social feed (likes, comments, and trending tags), and a redesigned Investors page with clear legal guidance.",
    author: "AeThex Development Team",
    changes: [
      {
        type: "added",
        description:
          "Live Status backend endpoint (/api/status) with health checks for DB, API, Auth, and CDN; frontend /status now auto-refreshes with real data",
        impact: "high",
      },
      {
        type: "added",
        description:
          "Dedicated /realms page for selecting and activating realms; dashboard adapts to active realm and supports ?realm= for direct navigation",
        impact: "high",
      },
      {
        type: "added",
        description:
          "Navigation updated to include Realms; Investors link moved to footer",
        impact: "medium",
      },
      {
        type: "added",
        description:
          "Investors page redesign with red theme and sections: Mission, Vision, What we do, How we execute, Traction/Roadmap; backend endpoint /api/investors/interest",
        impact: "medium",
      },
      {
        type: "added",
        description:
          "Social feed enhancements: working likes and comments with API; expandable comment textbox; trending hashtag/topic tagging with suggestions",
        impact: "high",
      },
      {
        type: "improved",
        description:
          "Unified unauthorized redirects to /onboarding for a consistent auth flow",
        impact: "medium",
      },
      {
        type: "improved",
        description:
          "Staff area: moderation reports and mentorship requests now load live data with basic moderation actions; new /api/staff/users listing/search",
        impact: "medium",
      },
      {
        type: "fixed",
        description:
          'Resolved "invalid input value for Enum user_type_enum: \\"staff\\"" by adding "staff" to enum via migration',
        impact: "high",
      },
    ],
  },
  {
    id: "v1.2.0",
    version: "1.2.0",
    date: "2025-01-08",
    type: "major",
    category: "Platform Enhancement",
    title: "Major Platform Improvements & New Features",
    description:
      "Comprehensive platform upgrade with new dashboard features, improved user experience, and enhanced system monitoring capabilities.",
    author: "AeThex Development Team",
    pullRequest: "#121e8c26",
    changes: [
      {
        type: "added",
        description:
          "New comprehensive Profile system with overseer dashboard and cross-site communication monitoring",
        impact: "high",
      },
      {
        type: "added",
        description:
          "System Status page with real-time monitoring of all AeThex services and infrastructure",
        impact: "high",
      },
      {
        type: "added",
        description:
          "Comprehensive Tutorials library with categorized learning content and filtering capabilities",
        impact: "medium",
      },
      {
        type: "added",
        description:
          "Nested Documentation routing system with improved navigation and breadcrumbs",
        impact: "medium",
      },
      {
        type: "added",
        description:
          "Documentation-specific tutorials section with interactive content types",
        impact: "medium",
      },
      {
        type: "added",
        description:
          "Login access options on onboarding page to prevent duplicate account creation",
        impact: "medium",
      },
      {
        type: "improved",
        description:
          "Enhanced navigation system with user-specific menu items when authenticated",
        impact: "medium",
      },
      {
        type: "improved",
        description:
          "Dashboard user interface with proper profile data integration and XP progression",
        impact: "medium",
      },
      {
        type: "improved",
        description:
          "Authentication flow with better error handling and redirect logic",
        impact: "high",
      },
      {
        type: "fixed",
        description:
          "Resolved Dashboard infinite loading screen issue when accessing without authentication",
        impact: "high",
      },
      {
        type: "fixed",
        description:
          "Fixed toast notification bouncing animations that were causing UI disruption",
        impact: "medium",
      },
      {
        type: "fixed",
        description:
          "Corrected database adapter table name mismatches and TypeScript compilation errors",
        impact: "high",
      },
      {
        type: "fixed",
        description:
          "Resolved DNS configuration issues for custom domain deployment",
        impact: "medium",
      },
      {
        type: "fixed",
        description:
          "Fixed user profile property access issues throughout the application",
        impact: "medium",
      },
      {
        type: "security",
        description:
          "Enhanced authentication redirect security with proper session handling",
        impact: "high",
      },
    ],
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "added":
      return <Plus className="h-4 w-4 text-green-500" />;
    case "improved":
      return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
    case "fixed":
      return <Bug className="h-4 w-4 text-orange-500" />;
    case "removed":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "security":
      return <Shield className="h-4 w-4 text-purple-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "added":
      return "bg-green-500";
    case "improved":
      return "bg-blue-500";
    case "fixed":
      return "bg-orange-500";
    case "removed":
      return "bg-red-500";
    case "security":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

const getVersionBadgeColor = (type: string) => {
  switch (type) {
    case "major":
      return "bg-purple-600";
    case "minor":
      return "bg-blue-600";
    case "patch":
      return "bg-green-600";
    default:
      return "bg-gray-600";
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high":
      return "text-red-400";
    case "medium":
      return "text-yellow-400";
    case "low":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
};

export default function Changelog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEntries = changelogEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.changes.some((change) =>
        change.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesType = selectedType === "all" || entry.type === selectedType;
    const matchesCategory =
      selectedCategory === "all" ||
      entry.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = [
    "all",
    "platform-enhancement",
    "security",
    "performance",
    "ui-ux",
  ];
  const types = ["all", "major", "minor", "patch"];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  AeThex Changelog
                </h1>
                <p className="text-xl text-gray-300">
                  Track the latest updates, improvements, and fixes to the
                  AeThex platform
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800"
                >
                  <Github className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Release Notes
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Releases</p>
                      <p className="text-2xl font-bold text-white">
                        {changelogEntries.length}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">New Features</p>
                      <p className="text-2xl font-bold text-green-400">
                        {changelogEntries.reduce(
                          (acc, entry) =>
                            acc +
                            entry.changes.filter((c) => c.type === "added")
                              .length,
                          0,
                        )}
                      </p>
                    </div>
                    <Plus className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Bug Fixes</p>
                      <p className="text-2xl font-bold text-orange-400">
                        {changelogEntries.reduce(
                          (acc, entry) =>
                            acc +
                            entry.changes.filter((c) => c.type === "fixed")
                              .length,
                          0,
                        )}
                      </p>
                    </div>
                    <Bug className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Improvements</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {changelogEntries.reduce(
                          (acc, entry) =>
                            acc +
                            entry.changes.filter((c) => c.type === "improved")
                              .length,
                          0,
                        )}
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search changelog entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "all"
                        ? "All Types"
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all"
                        ? "All Categories"
                        : category
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Changelog Entries */}
          <div className="space-y-8">
            {filteredEntries.map((entry, index) => (
              <Card
                key={entry.id}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Badge
                        className={`${getVersionBadgeColor(entry.type)} text-white border-0 px-3 py-1`}
                      >
                        v{entry.version}
                      </Badge>
                      <Badge variant="outline" className="text-gray-300">
                        {entry.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    {entry.pullRequest && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <Github className="h-4 w-4 mr-1" />
                        {entry.pullRequest}
                      </Button>
                    )}
                  </div>

                  <CardTitle className="text-2xl text-white">
                    {entry.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    {entry.description}
                  </CardDescription>

                  <div className="flex items-center text-sm text-gray-400 mt-2">
                    <Users className="h-4 w-4 mr-1" />
                    By {entry.author}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Group changes by type */}
                    {["added", "improved", "fixed", "security", "removed"].map(
                      (changeType) => {
                        const changesOfType = entry.changes.filter(
                          (change) => change.type === changeType,
                        );
                        if (changesOfType.length === 0) return null;

                        return (
                          <div key={changeType} className="space-y-3">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(changeType)}
                              <h4 className="font-semibold text-white capitalize">
                                {changeType} ({changesOfType.length})
                              </h4>
                            </div>
                            <ul className="space-y-2 ml-6">
                              {changesOfType.map((change, changeIndex) => (
                                <li
                                  key={changeIndex}
                                  className="flex items-start space-x-3"
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full ${getTypeColor(change.type)} mt-2 flex-shrink-0`}
                                  />
                                  <div className="flex-1">
                                    <p className="text-gray-300">
                                      {change.description}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className={`mt-1 text-xs ${getImpactColor(change.impact)} border-current`}
                                    >
                                      {change.impact} impact
                                    </Badge>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      },
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  No changelog entries found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your search terms or filters to find what you're
                  looking for.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Stay Updated
                </h3>
                <p className="text-gray-300 mb-4">
                  Follow our development progress and get notified about new
                  releases
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Watch on GitHub
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Bell className="h-4 w-4 mr-2" />
                    Subscribe to Updates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
