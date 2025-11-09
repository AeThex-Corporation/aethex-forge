import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  LucideIcon,
  Video,
  Code,
  FileText,
  Puzzle,
  LayoutDashboard,
} from "lucide-react";
import { useDocsTheme } from "@/contexts/DocsThemeContext";

export interface ResourceSection {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  items: string[];
  badge: string;
}

const defaultSections: ResourceSection[] = [
  {
    title: "Tutorials & Guides",
    description: "Step-by-step tutorials and comprehensive guides",
    icon: Video,
    href: "/docs/tutorials",
    items: [
      "Platform Quick Start",
      "Game Development",
      "AI Integration",
      "Performance Optimization",
    ],
    badge: "6 tutorials",
  },
  {
    title: "Platform Experience",
    description: "Understand dashboard, passport, and collaboration spaces",
    icon: LayoutDashboard,
    href: "/docs/platform",
    items: ["Dashboard", "Passport", "Community", "Mentorship"],
    badge: "New",
  },
  {
    title: "API Reference",
    description: "Complete API documentation with examples",
    icon: Code,
    href: "/docs/api",
    items: ["Authentication", "Project Management", "User APIs", "Webhooks"],
    badge: "40+ endpoints",
  },
  {
    title: "Examples",
    description: "Ready-to-use code examples and templates",
    icon: FileText,
    href: "/docs/examples",
    items: [
      "React Components",
      "Game Templates",
      "API Integration",
      "Deployment Scripts",
    ],
    badge: "25+ examples",
  },
  {
    title: "Integrations",
    description: "Embed partner tooling and automate external workflows",
    icon: Puzzle,
    href: "/docs/integrations",
    items: [
      "HelloSkip agent",
      "Theming hooks",
      "Status preflights",
      "Troubleshooting",
    ],
    badge: "Updated",
  },
];

interface ResourceSectionsGridProps {
  sections?: ResourceSection[];
}

export default function ResourceSectionsGrid({
  sections = defaultSections,
}: ResourceSectionsGridProps) {
  const { colors, theme } = useDocsTheme();
  const iconColor =
    theme === "professional" ? "text-gray-700" : "text-purple-400";
  const hoverBorderColor =
    theme === "professional"
      ? "hover:border-gray-400"
      : "hover:border-purple-500/50";
  const hoverTitleColor =
    theme === "professional"
      ? "group-hover:text-gray-900"
      : "group-hover:text-purple-400";
  const arrowColor =
    theme === "professional" ? "text-gray-600" : "text-purple-400";
  const explorehoverColor =
    theme === "professional"
      ? "group-hover:text-gray-900"
      : "group-hover:text-purple-300";

  return (
    <div className="mb-12">
      <h3 className={`text-2xl font-bold ${colors.headingColor} mb-6`}>
        Documentation Sections
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card
              key={index}
              className={`${colors.cardBg} border ${colors.cardBorder} ${hoverBorderColor} transition-all duration-300 cursor-pointer group`}
            >
              <Link to={section.href}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                    <Badge variant="outline">{section.badge}</Badge>
                  </div>
                  <CardTitle
                    className={`${colors.headingColor} ${hoverTitleColor} transition-colors`}
                  >
                    {section.title}
                  </CardTitle>
                  <CardDescription className={colors.textMuted}>
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className={`text-sm ${colors.textMuted} flex items-center`}
                      >
                        <ArrowRight className={`h-3 w-3 mr-2 ${arrowColor}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    className={`flex items-center ${theme === "professional" ? "text-gray-700" : "text-purple-400"} text-sm ${explorehoverColor} transition-colors`}
                  >
                    Explore section
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
