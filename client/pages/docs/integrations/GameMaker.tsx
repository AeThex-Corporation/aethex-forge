import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad, Code2, Rocket, ExternalLink, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";

export default function GameMakerIntegration() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-green-500/20 text-green-100 uppercase tracking-wide">
          <Gamepad className="mr-2 h-3 w-3" />
          GameMaker Integration
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Build with GameMaker + AeThex
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Integrate AeThex APIs with GameMaker Studio 2 for 2D game development. Use GML (GameMaker Language) 
          for backend integration, cloud saves, leaderboards, and cross-platform publishing.
        </p>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-950/20 border-green-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-300">1M+</div>
            <div className="text-sm text-gray-400">Active Developers</div>
          </CardContent>
        </Card>
        <Card className="bg-green-950/20 border-green-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-300">2D Focus</div>
            <div className="text-sm text-gray-400">Drag & Drop + GML</div>
          </CardContent>
        </Card>
        <Card className="bg-green-950/20 border-green-500/20">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-300">Multi-Export</div>
            <div className="text-sm text-gray-400">PC, Mobile, Console, Web</div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <section id="features" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">What You Can Build</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                Cloud Save Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Save player progress to AeThex backend, sync across Windows, Mac, Linux, iOS, Android builds
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                Online Leaderboards
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Global and friend leaderboards with daily/weekly/all-time filters via AeThex API
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                Player Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Email/password login, social auth (Google, Discord), and guest accounts with AeThex Passport
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                Analytics & Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Track player sessions, level completion rates, and custom events via AeThex telemetry
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Rocket className="h-6 w-6 text-green-400" />
          Quick Start Guide
        </h3>
        
        <Card className="bg-slate-900/50 border-green-500/20">
          <CardHeader>
            <CardTitle>1. Import AeThex Extension</CardTitle>
            <CardDescription>Add the AeThex GML scripts to your GameMaker project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Download the <code className="bg-green-950/50 px-2 py-1 rounded text-green-300">AeThex.yymps</code> extension 
              package and import into GameMaker Studio 2.
            </p>
            <ol className="space-y-2 text-gray-300 text-sm">
              <li>1. Download from <a href="https://github.com/aethex-corp/gamemaker-sdk" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li>2. In GameMaker: <strong>Tools → Import Local Package</strong></li>
              <li>3. Select <code className="bg-green-950/50 px-1 rounded">AeThex.yymps</code> file</li>
              <li>4. Import all scripts and objects</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-green-500/20">
          <CardHeader>
            <CardTitle>2. Initialize AeThex (GML)</CardTitle>
            <CardDescription>Set up the AeThex client in your game's create event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`/// Create Event of obj_AeThexManager
// Initialize AeThex client
global.aethex_api_key = "your_api_key_here";
global.aethex_base_url = "https://api.aethex.dev/v1";
global.aethex_auth_token = "";
global.current_user = undefined;

// HTTP async IDs for tracking requests
global.http_auth_login = -1;
global.http_save_data = -1;
global.http_load_data = -1;
global.http_leaderboard = -1;

show_debug_message("AeThex Manager initialized");

/// User Event 0 - Login Function
// Usage: with(obj_AeThexManager) event_user(0);
var _email = argument0;
var _password = argument1;

var _url = global.aethex_base_url + "/auth/login";
var _headers = ds_map_create();
ds_map_add(_headers, "Content-Type", "application/json");
ds_map_add(_headers, "X-API-Key", global.aethex_api_key);

var _body = json_encode({
    email: _email,
    password: _password
});

global.http_auth_login = http_request(_url, "POST", _headers, _body);

ds_map_destroy(_headers);`}
              language="gml"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-green-500/20">
          <CardHeader>
            <CardTitle>3. Handle HTTP Async Responses</CardTitle>
            <CardDescription>Process API responses in the Async HTTP event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`/// Async - HTTP Event of obj_AeThexManager
var _async_id = ds_map_find_value(async_load, "id");
var _status = ds_map_find_value(async_load, "status");
var _result = ds_map_find_value(async_load, "result");

// Login response
if (_async_id == global.http_auth_login) {
    if (_status == 0 && _result != "") {
        var _json = json_decode(_result);
        var _data = _json[? "root"];
        
        if (_data[? "success"]) {
            global.aethex_auth_token = _data[? "token"];
            global.current_user = _data[? "user"];
            
            show_debug_message("Login successful: " + string(_data[? "user"][? "username"]));
            
            // Transition to main menu
            room_goto(rm_main_menu);
        } else {
            show_debug_message("Login failed: " + string(_data[? "error"]));
            // Show error message to player
        }
        
        ds_map_destroy(_data);
        ds_map_destroy(_json);
    }
}

// Save data response
else if (_async_id == global.http_save_data) {
    if (_status == 0) {
        show_debug_message("Save successful!");
    } else {
        show_debug_message("Save failed");
    }
}

// Load data response
else if (_async_id == global.http_load_data) {
    if (_status == 0 && _result != "") {
        var _json = json_decode(_result);
        var _data = _json[? "root"][? "data"];
        
        // Restore player stats
        global.player_level = _data[? "level"];
        global.player_gold = _data[? "gold"];
        global.player_x = _data[? "position"][? "x"];
        global.player_y = _data[? "position"][? "y"];
        
        show_debug_message("Game loaded from cloud");
        
        ds_map_destroy(_data);
        ds_map_destroy(_json);
    }
}`}
              language="gml"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>
      </section>

      {/* Cloud Save System */}
      <section id="cloud-saves" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Code2 className="h-6 w-6 text-green-400" />
          Cloud Save Implementation
        </h3>

        <Card className="bg-slate-900/50 border-green-500/20">
          <CardHeader>
            <CardTitle>Save Player Data</CardTitle>
            <CardDescription>Upload save data to AeThex cloud storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`/// User Event 1 - Save Game Function
// Usage: with(obj_AeThexManager) { argument0 = save_data_map; event_user(1); }
var _save_data = argument0;

var _url = global.aethex_base_url + "/users/" + string(global.current_user[? "id"]) + "/data";
var _headers = ds_map_create();
ds_map_add(_headers, "Content-Type", "application/json");
ds_map_add(_headers, "X-API-Key", global.aethex_api_key);
ds_map_add(_headers, "Authorization", "Bearer " + global.aethex_auth_token);

var _body = json_encode({
    namespace: "gamemaker-save",
    data: _save_data
});

global.http_save_data = http_request(_url, "PUT", _headers, _body);

ds_map_destroy(_headers);
show_debug_message("Saving game to cloud...");

/// Example usage from player object
// Create save data
var _save = ds_map_create();
ds_map_add(_save, "level", global.player_level);
ds_map_add(_save, "gold", global.player_gold);
ds_map_add(_save, "hp", global.player_hp);

var _pos = ds_map_create();
ds_map_add(_pos, "x", x);
ds_map_add(_pos, "y", y);
ds_map_add(_save, "position", _pos);

var _inventory = ds_list_create();
for (var i = 0; i < ds_list_size(global.inventory); i++) {
    ds_list_add(_inventory, global.inventory[| i]);
}
ds_map_add(_save, "inventory", _inventory);

// Save to cloud
with(obj_AeThexManager) {
    argument0 = _save;
    event_user(1);
}

ds_map_destroy(_pos);
ds_list_destroy(_inventory);
ds_map_destroy(_save);`}
              language="gml"
              showLineNumbers={true}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-green-500/20">
          <CardHeader>
            <CardTitle>Leaderboard Integration</CardTitle>
            <CardDescription>Submit scores and display global rankings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={`/// User Event 2 - Submit Score Function
// Usage: with(obj_AeThexManager) { argument0 = score; event_user(2); }
var _score = argument0;

var _url = global.aethex_base_url + "/leaderboards/global-score/update";
var _headers = ds_map_create();
ds_map_add(_headers, "Content-Type", "application/json");
ds_map_add(_headers, "X-API-Key", global.aethex_api_key);
ds_map_add(_headers, "Authorization", "Bearer " + global.aethex_auth_token);

var _body = json_encode({
    userId: global.current_user[? "id"],
    score: _score,
    metadata: {
        platform: "gamemaker",
        timestamp: date_current_datetime()
    }
});

http_request(_url, "POST", _headers, _body);
ds_map_destroy(_headers);

/// Draw Event - Display Leaderboard
// Fetch and render top 10 players
if (leaderboard_loaded) {
    draw_set_color(c_white);
    draw_set_font(fnt_leaderboard);
    
    var _y_start = 100;
    var _y_spacing = 40;
    
    draw_text(100, 50, "GLOBAL LEADERBOARD");
    
    for (var i = 0; i < ds_list_size(leaderboard_entries); i++) {
        var _entry = leaderboard_entries[| i];
        var _rank = _entry[? "rank"];
        var _username = _entry[? "username"];
        var _score = _entry[? "score"];
        
        var _text = string(_rank) + ". " + _username + " - " + string(_score);
        draw_text(100, _y_start + (i * _y_spacing), _text);
    }
}`}
              language="gml"
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
              <CardTitle className="text-yellow-300">GameMaker-Specific Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Async HTTP events:</strong> All network requests are async, handle in Async - HTTP event</p>
              <p>• <strong>DS maps for JSON:</strong> Use ds_map for JSON data structures, remember to destroy them</p>
              <p>• <strong>Global variables:</strong> Store auth tokens in global scope for cross-room access</p>
              <p>• <strong>Error handling:</strong> Check HTTP status codes (0 = success) before parsing responses</p>
            </CardContent>
          </Card>

          <Card className="bg-green-950/20 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-300">Performance Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• <strong>Limit API calls:</strong> Cache leaderboard data, refresh every 30-60 seconds max</p>
              <p>• <strong>Local save backup:</strong> Use ini_open() for offline fallback saves</p>
              <p>• <strong>Batch operations:</strong> Group multiple save operations into single API call</p>
              <p>• <strong>Loading states:</strong> Show "Connecting..." UI during API requests</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="space-y-6">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Package className="h-6 w-6 text-green-400" />
          Resources & Examples
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Example Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/gamemaker-starter" target="_blank" rel="noopener noreferrer">
                  GameMaker Starter Template
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/gamemaker-platformer-demo" target="_blank" rel="noopener noreferrer">
                  Platformer with Cloud Saves
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href="https://github.com/aethex-corp/gamemaker-leaderboard" target="_blank" rel="noopener noreferrer">
                  Arcade Leaderboard Demo
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-green-500/20">
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
                <a href="https://manual.yoyogames.com" target="_blank" rel="noopener noreferrer">
                  GameMaker Manual
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
      <Card className="bg-gradient-to-r from-green-950/50 to-emerald-950/50 border-green-500/30">
        <CardContent className="p-8 space-y-4">
          <h3 className="text-2xl font-semibold text-white">Ready to Build?</h3>
          <p className="text-gray-300">
            Create 2D games with GameMaker Studio 2 and AeThex. Export to all platforms with 
            cloud saves, online leaderboards, and cross-platform progression.
          </p>
          <div className="flex gap-4">
            <Button className="bg-green-600 hover:bg-green-700" asChild>
              <a href="/dev-platform/dashboard">Get API Key</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/aethex-corp/gamemaker-sdk" target="_blank">
                Download Extension
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
