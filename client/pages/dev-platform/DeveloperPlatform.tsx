import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Code,
  Key,
  Zap,
  BookOpen,
  Package,
  ShoppingBag,
  FileCode,
  ArrowRight,
  CheckCircle2,
  Users,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: Key,
    title: "Developer Dashboard",
    description: "Manage API keys, track usage, and monitor your applications",
    href: "/dev-platform/dashboard",
    color: "text-blue-500",
  },
  {
    icon: BookOpen,
    title: "API Reference",
    description: "Complete documentation of all endpoints with code examples",
    href: "/dev-platform/api-reference",
    color: "text-purple-500",
  },
  {
    icon: Zap,
    title: "Quick Start Guide",
    description: "Get up and running in under 5 minutes with our tutorial",
    href: "/dev-platform/quick-start",
    color: "text-yellow-500",
  },
  {
    icon: Package,
    title: "Templates Gallery",
    description: "Pre-built starter kits for Discord, full-stack apps, and more",
    href: "/dev-platform/templates",
    color: "text-green-500",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Premium integrations, plugins, and tools from the community",
    href: "/dev-platform/marketplace",
    color: "text-pink-500",
  },
  {
    icon: FileCode,
    title: "Code Examples",
    description: "Production-ready code snippets for common use cases",
    href: "/dev-platform/examples",
    color: "text-cyan-500",
  },
];

const stats = [
  { label: "Active Developers", value: "12,000+" },
  { label: "API Requests/Day", value: "2.5M+" },
  { label: "Code Examples", value: "150+" },
  { label: "Templates Available", value: "50+" },
];

const steps = [
  {
    number: "1",
    title: "Create Account",
    description: "Sign up for free and verify your email",
  },
  {
    number: "2",
    title: "Get API Key",
    description: "Generate your first API key in the dashboard",
  },
  {
    number: "3",
    title: "Make Request",
    description: "Follow our quick start guide for your first call",
  },
  {
    number: "4",
    title: "Build & Scale",
    description: "Use templates, examples, and marketplace tools",
  },
];

export default function DeveloperPlatform() {
  return (
    <Layout>
      <SEO
        pageTitle="AeThex Developer Platform"
        description="Everything you need to build powerful applications with AeThex"
      />
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <Badge className="text-sm px-4 py-1">Developer Platform</Badge>
          <h1 className="text-5xl font-bold tracking-tight">
            Build the Future with{" "}
            <span className="text-primary">AeThex</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access powerful APIs, pre-built templates, and a thriving marketplace
            to accelerate your development workflow.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/dev-platform/quick-start">
              <Button size="lg">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/dev-platform/api-reference">
              <Button size="lg" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                View Docs
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </section>

        {/* Features Grid */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} to={feature.href}>
                <Card className="p-6 h-full hover:border-primary/50 transition-all group cursor-pointer">
                  <feature.icon className={`w-10 h-10 mb-4 ${feature.color}`} />
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="mt-4 flex items-center text-primary text-sm font-medium">
                    Explore
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Getting Started Steps */}
        <section className="bg-muted/30 -mx-8 px-8 py-16 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-4">
            Get Started in 4 Simple Steps
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            From zero to production in minutes. Follow our streamlined onboarding
            process.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/dev-platform/quick-start">
              <Button size="lg">
                Start Building Now
                <Rocket className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Popular Resources */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Popular Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Code className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Discord OAuth2 Flow</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete authentication implementation with token refresh
              </p>
              <Link to="/dev-platform/examples/oauth-discord-flow">
                <Button variant="ghost" size="sm">
                  View Example
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <Package className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Full Stack Template</h3>
              <p className="text-sm text-muted-foreground mb-4">
                React + Express + Supabase starter with auth
              </p>
              <Link to="/dev-platform/templates/fullstack-template">
                <Button variant="ghost" size="sm">
                  View Template
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <ShoppingBag className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Premium charts and visualization components
              </p>
              <Link to="/dev-platform/marketplace/premium-analytics-dashboard">
                <Button variant="ghost" size="sm">
                  View Product
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </Link>
            </Card>
          </div>
        </section>

        {/* Why AeThex */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Developers Choose AeThex
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">RESTful API Design</h3>
                <p className="text-muted-foreground">
                  Clean, predictable endpoints with JSON responses and standard
                  HTTP methods. Easy to integrate with any language or framework.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Type-Safe SDKs</h3>
                <p className="text-muted-foreground">
                  Official TypeScript, Python, and Go clients with full type
                  definitions. Catch errors at compile time, not runtime.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Generous Rate Limits</h3>
                <p className="text-muted-foreground">
                  60 requests/minute on free tier, upgradeable to 300/min. Build
                  and test without worrying about limits.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Active Community</h3>
                <p className="text-muted-foreground">
                  Join 12,000+ developers on Discord. Get help, share projects,
                  and contribute to the ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-primary/5 border-2 border-primary/20 rounded-lg p-12">
          <Users className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers building with AeThex. Create your account
            and get your API key in under 60 seconds.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg">
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/dev-platform/dashboard">
              <Button size="lg" variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
