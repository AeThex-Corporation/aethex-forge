import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Code2, Rocket, ExternalLink, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import CodeBlock from "@/components/dev-platform/CodeBlock";

export default function SpatialIntegration() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-cyan-500/20 text-cyan-100 uppercase tracking-wide">
          <Globe className="mr-2 h-3 w-3" />
          Spatial Integration
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Build Spatial Experiences with AeThex
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Create immersive 3D spaces for Spatial's web-based metaverse platform. Use AeThex's unified API 
          with Spatial's visual editor, TypeScript SDK, and multi-device support (VR, Desktop, Mobile).
        </p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-cyan-950/20 border-cyan-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-cyan-300">5M+</div>
            <div className="text-sm text-gray-400">Monthly Visitors</div>
          </CardContent>
        </Card>
        <Card className="bg-cyan-950/20 border-cyan-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-cyan-300">100K+</div>
            <div className="text-sm text-gray-400">Created Spaces</div>
          </CardContent>
        </Card>
        <Card className="bg-cyan-950/20 border-cyan-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-cyan-300">No Install</div>
            <div className="text-sm text-gray-400">Browser-Based</div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <section id="features" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">What You Can Build</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <CheckCircle2 className="h-5 w-5" />
                Web3 Virtual Events
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Host conferences, exhibitions, and networking events with AeThex authentication and NFT-gated access
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <CheckCircle2 className="h-5 w-5" />
                Cross-Device Experiences
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Build once, deploy everywhere - Spatial runs on Quest, desktop browsers, and mobile devices
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <CheckCircle2 className="h-5 w-5" />
                Interactive 3D Content
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Sync 3D models, animations, and interactive objects with AeThex backend for dynamic content updates
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <CheckCircle2 className="h-5 w-5" />
                Analytics & Engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Track visitor behavior, space engagement metrics, and cross-platform user journeys via AeThex analytics
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Rocket className="h-6 w-6 text-cyan-400" />
          Quick Start Guide
        </h3>
        
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle>1. Install AeThex Spatial SDK</CardTitle>
            <CardDescription>Add AeThex scripting components to your Spatial space</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              In Spatial Studio, go to <strong>Scripts</strong> → <strong>Add Package</strong> → Search for <code className="bg-cyan-950/50 px-2 py-1 rounded text-cyan-300">@aethex/spatial-sdk</code>
            </p>
            <CodeBlock
              code={`// Or install via npm for custom scripting
npm install @aethex/spatial-sdk

// Import in your Spatial TypeScript scripts
import { AeThexClient } from '@aethex/spatial-sdk';`}
              language="bash"
              showLineNumbers={false}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle>2. Initialize AeThex in Your Space</CardTitle>
            <CardDescription>Configure API credentials in Spatial Studio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`import { AeThexClient } from '@aethex/spatial-sdk';

// Initialize AeThex client in your space script
const aethex = new AeThexClient({
  apiKey: 'your_api_key_here',
  environment: 'production'
});

// Listen for player join events
space.onUserJoined.subscribe((user) => {
  console.log(\`User \${user.username} joined\`);
  
  // Fetch user profile from AeThex
  aethex.users.get(user.id).then(profile => {
    console.log('AeThex Profile:', profile);
  });
});

// Example: Update player stats when they interact
space.onInteract.subscribe((event) => {
  aethex.achievements.unlock(event.user.id, 'spatial-explorer');
});`}
              language="typescript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle>3. Build Interactive Features</CardTitle>
            <CardDescription>Create cross-platform leaderboards and achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`import { AeThexClient } from '@aethex/spatial-sdk';

const aethex = new AeThexClient({ apiKey: process.env.AETHEX_API_KEY });

// Create a leaderboard that syncs across Spatial, Roblox, VRChat
async function updateLeaderboard(userId: string, score: number) {
  await aethex.leaderboards.updateScore('global-leaderboard', {
    userId: userId,
    score: score,
    metadata: {
      platform: 'spatial',
      timestamp: Date.now()
    }
  });
  
  // Fetch top 10 players across all platforms
  const topPlayers = await aethex.leaderboards.getTop('global-leaderboard', {
    limit: 10,
    platform: 'all'
  });
  
  return topPlayers;
}

// Example: Score points when player collects item
space.onItemCollected.subscribe(async (event) => {
  const newScore = await updateLeaderboard(event.user.id, 100);
  console.log('New leaderboard:', newScore);
});`}
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
          Link Spatial visitors to AeThex Passport for cross-platform identity and progression.
        </p>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle>OAuth Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Spatial supports web-based OAuth flows, making authentication seamless for browser users.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">User Enters Space</h4>
                  <p className="text-gray-400 text-sm">Spatial script detects new visitor via onUserJoined event</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Prompt Authentication</h4>
                  <p className="text-gray-400 text-sm">Display 3D UI panel with "Link AeThex Account" button</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">OAuth Redirect</h4>
                  <p className="text-gray-400 text-sm">Opens <code className="bg-cyan-950/50 px-1 rounded">aethex.dev/oauth/spatial</code> in browser overlay</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Callback Webhook</h4>
                  <p className="text-gray-400 text-sm">Spatial receives auth token, stores in user session, unlocks cross-platform features</p>
                </div>
              </div>
            </div>

            <CodeBlock
              code={`// Spatial OAuth authentication
import { AeThexClient } from '@aethex/spatial-sdk';

const aethex = new AeThexClient({ apiKey: process.env.AETHEX_API_KEY });

// When user clicks "Link Account" button
async function initiateAuth(spatialUserId: string) {
  const authUrl = await aethex.auth.generateOAuthUrl({
    platform: 'spatial',
    userId: spatialUserId,
    redirectUri: 'https://spatial.io/spaces/your-space-id'
  });
  
  // Open OAuth flow in browser overlay
  space.openURL(authUrl);
}

// Handle OAuth callback
space.onOAuthCallback.subscribe(async (token) => {
  const linkedUser = await aethex.auth.verifyToken(token);
  console.log('User linked:', linkedUser);
  
  // Now you can access cross-platform data
  const achievements = await aethex.achievements.list(linkedUser.id);
  displayAchievements(achievements);
});`}
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
          Best Practices & Limitations
        </h3>

        <div className="space-y-4">
          <Card className="bg-yellow-950/20 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-300">Spatial Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Browser-based performance:</strong> Keep API calls under 50/minute to avoid throttling</p>
              <p>• <strong>Asset size limits:</strong> 3D models max 50MB, optimize for web delivery</p>
              <p>• <strong>Script execution:</strong> Spatial runs TypeScript in sandbox, no native code</p>
              <p>• <strong>Concurrent users:</strong> Max 50 users per space instance, scale with multiple instances</p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-300">Performance Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Cache API responses:</strong> Store frequently accessed data in space variables</p>
              <p>• <strong>Lazy load content:</strong> Only fetch 3D assets when user approaches interactive zones</p>
              <p>• <strong>Use CDN URLs:</strong> Host large assets on AeThex CDN for faster loading</p>
              <p>• <strong>Mobile optimization:</strong> Test on mobile devices, reduce draw calls for iOS/Android</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Package className="h-6 w-6 text-cyan-400" />
          Resources & Examples
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Example Spaces</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://spatial.io/@aethex/gallery" target="_blank" rel="noopener noreferrer">
                  AeThex Virtual Gallery
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://spatial.io/@aethex/leaderboard" target="_blank" rel="noopener noreferrer">
                  Cross-Platform Leaderboard
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/spatial-starter" target="_blank" rel="noopener noreferrer">
                  Starter Template
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-cyan-500/20">
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
                <a href="https://docs.spatial.io" target="_blank" rel="noopener noreferrer">
                  Spatial Developer Docs
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
      <Card className="bg-gradient-to-r from-cyan-950/50 to-blue-950/50 border-cyan-500/30">
        <CardContent className="p-8 space-y-4">
          <h3 className="text-2xl font-semibold text-white">Ready to Build?</h3>
          <p className="text-gray-300">
            Create immersive web3 experiences with Spatial and AeThex. Deploy to browsers, VR headsets, 
            and mobile devices with one unified API.
          </p>
          <div className="flex gap-4">
            <Button className="bg-cyan-600 hover:bg-cyan-700" asChild>
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
