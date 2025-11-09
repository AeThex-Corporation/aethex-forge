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
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface DocNavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
}

const docNavigation: DocNavItem[] = [
  {
    title: "Overview",
    path: "/docs",
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
    path: "/docs/api",
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
    <div className="min-h-screen bg-white text-slate-900 pt-20 md:pt-0">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white overflow-y-auto transition-all duration-300 pt-20 md:pt-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Back to Main Site Button */}
        <div className="p-4 border-b border-slate-200">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors w-full justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main Site
          </Link>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search docs..."
              className="bg-slate-50 border-slate-300 pl-10 pr-4 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation */}
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
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-slate-50"
              }`}
            >
              <div
                className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  isCurrentPage(item.path)
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium ${
                    isCurrentPage(item.path)
                      ? "text-slate-900"
                      : "text-slate-700"
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
      <main className="md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-20 border-b border-slate-200 bg-white p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 md:px-8 py-8 max-w-7xl mx-auto">
          {/* Content */}
          <div className="lg:col-span-3">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-slate-900 mb-3">{title}</h1>
              {description && (
                <p className="text-lg text-slate-600">{description}</p>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none">{children}</div>
          </div>

          {/* Table of Contents - Right Sidebar */}
          {tableOfContents.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-8">
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
                          ? "text-slate-700 hover:text-slate-900 font-medium"
                          : "text-slate-600 hover:text-slate-900 pl-4"
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
        <footer className="border-t border-slate-200 bg-slate-50 mt-12">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <Link to="/docs" className="hover:text-slate-900">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/platform" className="hover:text-slate-900">
                      Platform
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="hover:text-slate-900">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <Link to="/docs/tutorials" className="hover:text-slate-900">
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/docs/api"
                      className="hover:text-slate-900"
                    >
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="hover:text-slate-900">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Community</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <a href="#" className="hover:text-slate-900">
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-slate-900">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-slate-900">
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-slate-600">
              <p>&copy; 2025 AeThex. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-slate-900">
                  Privacy
                </a>
                <a href="#" className="hover:text-slate-900">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

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
