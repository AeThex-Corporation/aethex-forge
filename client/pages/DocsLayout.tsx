import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  Video,
  Code,
  Terminal,
  Search,
  Puzzle,
  Home,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/docs",
    icon: Home,
    exact: true,
  },
  {
    name: "Getting Started",
    href: "/docs/getting-started",
    icon: BookOpen,
  },
  {
    name: "Tutorials",
    href: "/docs/tutorials",
    icon: Video,
    badge: "New",
  },
  {
    name: "API Reference",
    href: "/docs/api",
    icon: Code,
  },
  {
    name: "CLI Tools",
    href: "/docs/cli",
    icon: Terminal,
  },
  {
    name: "Examples",
    href: "/docs/examples",
    icon: FileText,
  },
  {
    name: "Integrations",
    href: "/docs/integrations",
    icon: Puzzle,
  },
];

export default function DocsLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);

    if (segments.length <= 1) return [];

    const breadcrumbs = [];
    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      if (index > 0) {
        // Skip the first 'docs' segment
        breadcrumbs.push({
          name:
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace("-", " "),
          href: currentPath,
          isLast: index === segments.length - 1,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  AeThex Documentation
                </h1>
                <p className="text-gray-300">
                  Comprehensive guides, tutorials, and API references
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-white bg-slate-800 rounded-md"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Breadcrumb */}
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                <Link to="/docs" className="hover:text-white transition-colors">
                  Docs
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4" />
                    {crumb.isLast ? (
                      <span className="text-white">{crumb.name}</span>
                    ) : (
                      <Link
                        to={crumb.href}
                        className="hover:text-white transition-colors"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div
              className={`w-full lg:w-64 ${sidebarOpen ? "block" : "hidden lg:block"}`}
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sticky top-4">
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href, item.exact);

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all ${
                          active
                            ? "bg-purple-600 text-white"
                            : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <Badge className="bg-green-600 text-white text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
