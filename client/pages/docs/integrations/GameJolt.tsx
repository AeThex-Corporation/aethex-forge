import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Code2, Rocket, ExternalLink, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";

export default function GameJoltIntegration() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-purple-500/20 text-purple-100 uppercase tracking-wide">
          <Trophy className="mr-2 h-3 w-3" />
          GameJolt Integration
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Publish on GameJolt with AeThex
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Distribute your indie games on GameJolt's 10M+ player platform. Integrate AeThex APIs with 
          GameJolt's trophies, leaderboards, and data storage for enhanced player engagement.
        </p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-purple-950/20 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-300">10M+</div>
            <div className="text-sm text-gray-400">Registered Players</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-950/20 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-300">300K+</div>
            <div className="text-sm text-gray-400">Published Games</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-950/20 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-300">Free</div>
            <div className="text-sm text-gray-400">No Publishing Fees</div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <section id="features" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">What You Can Build</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <CheckCircle2 className="h-5 w-5" />
                Unified Achievement System
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Sync GameJolt trophies with AeThex achievements for cross-platform progression
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <CheckCircle2 className="h-5 w-5" />
                Cross-Platform Leaderboards
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Combine GameJolt scores with Steam, itch.io, and web players via AeThex API
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <CheckCircle2 className="h-5 w-5" />
                Player Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Track GameJolt player behavior and compare metrics across all distribution platforms
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <CheckCircle2 className="h-5 w-5" />
                Community Features
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Integrate AeThex social features with GameJolt's forums, comments, and community tools
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Rocket className="h-6 w-6 text-purple-400" />
          Quick Start Guide
        </h3>
        
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle>1. Set Up GameJolt Game</CardTitle>
            <CardDescription>Create your game listing on GameJolt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-2 text-gray-300">
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">1.</span>
                <span>Create account at <a href="https://gamejolt.com" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">gamejolt.com</a></span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">2.</span>
                <span>Add your game via Dashboard → Add Game</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">3.</span>
                <span>Get your Game ID and Private Key from Game → Manage → Game API</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">4.</span>
                <span>Configure trophies and leaderboards in GameJolt dashboard</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle>2. Install GameJolt + AeThex SDKs</CardTitle>
            <CardDescription>Integrate both APIs for maximum functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`// Install GameJolt API client (JavaScript/TypeScript)
npm install gamejolt-api

// Install AeThex SDK
npm install @aethex/sdk

// Initialize both clients
import { GameJolt } from 'gamejolt-api';
import { AeThexClient } from '@aethex/sdk';

const gamejolt = new GameJolt({
  gameId: 'YOUR_GAMEJOLT_GAME_ID',
  privateKey: 'YOUR_GAMEJOLT_PRIVATE_KEY'
});

const aethex = new AeThexClient({
  apiKey: 'YOUR_AETHEX_API_KEY',
  environment: 'production'
});

// Link GameJolt user to AeThex Passport
async function authenticatePlayer(gjUsername: string, gjUserToken: string) {
  // Verify GameJolt user
  const gjUser = await gamejolt.users.auth(gjUsername, gjUserToken);
  
  if (gjUser.success) {
    // Link to AeThex
    const aethexAuth = await aethex.auth.linkExternalAccount({
      platform: 'gamejolt',
      externalId: gjUser.data.id,
      username: gjUser.data.username
    });
    
    console.log('User linked across platforms!');
  }
}`}
              language="typescript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle>3. Sync Trophies & Achievements</CardTitle>
            <CardDescription>Award cross-platform achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`// Sync GameJolt trophy with AeThex achievement
async function unlockAchievement(trophyId: number, playerId: string) {
  try {
    // Unlock on GameJolt
    const gjResult = await gamejolt.trophies.addAchieved(
      trophyId,
      playerId
    );
    
    if (gjResult.success) {
      console.log('GameJolt trophy unlocked!');
      
      // Also unlock on AeThex for cross-platform tracking
      await aethex.achievements.unlock(playerId, \`gamejolt-trophy-\${trophyId}\`, {
        platform: 'gamejolt',
        timestamp: Date.now()
      });
      
      console.log('Achievement synced to AeThex!');
    }
  } catch (error) {
    console.error('Failed to unlock achievement:', error);
  }
}

// Example: Unlock achievement when player beats level
async function onLevelComplete(level: number) {
  if (level === 10) {
    await unlockAchievement(12345, currentUser.id); // Trophy ID 12345
  }
}`}
              language="typescript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>
      </section>

      {/* Leaderboard Integration */}
      <section id="leaderboards" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Code2 className="h-6 w-6 text-purple-400" />
          Leaderboard Integration
        </h3>

        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle>Cross-Platform Leaderboard Sync</CardTitle>
            <CardDescription>Submit scores to both GameJolt and AeThex</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`// Submit score to both platforms simultaneously
async function submitScore(playerId: string, score: number) {
  try {
    // Submit to GameJolt
    const gjResult = await gamejolt.scores.add(
      score,
      score + ' points',
      playerId,
      '12345' // GameJolt leaderboard table ID
    );
    
    // Submit to AeThex for cross-platform leaderboard
    const aethexResult = await aethex.leaderboards.updateScore('global-leaderboard', {
      userId: playerId,
      score: score,
      metadata: {
        platform: 'gamejolt',
        gameId: gamejolt.gameId,
        timestamp: Date.now()
      }
    });
    
    console.log('Score submitted to both platforms!');
    return { success: true };
  } catch (error) {
    console.error('Score submission failed:', error);
    return { success: false, error };
  }
}

// Fetch combined leaderboard (GameJolt + other platforms)
async function getCombinedLeaderboard() {
  // Get GameJolt scores
  const gjScores = await gamejolt.scores.fetch('12345', 10);
  
  // Get cross-platform scores from AeThex
  const aethexScores = await aethex.leaderboards.getTop('global-leaderboard', {
    limit: 10,
    platform: 'all' // Include all platforms
  });
  
  // Merge and display both
  return {
    gamejolt: gjScores.data,
    crossPlatform: aethexScores
  };
}`}
              language="typescript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>
      </section>

      {/* Best Practices */}
      <section id="best-practices" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
          Best Practices & Tips
        </h3>

        <div className="space-y-4">
          <Card className="bg-yellow-950/20 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-300">GameJolt-Specific Considerations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>API rate limits:</strong> GameJolt has no strict rate limits, but avoid spam</p>
              <p>• <strong>User authentication:</strong> Requires username + user token (auto-provided in GameJolt client)</p>
              <p>• <strong>Data storage:</strong> GameJolt offers 16MB per user, use for small saves</p>
              <p>• <strong>Web builds:</strong> GameJolt client works great for browser-based HTML5 games</p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-300">Publishing Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Multi-platform release:</strong> Publish on GameJolt, itch.io, and Steam simultaneously</p>
              <p>• <strong>Community engagement:</strong> Use GameJolt's forums and devlog features</p>
              <p>• <strong>Game Jams:</strong> Participate in GameJolt jams for visibility</p>
              <p>• <strong>AeThex analytics:</strong> Compare player behavior across all platforms</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Package className="h-6 w-6 text-purple-400" />
          Resources & Examples
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Example Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/gamejolt-starter" target="_blank" rel="noopener noreferrer">
                  GameJolt + AeThex Template
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/gamejolt-leaderboard" target="_blank" rel="noopener noreferrer">
                  Cross-Platform Leaderboard
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://gamejolt.com/@aethex" target="_blank" rel="noopener noreferrer">
                  AeThex GameJolt Profile
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
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
                <a href="https://gamejolt.com/game-api/doc" target="_blank" rel="noopener noreferrer">
                  GameJolt API Docs
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
      <Card className="bg-gradient-to-r from-purple-950/50 to-pink-950/50 border-purple-500/30">
        <CardContent className="p-8 space-y-4">
          <h3 className="text-2xl font-semibold text-white">Ready to Publish?</h3>
          <p className="text-gray-300">
            Distribute your indie game on GameJolt with AeThex cross-platform features. Reach 10M+ 
            players with unified achievements, leaderboards, and analytics.
          </p>
          <div className="flex gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
              <a href="/dev-platform/dashboard">Get API Key</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://gamejolt.com/dashboard/developer/games/add" target="_blank">
                Add Game on GameJolt
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
