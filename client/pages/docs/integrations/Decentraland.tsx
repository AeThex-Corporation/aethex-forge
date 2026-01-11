import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cuboid, Code2, Rocket, ExternalLink, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";

export default function DecentralandIntegration() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-red-500/20 text-red-100 uppercase tracking-wide">
          <Cuboid className="mr-2 h-3 w-3" />
          Decentraland Integration
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Build in Decentraland with AeThex
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Create blockchain-based virtual experiences in Decentraland's Ethereum-powered metaverse. Integrate 
          AeThex APIs with LAND parcels, NFT wearables, and DAO governance for web3 gaming.
        </p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-950/20 border-red-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-300">800K+</div>
            <div className="text-sm text-gray-400">Registered Users</div>
          </CardContent>
        </Card>
        <Card className="bg-red-950/20 border-red-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-300">90K+</div>
            <div className="text-sm text-gray-400">LAND Parcels</div>
          </CardContent>
        </Card>
        <Card className="bg-red-950/20 border-red-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-300">Ethereum</div>
            <div className="text-sm text-gray-400">Blockchain</div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <section id="features" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">What You Can Build</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-300">
                <CheckCircle2 className="h-5 w-5" />
                NFT-Gated Experiences
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Verify wallet ownership via AeThex, grant access to exclusive LAND areas, and NFT-gated minigames
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-300">
                <CheckCircle2 className="h-5 w-5" />
                Cross-Chain Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Award achievements that sync across Decentraland, Polygon, and other EVM chains via AeThex
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-300">
                <CheckCircle2 className="h-5 w-5" />
                DAO Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Connect Decentraland DAO voting with AeThex governance tools for multi-platform coordination
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-300">
                <CheckCircle2 className="h-5 w-5" />
                Smart Contract Events
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Listen to on-chain events (MANA transfers, wearable mints) and trigger in-world experiences via AeThex webhooks
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Rocket className="h-6 w-6 text-red-400" />
          Quick Start Guide
        </h3>
        
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardHeader>
            <CardTitle>1. Install Decentraland SDK + AeThex</CardTitle>
            <CardDescription>Set up your LAND parcel with AeThex integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`# Install Decentraland CLI and create new scene
npm install -g decentraland

# Create new scene
dcl init

# Install AeThex SDK
npm install @aethex/decentraland-sdk ethers`}
              language="bash"
              showLineNumbers={false}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-red-500/20">
          <CardHeader>
            <CardTitle>2. Initialize AeThex in Your Scene</CardTitle>
            <CardDescription>Configure API and Web3 wallet integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`import { AeThexClient } from '@aethex/decentraland-sdk';
import { getUserAccount } from '@decentraland/EthereumController';

// Initialize AeThex with Web3 support
const aethex = new AeThexClient({
  apiKey: 'your_api_key_here',
  environment: 'production',
  web3Provider: 'ethereum' // Auto-detects MetaMask/WalletConnect
});

// Example: Verify user owns specific NFT before granting access
async function checkNFTAccess() {
  const userAddress = await getUserAccount();
  
  // Check if user owns required NFT via AeThex
  const hasAccess = await aethex.web3.verifyNFTOwnership({
    walletAddress: userAddress,
    contractAddress: '0x...',
    tokenId: 1234,
    chain: 'ethereum'
  });
  
  if (hasAccess) {
    log('Access granted! Opening exclusive area...');
    // Unlock special content
  } else {
    log('NFT required for access');
  }
}

// Listen for player entering scene
export function onEnter() {
  checkNFTAccess();
}`}
              language="typescript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-red-500/20">
          <CardHeader>
            <CardTitle>3. Build NFT-Gated Game</CardTitle>
            <CardDescription>Create a treasure hunt with blockchain rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`import { AeThexClient } from '@aethex/decentraland-sdk';
import { getUserAccount } from '@decentraland/EthereumController';
import * as ui from '@dcl/ui-scene-utils';

const aethex = new AeThexClient({ apiKey: process.env.AETHEX_API_KEY });

// Track player progress across sessions
class TreasureHunt {
  private userAddress: string;
  
  async init() {
    this.userAddress = await getUserAccount();
    await this.loadProgress();
  }
  
  async loadProgress() {
    // Fetch player's treasure hunt progress from AeThex
    const progress = await aethex.users.getData(this.userAddress, {
      namespace: 'decentraland-treasure-hunt'
    });
    
    log(\`Treasures found: \${progress.treasuresFound || 0}/10\`);
    return progress;
  }
  
  async collectTreasure(treasureId: number) {
    // Update progress on AeThex backend
    await aethex.users.updateData(this.userAddress, {
      namespace: 'decentraland-treasure-hunt',
      data: {
        treasuresFound: treasureId,
        lastCollected: Date.now()
      }
    });
    
    // Award cross-platform achievement
    await aethex.achievements.unlock(this.userAddress, 'treasure-hunter');
    
    // Check if completed all treasures
    if (treasureId === 10) {
      this.awardNFTReward();
    }
  }
  
  async awardNFTReward() {
    // Mint reward NFT via AeThex smart contract integration
    const receipt = await aethex.web3.mintNFT({
      walletAddress: this.userAddress,
      contractAddress: '0x...', // Your reward NFT contract
      metadata: {
        name: 'Treasure Hunter',
        description: 'Completed AeThex Decentraland treasure hunt',
        image: 'ipfs://...'
      }
    });
    
    ui.displayAnnouncement('Reward NFT Minted! Check your wallet.', 5);
  }
}

// Initialize treasure hunt
const hunt = new TreasureHunt();
executeTask(async () => {
  await hunt.init();
});`}
              language="typescript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>
      </section>

      {/* Authentication Flow */}
      <section id="authentication" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">Web3 Wallet Authentication</h3>
        <p className="text-gray-400">
          Link Decentraland wallets to AeThex Passport for unified cross-chain identity.
        </p>

        <Card className="bg-slate-900/50 border-red-500/20">
          <CardHeader>
            <CardTitle>Wallet Signature Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              AeThex uses EIP-4361 (Sign-In with Ethereum) for secure, gasless wallet authentication.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-300 font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Connect Wallet</h4>
                  <p className="text-gray-400 text-sm">Player connects MetaMask or WalletConnect in Decentraland</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-300 font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Generate Sign-In Message</h4>
                  <p className="text-gray-400 text-sm">AeThex creates EIP-4361 message with nonce and expiration</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-300 font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Request Signature</h4>
                  <p className="text-gray-400 text-sm">Player signs message in wallet (no gas fees)</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-300 font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Verify & Link</h4>
                  <p className="text-gray-400 text-sm">AeThex verifies signature, links wallet to Passport, returns JWT</p>
                </div>
              </div>
            </div>

            <CodeBlock
              code={`import { AeThexClient } from '@aethex/decentraland-sdk';
import { getUserAccount, signMessage } from '@decentraland/EthereumController';

const aethex = new AeThexClient({ apiKey: process.env.AETHEX_API_KEY });

async function authenticateWallet() {
  try {
    const walletAddress = await getUserAccount();
    
    // Request Sign-In with Ethereum message from AeThex
    const { message, nonce } = await aethex.auth.generateSignInMessage({
      address: walletAddress,
      chainId: 1, // Ethereum mainnet
      platform: 'decentraland'
    });
    
    // Prompt user to sign message (no gas fees)
    const signature = await signMessage(message);
    
    // Verify signature and get auth token
    const { token, passportId } = await aethex.auth.verifySignature({
      address: walletAddress,
      signature: signature,
      nonce: nonce
    });
    
    log(\`Authenticated! Passport ID: \${passportId}\`);
    
    // Store token for subsequent API calls
    aethex.setAuthToken(token);
    
    // Now you can access cross-platform features
    const achievements = await aethex.achievements.list(passportId);
    displayAchievements(achievements);
    
  } catch (error) {
    log('Authentication failed:', error);
  }
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
              <CardTitle className="text-yellow-300">Decentraland Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>LAND parcel limits:</strong> 20MB scene size, 10k triangles per parcel</p>
              <p>• <strong>Gas costs:</strong> Minting NFTs requires ETH, use AeThex gasless relayer for UX</p>
              <p>• <strong>Network latency:</strong> Ethereum confirmations take 15-30 seconds, show loading states</p>
              <p>• <strong>Browser performance:</strong> Optimize 3D assets, Decentraland runs in WebGL</p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-300">Web3 Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Cache blockchain data:</strong> Store NFT ownership checks for 5-10 minutes</p>
              <p>• <strong>Use Polygon for speed:</strong> Deploy NFTs on Polygon (2s confirmations) instead of Ethereum mainnet</p>
              <p>• <strong>Gasless transactions:</strong> Use AeThex meta-transaction relayer for free UX</p>
              <p>• <strong>IPFS for metadata:</strong> Store NFT metadata on IPFS, link via AeThex CDN</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Package className="h-6 w-6 text-red-400" />
          Resources & Examples
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Example Scenes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://play.decentraland.org/?position=-100,100" target="_blank" rel="noopener noreferrer">
                  AeThex Gallery (NFT Gate)
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/dcl-treasure-hunt" target="_blank" rel="noopener noreferrer">
                  Treasure Hunt Template
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/dcl-nft-rewards" target="_blank" rel="noopener noreferrer">
                  NFT Reward System
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-red-500/20">
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
                <a href="https://docs.decentraland.org" target="_blank" rel="noopener noreferrer">
                  Decentraland SDK Docs
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
      <Card className="bg-gradient-to-r from-red-950/50 to-orange-950/50 border-red-500/30">
        <CardContent className="p-8 space-y-4">
          <h3 className="text-2xl font-semibold text-white">Ready to Build?</h3>
          <p className="text-gray-300">
            Create blockchain-powered metaverse experiences with Decentraland and AeThex. Build NFT-gated 
            games, DAO governance tools, and cross-chain achievements.
          </p>
          <div className="flex gap-4">
            <Button className="bg-red-600 hover:bg-red-700" asChild>
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
