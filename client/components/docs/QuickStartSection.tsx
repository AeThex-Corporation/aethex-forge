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
  LayoutDashboard,
  Code,
  Terminal,
  Rocket,
  Play,
  Link as LinkIcon,
  LucideIcon,
} from "lucide-react";
import { useDocsTheme } from "@/contexts/DocsThemeContext";

export interface QuickStartCard {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  duration: string;
  difficulty: string;
  isNew?: boolean;
}

const defaultCards: QuickStartCard[] = [
  {
    title: "Platform tour",
    description: "Walk through dashboard, passport, and community experiences",
    icon: LayoutDashboard,
    href: "/docs/platform",
    duration: "6 min read",
    difficulty: "Beginner",
    isNew: true,
  },
  {
    title: "Project setup",
    description: "Launch your first AeThex project with guided onboarding",
    icon: Rocket,
    href: "/docs/getting-started",
    duration: "5 min read",
    difficulty: "Beginner",
  },
  {
    title: "First tutorial",
    description:
      "Follow your first interactive tutorial to build something amazing",
    icon: Play,
    href: "/docs/tutorials",
    duration: "15 min",
    difficulty: "Beginner",
  },
  {
    title: "API integration",
    description: "Learn how to integrate with AeThex APIs and services",
    icon: Code,
    href: "/docs/api",
    duration: "10 min read",
    difficulty: "Intermediate",
  },
  {
    title: "CLI tools",
    description: "Master the command line tools for efficient development",
    icon: Terminal,
    href: "/docs/cli",
    duration: "8 min read",
    difficulty: "Intermediate",
  },
  {
    title: "Platform integrations",
    description: "Embed partner agents and automate external workflows",
    icon: LinkIcon,
    href: "/docs/integrations",
    duration: "7 min read",
    difficulty: "Intermediate",
  },
];

interface QuickStartSectionProps {
  cards?: QuickStartCard[];
}

export default function QuickStartSection({
  cards = defaultCards,
}: QuickStartSectionProps) {
  const { colors, theme } = useDocsTheme();

  return (
    <div className="mb-12">
      <h3 className={`text-2xl font-bold ${colors.headingColor} mb-6`}>
        Quick Start
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const hoverBorderColor =
            theme === "professional"
              ? "hover:border-gray-400"
              : "hover:border-purple-500/50";
          const iconColor =
            theme === "professional" ? "text-gray-700" : "text-purple-400";
          const hoverTitleColor =
            theme === "professional"
              ? "group-hover:text-gray-900"
              : "group-hover:text-purple-400";

          return (
            <Card
              key={index}
              className={`${colors.cardBg} border ${colors.cardBorder} ${hoverBorderColor} transition-all duration-300 hover:scale-105 cursor-pointer group`}
            >
              <Link to={card.href}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                    {card.isNew && (
                      <Badge className="bg-green-600 text-white text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <CardTitle
                    className={`${colors.headingColor} text-lg ${hoverTitleColor} transition-colors`}
                  >
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`${colors.textMuted} mb-3`}>
                    {card.description}
                  </CardDescription>
                  <div
                    className={`flex items-center justify-between text-xs ${colors.textMuted}`}
                  >
                    <span>{card.duration}</span>
                    <Badge variant="outline" className="text-xs">
                      {card.difficulty}
                    </Badge>
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
