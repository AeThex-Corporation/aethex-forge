import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/dev-platform/Breadcrumbs";
import { TemplateCard } from "@/components/dev-platform/TemplateCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

const categories = [
  "All Templates",
  "Discord Bots",
  "API Integrations",
  "Full Stack",
  "Webhooks",
  "Automation",
  "Analytics",
];

const languages = ["All", "JavaScript", "TypeScript", "Python", "Go", "Rust"];

const templates = [
  {
    id: "discord-activity-starter",
    name: "Discord Activity Starter",
    description: "Full-featured Discord Activity with user authentication and real-time features",
    category: "Discord Bots",
    language: "TypeScript",
    stars: 245,
    downloads: 1840,
    author: "AeThex Labs",
    difficulty: "intermediate" as const,
    tags: ["discord", "activities", "oauth", "react"],
    githubUrl: "https://github.com/aethex/discord-activity-starter",
    demoUrl: "https://discord.com/application-directory/123",
  },
  {
    id: "api-client-js",
    name: "AeThex API Client (JS)",
    description: "Official JavaScript/TypeScript client for the AeThex API with full type safety",
    category: "API Integrations",
    language: "TypeScript",
    stars: 189,
    downloads: 3240,
    author: "AeThex Core",
    difficulty: "beginner" as const,
    tags: ["api", "sdk", "typescript", "node"],
    githubUrl: "https://github.com/aethex/aethex-js",
  },
  {
    id: "webhook-relay",
    name: "Webhook Relay Service",
    description: "Forward and transform webhooks between services with retry logic and logging",
    category: "Webhooks",
    language: "Go",
    stars: 167,
    downloads: 892,
    author: "Community",
    difficulty: "advanced" as const,
    tags: ["webhooks", "relay", "proxy", "go"],
    githubUrl: "https://github.com/community/webhook-relay",
  },
  {
    id: "fullstack-template",
    name: "AeThex Full Stack Template",
    description: "Complete app with React frontend, Express backend, and Supabase integration",
    category: "Full Stack",
    language: "TypeScript",
    stars: 421,
    downloads: 2156,
    author: "AeThex Labs",
    difficulty: "intermediate" as const,
    tags: ["react", "express", "supabase", "tailwind"],
    githubUrl: "https://github.com/aethex/fullstack-template",
    demoUrl: "https://template.aethex.dev",
  },
  {
    id: "python-api-wrapper",
    name: "AeThex API Wrapper (Python)",
    description: "Pythonic wrapper for AeThex API with async support and type hints",
    category: "API Integrations",
    language: "Python",
    stars: 134,
    downloads: 1654,
    author: "AeThex Core",
    difficulty: "beginner" as const,
    tags: ["python", "asyncio", "api", "wrapper"],
    githubUrl: "https://github.com/aethex/aethex-py",
  },
  {
    id: "analytics-dashboard",
    name: "Developer Analytics Dashboard",
    description: "Pre-built dashboard to visualize API usage, user activity, and performance metrics",
    category: "Analytics",
    language: "TypeScript",
    stars: 298,
    downloads: 1432,
    author: "Community",
    difficulty: "intermediate" as const,
    tags: ["analytics", "charts", "dashboard", "recharts"],
    githubUrl: "https://github.com/community/analytics-dashboard",
    demoUrl: "https://analytics-demo.aethex.dev",
  },
  {
    id: "automation-workflows",
    name: "Workflow Automation Kit",
    description: "Build automated workflows with triggers, actions, and conditions using AeThex API",
    category: "Automation",
    language: "JavaScript",
    stars: 203,
    downloads: 967,
    author: "AeThex Labs",
    difficulty: "advanced" as const,
    tags: ["automation", "workflows", "triggers", "zapier-like"],
    githubUrl: "https://github.com/aethex/workflow-kit",
  },
  {
    id: "discord-bot-boilerplate",
    name: "Discord Bot Boilerplate",
    description: "Production-ready Discord bot with slash commands, events, and database integration",
    category: "Discord Bots",
    language: "TypeScript",
    stars: 512,
    downloads: 4321,
    author: "AeThex Labs",
    difficulty: "beginner" as const,
    tags: ["discord", "bot", "slash-commands", "prisma"],
    githubUrl: "https://github.com/aethex/discord-bot-boilerplate",
  },
  {
    id: "rust-api-client",
    name: "AeThex API Client (Rust)",
    description: "Blazing fast Rust client with zero-copy deserialization and async runtime",
    category: "API Integrations",
    language: "Rust",
    stars: 87,
    downloads: 432,
    author: "Community",
    difficulty: "advanced" as const,
    tags: ["rust", "tokio", "serde", "performance"],
    githubUrl: "https://github.com/community/aethex-rs",
  },
];

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All Templates" || template.category === selectedCategory;

    const matchesLanguage =
      selectedLanguage === "All" || template.language === selectedLanguage;

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  return (
    <Layout>
      <SEO pageTitle="Templates Gallery" description="Pre-built templates and starter kits to accelerate your development" />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates, tags, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 rounded-md border border-input bg-background text-sm"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="px-3 py-1 rounded-md border border-input bg-background text-sm">
              <option>Most Popular</option>
              <option>Most Downloaded</option>
              <option>Recently Added</option>
              <option>Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} {...template} />
            ))}
          </div>
        )}

        {/* Submit Template CTA */}
        <div className="mt-12 p-8 border-2 border-dashed border-border rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Have a template to share?</h3>
          <p className="text-muted-foreground mb-4">
            Submit your template to help other developers get started faster
          </p>
          <Button variant="outline">
            Submit Template
          </Button>
        </div>
      </div>
    </Layout>
  );
}
