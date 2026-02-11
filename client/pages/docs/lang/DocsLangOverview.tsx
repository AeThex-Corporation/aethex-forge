import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Terminal,
  BookOpen,
  Code,
  Zap,
  Shield,
  Users,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  FileText,
  Github,
  Globe,
  Lock,
  Copy,
} from "lucide-react";
import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
    >
      {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
    </button>
  );
}

function CodeBlock({ code, language = "aethex" }: { code: string; language?: string }) {
  return (
    <div className="relative">
      <CopyButton text={code} />
      <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-slate-300 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

const docSections = [
  {
    title: "Quick Start",
    description: "Get up and running in 5 minutes",
    icon: Zap,
    href: "/docs/lang/quickstart",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Language Syntax",
    description: "Learn realities, journeys, and cross-platform sync",
    icon: Code,
    href: "/docs/lang/syntax",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "CLI Reference",
    description: "Command line compiler and tools",
    icon: Terminal,
    href: "/docs/lang/cli",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Examples",
    description: "Real-world code examples and patterns",
    icon: FileText,
    href: "/docs/lang/examples",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const features = [
  {
    icon: Globe,
    title: "Cross-Platform Native",
    description: "Deploy to Roblox, UEFN, Unity, VRChat, Spatial, and Web",
  },
  {
    icon: Users,
    title: "Universal Passport",
    description: "Single identity system across all metaverse platforms",
  },
  {
    icon: Shield,
    title: "Compliance-First",
    description: "Built-in COPPA/FERPA/PII protection",
  },
  {
    icon: Package,
    title: "Standard Library",
    description: "Battle-tested utilities for auth, data sync, and safety",
  },
];

const platforms = [
  { name: "JavaScript", status: "ready" },
  { name: "Roblox (Lua)", status: "ready" },
  { name: "UEFN (Verse)", status: "coming" },
  { name: "Unity (C#)", status: "coming" },
];

const helloWorldCode = `reality HelloWorld {
    platforms: all
}

journey Greet(name) {
    platform: all
    notify "Hello, " + name + "!"
}`;

const crossPlatformCode = `import { Passport } from "@aethex.os/core"

reality MyGame {
    platforms: [roblox, uefn, web]
}

journey AuthenticatePlayer(username) {
    platform: all
    
    let passport = new Passport(username)
    
    when passport.verify() {
        sync passport across [roblox, uefn, web]
        notify "Welcome, " + username + "!"
    }
}`;

export default function DocsLangOverview() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Badge className="text-sm px-4 py-1 bg-purple-500/20 text-purple-400 border-purple-500/30">
            v1.0.0
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-1">
            MIT License
          </Badge>
        </div>
        <h1 className="text-4xl font-bold">AeThex Language</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          <strong>Write once. Build everywhere. Comply by default.</strong>
        </p>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          AeThex is a programming language for cross-platform metaverse development. 
          Write your game logic, authentication, and compliance rules once, then compile 
          to JavaScript, Lua (Roblox), Verse (UEFN), and C# (Unity).
        </p>

        {/* Install Command */}
        <div className="relative max-w-md mx-auto">
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3">
            <Terminal className="h-5 w-5 text-slate-500" />
            <code className="text-sm font-mono text-slate-300 flex-1 text-left">
              npm install -g @aethex.os/cli
            </code>
            <CopyButton text="npm install -g @aethex.os/cli" />
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Link to="/docs/lang/quickstart">
            <Button size="lg">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <a
            href="https://github.com/AeThex-Corporation/AeThexOS"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </a>
        </div>
      </section>

      {/* Platform Support */}
      <section className="text-center">
        <p className="text-sm text-muted-foreground mb-4">Compilation Targets</p>
        <div className="flex flex-wrap justify-center gap-3">
          {platforms.map((platform) => (
            <Badge
              key={platform.name}
              variant={platform.status === "ready" ? "default" : "outline"}
              className={`px-4 py-2 text-sm ${
                platform.status === "ready" 
                  ? "bg-green-500/20 text-green-400 border-green-500/30" 
                  : "text-slate-400"
              }`}
            >
              {platform.status === "ready" && <CheckCircle2 className="w-3 h-3 mr-2" />}
              {platform.name}
              {platform.status === "coming" && " (Coming Soon)"}
            </Badge>
          ))}
        </div>
      </section>

      {/* Documentation Sections */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {docSections.map((section) => (
            <Link key={section.title} to={section.href}>
              <Card className="h-full hover:border-primary/50 transition-all cursor-pointer">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <section.icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Hello World Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hello World</h2>
        <p className="text-muted-foreground mb-6">
          Create <code className="bg-slate-800 px-2 py-0.5 rounded text-sm">hello.aethex</code>:
        </p>
        <CodeBlock code={helloWorldCode} />
        <div className="mt-4 flex gap-2">
          <code className="bg-slate-800 px-3 py-2 rounded text-sm font-mono">
            aethex compile hello.aethex
          </code>
          <code className="bg-slate-800 px-3 py-2 rounded text-sm font-mono">
            node hello.js
          </code>
        </div>
      </section>

      {/* Cross-Platform Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Cross-Platform Authentication</h2>
        <p className="text-muted-foreground mb-6">
          One codebase, deployed everywhere:
        </p>
        <CodeBlock code={crossPlatformCode} />
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Why AeThex?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="p-2 h-fit rounded-lg bg-primary/10">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* npm Packages */}
      <section>
        <h2 className="text-2xl font-bold mb-6">npm Packages</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Terminal className="w-5 h-5 text-green-500" />
                @aethex.os/cli
              </CardTitle>
              <CardDescription>Command line compiler</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://www.npmjs.com/package/@aethex.os/cli"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View on npm <ExternalLink className="w-3 h-3" />
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5 text-purple-500" />
                @aethex.os/core
              </CardTitle>
              <CardDescription>Standard library</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://www.npmjs.com/package/@aethex.os/core"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View on npm <ExternalLink className="w-3 h-3" />
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Foundry */}
      <section>
        <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-purple-500/20">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl font-bold mb-2">The Foundry Certification</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              AeThex is the official language taught at The AeThex Foundry certification program.
              Learn to build compliant, cross-platform metaverse experiences.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/foundation">
                <Button>
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Links */}
      <section className="text-center text-sm text-muted-foreground border-t border-border/50 pt-8">
        <p className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://github.com/AeThex-Corporation/AeThexOS"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground flex items-center gap-1"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
          <span>•</span>
          <a
            href="https://github.com/AeThex-Corporation/AeThexOS/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            Report Issues
          </a>
          <span>•</span>
          <Link to="/community" className="hover:text-foreground">
            Community
          </Link>
        </p>
      </section>
    </div>
  );
}
