import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";
import { CodeTabs } from "@/components/dev-platform/CodeTabs";
import { Callout } from "@/components/dev-platform/ui/Callout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  GitFork,
  Star,
  ExternalLink,
  Copy,
  CheckCircle2,
  Package,
  Zap,
  Shield,
} from "lucide-react";

// Mock data - in production, fetch from API
const templateData: Record<string, any> = {
  "discord-activity-starter": {
    name: "Discord Activity Starter",
    description: "Full-featured Discord Activity with user authentication and real-time features",
    longDescription:
      "A production-ready starter template for building Discord Activities. Includes OAuth2 authentication, real-time communication with Discord SDK, responsive UI components, and TypeScript support throughout.",
    category: "Discord Bots",
    language: "TypeScript",
    stars: 245,
    downloads: 1840,
    author: "AeThex Labs",
    difficulty: "intermediate",
    tags: ["discord", "activities", "oauth", "react"],
    githubUrl: "https://github.com/aethex/discord-activity-starter",
    demoUrl: "https://discord.com/application-directory/123",
    version: "2.1.0",
    lastUpdated: "2026-01-05",
    license: "MIT",
    features: [
      "Discord OAuth2 authentication flow",
      "Real-time communication with Discord SDK",
      "Responsive UI with Tailwind CSS",
      "TypeScript for type safety",
      "Express backend with session management",
      "Database integration with Supabase",
      "Hot reload for development",
      "Production build optimization",
    ],
    prerequisites: [
      "Node.js 18 or higher",
      "Discord Developer Account",
      "Basic understanding of React",
      "Familiarity with REST APIs",
    ],
  },
  "fullstack-template": {
    name: "AeThex Full Stack Template",
    description: "Complete app with React frontend, Express backend, and Supabase integration",
    longDescription:
      "A comprehensive full-stack starter template that includes everything you need to build production-ready applications. Features modern React with TypeScript, Express server, Supabase database, and complete authentication system.",
    category: "Full Stack",
    language: "TypeScript",
    stars: 421,
    downloads: 2156,
    author: "AeThex Labs",
    difficulty: "intermediate",
    tags: ["react", "express", "supabase", "tailwind"],
    githubUrl: "https://github.com/aethex/fullstack-template",
    demoUrl: "https://template.aethex.dev",
    version: "3.0.2",
    lastUpdated: "2026-01-06",
    license: "MIT",
    features: [
      "React 18 with TypeScript",
      "Express server with TypeScript",
      "Supabase authentication and database",
      "Tailwind CSS with custom theme",
      "shadcn/ui component library",
      "Vite for fast development",
      "API key management system",
      "Production deployment configs",
    ],
    prerequisites: [
      "Node.js 18 or higher",
      "Supabase account",
      "Git installed",
      "Understanding of React and Node.js",
    ],
  },
};

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const template = templateData[id || ""] || templateData["fullstack-template"];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cloneCommand = `git clone ${template.githubUrl}`;
  const installCommand = "npm install";
  const runCommand = "npm run dev";

  return (
    <Layout>
      <SEO pageTitle={template.name} description={template.description} />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline">{template.category}</Badge>
              <Badge variant="outline">{template.language}</Badge>
              <Badge variant="outline" className="capitalize">
                {template.difficulty}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">{template.longDescription}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {template.stars} stars
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {template.downloads} downloads
              </span>
              <span>v{template.version}</span>
              <span>Updated {template.lastUpdated}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {template.demoUrl && (
              <Button variant="outline" asChild>
                <a href={template.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
            <Button asChild>
              <a href={template.githubUrl} target="_blank" rel="noopener noreferrer">
                <GitFork className="w-4 h-4 mr-2" />
                Clone Repository
              </a>
            </Button>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="p-6 border-primary/20 bg-primary/5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Start
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-2">1. Clone the repository:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm p-3 bg-background rounded border border-border">
                  {cloneCommand}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(cloneCommand)}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">2. Install dependencies:</p>
              <code className="block text-sm p-3 bg-background rounded border border-border">
                {installCommand}
              </code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">3. Start development server:</p>
              <code className="block text-sm p-3 bg-background rounded border border-border">
                {runCommand}
              </code>
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Features
                </h3>
                <ul className="space-y-2">
                  {template.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Prerequisites
                </h3>
                <ul className="space-y-2">
                  {template.prerequisites.map((prereq: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">•</span>
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>License:</strong> {template.license}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Maintained by:</strong> {template.author}
                  </p>
                </div>
              </Card>
            </div>

            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <Callout variant="info">
              <p className="font-medium">Before you begin</p>
              <p className="text-sm mt-1">
                Make sure you have all prerequisites installed and configured.
              </p>
            </Callout>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">1. Clone and Install</h3>
                <CodeBlock
                  code={`# Clone the repository
git clone ${template.githubUrl}
cd ${template.name.toLowerCase().replace(/\s+/g, "-")}

# Install dependencies
npm install`}
                  language="bash"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">2. Configure Environment</h3>
                <p className="text-muted-foreground mb-4">
                  Copy the example environment file and add your credentials:
                </p>
                <CodeBlock
                  code={`# Create .env file
cp .env.example .env

# Edit with your values
# Required variables:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_secret`}
                  language="bash"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">3. Run Development Server</h3>
                <CodeBlock
                  code={`# Start the dev server
npm run dev

# Server will start at http://localhost:8080
# Hot reload is enabled for both client and server`}
                  language="bash"
                />
              </div>

              <Callout variant="success">
                <p className="font-medium">✅ You're ready!</p>
                <p className="text-sm mt-1">
                  Visit http://localhost:8080 to see your app running.
                </p>
              </Callout>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Authentication Example</h3>
              <CodeTabs
                examples={[
                  {
                    language: "typescript",
                    label: "TypeScript",
                    code: `import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Sign in with Discord
async function signInWithDiscord() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: window.location.origin + '/auth/callback'
    }
  });
  
  if (error) throw error;
  return data;
}`,
                  },
                ]}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">API Request Example</h3>
              <CodeTabs
                examples={[
                  {
                    language: "typescript",
                    label: "TypeScript",
                    code: `// Fetch user profile
async function getUserProfile() {
  const response = await fetch('/api/user/profile', {
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
}`,
                  },
                ]}
              />
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-2">How do I deploy this template?</h4>
              <p className="text-sm text-muted-foreground">
                The template includes configuration for deployment to Vercel, Netlify, and Railway.
                See the README.md file for detailed deployment instructions.
              </p>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-2">Can I customize the UI theme?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! The template uses Tailwind CSS with custom theme tokens. Edit
                client/global.css to customize colors, fonts, and design tokens.
              </p>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-2">Is this production-ready?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, this template includes production optimizations, error handling, security
                best practices, and monitoring setup. However, always review and test before
                deploying to production.
              </p>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-2">How do I get support?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Join our Discord community for help, open an issue on GitHub, or check the
                documentation site.
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Join Discord
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back Link */}
        <div className="pt-8 border-t border-border">
          <Link to="/dev-platform/templates">
            <Button variant="ghost">
              ← Back to Templates
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
