import { useState, useMemo } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
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
  Moon,
  Sun,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DocsThemeProvider, useDocsTheme } from "@/contexts/DocsThemeContext";

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
  children?: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  tableOfContents?: Array<{ id: string; label: string; level: number }>;
}

function DocsLayoutContent({
  children,
  title = "Documentation",
  description,
  breadcrumbs,
  tableOfContents = [],
}: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { colors, toggleTheme, theme } = useDocsTheme();

  const filteredNav = useMemo(() => {
    if (!searchQuery) return docNavigation;
    const query = searchQuery.toLowerCase();
    return docNavigation.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const isCurrentPage = (path: string) => location.pathname === path;

  // Subtle geometric grid for professional theme - black/white only
  const gridPatternStyle =
    theme === "professional"
      ? {
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, 0.02) 25%, rgba(0, 0, 0, 0.02) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.02) 75%, rgba(0, 0, 0, 0.02) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, 0.02) 25%, rgba(0, 0, 0, 0.02) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.02) 75%, rgba(0, 0, 0, 0.02) 76%, transparent 77%, transparent)
          `,
          backgroundSize: "80px 80px",
        }
      : undefined;

  return (
    <div
      className={`min-h-screen ${colors.background} ${colors.foreground} transition-colors duration-300`}
      style={gridPatternStyle}
    >
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 ${colors.sidebar} border-r ${colors.border} overflow-y-auto transition-all duration-300 pt-20 md:pt-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* AeThex Branding */}
        <div
          className={`p-6 border-b ${colors.border} flex flex-col items-center justify-center`}
        >
          <Link
            to="/docs"
            className="flex flex-col items-center justify-center gap-4 w-full"
          >
            <img
              src={
                theme === "professional"
                  ? "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fbac6154f77e94521bcbfe35abd605cd0?format=webp&width=800"
                  : "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F1d007dd573c54339ad35fde9cd637516?format=webp&width=800"
              }
              alt="AeThex Logo"
              className="h-16 w-16 object-contain"
            />
            <div className="text-center">
              <div className={`font-bold text-lg ${colors.headingColor}`}>
                AeThex
              </div>
              <div className={`text-xs ${colors.textMuted}`}>Documentation</div>
            </div>
          </Link>
          <Link
            to="/"
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${colors.sidebarText} ${colors.sidebarHover} transition-colors w-full justify-center`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main Site
          </Link>
        </div>

        {/* Theme Toggle */}
        <div className={`p-4 border-b ${colors.border} flex justify-center`}>
          <button
            onClick={toggleTheme}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${colors.sidebarText} ${colors.sidebarHover} transition-colors`}
            title={`Switch to ${theme === "professional" ? "AeThex Brand" : "Professional"} theme`}
          >
            {theme === "professional" ? (
              <>
                <Moon className="h-4 w-4" />
                <span className="text-xs">Brand</span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                <span className="text-xs">Light</span>
              </>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className={`p-4 border-b ${colors.border}`}>
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${colors.textMuted}`}
            />
            <Input
              placeholder="Search docs..."
              className={`${colors.inputBg} border-${colors.border} pl-10 pr-4 text-sm ${colors.foreground}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <div
            className={`text-xs font-semibold ${colors.textMuted} uppercase tracking-wider mb-4 px-2`}
          >
            Documentation
          </div>
          {filteredNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-start gap-3 px-3 py-3 rounded-lg transition-all group ${
                isCurrentPage(item.path)
                  ? `${colors.sidebarActiveBg} border ${colors.border}`
                  : colors.sidebarHover
              }`}
            >
              <div
                className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  isCurrentPage(item.path)
                    ? colors.sidebarActive
                    : `${colors.textMuted} group-hover:${colors.sidebarText}`
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium ${
                    isCurrentPage(item.path)
                      ? colors.headingColor
                      : colors.sidebarText
                  }`}
                >
                  {item.title}
                </div>
                {item.description && (
                  <div className={`text-xs ${colors.textMuted} line-clamp-1`}>
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
        <div
          className={`md:hidden sticky top-0 z-20 border-b ${colors.border} ${colors.cardBg} p-4 flex items-center justify-between`}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 ${colors.sidebarHover} rounded-lg`}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <Link to="/" className={`text-sm font-medium ${colors.accent}`}>
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 md:px-8 py-8 max-w-7xl mx-auto">
          {/* Content */}
          <div className="lg:col-span-3">
            {title && (
              <div className="mb-8">
                <h1
                  className={`text-5xl font-bold ${colors.headingColor} mb-3`}
                >
                  {title}
                </h1>
                {description && (
                  <p className={`text-lg ${colors.textMuted}`}>{description}</p>
                )}
              </div>
            )}

            {/* Content - either children (for wrapper) or Outlet (for routing) */}
            <div
              className={`prose max-w-none ${theme === "professional" ? "prose-neutral" : "prose-invert"}`}
            >
              {children || <Outlet />}
            </div>
          </div>

          {/* Table of Contents - Right Sidebar */}
          {tableOfContents.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-8">
                <div
                  className={`text-xs font-semibold ${colors.textMuted} uppercase tracking-wider mb-4`}
                >
                  On this page
                </div>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm transition-colors line-clamp-2 ${
                        item.level === 2
                          ? `${colors.headingColor} font-medium ${colors.accentHover}`
                          : `${colors.textMuted} ${colors.accentHover} pl-4`
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
        <footer className={`border-t ${colors.border} ${colors.cardBg} mt-12`}>
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
            {/* AeThex Arms - Grayscale for professional, colored for brand */}
            <div className={`mb-8 pb-8 border-b ${colors.border}`}>
              <h3
                className={`text-sm font-semibold ${colors.headingColor} mb-3`}
              >
                AeThex Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {theme === "professional" ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-200">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <span className="text-xs font-medium text-gray-700">
                        Labs
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-200">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <span className="text-xs font-medium text-gray-700">
                        GameForge
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-200">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <span className="text-xs font-medium text-gray-700">
                        Corp
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-200">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <span className="text-xs font-medium text-gray-700">
                        Foundation
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-200">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <span className="text-xs font-medium text-gray-700">
                        Dev-Link
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-100">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span className="text-xs font-medium text-yellow-900">
                        Labs
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-100">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-medium text-green-900">
                        GameForge
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-xs font-medium text-blue-900">
                        Corp
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-xs font-medium text-red-900">
                        Foundation
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-100">
                      <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                      <span className="text-xs font-medium text-cyan-900">
                        Dev-Link
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className={`font-semibold ${colors.headingColor} mb-4`}>
                  Product
                </h3>
                <ul className={`space-y-2 text-sm ${colors.textMuted}`}>
                  <li>
                    <Link to="/docs" className={`${colors.accentHover}`}>
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/docs/platform"
                      className={`${colors.accentHover}`}
                    >
                      Platform
                    </Link>
                  </li>
                  <li>
                    <a href="#" className={`${colors.accentHover}`}>
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold ${colors.headingColor} mb-4`}>
                  Resources
                </h3>
                <ul className={`space-y-2 text-sm ${colors.textMuted}`}>
                  <li>
                    <Link
                      to="/docs/tutorials"
                      className={`${colors.accentHover}`}
                    >
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/api" className={`${colors.accentHover}`}>
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <a href="#" className={`${colors.accentHover}`}>
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold ${colors.headingColor} mb-4`}>
                  Community
                </h3>
                <ul className={`space-y-2 text-sm ${colors.textMuted}`}>
                  <li>
                    <a href="#" className={`${colors.accentHover}`}>
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="#" className={`${colors.accentHover}`}>
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="#" className={`${colors.accentHover}`}>
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`border-t ${colors.border} mt-8 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm ${colors.textMuted}`}
            >
              <p>&copy; 2025 AeThex. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className={`${colors.accentHover}`}>
                  Privacy
                </a>
                <a href="#" className={`${colors.accentHover}`}>
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

export default function DocsLayout(props: DocsLayoutProps) {
  return (
    <DocsThemeProvider>
      <DocsLayoutContent {...props} />
    </DocsThemeProvider>
  );
}
