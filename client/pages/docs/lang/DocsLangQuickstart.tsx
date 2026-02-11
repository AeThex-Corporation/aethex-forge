import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  CheckCircle2,
  Copy,
  ArrowRight,
  FileText,
  Folder,
  ExternalLink,
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

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  return (
    <div className="relative">
      <CopyButton text={code} />
      <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-slate-300 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function StepCard({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <span className="text-sm font-bold text-primary">{number}</span>
      </div>
      <CardHeader className="pl-16">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-16">
        {children}
      </CardContent>
    </Card>
  );
}

const installCode = `# Install the CLI globally
npm install -g @aethex.os/cli

# Verify installation
aethex --version`;

const newProjectCode = `aethex new my-first-game
cd my-first-game
npm install`;

const mainAethexCode = `reality MyFirstGame {
    platforms: [roblox, web]
}

journey WelcomePlayer(username) {
    platform: all
    notify "Welcome, " + username + "!"
}`;

const compileCode = `# Compile to JavaScript
npm run build

# Run it
node build/main.js

# Or compile to Roblox
npm run build:roblox`;

const authExampleCode = `import { Passport } from "@aethex.os/core"

journey Login(username) {
    let passport = new Passport(username)
    
    when passport.verify() {
        sync passport across [roblox, web]
        notify "Logged in everywhere!"
    }
}`;

const piiExampleCode = `import { SafeInput } from "@aethex.os/core"

journey SubmitScore(player, score) {
    let validation = SafeInput.validate(score)
    
    when validation.valid {
        # Safe to submit
        notify "Score: " + score
    } otherwise {
        # PII detected!
        notify "Error: " + validation.message
    }
}`;

const projectStructure = `my-project/
├── aethex.config.json    # Config file
├── package.json           # npm dependencies
├── src/
│   ├── main.aethex       # Your code
│   ├── auth.aethex
│   └── game.aethex
└── build/
    ├── main.js           # Compiled JavaScript
    └── main.lua          # Compiled Lua`;

const stdlibCode = `# Import from @aethex.os/core
import { Passport, DataSync, SafeInput, Compliance } from "@aethex.os/core"

# Import from @aethex.os/roblox (platform-specific)
import { RemoteEvent, Leaderboard } from "@aethex.os/roblox"`;

const commonPatterns = {
  auth: `journey Login(user) {
    when user.verify() {
        sync user.passport across [roblox, web]
    }
}`,
  datasync: `journey SaveProgress(player) {
    sync player.stats across [roblox, uefn, web]
}`,
  pii: `let result = SafeInput.validate(userInput)
when result.valid {
    # Safe to use
}`,
  coppa: `when Compliance.isCOPPACompliant(user.age) {
    # User is 13+
}`,
};

export default function DocsLangQuickstart() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section>
        <Badge className="mb-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          5 Minute Guide
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Quick Start</h1>
        <p className="text-xl text-muted-foreground">
          Get up and running with AeThex in 5 minutes.
        </p>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Installation</h2>
        <CodeBlock code={installCode} />
      </section>

      {/* Steps */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Your First AeThex Program</h2>
        
        <StepCard number={1} title="Create a new project">
          <CodeBlock code={newProjectCode} />
        </StepCard>

        <StepCard number={2} title="Edit src/main.aethex">
          <CodeBlock code={mainAethexCode} language="aethex" />
        </StepCard>

        <StepCard number={3} title="Compile and run">
          <CodeBlock code={compileCode} />
        </StepCard>
      </section>

      {/* Example Projects */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Example Projects</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Platform Authentication</CardTitle>
              <CardDescription>Authenticate users across multiple platforms with one codebase</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={authExampleCode} language="aethex" />
              <div className="mt-4 text-sm text-muted-foreground">
                Compile and run:
                <code className="ml-2 bg-slate-800 px-2 py-1 rounded">aethex compile auth.aethex && node auth.js</code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>PII-Safe Leaderboard</CardTitle>
                <Badge variant="outline" className="text-xs">Foundry Exam</Badge>
              </div>
              <CardDescription>
                This is the Foundry certification exam - if you can build this correctly, 
                you're ready to work in metaverse development.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={piiExampleCode} language="aethex" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compilation Targets */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Compilation Targets</h2>
        <CodeBlock code={`# JavaScript (default)
aethex compile game.aethex

# Roblox (Lua)
aethex compile game.aethex --target roblox --output game.lua

# UEFN (Verse) - Coming soon
aethex compile game.aethex --target uefn --output game.verse

# Unity (C#) - Coming soon
aethex compile game.aethex --target unity --output game.cs`} />
      </section>

      {/* Watch Mode */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Watch Mode</h2>
        <p className="text-muted-foreground mb-4">Auto-recompile on file save:</p>
        <CodeBlock code="aethex compile game.aethex --watch" />
      </section>

      {/* Project Structure */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Project Structure</h2>
        <CodeBlock code={projectStructure} />
      </section>

      {/* Standard Library */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Standard Library</h2>
        <CodeBlock code={stdlibCode} language="aethex" />
      </section>

      {/* Common Patterns */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Common Patterns</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={commonPatterns.auth} language="aethex" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Data Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={commonPatterns.datasync} language="aethex" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">PII Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={commonPatterns.pii} language="aethex" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">COPPA Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={commonPatterns.coppa} language="aethex" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/docs/lang/syntax">
            <Card className="h-full hover:border-primary/50 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Language Syntax
                </CardTitle>
                <CardDescription>Learn realities, journeys, and more</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/docs/lang/examples">
            <Card className="h-full hover:border-primary/50 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-purple-500" />
                  Examples
                </CardTitle>
                <CardDescription>View more code examples</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* Getting Help */}
      <section className="text-center text-sm text-muted-foreground border-t border-border/50 pt-8">
        <h3 className="font-semibold text-foreground mb-4">Getting Help</h3>
        <p className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://github.com/AeThex-Corporation/AeThexOS/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground flex items-center gap-1"
          >
            GitHub Issues <ExternalLink className="w-3 h-3" />
          </a>
          <span>•</span>
          <a
            href="https://discord.gg/aethex"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            Discord
          </a>
          <span>•</span>
          <Link to="/support" className="hover:text-foreground">
            Support
          </Link>
        </p>
      </section>
    </div>
  );
}
