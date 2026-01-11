import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";
import { ApiEndpointCard } from "@/components/dev-platform/ui/ApiEndpointCard";
import { StatCard } from "@/components/dev-platform/ui/StatCard";
import { Callout } from "@/components/dev-platform/ui/Callout";
import {
  BookOpen,
  Code2,
  Package,
  LayoutTemplate,
  Zap,
  Users,
  Gamepad2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function DevLanding() {
  const exampleCode = `import { AeThex } from '@aethex/sdk';

const game = new AeThex.Game({
  apiKey: process.env.AETHEX_API_KEY
});

game.onPlayerJoin((player) => {
  console.log(\`\${player.username} joined!\`);
});

// Deploy to all platforms with one command
await game.deploy(['roblox', 'fortnite', 'web']);`;

  const features = [
    {
      icon: Zap,
      title: "Cross-Platform Deployment",
      description: "Deploy to Roblox, Fortnite, Web, and Mobile with one command",
    },
    {
      icon: Users,
      title: "Unified Identity",
      description: "AeThex Passport provides seamless authentication across all platforms",
    },
    {
      icon: Gamepad2,
      title: "Game State Sync",
      description: "Automatically sync player progress across all platforms",
    },
    {
      icon: Code2,
      title: "Developer-First API",
      description: "Clean, intuitive API with TypeScript support built-in",
    },
  ];

  return (
    <Layout>
      <SEO pageTitle="AeThex Developer Platform" description="Build cross-platform games with AeThex. Ship to Roblox, Fortnite, Web, and Mobile from a single codebase." />
      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build Once.{" "}
            <span className="text-primary">Deploy Everywhere.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Ship to Roblox, Fortnite, Web, and Mobile from one codebase
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/docs/getting-started">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View Documentation
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold sm:text-4xl">12K+</div>
              <div className="text-sm text-muted-foreground">Games Deployed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold sm:text-4xl">50K+</div>
              <div className="text-sm text-muted-foreground">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold sm:text-4xl">5M+</div>
              <div className="text-sm text-muted-foreground">Monthly Players</div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="border-t border-border/40 bg-muted/20 py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  Simple. Powerful. Universal.
                </h2>
                <p className="text-lg text-muted-foreground">
                  Write once, deploy everywhere. No platform-specific code.
                </p>
                <ul className="space-y-3">
                  {[
                    "TypeScript-first with full IntelliSense support",
                    "Real-time multiplayer built-in",
                    "Automatic state synchronization",
                    "Cross-platform identity management",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/docs/getting-started">
                  <Button>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div>
                <CodeBlock
                  code={exampleCode}
                  language="typescript"
                  fileName="game.ts"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="text-lg text-muted-foreground mt-4">
              Enterprise-grade infrastructure
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Tools */}
      <section className="border-t border-border/40 bg-muted/20 py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Developer Tools</h2>
              <p className="text-lg text-muted-foreground mt-4">
                Build, test, and deploy
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Link
                to="/docs"
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <BookOpen className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive guides and tutorials
                </p>
              </Link>

              <Link
                to="/api-reference"
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <Code2 className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">API Reference</h3>
                <p className="text-sm text-muted-foreground">
                  Complete API documentation
                </p>
              </Link>

              <Link
                to="/sdk"
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <Package className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">SDK</h3>
                <p className="text-sm text-muted-foreground">
                  SDKs for all platforms
                </p>
              </Link>

              <Link
                to="/templates"
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <LayoutTemplate className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Starter projects and boilerplates
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* API Showcase */}
      <section className="container py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful API</h2>
            <p className="text-lg text-muted-foreground mt-4">
              RESTful API with intuitive endpoints
            </p>
          </div>
          <div className="space-y-4">
            <ApiEndpointCard
              method="POST"
              endpoint="/api/creators"
              description="Create a new creator profile in the AeThex ecosystem"
            />
            <ApiEndpointCard
              method="GET"
              endpoint="/api/games/:id"
              description="Get detailed information about a specific game"
            />
            <ApiEndpointCard
              method="POST"
              endpoint="/api/games/:id/deploy"
              description="Deploy a game to specified platforms"
            />
          </div>
          <div className="text-center mt-8">
            <Link to="/api-reference">
              <Button variant="outline">
                View Full API Reference
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-primary/10 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Building?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers building the next generation of
              cross-platform games with AeThex.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/docs/getting-started">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Talk to Sales
                </Button>
              </Link>
            </div>

            <Callout type="info" className="mt-12 text-left">
              <strong>Looking for Discord Activity integration?</strong> Check
              out our{" "}
              <Link to="/docs/integrations/discord" className="text-primary hover:underline">
                Discord Integration Guide
              </Link>{" "}
              to build games that run inside Discord.
            </Callout>
          </div>
        </div>
      </section>
    </Layout>
  );
}
