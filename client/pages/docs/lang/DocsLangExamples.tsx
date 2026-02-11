import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Copy,
  Shield,
  Users,
  Award,
  Zap,
  Lock,
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

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <CopyButton text={code} />
      <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-slate-300 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

const helloWorldCode = `# AeThex Hello World Example

reality HelloWorld {
    platforms: all
}

journey Greet(name) {
    platform: all
    notify "Hello, " + name + " from AeThex!"
}`;

const crossPlatformAuthCode = `import { Passport, DataSync } from "@aethex.os/core"

reality UniversalAuth {
    platforms: [roblox, uefn, web]
}

journey Login(username, password) {
    platform: all
    
    let passport = new Passport(username)
    
    when passport.verify() {
        sync passport across [roblox, uefn, web]
        
        # Pull existing data from any platform
        let playerData = DataSync.pull(passport.userId, "roblox")
        
        notify "Logged in across all platforms!"
        reveal passport
    }
}`;

const secureLeaderboardCode = `# The Foundry Certification Exam
# Task: Build a COPPA-compliant, PII-safe leaderboard
#
# Requirements:
# 1. Must accept player scores
# 2. Must detect and block PII (phone numbers, emails, etc.)
# 3. Must work on Roblox (Lua)
# 4. Must display safely without exposing sensitive data

import { SafeInput, Compliance } from "@aethex.os/core"

reality SecureLeaderboard {
    platforms: [roblox]
    type: "compliance-exam"
}

# CRITICAL: This is the exam
# If PII gets through to the leaderboard, you FAIL

journey SubmitScore(player, playerName, score) {
    platform: roblox
    
    # STEP 1: Validate player age (COPPA compliance)
    when !Compliance.isCOPPACompliant(player.age) {
        notify "Players under 13 cannot submit scores publicly"
        return
    }
    
    # STEP 2: Validate player name for PII
    let nameValidation = SafeInput.validate(playerName)
    
    when !nameValidation.valid {
        notify "Invalid name: " + nameValidation.message
        notify "Blocked PII types: " + nameValidation.blocked
        
        # Log security incident
        Compliance.logCheck(player.userId, "leaderboard_name_check", false)
        
        return
    }
    
    # STEP 3: Validate score value for PII
    let scoreValidation = SafeInput.validate(score.toString())
    
    when !scoreValidation.valid {
        notify "Invalid score: contains sensitive data"
        
        # Log security incident
        Compliance.logCheck(player.userId, "leaderboard_score_check", false)
        
        return
    }
    
    # STEP 4: All validations passed - safe to submit
    Compliance.logCheck(player.userId, "leaderboard_submission", true)
    notify "Score submitted successfully!"
    
    reveal {
        player: nameValidation.clean,
        score: scoreValidation.clean
    }
}

# Test function: Attempts to inject PII
journey TestPIIDetection() {
    platform: roblox
    
    notify "=== FOUNDRY EXAM TEST SUITE ==="
    
    # Test 1: Phone number in name
    let test1 = SafeInput.validate("John 555-1234")
    when test1.valid {
        notify "❌ FAIL: Phone number not detected"
    } otherwise {
        notify "✅ PASS: Phone number blocked"
    }
    
    # Test 2: Email in name
    let test2 = SafeInput.validate("player@email.com")
    when test2.valid {
        notify "❌ FAIL: Email not detected"
    } otherwise {
        notify "✅ PASS: Email blocked"
    }
    
    # Test 3: Clean name
    let test3 = SafeInput.validate("PlayerOne")
    when test3.valid {
        notify "✅ PASS: Clean name accepted"
    } otherwise {
        notify "❌ FAIL: Clean name rejected"
    }
    
    # Test 4: SSN in score
    let test4 = SafeInput.validate("123-45-6789")
    when test4.valid {
        notify "❌ FAIL: SSN not detected"
    } otherwise {
        notify "✅ PASS: SSN blocked"
    }
}`;

const coppaRegistrationCode = `import { Compliance, Passport } from "@aethex.os/core"

journey RegisterUser(username, age) {
    platform: all
    
    when Compliance.isCOPPACompliant(age) {
        # User is 13+, can proceed
        let passport = new Passport(username)
        passport.verify()
        notify "Account created!"
    } otherwise {
        # Under 13, require parent consent
        notify "Parent permission required"
        # Send email to parent (implementation omitted)
    }
}`;

const dataSyncCode = `import { Passport, DataSync } from "@aethex.os/core"

reality CrossPlatformProgress {
    platforms: [roblox, uefn, web]
}

journey SaveProgress(player, progress) {
    platform: all
    
    # Sync progress data across all platforms
    DataSync.sync({
        level: progress.level,
        experience: progress.xp,
        inventory: progress.items
    }, [roblox, uefn, web])
    
    notify "Progress saved!"
}

journey LoadProgress(player) {
    platform: all
    
    # Pull latest progress from any platform
    let data = DataSync.pull(player.userId, "web")
    
    reveal data
}`;

const examples = [
  {
    id: "hello-world",
    title: "Hello World",
    description: "Your first AeThex program",
    icon: Zap,
    color: "text-yellow-500",
    code: helloWorldCode,
    difficulty: "Beginner",
  },
  {
    id: "cross-platform-auth",
    title: "Cross-Platform Authentication",
    description: "Login once, authenticated everywhere",
    icon: Users,
    color: "text-blue-500",
    code: crossPlatformAuthCode,
    difficulty: "Intermediate",
  },
  {
    id: "secure-leaderboard",
    title: "Secure Leaderboard (Foundry Exam)",
    description: "COPPA-compliant, PII-safe leaderboard - the certification exam",
    icon: Award,
    color: "text-purple-500",
    code: secureLeaderboardCode,
    difficulty: "Advanced",
  },
  {
    id: "coppa-registration",
    title: "COPPA-Compliant Registration",
    description: "User registration with age verification",
    icon: Lock,
    color: "text-green-500",
    code: coppaRegistrationCode,
    difficulty: "Intermediate",
  },
  {
    id: "data-sync",
    title: "Cross-Platform Data Sync",
    description: "Sync player progress across all platforms",
    icon: Shield,
    color: "text-cyan-500",
    code: dataSyncCode,
    difficulty: "Intermediate",
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function DocsLangExamples() {
  const [activeExample, setActiveExample] = useState("hello-world");
  const currentExample = examples.find((e) => e.id === activeExample) || examples[0];

  return (
    <div className="space-y-12">
      {/* Header */}
      <section>
        <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
          Code Examples
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Examples</h1>
        <p className="text-xl text-muted-foreground">
          Real-world code examples and patterns for AeThex development.
        </p>
      </section>

      {/* Examples Grid for Quick Navigation */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Browse Examples</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              className={`text-left w-full ${
                activeExample === example.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <Card className="h-full hover:border-primary/50 transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <example.icon className={`w-6 h-6 ${example.color}`} />
                    <Badge className={difficultyColors[example.difficulty]}>
                      {example.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* Active Example Display */}
      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <currentExample.icon className={`w-6 h-6 ${currentExample.color}`} />
                <CardTitle>{currentExample.title}</CardTitle>
              </div>
              <Badge className={difficultyColors[currentExample.difficulty]}>
                {currentExample.difficulty}
              </Badge>
            </div>
            <CardDescription>{currentExample.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={currentExample.code} />
          </CardContent>
        </Card>
      </section>

      {/* All Examples (Tabbed) */}
      <section>
        <h2 className="text-2xl font-bold mb-6">All Examples</h2>
        <Tabs defaultValue="hello-world" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-2">
            {examples.map((example) => (
              <TabsTrigger key={example.id} value={example.id} className="text-xs">
                {example.title.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          {examples.map((example) => (
            <TabsContent key={example.id} value={example.id} className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <example.icon className={`w-5 h-5 ${example.color}`} />
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <Badge className={difficultyColors[example.difficulty]}>
                      {example.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={example.code} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* The Foundry Note */}
      <section>
        <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-purple-500/20">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Award className="w-8 h-8 text-purple-400 shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">The Foundry Certification</h3>
                <p className="text-muted-foreground mb-4">
                  The <strong>Secure Leaderboard</strong> example above is the actual Foundry certification exam. 
                  If you can implement a COPPA-compliant, PII-safe leaderboard that passes all validation tests, 
                  you're ready for professional metaverse development.
                </p>
                <Link 
                  to="/foundation" 
                  className="text-primary hover:underline text-sm"
                >
                  Learn more about The Foundry →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Navigation */}
      <section className="flex justify-between pt-8 border-t border-border/50">
        <Link to="/docs/lang/cli" className="text-sm text-muted-foreground hover:text-foreground">
          ← CLI Reference
        </Link>
        <Link to="/docs/lang" className="text-sm text-muted-foreground hover:text-foreground">
          Back to Overview →
        </Link>
      </section>
    </div>
  );
}
