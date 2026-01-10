import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { ExampleCard } from "@/components/dev-platform/ExampleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Code2, BookOpen, Lightbulb } from "lucide-react";

const categories = [
  "All Examples",
  "Authentication",
  "API Integration",
  "Database",
  "Real-time",
  "File Upload",
  "Payment",
  "Discord",
];

const languages = ["All", "JavaScript", "TypeScript", "Python", "Go"];

const examples = [
  {
    id: "oauth-discord-flow",
    title: "Discord OAuth2 Authentication Flow",
    description: "Complete OAuth2 implementation with Discord, including token refresh and user profile fetching",
    category: "Authentication",
    language: "TypeScript",
    difficulty: "intermediate" as const,
    tags: ["oauth", "discord", "authentication", "express"],
    lines: 145,
  },
  {
    id: "api-key-middleware",
    title: "API Key Authentication Middleware",
    description: "Express middleware for API key validation with rate limiting and usage tracking",
    category: "Authentication",
    language: "TypeScript",
    difficulty: "beginner" as const,
    tags: ["middleware", "api-keys", "express", "security"],
    lines: 78,
  },
  {
    id: "supabase-crud",
    title: "Supabase CRUD Operations",
    description: "Complete CRUD implementation with Supabase including RLS policies and real-time subscriptions",
    category: "Database",
    language: "TypeScript",
    difficulty: "beginner" as const,
    tags: ["supabase", "crud", "postgresql", "rls"],
    lines: 112,
  },
  {
    id: "websocket-chat",
    title: "Real-time Chat with WebSockets",
    description: "Build a real-time chat system using WebSockets with message history and typing indicators",
    category: "Real-time",
    language: "JavaScript",
    difficulty: "intermediate" as const,
    tags: ["websockets", "chat", "real-time", "socket.io"],
    lines: 203,
  },
  {
    id: "stripe-payment-flow",
    title: "Stripe Payment Integration",
    description: "Accept payments with Stripe including checkout, webhooks, and subscription management",
    category: "Payment",
    language: "TypeScript",
    difficulty: "advanced" as const,
    tags: ["stripe", "payments", "webhooks", "subscriptions"],
    lines: 267,
  },
  {
    id: "file-upload-s3",
    title: "File Upload to S3",
    description: "Upload files directly to AWS S3 with progress tracking and pre-signed URLs",
    category: "File Upload",
    language: "TypeScript",
    difficulty: "intermediate" as const,
    tags: ["s3", "aws", "upload", "presigned-urls"],
    lines: 134,
  },
  {
    id: "discord-slash-commands",
    title: "Discord Slash Commands Handler",
    description: "Create and handle Discord slash commands with subcommands and autocomplete",
    category: "Discord",
    language: "TypeScript",
    difficulty: "intermediate" as const,
    tags: ["discord", "slash-commands", "bot", "interactions"],
    lines: 189,
  },
  {
    id: "jwt-refresh-tokens",
    title: "JWT with Refresh Tokens",
    description: "Implement JWT authentication with refresh token rotation and automatic renewal",
    category: "Authentication",
    language: "TypeScript",
    difficulty: "advanced" as const,
    tags: ["jwt", "refresh-tokens", "authentication", "security"],
    lines: 156,
  },
  {
    id: "graphql-api",
    title: "GraphQL API with Apollo Server",
    description: "Build a GraphQL API with type-safe resolvers, authentication, and data loaders",
    category: "API Integration",
    language: "TypeScript",
    difficulty: "advanced" as const,
    tags: ["graphql", "apollo", "resolvers", "dataloaders"],
    lines: 298,
  },
  {
    id: "rate-limiting",
    title: "Rate Limiting with Redis",
    description: "Implement sliding window rate limiting using Redis for API protection",
    category: "API Integration",
    language: "TypeScript",
    difficulty: "intermediate" as const,
    tags: ["rate-limiting", "redis", "api", "protection"],
    lines: 95,
  },
  {
    id: "email-queue",
    title: "Email Queue with Bull",
    description: "Process emails asynchronously with Bull queue, retries, and monitoring dashboard",
    category: "API Integration",
    language: "TypeScript",
    difficulty: "intermediate" as const,
    tags: ["queue", "bull", "email", "background-jobs"],
    lines: 178,
  },
  {
    id: "python-api-client",
    title: "Python API Client with Async",
    description: "Build an async Python client for the AeThex API with retry logic and type hints",
    category: "API Integration",
    language: "Python",
    difficulty: "beginner" as const,
    tags: ["python", "asyncio", "api-client", "httpx"],
    lines: 142,
  },
];

export default function CodeExamples() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Examples");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const filteredExamples = examples.filter((example) => {
    const matchesSearch =
      example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All Examples" || example.category === selectedCategory;

    const matchesLanguage =
      selectedLanguage === "All" || example.language === selectedLanguage;

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  return (
    <Layout>
      <SEO pageTitle="Code Examples Repository" description="Production-ready code examples for common use cases and integrations" />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <Code2 className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Copy & Paste</h3>
            <p className="text-sm text-muted-foreground">
              Production-ready code you can use immediately
            </p>
          </Card>
          <Card className="p-6">
            <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="font-semibold mb-1">Well Documented</h3>
            <p className="text-sm text-muted-foreground">
              Every example includes detailed explanations
            </p>
          </Card>
          <Card className="p-6">
            <Lightbulb className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-semibold mb-1">Best Practices</h3>
            <p className="text-sm text-muted-foreground">
              Learn from real-world, tested implementations
            </p>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search examples, tags, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
            {filteredExamples.length} example{filteredExamples.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="px-3 py-1 rounded-md border border-input bg-background text-sm">
              <option>Most Popular</option>
              <option>Recently Added</option>
              <option>Difficulty</option>
            </select>
          </div>
        </div>

        {/* Examples Grid */}
        {filteredExamples.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No examples found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExamples.map((example) => (
              <ExampleCard key={example.id} {...example} />
            ))}
          </div>
        )}

        {/* Contribute CTA */}
        <div className="mt-12 p-8 border-2 border-dashed border-border rounded-lg text-center">
          <Code2 className="w-12 h-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Contribute Your Examples</h3>
          <p className="text-muted-foreground mb-4">
            Share your code examples with the community and help other developers
          </p>
          <Button variant="outline">Submit Example</Button>
        </div>
      </div>
    </Layout>
  );
}
