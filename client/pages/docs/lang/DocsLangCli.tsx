import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Terminal,
  CheckCircle2,
  Copy,
  ExternalLink,
  Package,
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

const installCode = `npm install -g @aethex.os/cli`;

const compileBasicCode = `aethex compile myfile.aethex`;

const compileTargetCode = `# JavaScript (default)
aethex compile myfile.aethex --target javascript

# Roblox/Lua
aethex compile myfile.aethex --target roblox

# UEFN/Verse (coming soon)
aethex compile myfile.aethex --target uefn

# Unity/C# (coming soon)
aethex compile myfile.aethex --target unity`;

const outputCode = `aethex compile myfile.aethex -o output.js
aethex compile myfile.aethex -t roblox -o game.lua`;

const watchCode = `aethex compile myfile.aethex --watch`;

const newProjectCode = `# Basic project
aethex new my-project

# With template
aethex new my-game --template passport`;

const initCode = `aethex init`;

const helloAethexCode = `reality HelloWorld {
    platforms: all
}

journey Greet(name) {
    platform: all
    notify "Hello, " + name + "!"
}`;

const commands = [
  {
    name: "compile",
    syntax: "aethex compile <file>",
    description: "Compile an AeThex file to the target platform",
    options: [
      { flag: "-t, --target <platform>", description: "Target platform (javascript, roblox, uefn, unity)" },
      { flag: "-o, --output <file>", description: "Output file path" },
      { flag: "-w, --watch", description: "Watch for changes and recompile" },
    ],
  },
  {
    name: "new",
    syntax: "aethex new <name>",
    description: "Create a new AeThex project",
    options: [
      { flag: "--template <type>", description: "Project template (basic, passport, game)" },
    ],
  },
  {
    name: "init",
    syntax: "aethex init",
    description: "Initialize AeThex in the current directory",
    options: [],
  },
  {
    name: "--help",
    syntax: "aethex --help",
    description: "Show help information",
    options: [],
  },
  {
    name: "--version",
    syntax: "aethex --version",
    description: "Show CLI version",
    options: [],
  },
];

const targets = [
  { name: "javascript", language: "JavaScript", platform: "Web, Node.js", status: "ready" },
  { name: "roblox", language: "Lua", platform: "Roblox", status: "ready" },
  { name: "uefn", language: "Verse", platform: "Fortnite", status: "coming" },
  { name: "unity", language: "C#", platform: "Unity, VRChat", status: "coming" },
];

export default function DocsLangCli() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section>
        <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
          @aethex.os/cli
        </Badge>
        <h1 className="text-4xl font-bold mb-4">CLI Reference</h1>
        <p className="text-xl text-muted-foreground">
          AeThex Language Command Line Interface - Compile <code className="bg-slate-800 px-2 py-0.5 rounded">.aethex</code> files 
          to JavaScript, Lua, Verse, and C#.
        </p>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Installation</h2>
        <CodeBlock code={installCode} />
        <p className="mt-4 text-sm text-muted-foreground">
          <a
            href="https://www.npmjs.com/package/@aethex.os/cli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            View on npm <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Usage</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Compile a file
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={compileBasicCode} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compile to specific target</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={compileTargetCode} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Save to file</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={outputCode} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Watch mode</CardTitle>
              <CardDescription>Auto-recompile on file changes</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={watchCode} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create new project</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={newProjectCode} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Initialize in existing directory</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={initCode} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Example</h2>
        <p className="text-muted-foreground mb-4">
          Create <code className="bg-slate-800 px-2 py-0.5 rounded">hello.aethex</code>:
        </p>
        <CodeBlock code={helloAethexCode} language="aethex" />
        <p className="text-muted-foreground mt-6 mb-4">Compile and run:</p>
        <CodeBlock code={`aethex compile hello.aethex -o hello.js
node hello.js`} />
      </section>

      {/* Commands Reference */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Commands</h2>
        <div className="space-y-4">
          {commands.map((cmd) => (
            <Card key={cmd.name}>
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-lg">{cmd.syntax}</CardTitle>
                <CardDescription>{cmd.description}</CardDescription>
              </CardHeader>
              {cmd.options.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    {cmd.options.map((opt) => (
                      <div key={opt.flag} className="flex gap-4 text-sm">
                        <code className="bg-slate-800 px-2 py-0.5 rounded whitespace-nowrap">{opt.flag}</code>
                        <span className="text-muted-foreground">{opt.description}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Options */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Global Options</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 font-medium">Option</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="py-3 px-4"><code className="bg-slate-800 px-2 py-0.5 rounded">-t, --target &lt;platform&gt;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Target platform (javascript, roblox, uefn, unity)</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-3 px-4"><code className="bg-slate-800 px-2 py-0.5 rounded">-o, --output &lt;file&gt;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Output file path</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-3 px-4"><code className="bg-slate-800 px-2 py-0.5 rounded">-w, --watch</code></td>
                <td className="py-3 px-4 text-muted-foreground">Watch for changes</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-3 px-4"><code className="bg-slate-800 px-2 py-0.5 rounded">--template &lt;type&gt;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Project template (basic, passport, game)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Targets */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Targets</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 font-medium">Target</th>
                <th className="text-left py-3 px-4 font-medium">Language</th>
                <th className="text-left py-3 px-4 font-medium">Platform</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((target) => (
                <tr key={target.name} className="border-b border-slate-800">
                  <td className="py-3 px-4">
                    <code className="bg-slate-800 px-2 py-0.5 rounded">{target.name}</code>
                  </td>
                  <td className="py-3 px-4">{target.language}</td>
                  <td className="py-3 px-4 text-muted-foreground">{target.platform}</td>
                  <td className="py-3 px-4">
                    {target.status === "ready" ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-400">Coming Soon</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Learn More */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Learn More</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/docs/lang">
            <Card className="h-full hover:border-primary/50 transition-all cursor-pointer">
              <CardContent className="pt-6">
                <Package className="w-6 h-6 mb-2 text-primary" />
                <h3 className="font-semibold">Language Guide</h3>
                <p className="text-sm text-muted-foreground">Full documentation</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/docs/lang/examples">
            <Card className="h-full hover:border-primary/50 transition-all cursor-pointer">
              <CardContent className="pt-6">
                <Terminal className="w-6 h-6 mb-2 text-green-500" />
                <h3 className="font-semibold">Examples</h3>
                <p className="text-sm text-muted-foreground">Code samples</p>
              </CardContent>
            </Card>
          </Link>
          <a
            href="https://www.npmjs.com/package/@aethex.os/core"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="h-full hover:border-primary/50 transition-all cursor-pointer">
              <CardContent className="pt-6">
                <Package className="w-6 h-6 mb-2 text-purple-500" />
                <h3 className="font-semibold">@aethex.os/core</h3>
                <p className="text-sm text-muted-foreground">Standard Library</p>
              </CardContent>
            </Card>
          </a>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex justify-between pt-8 border-t border-border/50">
        <Link to="/docs/lang/syntax" className="text-sm text-muted-foreground hover:text-foreground">
          ← Language Syntax
        </Link>
        <Link to="/docs/lang/examples" className="text-sm text-muted-foreground hover:text-foreground">
          Examples →
        </Link>
      </section>
    </div>
  );
}
