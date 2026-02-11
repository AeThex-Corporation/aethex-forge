import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  Package,
  Shield,
  Users,
  Zap,
  Copy,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Github,
  Terminal,
  Code,
  Lock,
  Globe,
  FileText,
} from "lucide-react";
import { useState } from "react";

const PACKAGE_VERSION = "1.0.0";

const features = [
  {
    icon: Users,
    title: "Passport",
    description: "Universal identity across platforms - authenticate users seamlessly on Roblox, web, and more",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "DataSync",
    description: "Cross-platform data synchronization for real-time state management",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Shield,
    title: "SafeInput",
    description: "PII detection and scrubbing - critical for CODEX and child safety compliance",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Lock,
    title: "Compliance",
    description: "Built-in COPPA/FERPA compliance checks with audit trail logging",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const platforms = [
  { name: "Roblox", supported: true },
  { name: "UEFN", supported: true },
  { name: "Unity", supported: true },
  { name: "Web", supported: true },
  { name: "Node.js", supported: true },
];

const codeExamples = {
  passport: `const { Passport } = require('@aethex.os/core');

const passport = new Passport('user123', 'PlayerOne');
await passport.verify();
await passport.syncAcross(['roblox', 'web']);`,
  safeinput: `const { SafeInput } = require('@aethex.os/core');

// Detect PII
const detected = SafeInput.detectPII('Call me at 555-1234');
// Returns: ['phone']

// Scrub PII
const clean = SafeInput.scrub('My email is user@example.com');
// Returns: 'My email is [EMAIL_REDACTED]'

// Validate input
const result = SafeInput.validate('PlayerName123');
if (result.valid) {
  console.log('Safe to use');
}`,
  compliance: `const { Compliance } = require('@aethex.os/core');

// Age gate
if (Compliance.isCOPPACompliant(userAge)) {
  // User is 13+
}

// Check data collection permission
if (Compliance.canCollectData(user)) {
  // Safe to collect
}

// Log compliance check for audit
Compliance.logCheck(userId, 'leaderboard_submission', true);`,
  datasync: `const { DataSync } = require('@aethex.os/core');

// Sync data across platforms
await DataSync.sync({
  inventory: playerInventory,
  progress: gameProgress
}, ['roblox', 'web']);

// Pull data from specific platform
const data = await DataSync.pull(userId, 'roblox');`,
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="absolute top-2 right-2 h-8 w-8 p-0"
    >
      {copied ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}

function CodeBlock({ code, language = "javascript" }: { code: string; language?: string }) {
  return (
    <div className="relative">
      <CopyButton text={code} />
      <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-slate-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}

export default function AethexLang() {
  return (
    <Layout>
      <SEO
        pageTitle="@aethex.os/core | AeThex Language Standard Library"
        description="Cross-platform utilities for authentication, data sync, and compliance. Build safer metaverse experiences with built-in COPPA support."
      />
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Badge className="text-sm px-4 py-1 bg-purple-500/20 text-purple-400 border-purple-500/30">
              v{PACKAGE_VERSION}
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-1">
              MIT License
            </Badge>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="text-primary">@aethex.os/core</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AeThex Language Standard Library — Cross-platform utilities for authentication, 
            data sync, and compliance across the metaverse.
          </p>
          
          {/* Install Command */}
          <div className="relative max-w-md mx-auto">
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3">
              <Terminal className="h-5 w-5 text-slate-500" />
              <code className="text-sm font-mono text-slate-300 flex-1 text-left">
                npm install @aethex.os/core
              </code>
              <CopyButton text="npm install @aethex.os/core" />
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <a 
              href="https://www.npmjs.com/package/@aethex.os/core" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg">
                <Package className="w-4 h-4 mr-2" />
                View on npm
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
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
          <p className="text-sm text-muted-foreground mb-4">Works everywhere you build</p>
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((platform) => (
              <Badge
                key={platform.name}
                variant="outline"
                className="px-4 py-2 text-sm"
              >
                <Globe className="w-3 h-3 mr-2" />
                {platform.name}
              </Badge>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-4">Core Modules</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to build safe, compliant, cross-platform experiences
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 hover:border-primary/50 transition-all">
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-4">Quick Examples</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get started in minutes with these production-ready code snippets
          </p>
          
          <Tabs defaultValue="passport" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="passport">Passport</TabsTrigger>
              <TabsTrigger value="safeinput">SafeInput</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="datasync">DataSync</TabsTrigger>
            </TabsList>
            <TabsContent value="passport" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Passport - Universal Identity
                  </CardTitle>
                  <CardDescription>
                    Authenticate users once, verify them everywhere
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={codeExamples.passport} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="safeinput" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    SafeInput - PII Detection
                  </CardTitle>
                  <CardDescription>
                    Detect and scrub personally identifiable information automatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={codeExamples.safeinput} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="compliance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-500" />
                    Compliance - COPPA/FERPA
                  </CardTitle>
                  <CardDescription>
                    Built-in compliance checks with audit trail logging
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={codeExamples.compliance} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="datasync" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    DataSync - Cross-Platform State
                  </CardTitle>
                  <CardDescription>
                    Synchronize data across all supported platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={codeExamples.datasync} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* API Reference */}
        <section>
          <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-purple-500/20">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">API Reference</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-2">Passport</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><code className="text-xs bg-slate-800 px-1 rounded">new Passport(userId, username)</code> - Create passport</li>
                        <li><code className="text-xs bg-slate-800 px-1 rounded">verify()</code> - Verify identity</li>
                        <li><code className="text-xs bg-slate-800 px-1 rounded">syncAcross(platforms)</code> - Sync across platforms</li>
                        <li><code className="text-xs bg-slate-800 px-1 rounded">toJSON()</code> - Export as JSON</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400 mb-2">SafeInput</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><code className="text-xs bg-slate-800 px-1 rounded">SafeInput.detectPII(input)</code> - Detect PII types</li>
                        <li><code className="text-xs bg-slate-800 px-1 rounded">SafeInput.scrub(input)</code> - Scrub PII from string</li>
                        <li><code className="text-xs bg-slate-800 px-1 rounded">SafeInput.validate(input)</code> - Validate input safety</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">DataSync</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><code className="text-xs bg-slate-800 px-1 rounded">DataSync.sync(data, platforms)</code> - Sync data</li>
                        <li><code className="text-xs bg-slate-800 px-1 rounded">DataSync.pull(userId, platform)</code> - Pull data</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-2">Compliance</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><code className="text-xs bg-slate-800 px-1 rounded">Compliance.isCOPPACompliant(age)</code> - Check if 13+</li>
                        <li><code className="text-xs bg-slate-800 px-1 rounded">Compliance.requiresParentConsent(age)</code> - Check if &lt;13</li>
                        <li><code className="text-xs bg-slate-800 px-1 rounded">Compliance.canCollectData(user)</code> - Check permission</li>
                        <li><code className="text-xs bg-slate-800 px-1 rounded">Compliance.logCheck(userId, type, result)</code> - Audit log</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Keywords/Use Cases */}
        <section className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Built for</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["metaverse", "cross-platform", "roblox", "uefn", "unity", "coppa", "compliance", "pii-detection"].map((keyword) => (
              <Badge key={keyword} variant="secondary" className="px-3 py-1">
                {keyword}
              </Badge>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 py-8">
          <h2 className="text-3xl font-bold">Ready to Build?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start building safer, compliant cross-platform experiences today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/docs/lang/quickstart">
              <Button size="lg">
                Quick Start Guide
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/docs/lang">
              <Button size="lg" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Full Documentation
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer Info */}
        <section className="text-center text-sm text-muted-foreground border-t border-border/50 pt-8">
          <p>
            Maintained by{" "}
            <a href="https://aethex.dev" className="text-primary hover:underline">
              AeThex Foundation
            </a>
            {" · "}
            <a 
              href="https://github.com/AeThex-Corporation/AeThexOS/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Report Issues
            </a>
          </p>
        </section>
      </div>
    </Layout>
  );
}
