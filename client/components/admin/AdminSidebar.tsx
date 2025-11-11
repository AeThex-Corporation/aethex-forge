import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  Users,
  MessageSquare,
  Grid3x3,
  Settings,
  Award,
  Shield,
  Rocket,
  PenTool,
  Command,
  Activity,
  ClipboardList,
  BookOpen,
  Home,
  ArrowRight,
  Music,
} from "lucide-react";

interface SidebarSection {
  label: string;
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
}

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
}: AdminSidebarProps) {
  const location = useLocation();

  const sections: SidebarSection[] = [
    {
      label: "Overview",
      items: [
        {
          id: "overview",
          label: "Dashboard",
          icon: <BarChart3 className="h-4 w-4" />,
          onClick: () => onTabChange("overview"),
        },
        {
          id: "system-map",
          label: "System Map",
          icon: <Grid3x3 className="h-4 w-4" />,
          onClick: () => onTabChange("system-map"),
        },
        {
          id: "roadmap",
          label: "Roadmap",
          icon: <Rocket className="h-4 w-4" />,
          onClick: () => onTabChange("roadmap"),
        },
      ],
    },
    {
      label: "Staff Management",
      items: [
        {
          id: "staff",
          label: "Staff Operations",
          icon: <Shield className="h-4 w-4" />,
          onClick: () => onTabChange("staff"),
        },
        {
          id: "blogs",
          label: "Blog Posts",
          icon: <PenTool className="h-4 w-4" />,
          onClick: () => onTabChange("blogs"),
        },
        {
          id: "community",
          label: "Community",
          icon: <Users className="h-4 w-4" />,
          onClick: () => onTabChange("community"),
        },
        {
          id: "mentorship",
          label: "Mentorship",
          icon: <Award className="h-4 w-4" />,
          onClick: () => onTabChange("mentorship"),
        },
      ],
    },
    {
      label: "Staff Resources",
      items: [
        {
          id: "announcements",
          label: "Announcements",
          icon: <MessageSquare className="h-4 w-4" />,
          onClick: () => (window.location.href = "/staff/announcements"),
        },
        {
          id: "knowledge-base",
          label: "Knowledge Base",
          icon: <BookOpen className="h-4 w-4" />,
          onClick: () => (window.location.href = "/staff/knowledge-base"),
        },
        {
          id: "team-handbook",
          label: "Team Handbook",
          icon: <FileText className="h-4 w-4" />,
          onClick: () => (window.location.href = "/staff/team-handbook"),
        },
        {
          id: "learning-portal",
          label: "Learning Portal",
          icon: <BookOpen className="h-4 w-4" />,
          onClick: () => (window.location.href = "/staff/learning-portal"),
        },
        {
          id: "project-tracking",
          label: "Project Tracking",
          icon: <ClipboardList className="h-4 w-4" />,
          onClick: () => (window.location.href = "/staff/project-tracking"),
        },
        {
          id: "performance-reviews",
          label: "Performance Reviews",
          icon: <Award className="h-4 w-4" />,
          onClick: () => (window.location.href = "/staff/performance-reviews"),
        },
        {
          id: "expense-reports",
          label: "Expense Reports",
          icon: <FileText className="h-4 w-4" />,
          onClick: () => (window.location.href = "/staff/expense-reports"),
        },
        {
          id: "marketplace",
          label: "Internal Marketplace",
          icon: <Grid3x3 className="h-4 w-4" />,
          onClick: () => (window.location.href = "/staff/marketplace"),
        },
      ],
    },
    {
      label: "Platform",
      items: [
        {
          id: "arm-metrics",
          label: "Arm Metrics",
          icon: <Activity className="h-4 w-4" />,
          onClick: () => onTabChange("arm-metrics"),
        },
        {
          id: "ethos",
          label: "Ethos Verification",
          icon: <Music className="h-4 w-4" />,
          onClick: () => onTabChange("ethos"),
        },
        {
          id: "discord",
          label: "Discord Management",
          icon: <Command className="h-4 w-4" />,
          onClick: () => onTabChange("discord"),
        },
        {
          id: "operations",
          label: "Operations",
          icon: <Settings className="h-4 w-4" />,
          onClick: () => onTabChange("operations"),
        },
      ],
    },
    {
      label: "Resources",
      items: [
        {
          id: "internal-docs",
          label: "Internal Docs",
          icon: <BookOpen className="h-4 w-4" />,
          onClick: () => (window.location.href = "/internal-docs"),
        },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-background/50 border-r border-border/40 backdrop-blur">
      {/* Header */}
      <div className="p-6 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-aethex-500 to-purple-600 flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Admin Control</h1>
            <p className="text-xs text-muted-foreground">Staff Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {sections.map((section) => (
          <div key={section.label} className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.label}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    activeTab === item.id
                      ? "bg-aethex-500/20 text-aethex-200 border border-aethex-400/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  {activeTab === item.id && (
                    <ArrowRight className="h-3 w-3 opacity-50" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/40 space-y-2">
        <p className="text-xs text-muted-foreground px-3">
          Need help? Check the{" "}
          <button
            onClick={() => (window.location.href = "/internal-docs")}
            className="text-aethex-300 hover:text-aethex-200 underline"
          >
            docs
          </button>
        </p>
      </div>
    </aside>
  );
}
