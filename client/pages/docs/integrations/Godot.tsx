import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Code2, Rocket, ExternalLink, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";

export default function GodotIntegration() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-blue-500/20 text-blue-100 uppercase tracking-wide">
          <Zap className="mr-2 h-3 w-3" />
          Godot Engine Integration
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Build with Godot Engine + AeThex
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Integrate AeThex APIs with Godot 4's open-source game engine. Use GDScript or C# to build 
          cross-platform games with unified backend, authentication, leaderboards, and cloud saves.
        </p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-950/20 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-300">2M+</div>
            <div className="text-sm text-gray-400">Active Developers</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-950/20 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-300">Open Source</div>
            <div className="text-sm text-gray-400">MIT Licensed</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-950/20 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-300">2D + 3D</div>
            <div className="text-sm text-gray-400">Multi-Platform Export</div>
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
                Cloud Save System
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Save player progress to AeThex backend, sync across PC, mobile, web, and console builds
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <CheckCircle2 className="h-5 w-5" />
                Multiplayer Backend
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Use AeThex REST APIs with Godot's HTTPRequest node for matchmaking, lobbies, and player data
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <CheckCircle2 className="h-5 w-5" />
                Cross-Platform Auth
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Link Steam, Epic, or email accounts to AeThex Passport for unified player identity
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <CheckCircle2 className="h-5 w-5" />
                Analytics & Events
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Track player behavior, session analytics, and custom events with AeThex telemetry API
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
            <CardTitle>1. Install AeThex Godot Plugin</CardTitle>
            <CardDescription>Add the AeThex GDScript plugin to your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Download from the Godot Asset Library or install manually:
            </p>
            <CodeBlock
              code={`# Clone the plugin into your project's addons folder
cd your-godot-project/
git clone https://github.com/aethex-corp/godot-sdk addons/aethex

# Or download manually
# https://github.com/aethex-corp/godot-sdk/releases/latest

# Enable in Project Settings → Plugins → AeThex SDK → Enable`}
              language="bash"
              showLineNumbers={false}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>2. Initialize AeThex Client (GDScript)</CardTitle>
            <CardDescription>Create an autoload singleton for global AeThex access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`# res://scripts/AeThexManager.gd
extends Node

var aethex_client: AeThexClient

func _ready():
    # Initialize AeThex SDK
    aethex_client = AeThexClient.new()
    aethex_client.api_key = "your_api_key_here"
    aethex_client.environment = AeThexClient.Environment.PRODUCTION
    
    # Connect signals
    aethex_client.connect("auth_success", self, "_on_auth_success")
    aethex_client.connect("auth_failed", self, "_on_auth_failed")
    
    add_child(aethex_client)
    print("AeThex SDK initialized")

func authenticate_user(email: String, password: String):
    aethex_client.auth.login(email, password)

func _on_auth_success(user_data: Dictionary):
    print("User authenticated: ", user_data.username)
    # Store user session
    Global.current_user = user_data

func _on_auth_failed(error: String):
    print("Auth failed: ", error)
    # Show error to player`}
              language="gdscript"
              showLineNumbers={true}
            />
            
            <p className="text-sm text-gray-400">
              Add <code className="bg-blue-950/50 px-1 rounded">res://scripts/AeThexManager.gd</code> as an autoload 
              in Project Settings → Autoload → Name: "AeThex"
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>3. Build Cloud Save System</CardTitle>
            <CardDescription>Save and load player progress with one function call</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`# res://scripts/SaveManager.gd
extends Node

# Save player progress to AeThex cloud
func save_game(player_data: Dictionary) -> void:
    var result = await AeThex.aethex_client.users.update_data(
        Global.current_user.id,
        {
            "level": player_data.level,
            "gold": player_data.gold,
            "inventory": player_data.inventory,
            "position": {
                "x": player_data.position.x,
                "y": player_data.position.y
            },
            "timestamp": Time.get_unix_time_from_system()
        }
    )
    
    if result.success:
        print("Game saved to cloud!")
    else:
        print("Save failed: ", result.error)

# Load player progress from AeThex cloud
func load_game() -> Dictionary:
    var result = await AeThex.aethex_client.users.get_data(
        Global.current_user.id
    )
    
    if result.success:
        print("Game loaded from cloud!")
        return result.data
    else:
        print("Load failed, using default data")
        return get_default_player_data()

func get_default_player_data() -> Dictionary:
    return {
        "level": 1,
        "gold": 0,
        "inventory": [],
        "position": {"x": 0, "y": 0}
    }

# Example: Auto-save every 5 minutes
func _ready():
    var auto_save_timer = Timer.new()
    auto_save_timer.wait_time = 300.0  # 5 minutes
    auto_save_timer.autostart = true
    auto_save_timer.connect("timeout", self, "auto_save")
    add_child(auto_save_timer)

func auto_save():
    save_game(Global.player_data)`}
              language="gdscript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>
      </section>

      {/* C# Examples */}
      <section id="csharp-examples" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Code2 className="h-6 w-6 text-blue-400" />
          C# Integration (Godot 4 Mono)
        </h3>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Leaderboard System (C#)</CardTitle>
            <CardDescription>Display global leaderboards with real-time updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`using Godot;
using AeThex;
using System.Threading.Tasks;

public partial class Leaderboard : Control
{
    private AeThexClient _aethex;
    private ItemList _leaderboardList;
    
    public override void _Ready()
    {
        _aethex = GetNode<AeThexClient>("/root/AeThex");
        _leaderboardList = GetNode<ItemList>("LeaderboardList");
        
        LoadLeaderboard();
    }
    
    private async void LoadLeaderboard()
    {
        try
        {
            var result = await _aethex.Leaderboards.GetTopAsync("global-score", new()
            {
                Limit = 100,
                Platform = "all"
            });
            
            _leaderboardList.Clear();
            
            foreach (var entry in result.Entries)
            {
                var text = $"{entry.Rank}. {entry.Username} - {entry.Score:N0} pts";
                _leaderboardList.AddItem(text);
            }
            
            GD.Print($"Loaded {result.Entries.Count} leaderboard entries");
        }
        catch (System.Exception e)
        {
            GD.PrintErr($"Failed to load leaderboard: {e.Message}");
        }
    }
    
    public async void SubmitScore(int score)
    {
        try
        {
            await _aethex.Leaderboards.UpdateScoreAsync("global-score", new()
            {
                UserId = GlobalData.CurrentUser.Id,
                Score = score,
                Metadata = new()
                {
                    { "platform", "godot" },
                    { "version", ProjectSettings.GetSetting("application/config/version").AsString() }
                }
            });
            
            GD.Print($"Score submitted: {score}");
            LoadLeaderboard(); // Refresh
        }
        catch (System.Exception e)
        {
            GD.PrintErr($"Failed to submit score: {e.Message}");
        }
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
        <h3 className="text-2xl font-semibold text-white">Player Authentication</h3>
        <p className="text-gray-400">
          Multiple authentication methods: Email/password, Steam, Epic Games, or anonymous.
        </p>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Email + Password Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`# GDScript authentication example
extends Control

@onready var email_input = $VBoxContainer/EmailInput
@onready var password_input = $VBoxContainer/PasswordInput
@onready var login_button = $VBoxContainer/LoginButton
@onready var status_label = $VBoxContainer/StatusLabel

func _ready():
    login_button.connect("pressed", self, "_on_login_pressed")

func _on_login_pressed():
    var email = email_input.text
    var password = password_input.text
    
    if email.is_empty() or password.is_empty():
        status_label.text = "Please enter email and password"
        return
    
    status_label.text = "Logging in..."
    login_button.disabled = true
    
    # Authenticate with AeThex
    var result = await AeThex.aethex_client.auth.login(email, password)
    
    if result.success:
        status_label.text = "Login successful!"
        Global.current_user = result.user
        
        # Save auth token for future requests
        AeThex.aethex_client.set_auth_token(result.token)
        
        # Transition to main game
        await get_tree().create_timer(1.0).timeout
        get_tree().change_scene_to_file("res://scenes/MainMenu.tscn")
    else:
        status_label.text = "Login failed: " + result.error
        login_button.disabled = false`}
              language="gdscript"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle>Steam Authentication (PC Builds)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Link Godot games on Steam with AeThex using the GodotSteam plugin.
            </p>
            <CodeBlock
              code={`# Requires GodotSteam plugin: https://godotsteam.com
extends Node

func authenticate_with_steam():
    if not Steam.isSteamRunning():
        print("Steam not running")
        return
    
    # Get Steam session ticket
    var ticket_result = Steam.getAuthSessionTicket()
    var ticket = ticket_result["ticket"]
    
    # Send to AeThex for verification
    var result = await AeThex.aethex_client.auth.login_steam({
        "ticket": ticket,
        "steam_id": Steam.getSteamID()
    })
    
    if result.success:
        print("Steam auth successful!")
        Global.current_user = result.user`}
              language="gdscript"
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
              <CardTitle className="text-yellow-300">Godot-Specific Considerations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Use await for async calls:</strong> Godot 4's await keyword makes HTTP requests clean</p>
              <p>• <strong>HTTPRequest node:</strong> For manual API calls, use Godot's built-in HTTPRequest</p>
              <p>• <strong>Export variables:</strong> Store API keys in environment variables, not in scenes</p>
              <p>• <strong>Signal-based flow:</strong> Connect AeThex signals for auth success/failure</p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-300">Performance Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Cache API responses:</strong> Store user data locally, sync periodically</p>
              <p>• <strong>Batch requests:</strong> Group multiple API calls when possible</p>
              <p>• <strong>Background threads:</strong> Use Thread or WorkerThreadPool for heavy API work</p>
              <p>• <strong>Offline mode:</strong> Implement local fallback when API is unreachable</p>
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
              <CardTitle className="text-lg">Example Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/godot-starter" target="_blank" rel="noopener noreferrer">
                  Godot + AeThex Starter
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/godot-multiplayer-demo" target="_blank" rel="noopener noreferrer">
                  Multiplayer Demo
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/godot-leaderboard" target="_blank" rel="noopener noreferrer">
                  Leaderboard System
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
                <a href="https://docs.godotengine.org" target="_blank" rel="noopener noreferrer">
                  Godot Engine Docs
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
      <Card className="bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border-blue-500/30">
        <CardContent className="p-8 space-y-4">
          <h3 className="text-2xl font-semibold text-white">Ready to Build?</h3>
          <p className="text-gray-300">
            Create cross-platform games with Godot Engine and AeThex. Export to PC, mobile, web, 
            and console with unified cloud saves, leaderboards, and authentication.
          </p>
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <a href="/dev-platform/dashboard">Get API Key</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/aethex-corp/godot-sdk" target="_blank">
                Download SDK
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
