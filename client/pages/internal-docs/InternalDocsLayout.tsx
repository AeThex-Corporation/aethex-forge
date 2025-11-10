import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { Menu, X, ChevronRight, Lock, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavSpace {
  id: string;
  title: string;
  emoji: string;
  description: string;
  pages: NavPage[];
}

interface NavPage {
  title: string;
  path: string;
  description?: string;
}

const spaces: NavSpace[] = [
  {
    id: "space1",
    title: "START HERE",
    emoji: "🚀",
    description: "For All New Members",
    pages: [
      {
        title: "Welcome",
        path: "/internal-docs",
        description: "Welcome to AeThex Ecosystem",
      },
      {
        title: "Axiom Model",
        path: "/internal-docs/axiom-model",
        description: "Our 3-entity structure",
      },
      {
        title: "Find Your Role",
        path: "/internal-docs/find-your-role",
        description: "Who are you in the ecosystem?",
      },
    ],
  },
  {
    id: "space2",
    title: "ECOSYSTEM-WIDE",
    emoji: "🌍",
    description: "Universal Rules",
    pages: [
      {
        title: "Code of Conduct",
        path: "/internal-docs/code-of-conduct",
        description: "How we act",
      },
      {
        title: "Communication Protocol",
        path: "/internal-docs/communication",
        description: "Discord, Slack, meetings",
      },
      {
        title: "Meeting Cadence",
        path: "/internal-docs/meetings",
        description: "When & how we meet",
      },
      {
        title: "Brand & Voice",
        path: "/internal-docs/brand",
        description: "How we talk publicly",
      },
      {
        title: "Tech Stack",
        path: "/internal-docs/tech-stack",
        description: "Tools we use",
      },
    ],
  },
  {
    id: "space3",
    title: "THE FOUNDATION",
    emoji: "🏛️",
    description: "The Guardian",
    pages: [
      {
        title: "Governance Model",
        path: "/internal-docs/foundation-governance",
        description: "The Parliament",
      },
      {
        title: "Open-Source Protocol",
        path: "/internal-docs/foundation-protocol",
        description: "The AI Foundry",
      },
      {
        title: "Community Programs",
        path: "/internal-docs/foundation-programs",
        description: "The University",
      },
    ],
  },
  {
    id: "space4",
    title: "THE CORP",
    emoji: "⚙️",
    description: "The Engine",
    pages: [
      {
        title: "Product & Engineering",
        path: "/internal-docs/corp-product",
        description: "Development lifecycle",
      },
      {
        title: "Product Blueprints",
        path: "/internal-docs/corp-blueprints",
        description: "The Factory",
      },
      {
        title: "Client & Sales Ops",
        path: "/internal-docs/corp-clients",
        description: "Client onboarding & hiring",
      },
      {
        title: "Platform Strategy",
        path: "/internal-docs/corp-platform",
        description: "The Monolith",
      },
    ],
  },
  {
    id: "space5",
    title: "PEOPLE & FINANCE",
    emoji: "👥",
    description: "Back Office",
    pages: [
      {
        title: "Onboarding",
        path: "/internal-docs/onboarding",
        description: "New hire handbook",
      },
      {
        title: "Finance & Payments",
        path: "/internal-docs/finance",
        description: "Invoicing & expenses",
      },
    ],
  },
];

interface InternalDocsLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function InternalDocsLayout({
  children,
  title,
  description,
}: InternalDocsLayoutProps) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isCurrentPage = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-700 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-900">
          <Link
            to="/internal-docs"
            className="flex items-center gap-3 mb-6"
            onClick={() => setSidebarOpen(false)}
          >
            <Lock className="h-5 w-5 text-blue-400" />
            <div>
              <div className="font-bold text-sm text-white">Internal Hub</div>
              <div className="text-xs text-slate-400">Operations & Docs</div>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors w-full justify-center"
          >
            <Home className="h-4 w-4" />
            Back to Site
          </Link>
        </div>

        {/* Spaces Navigation */}
        <nav className="p-4 space-y-6">
          {spaces.map((space) => (
            <div key={space.id}>
              <div className="flex items-center gap-2 mb-3 px-2">
                <span className="text-lg">{space.emoji}</span>
                <div>
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {space.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {space.description}
                  </div>
                </div>
              </div>

              <div className="space-y-1 pl-2">
                {space.pages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm transition-all group ${
                      isCurrentPage(page.path)
                        ? "bg-blue-600 text-white font-medium"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-medium">{page.title}</div>
                    {page.description && (
                      <div className="text-xs text-slate-500 group-hover:text-slate-400">
                        {page.description}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-700 space-y-2 text-xs text-slate-500">
          <p>🔒 Internal only - Requires authentication</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-72">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-20 border-b border-slate-700 bg-slate-900/95 backdrop-blur p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <Link
            to="/"
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            ← Back
          </Link>
        </div>

        <div className="p-6 md:p-8 max-w-4xl">
          {title && (
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
              {description && (
                <p className="text-lg text-slate-400">{description}</p>
              )}
            </div>
          )}

          <div className="prose prose-invert max-w-none">{children}</div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-700 bg-slate-900/50 mt-12">
          <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
            <p className="text-sm text-slate-500">
              © 2025 AeThex. This is an internal operations hub. Information
              here is confidential and for authorized personnel only.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
