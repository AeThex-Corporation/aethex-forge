import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Code,
  Terminal,
  Video,
  LayoutDashboard,
  FileText,
  ArrowRight,
  Rocket,
  Zap,
  Shield,
  Users,
  Play,
  Download,
  Github,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";

const quickStartCards = [
  {
    title: "Platform Overview",
    description: "Get familiar with AeThex platform features and capabilities",
    icon: Rocket,
    href: "/docs/getting-started",
    duration: "5 min read",
    difficulty: "Beginner",
  },
  {
    title: "First Tutorial",
    description:
      "Follow your first interactive tutorial to build something amazing",
    icon: Play,
    href: "/docs/tutorials",
    duration: "15 min",
    difficulty: "Beginner",
    isNew: true,
  },
  {
    title: "API Integration",
    description: "Learn how to integrate with AeThex APIs and services",
    icon: Code,
    href: "/docs/api",
    duration: "10 min read",
    difficulty: "Intermediate",
  },
  {
    title: "CLI Tools",
    description: "Master the command line tools for efficient development",
    icon: Terminal,
    href: "/docs/cli",
    duration: "8 min read",
    difficulty: "Intermediate",
  },
  {
    title: "Platform Integrations",
    description: "Embed partner agents and automate external workflows",
    icon: LinkIcon,
    href: "/docs/integrations",
    duration: "7 min read",
    difficulty: "Intermediate",
  },
];

const resourceSections = [
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
    icon: LinkIcon,
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

const featuredUpdates = [
  {
    title: "New AI Integration Tutorials",
    description: "Learn how to integrate cutting-edge AI features",
    date: "2 days ago",
    type: "Tutorial",
    isNew: true,
  },
  {
    title: "API v2.1 Documentation",
    description: "Updated API docs with new endpoints and features",
    date: "1 week ago",
    type: "API",
  },
  {
    title: "Performance Best Practices",
    description: "New guide on optimizing application performance",
    date: "2 weeks ago",
    type: "Guide",
  },
];

export default function DocsOverview() {
  return (
    <div>
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Welcome to AeThex Documentation
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Everything you need to build, deploy, and scale amazing projects with
          AeThex. Get started with our guides, explore our APIs, and learn from
          comprehensive tutorials.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Link to="/docs/getting-started">
              <Rocket className="h-5 w-5 mr-2" />
              Get Started
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            <Link to="/docs/tutorials">
              <Play className="h-5 w-5 mr-2" />
              Watch Tutorials
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Start Cards */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6">Quick Start</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStartCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <Link to={card.href}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-8 w-8 text-purple-400" />
                      {card.isNew && (
                        <Badge className="bg-green-600 text-white text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white text-lg group-hover:text-purple-400 transition-colors">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 mb-3">
                      {card.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-gray-500">
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

      {/* Resource Sections */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6">
          Documentation Sections
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {resourceSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
              >
                <Link to={section.href}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-8 w-8 text-purple-400" />
                      <Badge variant="outline">{section.badge}</Badge>
                    </div>
                    <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-sm text-gray-400 flex items-center"
                        >
                          <ArrowRight className="h-3 w-3 mr-2 text-purple-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center text-purple-400 text-sm group-hover:text-purple-300 transition-colors">
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

      {/* Featured Updates */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Recent Updates</h3>
          <Button
          asChild
          variant="outline"
          size="sm"
          className="border-slate-600 text-white hover:bg-slate-800"
        >
          <Link to="/changelog">View All Updates</Link>
        </Button>
        </div>
        <div className="space-y-4">
          {featuredUpdates.map((update, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-medium">{update.title}</h4>
                      {update.isNew && (
                        <Badge className="bg-green-600 text-white text-xs">
                          New
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {update.type}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {update.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{update.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Github className="h-5 w-5 mr-2" />
              GitHub Repository
            </CardTitle>
            <CardDescription className="text-gray-400">
              Explore our open-source projects and contribute to the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <a
                href="https://github.com/aethex/examples"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Community Support
            </CardTitle>
            <CardDescription className="text-gray-400">
              Join our community for help, discussions, and collaboration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <Link to="/community" className="inline-flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Community
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
