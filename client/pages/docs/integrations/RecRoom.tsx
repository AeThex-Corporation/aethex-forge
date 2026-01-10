import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Code2, Rocket, ExternalLink, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import CodeBlock from "@/components/dev-platform/CodeBlock";

export default function RecRoomIntegration() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-blue-500/20 text-blue-100 uppercase tracking-wide">
          <Gamepad2 className="mr-2 h-3 w-3" />
          RecRoom Integration
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Build RecRoom Experiences with AeThex
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Create cross-platform social games for RecRoom's 3M+ monthly active users. Use AeThex's unified API 
          with RecRoom Circuits for visual scripting, data persistence, and multi-platform deployment.
        </p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-950/20 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-300">3M+</div>
            <div className="text-sm text-gray-400">Monthly Active Users</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-950/20 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-300">12M+</div>
            <div className="text-sm text-gray-400">Created Rooms</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-950/20 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-300">VR + Mobile</div>
            <div className="text-sm text-gray-400">Cross-Platform</div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <section id="features" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">What You Can Build</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <CheckCircle2 className="h-5 w-5" />
                Persistent Game State
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Save player inventory, room configurations, and game progress that persists across VR and mobile sessions
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <CheckCircle2 className="h-5 w-5" />
                Unified Leaderboards
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Track scores across RecRoom, Roblox, and web platforms with AeThex's cross-platform leaderboard API
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <CheckCircle2 className="h-5 w-5" />
                Circuit Automation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Connect RecRoom Circuits to AeThex webhooks for real-time events, triggers, and automated game logic
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <CheckCircle2 className="h-5 w-5" />
                Social Features
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Link RecRoom profiles to AeThex Passport for friend lists, parties, and social features across platforms
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Rocket className="h-6 w-6 text-blue-400" />
          Quick Start Guide
        </h3>
        
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>1. Install AeThex Circuits Plugin</CardTitle>
            <CardDescription>Add AeThex API chips to your RecRoom Circuits palette</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              In RecRoom's Maker Pen, search for <code className="bg-blue-950/50 px-2 py-1 rounded text-blue-300">AeThex</code> in the 
              Circuits V2 palette to find pre-built API chips.
            </p>
            <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm text-blue-200 font-semibold">Available Chips:</p>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• <code className="text-blue-300">AeThex API Call</code> - Make HTTP requests to AeThex endpoints</li>
                <li>• <code className="text-blue-300">AeThex Auth</code> - Authenticate RecRoom players</li>
                <li>• <code className="text-blue-300">AeThex Save Data</code> - Persist player data</li>
                <li>• <code className="text-blue-300">AeThex Leaderboard</code> - Fetch/update leaderboard scores</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>2. Configure API Credentials</CardTitle>
            <CardDescription>Get your API key from the AeThex Developer Dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">1.</span>
                <span>Visit <a href="/dev-platform/dashboard" className="text-blue-400 hover:underline">AeThex Developer Dashboard</a></span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">2.</span>
                <span>Create new API key with <code className="bg-blue-950/50 px-1 rounded">recroom:read</code> and <code className="bg-blue-950/50 px-1 rounded">recroom:write</code> scopes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">3.</span>
                <span>Copy API key to your RecRoom room's configuration chip</span>
              </li>
            </ol>

            <div className="bg-yellow-950/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-yellow-200 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>Security:</strong> Never display your API key in-room. Use the AeThex Config chip which stores credentials securely.</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>3. Build Your First Circuit</CardTitle>
            <CardDescription>Create a persistent leaderboard that syncs across platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Connect the following chips in RecRoom Circuits V2:
            </p>

            <div className="bg-slate-950/50 border border-blue-500/20 rounded-lg p-4 space-y-3 font-mono text-sm">
              <div className="flex items-center gap-2">
                <div className="w-32 px-3 py-1 bg-green-950/50 border border-green-500/30 rounded text-green-300">Button</div>
                <div className="text-gray-500">→</div>
                <div className="w-32 px-3 py-1 bg-blue-950/50 border border-blue-500/30 rounded text-blue-300">AeThex Auth</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 px-3 py-1 bg-blue-950/50 border border-blue-500/30 rounded text-blue-300">AeThex Auth</div>
                <div className="text-gray-500">→</div>
                <div className="w-32 px-3 py-1 bg-purple-950/50 border border-purple-500/30 rounded text-purple-300">Player ID</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 px-3 py-1 bg-purple-950/50 border border-purple-500/30 rounded text-purple-300">Player ID</div>
                <div className="text-gray-500">→</div>
                <div className="w-32 px-3 py-1 bg-blue-950/50 border border-blue-500/30 rounded text-blue-300">Get Score</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 px-3 py-1 bg-blue-950/50 border border-blue-500/30 rounded text-blue-300">Get Score</div>
                <div className="text-gray-500">→</div>
                <div className="w-32 px-3 py-1 bg-yellow-950/50 border border-yellow-500/30 rounded text-yellow-300">Text Screen</div>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              This circuit fetches a player's score from AeThex when they press a button, displaying it on a text screen. 
              Scores are shared across RecRoom, Roblox, VRChat, and web platforms.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Code Examples */}
      <section id="examples" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Code2 className="h-6 w-6 text-blue-400" />
          API Integration Examples
        </h3>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Save Player Progress</CardTitle>
            <CardDescription>Persist inventory and game state across sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`// JavaScript (for webhook endpoints)
// RecRoom sends player data to your AeThex webhook
app.post('/api/recroom/save-progress', async (req, res) => {
  const { playerId, inventory, level, checkpoint } = req.body;
  
  // Save to AeThex backend
  await aethex.users.update(playerId, {
    recroom_inventory: inventory,
    recroom_level: level,
    recroom_checkpoint: checkpoint,
    last_played_recroom: new Date().toISOString()
  });
  
  res.json({ success: true, saved_at: new Date() });
});

// Load player progress when they join
app.get('/api/recroom/load-progress/:playerId', async (req, res) => {
  const { playerId } = req.params;
  
  const userData = await aethex.users.get(playerId);
  
  res.json({
    inventory: userData.recroom_inventory || [],
    level: userData.recroom_level || 1,
    checkpoint: userData.recroom_checkpoint || 'start'
  });
});`}
              language="javascript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Cross-Platform Leaderboard</CardTitle>
            <CardDescription>Update scores that sync across RecRoom, Roblox, and web</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`// TypeScript endpoint for RecRoom Circuit webhook
import { AeThexClient } from '@aethex/sdk';

const aethex = new AeThexClient({
  apiKey: process.env.AETHEX_API_KEY
});

// RecRoom Circuit triggers this when player scores
export async function updateScore(req, res) {
  const { playerId, score, gameMode } = req.body;
  
  try {
    // Update player's score in AeThex leaderboard
    await aethex.leaderboards.updateScore('global-leaderboard', {
      userId: playerId,
      score: score,
      metadata: {
        platform: 'recroom',
        gameMode: gameMode,
        timestamp: Date.now()
      }
    });
    
    // Fetch updated leaderboard (top 10)
    const leaderboard = await aethex.leaderboards.getTop('global-leaderboard', {
      limit: 10,
      platform: 'all' // Include scores from all platforms
    });
    
    res.json({
      success: true,
      playerRank: leaderboard.findIndex(entry => entry.userId === playerId) + 1,
      topPlayers: leaderboard
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}`}
              language="typescript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>
      </section>

      {/* Authentication Flow */}
      <section id="authentication" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">Player Authentication</h3>
        <p className="text-gray-400">
          Link RecRoom players to AeThex Passport for cross-platform identity.
        </p>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>3-Step Auth Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Player Enters Room</h4>
                  <p className="text-gray-400 text-sm">Use RecRoom Circuits to detect player join event</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Generate Auth Code</h4>
                  <p className="text-gray-400 text-sm">
                    AeThex API Call chip requests 6-digit code, displays it on a text board in-room
                  </p>
                  <code className="block mt-2 text-xs bg-blue-950/50 px-3 py-2 rounded text-blue-200">
                    POST /api/auth/generate-code<br/>
                    → Returns: {`{ code: "ABC123", expires: "2026-01-10T21:00:00Z" }`}
                  </code>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Player Links Account</h4>
                  <p className="text-gray-400 text-sm">
                    Player visits <code className="bg-blue-950/50 px-1 rounded">aethex.dev/link</code>, enters code, 
                    RecRoom receives webhook with Passport ID
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Best Practices */}
      <section id="best-practices" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
          Best Practices & Limitations
        </h3>

        <div className="space-y-4">
          <Card className="bg-yellow-950/20 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-300">RecRoom Circuits Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>No native HTTP chips:</strong> Use AeThex middleware webhooks instead of direct API calls</p>
              <p>• <strong>Response delays:</strong> Webhook roundtrips take 1-3 seconds, design UX accordingly</p>
              <p>• <strong>Circuit complexity:</strong> Max 200 chips per room, optimize with cloud functions</p>
              <p>• <strong>Mobile performance:</strong> Keep API payloads under 50KB for mobile players</p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-300">Performance Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Cache results:</strong> Store API responses in room variables for 5-10 minutes</p>
              <p>• <strong>Batch operations:</strong> Group multiple player updates into single API call</p>
              <p>• <strong>Lazy loading:</strong> Only fetch data when players interact with features</p>
              <p>• <strong>Offline mode:</strong> Implement fallback gameplay when webhooks fail</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Package className="h-6 w-6 text-blue-400" />
          Resources & Examples
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Example Rooms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://rec.net/room/aethex-leaderboard" target="_blank" rel="noopener noreferrer">
                  Cross-Platform Leaderboard
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://rec.net/room/aethex-inventory" target="_blank" rel="noopener noreferrer">
                  Persistent Inventory
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://rec.net/room/aethex-auth" target="_blank" rel="noopener noreferrer">
                  Authentication Demo
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="/dev-platform/api-reference" target="_blank">
                  AeThex API Reference
                  <Code2 className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://recroom.com/developer" target="_blank" rel="noopener noreferrer">
                  RecRoom Developer Docs
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="/community" target="_blank">
                  Join Discord Community
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-blue-950/50 to-cyan-950/50 border-blue-500/30">
        <CardContent className="p-8 space-y-4">
          <h3 className="text-2xl font-semibold text-white">Ready to Build?</h3>
          <p className="text-gray-300">
            Start building cross-platform social games with AeThex. Deploy to RecRoom, VRChat, 
            Roblox, and web simultaneously with one unified API.
          </p>
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <a href="/dev-platform/dashboard">Get API Key</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/dev-platform/quick-start">View Quick Start</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
