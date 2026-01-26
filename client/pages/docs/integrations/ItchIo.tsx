import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Code2, Rocket, ExternalLink, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";

export default function ItchIoIntegration() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-pink-500/20 text-pink-100 uppercase tracking-wide">
          <Heart className="mr-2 h-3 w-3" />
          Itch.io Integration
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Publish on Itch.io with AeThex
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Distribute your indie games on itch.io, the world's largest indie game marketplace. Integrate 
          AeThex APIs for cloud saves, achievements, analytics, and cross-platform player progression.
        </p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-pink-950/20 border-pink-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-pink-300">1M+</div>
            <div className="text-sm text-gray-400">Creators</div>
          </CardContent>
        </Card>
        <Card className="bg-pink-950/20 border-pink-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-pink-300">500K+</div>
            <div className="text-sm text-gray-400">Published Games</div>
          </CardContent>
        </Card>
        <Card className="bg-pink-950/20 border-pink-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-pink-300">Pay What You Want</div>
            <div className="text-sm text-gray-400">Flexible Pricing</div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <section id="features" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">What You Can Build</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-pink-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-300">
                <CheckCircle2 className="h-5 w-5" />
                Cloud Save Sync
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Save player progress to AeThex backend, accessible across itch.io app and browser builds
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-pink-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-300">
                <CheckCircle2 className="h-5 w-5" />
                Cross-Store Leaderboards
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Combine itch.io players with Steam, Epic, and GameJolt users in unified leaderboards
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-pink-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-300">
                <CheckCircle2 className="h-5 w-5" />
                Player Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Track itch.io player behavior, demographics, and compare with other distribution platforms
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-pink-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-300">
                <CheckCircle2 className="h-5 w-5" />
                Web Game Backend
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Perfect for HTML5/WebGL games on itch.io - use AeThex REST APIs directly from browser
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Rocket className="h-6 w-6 text-pink-400" />
          Quick Start Guide
        </h3>
        
        <Card className="bg-slate-900/50 border-pink-500/20">
          <CardHeader>
            <CardTitle>1. Publish Your Game on Itch.io</CardTitle>
            <CardDescription>Create your game page and upload builds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-2 text-gray-300">
              <li className="flex gap-3">
                <span className="text-pink-400 font-bold">1.</span>
                <span>Create account at <a href="https://itch.io" className="text-pink-400 hover:underline" target="_blank" rel="noopener noreferrer">itch.io</a></span>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-400 font-bold">2.</span>
                <span>Upload your game via Dashboard → Upload new project</span>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-400 font-bold">3.</span>
                <span>Configure pricing (free, paid, or pay-what-you-want)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-400 font-bold">4.</span>
                <span>Set up API access in your game code (no itch.io API key needed for basic features)</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-pink-500/20">
          <CardHeader>
            <CardTitle>2. Initialize AeThex for Web Games</CardTitle>
            <CardDescription>Perfect for HTML5/WebGL builds on itch.io</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`// For HTML5/JavaScript games on itch.io
// Install via CDN or npm
<script src="https://cdn.aethex.dev/sdk/v1/aethex.min.js"></script>

// Or via npm for bundled projects
import { AeThexClient } from '@aethex/sdk';

// Initialize client
const aethex = new AeThexClient({
  apiKey: 'YOUR_AETHEX_API_KEY',
  environment: 'production'
});

// Authenticate player (email/password or guest)
async function authenticatePlayer() {
  try {
    // Check if user has existing session
    const savedToken = localStorage.getItem('aethex_token');
    
    if (savedToken) {
      aethex.setAuthToken(savedToken);
      console.log('Restored session');
      return;
    }
    
    // Otherwise, create guest account
    const result = await aethex.auth.createGuest({
      platform: 'itchio',
      deviceId: generateDeviceId()
    });
    
    localStorage.setItem('aethex_token', result.token);
    console.log('Guest account created:', result.userId);
    
  } catch (error) {
    console.error('Auth failed:', error);
  }
}

function generateDeviceId() {
  // Create stable device ID for itch.io app or browser
  const storedId = localStorage.getItem('device_id');
  if (storedId) return storedId;
  
  const newId = 'itchio_' + Math.random().toString(36).substring(2);
  localStorage.setItem('device_id', newId);
  return newId;
}

// Call on game start
authenticatePlayer();`}
              language="javascript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-pink-500/20">
          <CardHeader>
            <CardTitle>3. Implement Cloud Saves</CardTitle>
            <CardDescription>Save player progress across sessions and devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`// Cloud save implementation for itch.io games
class SaveManager {
  constructor(aethexClient) {
    this.aethex = aethexClient;
    this.userId = null;
  }
  
  async init() {
    const user = await this.aethex.auth.getCurrentUser();
    this.userId = user.id;
  }
  
  // Save game state to AeThex cloud
  async saveGame(gameState) {
    try {
      await this.aethex.users.updateData(this.userId, {
        namespace: 'itchio-game-save',
        data: {
          level: gameState.level,
          score: gameState.score,
          inventory: gameState.inventory,
          progress: gameState.progress,
          timestamp: Date.now()
        }
      });
      
      console.log('Game saved to cloud!');
      this.showNotification('Game Saved');
    } catch (error) {
      console.error('Save failed:', error);
      this.showNotification('Save failed - will retry');
    }
  }
  
  // Load game state from AeThex cloud
  async loadGame() {
    try {
      const result = await this.aethex.users.getData(this.userId, {
        namespace: 'itchio-game-save'
      });
      
      if (result.data) {
        console.log('Game loaded from cloud');
        return result.data;
      } else {
        console.log('No save found, starting new game');
        return this.getDefaultGameState();
      }
    } catch (error) {
      console.error('Load failed:', error);
      return this.getDefaultGameState();
    }
  }
  
  getDefaultGameState() {
    return {
      level: 1,
      score: 0,
      inventory: [],
      progress: 0
    };
  }
  
  // Auto-save every 2 minutes
  enableAutoSave(getGameState) {
    setInterval(() => {
      const state = getGameState();
      this.saveGame(state);
    }, 120000); // 2 minutes
  }
  
  showNotification(message) {
    // Show in-game notification
    console.log('NOTIFICATION:', message);
  }
}

// Usage
const saveManager = new SaveManager(aethex);
await saveManager.init();

// Load game on start
const gameState = await saveManager.loadGame();

// Enable auto-save
saveManager.enableAutoSave(() => ({
  level: currentLevel,
  score: playerScore,
  inventory: playerInventory,
  progress: gameProgress
}));

// Manual save button
document.getElementById('save-button').addEventListener('click', async () => {
  await saveManager.saveGame({
    level: currentLevel,
    score: playerScore,
    inventory: playerInventory,
    progress: gameProgress
  });
});`}
              language="javascript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>
      </section>

      {/* Itch.io App Integration */}
      <section id="itchio-app" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Code2 className="h-6 w-6 text-pink-400" />
          Itch.io App Integration
        </h3>

        <Card className="bg-slate-900/50 border-pink-500/20">
          <CardHeader>
            <CardTitle>Detect Itch.io App Environment</CardTitle>
            <CardDescription>Optimize for browser vs desktop app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`// Detect if game is running in itch.io desktop app
function isItchApp() {
  // Itch.io app exposes window.Itch object
  return typeof window.Itch !== 'undefined';
}

// Adjust save strategy based on environment
async function configureSaveStrategy() {
  if (isItchApp()) {
    console.log('Running in itch.io app - using cloud + local saves');
    
    // Use both local and cloud saves for redundancy
    await enableCloudSaves();
    await enableLocalSaves();
    
    // Access itch.io app features
    if (window.Itch) {
      // Get app version
      console.log('Itch app version:', window.Itch.VERSION);
      
      // Trigger app features (if available)
      // Note: Limited itch.io app API
    }
  } else {
    console.log('Running in browser - cloud saves only');
    await enableCloudSaves();
  }
}

async function enableCloudSaves() {
  // AeThex cloud saves work everywhere
  console.log('Cloud saves enabled via AeThex');
}

async function enableLocalSaves() {
  // Local saves for itch.io app using localStorage
  console.log('Local saves enabled for app');
}

configureSaveStrategy();`}
              language="javascript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-pink-500/20">
          <CardHeader>
            <CardTitle>Cross-Platform Leaderboard</CardTitle>
            <CardDescription>Share scores across itch.io and other stores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`// Submit score to AeThex leaderboard
async function submitScore(score) {
  try {
    const result = await aethex.leaderboards.updateScore('global-leaderboard', {
      userId: currentUser.id,
      score: score,
      metadata: {
        platform: 'itchio',
        timestamp: Date.now(),
        gameVersion: '1.0.0'
      }
    });
    
    console.log(\`Score submitted! Your rank: \${result.rank}\`);
    return result;
  } catch (error) {
    console.error('Failed to submit score:', error);
  }
}

// Display leaderboard with itch.io and other platforms
async function displayLeaderboard() {
  const leaderboard = await aethex.leaderboards.getTop('global-leaderboard', {
    limit: 100,
    platform: 'all' // Include Steam, Epic, GameJolt, etc.
  });
  
  const container = document.getElementById('leaderboard');
  container.innerHTML = '<h2>Global Leaderboard</h2>';
  
  leaderboard.entries.forEach((entry, index) => {
    const platformBadge = getPlatformBadge(entry.metadata.platform);
    
    container.innerHTML += \`
      <div class="leaderboard-entry">
        <span class="rank">\${index + 1}</span>
        <span class="username">\${entry.username}</span>
        <span class="platform-badge">\${platformBadge}</span>
        <span class="score">\${entry.score.toLocaleString()}</span>
      </div>
    \`;
  });
}

function getPlatformBadge(platform) {
  const badges = {
    'itchio': '🎮 itch.io',
    'steam': '🔷 Steam',
    'gamejolt': '⚡ GameJolt',
    'epic': '📦 Epic'
  };
  return badges[platform] || '🌐 Web';
}`}
              language="javascript"
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
              <CardTitle className="text-yellow-300">Itch.io-Specific Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>HTML5 games:</strong> Itch.io has excellent HTML5 support, perfect for WebGL/Canvas games</p>
              <p>• <strong>Pay-what-you-want:</strong> Offer free version with AeThex ads, paid removes ads</p>
              <p>• <strong>Butler CLI:</strong> Use itch.io's butler tool for automated builds and updates</p>
              <p>• <strong>Browser compatibility:</strong> Test in Chrome, Firefox, Safari for web builds</p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-300">Monetization Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Flexible pricing:</strong> Let players pay what they want ($0-$20 recommended)</p>
              <p>• <strong>Revenue share:</strong> Itch.io takes 0-30% (you choose), AeThex tracks sales analytics</p>
              <p>• <strong>Bundle sales:</strong> Participate in itch.io bundles for discoverability</p>
              <p>• <strong>Patreon integration:</strong> Link Patreon supporters to exclusive AeThex features</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Package className="h-6 w-6 text-pink-400" />
          Resources & Examples
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Example Games</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://aethex.itch.io/demo-game" target="_blank" rel="noopener noreferrer">
                  AeThex + Itch.io Demo
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/itchio-html5-starter" target="_blank" rel="noopener noreferrer">
                  HTML5 Game Template
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/itchio-cloud-saves" target="_blank" rel="noopener noreferrer">
                  Cloud Save Example
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-pink-500/20">
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
                <a href="https://itch.io/docs/creators" target="_blank" rel="noopener noreferrer">
                  Itch.io Creator Docs
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
      <Card className="bg-gradient-to-r from-pink-950/50 to-rose-950/50 border-pink-500/30">
        <CardContent className="p-8 space-y-4">
          <h3 className="text-2xl font-semibold text-white">Ready to Launch?</h3>
          <p className="text-gray-300">
            Publish your indie game on itch.io with AeThex backend features. Reach 500K+ games 
            marketplace with cloud saves, cross-platform leaderboards, and player analytics.
          </p>
          <div className="flex gap-4">
            <Button className="bg-pink-600 hover:bg-pink-700" asChild>
              <a href="/dev-platform/dashboard">Get API Key</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://itch.io/game/new" target="_blank">
                Upload to Itch.io
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
