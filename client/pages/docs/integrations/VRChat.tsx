import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headset, Code2, Rocket, ExternalLink, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";

export default function VRChatIntegration() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-purple-500/20 text-purple-100 uppercase tracking-wide">
          <Headset className="mr-2 h-3 w-3" />
          VRChat Integration
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Build VRChat Worlds with AeThex
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Deploy interactive VR experiences to VRChat's 30K+ concurrent user platform using AeThex's unified API. 
          Leverage Udon scripting integration, cross-platform authentication, and real-time data sync.
        </p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-purple-950/20 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-300">30K+</div>
            <div className="text-sm text-gray-400">Concurrent Users</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-950/20 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-300">250K+</div>
            <div className="text-sm text-gray-400">Published Worlds</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-950/20 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-300">C#</div>
            <div className="text-sm text-gray-400">Udon Programming</div>
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
                Persistent World Data
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Store player progress, leaderboards, and world state in AeThex backend with automatic sync across sessions
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <CheckCircle2 className="h-5 w-5" />
                Cross-Platform Auth
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Link VRChat users to AeThex Passport for unified identity across Roblox, Fortnite, and web platforms
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <CheckCircle2 className="h-5 w-5" />
                Real-Time Events
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Trigger world events based on API data - sync game state, achievements, or live leaderboards in real-time
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <CheckCircle2 className="h-5 w-5" />
                Asset Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Upload and manage VRChat assets through AeThex API, with automatic versioning and CDN distribution
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
            <CardTitle>1. Install AeThex Unity SDK</CardTitle>
            <CardDescription>Add the AeThex package to your VRChat Unity project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`// Via Unity Package Manager
// Add this URL to Package Manager → Add package from git URL
https://github.com/aethex-corp/unity-sdk.git

// Or download and import manually
// Download: https://github.com/aethex-corp/unity-sdk/releases/latest`}
              language="bash"
              showLineNumbers={false}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle>2. Configure API Credentials</CardTitle>
            <CardDescription>Get your API key from the AeThex Developer Dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`using AeThex;

public class AeThexManager : MonoBehaviour
{
    private AeThexClient client;

    void Start()
    {
        // Initialize AeThex client
        client = new AeThexClient(new AeThexConfig
        {
            ApiKey = "your_api_key_here",
            Environment = AeThexEnvironment.Production
        });
        
        Debug.Log("AeThex initialized for VRChat");
    }
}`}
              language="csharp"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle>3. Create Your First Udon Script</CardTitle>
            <CardDescription>Build a persistent leaderboard that syncs across VRChat sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using AeThex;

public class VRChatLeaderboard : UdonSharpBehaviour
{
    private AeThexClient aethexClient;
    
    void Start()
    {
        aethexClient = GetComponent<AeThexManager>().GetClient();
    }
    
    public override void OnPlayerJoined(VRCPlayerApi player)
    {
        // Fetch player's AeThex profile
        string playerId = player.displayName;
        
        aethexClient.GetUserProfile(playerId).Then(profile =>
        {
            Debug.Log($"Player {profile.username} joined with score: {profile.score}");
            UpdateLeaderboard(profile);
        });
    }
    
    public void OnPlayerScored(VRCPlayerApi player, int points)
    {
        // Update score in AeThex backend
        aethexClient.UpdateUserScore(player.displayName, points).Then(() =>
        {
            Debug.Log($"Score updated: +{points} points");
        });
    }
    
    private void UpdateLeaderboard(UserProfile profile)
    {
        // Update VRChat UI with leaderboard data
        // This syncs across all players in the world
    }
}`}
              language="csharp"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>
      </section>

      {/* Authentication Flow */}
      <section id="authentication" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">Cross-Platform Authentication</h3>
        <p className="text-gray-400">
          Link VRChat players to their AeThex Passport for unified identity across all platforms.
        </p>

        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle>Authentication Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">1.</span>
                <span>Player joins VRChat world and interacts with authentication panel</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">2.</span>
                <span>World displays unique 6-digit code from AeThex API</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">3.</span>
                <span>Player visits <code className="bg-purple-950/50 px-2 py-1 rounded">aethex.dev/dashboard?tab=link-device</code> and enters code</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">4.</span>
                <span>VRChat world receives webhook with linked Passport data</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-bold">5.</span>
                <span>Player's VRChat profile now syncs with Roblox, Fortnite, web accounts</span>
              </li>
            </ol>

            <CodeBlock
              code={`// Generate authentication code in VRChat world
public void OnAuthButtonPressed()
{
    aethexClient.GenerateAuthCode(playerDisplayName).Then(response =>
    {
        // Display 6-digit code to player in-world
        authCodeText.text = $"Code: {response.code}";
        Debug.Log($"Player should visit: aethex.dev/dashboard?tab=link-device&code={response.code}");
        
        // Poll for authentication completion
        StartCoroutine(PollAuthStatus(response.code));
    });
}

private IEnumerator PollAuthStatus(string code)
{
    while (true)
    {
        yield return new WaitForSeconds(2f);
        
        var status = await aethexClient.CheckAuthStatus(code);
        if (status.authenticated)
        {
            Debug.Log($"Player linked! Passport ID: {status.passportId}");
            OnPlayerAuthenticated(status.passportId);
            break;
        }
    }
}`}
              language="csharp"
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
              <CardTitle className="text-yellow-300">VRChat Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>No direct HTTP requests:</strong> Use AeThex SDK which handles async via Unity coroutines</p>
              <p>• <strong>Udon C# restrictions:</strong> No threading, limited async/await support</p>
              <p>• <strong>Rate limits:</strong> Max 100 API calls per world per minute</p>
              <p>• <strong>Data size:</strong> Keep API responses under 100KB for optimal performance</p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-300">Performance Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Cache data:</strong> Store frequently accessed data locally, refresh every 5 minutes</p>
              <p>• <strong>Batch requests:</strong> Use bulk endpoints to fetch multiple players at once</p>
              <p>• <strong>Lazy load:</strong> Only fetch data when players interact with features</p>
              <p>• <strong>Fallback mode:</strong> Implement offline mode for when API is unavailable</p>
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
              <CardTitle className="text-lg">Example Worlds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/vrchat-leaderboard-world" target="_blank" rel="noopener noreferrer">
                  Leaderboard World
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/vrchat-auth-demo" target="_blank" rel="noopener noreferrer">
                  Authentication Demo
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/vrchat-inventory-sync" target="_blank" rel="noopener noreferrer">
                  Inventory Sync
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
                <a href="https://docs.vrchat.com/docs/udon" target="_blank" rel="noopener noreferrer">
                  VRChat Udon Docs
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
      <Card className="bg-gradient-to-r from-purple-950/50 to-indigo-950/50 border-purple-500/30">
        <CardContent className="p-8 space-y-4">
          <h3 className="text-2xl font-semibold text-white">Ready to Build?</h3>
          <p className="text-gray-300">
            Start building cross-platform VR experiences with AeThex. Deploy to VRChat, RecRoom, 
            and web simultaneously with one unified API.
          </p>
          <div className="flex gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
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
