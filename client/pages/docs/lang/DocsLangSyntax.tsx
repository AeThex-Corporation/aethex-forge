import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Copy,
  Code,
  Layers,
  Zap,
  Globe,
  GitBranch,
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

const realitiesCode = `reality GameName {
    platforms: [roblox, uefn, web]
    type: "multiplayer"
}`;

const journeysCode = `journey ProcessScore(player, score) {
    platform: all
    
    # Automatically scrubs PII before processing
    when score > 1000 {
        notify "High score achieved!"
    }
}`;

const syncCode = `import { Passport } from "@aethex.os/core"

journey SaveProgress(player) {
    platform: all

    let passport = player.passport
    sync passport across [roblox, uefn, web]
}`;

const conditionalCode = `when player.age < 13 {
    # COPPA compliance automatic
    notify "Parent permission required"
} otherwise {
    # Full features unlocked
    reveal player.stats
}`;

const platformSpecificCode = `journey DisplayLeaderboard() {
    platform: roblox {
        # Roblox-specific code
        reveal leaderboardGUI
    }
    
    platform: web {
        # Web-specific code
        reveal leaderboardHTML
    }
}`;

const coreLibraryCode = `import { Passport, DataSync, SafeInput, Compliance } from "@aethex.os/core"

# Passport - Universal identity
let passport = new Passport(userId, username)
passport.verify()
passport.syncAcross([roblox, web])

# DataSync - Cross-platform data
DataSync.sync(playerData, [roblox, uefn])

# SafeInput - PII protection
let result = SafeInput.validate(userInput)
when result.valid {
    # Input is safe
}

# Compliance - COPPA/FERPA checks
when Compliance.isCOPPACompliant(user.age) {
    # Can collect data
}`;

const robloxLibraryCode = `import { RemoteEvent, Leaderboard } from "@aethex.os/roblox"

# Roblox-specific features
let event = RemoteEvent.new("PlayerJoined")
event.FireAllClients(player)

let stats = Leaderboard.new("Points", 0)
Leaderboard.updateScore(player, "Points", 100)`;

const configCode = `{
  "targets": ["javascript", "roblox", "uefn"],
  "srcDir": "src",
  "outDir": "build",
  "stdlib": true,
  "compliance": {
    "coppa": true,
    "ferpa": true,
    "piiDetection": true
  }
}`;

const projectStructureCode = `my-game/
├── aethex.config.json   # Compilation settings
├── package.json          # npm dependencies
├── src/
│   ├── main.aethex      # Entry point
│   ├── auth.aethex      # Authentication logic
│   └── game.aethex      # Game logic
└── build/
    ├── main.js          # JavaScript output
    └── main.lua         # Roblox output`;

const syntaxSections = [
  {
    id: "realities",
    title: "Realities (Namespaces)",
    icon: Layers,
    description: "Define your game or application namespace",
    code: realitiesCode,
  },
  {
    id: "journeys",
    title: "Journeys (Functions)",
    icon: Zap,
    description: "Create functions that run across platforms",
    code: journeysCode,
  },
  {
    id: "sync",
    title: "Cross-Platform Sync",
    icon: Globe,
    description: "Synchronize data across all platforms with one line",
    code: syncCode,
  },
  {
    id: "conditionals",
    title: "Conditional Logic",
    icon: GitBranch,
    description: "Use when/otherwise for conditions with built-in compliance",
    code: conditionalCode,
  },
  {
    id: "platform",
    title: "Platform-Specific Code",
    icon: Code,
    description: "Write code that only runs on specific platforms",
    code: platformSpecificCode,
  },
];

export default function DocsLangSyntax() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section>
        <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
          Language Reference
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Language Syntax</h1>
        <p className="text-xl text-muted-foreground">
          Learn the AeThex syntax, from realities and journeys to cross-platform sync.
        </p>
      </section>

      {/* Syntax Sections */}
      <section className="space-y-8">
        {syntaxSections.map((section) => (
          <Card key={section.id} id={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="w-5 h-5 text-primary" />
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={section.code} />
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Standard Library */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Standard Library</h2>
        
        <Tabs defaultValue="core" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="core">@aethex.os/core</TabsTrigger>
            <TabsTrigger value="roblox">@aethex.os/roblox</TabsTrigger>
          </TabsList>
          <TabsContent value="core" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Core Library</CardTitle>
                <CardDescription>
                  Universal utilities for authentication, data sync, and compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={coreLibraryCode} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="roblox" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Roblox Library</CardTitle>
                <CardDescription>
                  Roblox-specific features and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={robloxLibraryCode} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Configuration */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Configuration</h2>
        <p className="text-muted-foreground mb-6">
          Configure your project with <code className="bg-slate-800 px-2 py-0.5 rounded text-sm">aethex.config.json</code>:
        </p>
        <CodeBlock code={configCode} language="json" />
      </section>

      {/* Project Structure */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Project Structure</h2>
        <CodeBlock code={projectStructureCode} />
      </section>

      {/* Compilation Targets Table */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Compilation Targets</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 font-medium">Target</th>
                <th className="text-left py-3 px-4 font-medium">Extension</th>
                <th className="text-left py-3 px-4 font-medium">Use Case</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="py-3 px-4">JavaScript</td>
                <td className="py-3 px-4"><code className="bg-slate-800 px-2 py-0.5 rounded text-sm">.js</code></td>
                <td className="py-3 px-4 text-muted-foreground">Web applications, Node.js backends</td>
                <td className="py-3 px-4"><Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ready</Badge></td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-3 px-4">Roblox (Lua)</td>
                <td className="py-3 px-4"><code className="bg-slate-800 px-2 py-0.5 rounded text-sm">.lua</code></td>
                <td className="py-3 px-4 text-muted-foreground">Roblox games</td>
                <td className="py-3 px-4"><Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ready</Badge></td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-3 px-4">UEFN (Verse)</td>
                <td className="py-3 px-4"><code className="bg-slate-800 px-2 py-0.5 rounded text-sm">.verse</code></td>
                <td className="py-3 px-4 text-muted-foreground">Fortnite Creative</td>
                <td className="py-3 px-4"><Badge variant="outline" className="text-slate-400">Coming Soon</Badge></td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-3 px-4">Unity (C#)</td>
                <td className="py-3 px-4"><code className="bg-slate-800 px-2 py-0.5 rounded text-sm">.cs</code></td>
                <td className="py-3 px-4 text-muted-foreground">Unity games, VRChat</td>
                <td className="py-3 px-4"><Badge variant="outline" className="text-slate-400">Coming Soon</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Keywords Reference */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Keywords Reference</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Declarations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">reality</code> - Define a namespace</div>
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">journey</code> - Define a function</div>
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">let</code> - Declare a variable</div>
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">import</code> - Import from libraries</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Control Flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">when</code> - Conditional (if)</div>
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">otherwise</code> - Else clause</div>
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">return</code> - Return from journey</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cross-Platform</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">sync ... across</code> - Sync data</div>
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">platform:</code> - Target platforms</div>
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">platforms:</code> - Reality platforms</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">notify</code> - Output message</div>
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">reveal</code> - Return/expose data</div>
              <div><code className="bg-slate-800 px-2 py-0.5 rounded">new</code> - Create instance</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex justify-between pt-8 border-t border-border/50">
        <Link to="/docs/lang/quickstart" className="text-sm text-muted-foreground hover:text-foreground">
          ← Quick Start
        </Link>
        <Link to="/docs/lang/cli" className="text-sm text-muted-foreground hover:text-foreground">
          CLI Reference →
        </Link>
      </section>
    </div>
  );
}
