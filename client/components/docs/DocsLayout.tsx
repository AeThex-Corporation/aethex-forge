import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ChevronRight,
  BookOpen,
  Code2,
  Zap,
  FileText,
  GitBranch,
  Layers,
  BookMarked,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DocNavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
}

const docNavigation: DocNavItem[] = [
  {
    title: "Overview",
    path: "/docs/overview",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Get started with AeThex",
  },
  {
    title: "Getting Started",
    path: "/docs/getting-started",
    icon: <Zap className="h-5 w-5" />,
    description: "Quick start guide",
  },
  {
    title: "Platform",
    path: "/docs/platform",
    icon: <Layers className="h-5 w-5" />,
    description: "Platform architecture & features",
  },
  {
    title: "API Reference",
    path: "/docs/api-reference",
    icon: <Code2 className="h-5 w-5" />,
    description: "Complete API documentation",
  },
  {
    title: "CLI",
    path: "/docs/cli",
    icon: <GitBranch className="h-5 w-5" />,
    description: "Command line tools",
  },
  {
    title: "Tutorials",
    path: "/docs/tutorials",
    icon: <BookMarked className="h-5 w-5" />,
    description: "Step-by-step guides",
  },
  {
    title: "Examples",
    path: "/docs/examples",
    icon: <FileText className="h-5 w-5" />,
    description: "Code examples",
  },
  {
    title: "Integrations",
    path: "/docs/integrations",
    icon: <Zap className="h-5 w-5" />,
    description: "Third-party integrations",
  },
  {
    title: "Curriculum",
    path: "/docs/curriculum",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Learning paths",
  },
];

interface DocsLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  tableOfContents?: Array<{ id: string; label: string; level: number }>;
}

export default function DocsLayout({
  children,
  title,
  description,
  breadcrumbs,
  tableOfContents = [],
}: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const filteredNav = useMemo(() => {
    if (!searchQuery) return docNavigation;
    const query = searchQuery.toLowerCase();
    return docNavigation.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const isCurrentPage = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Link to="/docs/overview" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-white hidden sm:inline">
                AeThex Docs
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-sm mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search documentation..."
                className="bg-slate-800 border-slate-700 pl-10 pr-4 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* GitHub Link */}
          <Link
            to="/docs/overview"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm"
          >
            GitHub
          </Link>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden px-4 py-2 border-t border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search..."
              className="bg-slate-800 border-slate-700 pl-10 pr-4 text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 top-16 z-30 w-64 border-r border-slate-800 bg-slate-950 overflow-y-auto transition-all duration-300 md:relative md:inset-auto md:top-0 md:block ${
            sidebarOpen ? "left-0" : "-left-64"
          }`}
        >
          <nav className="p-4 space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
              Documentation
            </div>
            {filteredNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-start gap-3 px-3 py-3 rounded-lg transition-all group ${
                  isCurrentPage(item.path)
                    ? "bg-slate-800 border border-slate-700"
                    : "hover:bg-slate-800/50"
                }`}
              >
                <div
                  className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                    isCurrentPage(item.path)
                      ? "text-cyan-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      isCurrentPage(item.path)
                        ? "text-white"
                        : "text-slate-300"
                    }`}
                  >
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-slate-500 line-clamp-1">
                      {item.description}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {/* Breadcrumbs */}
          {breadcrumbs && (
            <div className="border-b border-slate-800 bg-slate-950/50 px-4 md:px-8 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Link
                  to="/docs/overview"
                  className="text-slate-400 hover:text-slate-300"
                >
                  Docs
                </Link>
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    {crumb.path ? (
                      <Link
                        to={crumb.path}
                        className="text-slate-400 hover:text-slate-300"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-slate-300">{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 md:px-8 py-8 max-w-7xl mx-auto">
            {/* Content */}
            <div className="lg:col-span-3">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
                {description && (
                  <p className="text-lg text-slate-400">{description}</p>
                )}
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">{children}</div>
            </div>

            {/* Table of Contents - Right Sidebar */}
            {tableOfContents.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-20">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    On this page
                  </div>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm transition-colors line-clamp-2 ${
                          item.level === 2
                            ? "text-slate-400 hover:text-slate-200"
                            : "text-slate-500 hover:text-slate-300 pl-4"
                        }`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-800 bg-slate-950/50 mt-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold text-white mb-3">Product</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>
                      <Link to="/docs/overview" className="hover:text-slate-200">
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link to="/docs/platform" className="hover:text-slate-200">
                        Platform
                      </Link>
                    </li>
                    <li>
                      <a href="#" className="hover:text-slate-200">
                        Pricing
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">Resources</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>
                      <Link
                        to="/docs/tutorials"
                        className="hover:text-slate-200"
                      >
                        Tutorials
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/docs/api-reference"
                        className="hover:text-slate-200"
                      >
                        API Reference
                      </Link>
                    </li>
                    <li>
                      <a href="#" className="hover:text-slate-200">
                        Blog
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">Community</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>
                      <a href="#" className="hover:text-slate-200">
                        Discord
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-slate-200">
                        GitHub
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-slate-200">
                        Twitter
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-slate-800 mt-8 pt-8 flex justify-between items-center text-sm text-slate-500">
                <p>&copy; 2025 AeThex. All rights reserved.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-slate-400">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-slate-400">
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
