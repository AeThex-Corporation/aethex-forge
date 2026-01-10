import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, Code2, Rocket, ExternalLink, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";

export default function TheSandboxIntegration() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-amber-500/20 text-amber-100 uppercase tracking-wide">
          <Box className="mr-2 h-3 w-3" />
          The Sandbox Integration
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Build in The Sandbox with AeThex
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Create voxel-based gaming experiences in The Sandbox metaverse. Integrate AeThex APIs with Game Maker, 
          VoxEdit assets, and LAND ownership for user-generated content at scale.
        </p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-amber-950/20 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-300">2M+</div>
            <div className="text-sm text-gray-400">Monthly Players</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-950/20 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-300">166K+</div>
            <div className="text-sm text-gray-400">LAND Owners</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-950/20 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-300">Polygon</div>
            <div className="text-sm text-gray-400">Blockchain</div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <section id="features" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">What You Can Build</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-300">
                <CheckCircle2 className="h-5 w-5" />
                Voxel Game Experiences
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Build games with Game Maker visual editor, sync player progress and rewards via AeThex backend
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-300">
                <CheckCircle2 className="h-5 w-5" />
                NFT Asset Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Create VoxEdit assets, list on OpenSea, track ownership and sales via AeThex analytics
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-300">
                <CheckCircle2 className="h-5 w-5" />
                LAND Experiences
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Deploy games across multiple LAND parcels with unified player accounts via AeThex Passport
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-300">
                <CheckCircle2 className="h-5 w-5" />
                Cross-Platform Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Award achievements in The Sandbox that unlock rewards in Roblox, Minecraft, and web platforms
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Rocket className="h-6 w-6 text-amber-400" />
          Quick Start Guide
        </h3>
        
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle>1. Install Game Maker + AeThex Plugin</CardTitle>
            <CardDescription>Add AeThex SDK to your Sandbox experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Download The Sandbox Game Maker from <a href="https://www.sandbox.game/en/create/game-maker/" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">sandbox.game</a>, 
              then install the AeThex plugin from the Asset Library.
            </p>
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm text-amber-200 font-semibold">Plugin Features:</p>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• <code className="text-amber-300">AeThex API Block</code> - Make HTTP requests to AeThex endpoints</li>
                <li>• <code className="text-amber-300">Player Auth Block</code> - Link wallet to AeThex Passport</li>
                <li>• <code className="text-amber-300">Achievement Block</code> - Award cross-platform achievements</li>
                <li>• <code className="text-amber-300">Leaderboard Block</code> - Display global leaderboards</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle>2. Configure AeThex in Game Maker</CardTitle>
            <CardDescription>Add API credentials via visual scripting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Drag the <strong>AeThex Config</strong> block into your experience, then enter your API key from the 
              <a href="/dev-platform/dashboard" className="text-amber-400 hover:underline"> Developer Dashboard</a>.
            </p>
            
            <div className="bg-slate-950/50 border border-amber-500/20 rounded-lg p-4 space-y-3">
              <p className="text-sm text-amber-200 font-semibold">Visual Script Example:</p>
              <div className="font-mono text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-40 px-3 py-1 bg-green-950/50 border border-green-500/30 rounded text-green-300">On Player Enter</div>
                  <div className="text-gray-500">→</div>
                  <div className="w-40 px-3 py-1 bg-amber-950/50 border border-amber-500/30 rounded text-amber-300">AeThex Auth</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-40 px-3 py-1 bg-amber-950/50 border border-amber-500/30 rounded text-amber-300">Player Wallet</div>
                  <div className="text-gray-500">→</div>
                  <div className="w-40 px-3 py-1 bg-blue-950/50 border border-blue-500/30 rounded text-blue-300">Get Profile</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-40 px-3 py-1 bg-blue-950/50 border border-blue-500/30 rounded text-blue-300">Profile Data</div>
                  <div className="text-gray-500">→</div>
                  <div className="w-40 px-3 py-1 bg-purple-950/50 border border-purple-500/30 rounded text-purple-300">Display UI</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle>3. Build with TypeScript SDK (Advanced)</CardTitle>
            <CardDescription>For custom logic beyond Game Maker's visual editor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Use The Sandbox TypeScript SDK for complex game logic that integrates with AeThex APIs.
            </p>
            
            <CodeBlock
              code={`import { AeThexClient } from '@aethex/sandbox-sdk';
import { getPlayerWallet } from '@sandbox-game/sdk';

// Initialize AeThex
const aethex = new AeThexClient({
  apiKey: process.env.AETHEX_API_KEY,
  environment: 'production'
});

// Example: Track player progress across LAND parcels
class CrossLandProgress {
  async saveCheckpoint(walletAddress: string, landId: string, checkpoint: number) {
    await aethex.users.updateData(walletAddress, {
      namespace: 'sandbox-quest',
      data: {
        currentLand: landId,
        checkpoint: checkpoint,
        timestamp: Date.now()
      }
    });
  }
  
  async loadProgress(walletAddress: string) {
    const data = await aethex.users.getData(walletAddress, {
      namespace: 'sandbox-quest'
    });
    
    return data.checkpoint || 0;
  }
}

// Example: Award NFT for completing quest
async function completeQuest(walletAddress: string) {
  // Update quest status in AeThex
  await aethex.achievements.unlock(walletAddress, 'sandbox-quest-complete');
  
  // Mint reward NFT on Polygon
  const nft = await aethex.web3.mintNFT({
    walletAddress: walletAddress,
    contractAddress: '0x...', // Your ASSETS contract on Polygon
    chain: 'polygon',
    metadata: {
      name: 'Quest Completionist',
      description: 'Completed the AeThex Sandbox Quest',
      image: 'ipfs://Qm...',
      attributes: [
        { trait_type: 'Rarity', value: 'Epic' },
        { trait_type: 'Type', value: 'Achievement Badge' }
      ]
    }
  });
  
  console.log(\`NFT minted! Token ID: \${nft.tokenId}\`);
}`}
              language="typescript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>
      </section>

      {/* Authentication Flow */}
      <section id="authentication" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">Wallet Authentication</h3>
        <p className="text-gray-400">
          Link Sandbox wallets to AeThex Passport for cross-platform progression.
        </p>

        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle>Polygon Wallet Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              The Sandbox uses Polygon network for fast, low-cost transactions. AeThex supports Polygon L2 natively.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Player Enters Experience</h4>
                  <p className="text-gray-400 text-sm">Game Maker detects player with Polygon wallet connected</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Check AeThex Link</h4>
                  <p className="text-gray-400 text-sm">AeThex API checks if wallet is already linked to Passport</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Sign-In Prompt (First Time)</h4>
                  <p className="text-gray-400 text-sm">If not linked, prompt wallet signature (gasless, EIP-4361)</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Cross-Platform Access</h4>
                  <p className="text-gray-400 text-sm">Player can now access achievements, progress from other platforms</p>
                </div>
              </div>
            </div>

            <CodeBlock
              code={`import { AeThexClient } from '@aethex/sandbox-sdk';
import { getPlayerWallet, signMessage } from '@sandbox-game/sdk';

const aethex = new AeThexClient({ apiKey: process.env.AETHEX_API_KEY });

async function linkWalletToAeThex() {
  const walletAddress = await getPlayerWallet();
  
  // Check if wallet is already linked
  const isLinked = await aethex.auth.checkWalletLink(walletAddress);
  
  if (isLinked) {
    console.log('Wallet already linked!');
    return;
  }
  
  // Generate Sign-In with Ethereum message
  const { message, nonce } = await aethex.auth.generateSignInMessage({
    address: walletAddress,
    chainId: 137, // Polygon mainnet
    platform: 'sandbox'
  });
  
  // Request signature (no gas fees)
  const signature = await signMessage(message);
  
  // Verify and link wallet to Passport
  const { passportId, token } = await aethex.auth.verifySignature({
    address: walletAddress,
    signature: signature,
    nonce: nonce
  });
  
  console.log(\`Linked! Passport ID: \${passportId}\`);
  
  // Load cross-platform achievements
  const achievements = await aethex.achievements.list(passportId);
  displayAchievements(achievements);
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
          Best Practices & Limitations
        </h3>

        <div className="space-y-4">
          <Card className="bg-yellow-950/20 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-300">The Sandbox Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Game Maker constraints:</strong> Visual scripting has limited logic complexity</p>
              <p>• <strong>Voxel performance:</strong> Max 50k voxels per LAND parcel, optimize models</p>
              <p>• <strong>Player limits:</strong> 100 concurrent players per experience</p>
              <p>• <strong>Asset file sizes:</strong> VoxEdit models max 10MB, use LOD for large objects</p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-300">Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Polygon L2 benefits:</strong> 2-second confirmations, $0.001 gas fees vs Ethereum mainnet</p>
              <p>• <strong>Batch API calls:</strong> Update multiple players' data in single request</p>
              <p>• <strong>Cache NFT metadata:</strong> Store VoxEdit asset metadata on AeThex CDN</p>
              <p>• <strong>Mobile support:</strong> The Sandbox mobile app launching 2026, test on Android/iOS</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Package className="h-6 w-6 text-amber-400" />
          Resources & Examples
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Example Experiences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://www.sandbox.game/en/experiences/aethex-quest/" target="_blank" rel="noopener noreferrer">
                  AeThex Quest Experience
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/sandbox-cross-platform-rewards" target="_blank" rel="noopener noreferrer">
                  Cross-Platform Rewards
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/sandbox-nft-gallery" target="_blank" rel="noopener noreferrer">
                  NFT Gallery Template
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-amber-500/20">
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
                <a href="https://docs.sandbox.game" target="_blank" rel="noopener noreferrer">
                  The Sandbox Game Maker Docs
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
      <Card className="bg-gradient-to-r from-amber-950/50 to-yellow-950/50 border-amber-500/30">
        <CardContent className="p-8 space-y-4">
          <h3 className="text-2xl font-semibold text-white">Ready to Build?</h3>
          <p className="text-gray-300">
            Create voxel gaming experiences with The Sandbox and AeThex. Build NFT-powered games with 
            cross-platform rewards on Polygon L2.
          </p>
          <div className="flex gap-4">
            <Button className="bg-amber-600 hover:bg-amber-700" asChild>
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
