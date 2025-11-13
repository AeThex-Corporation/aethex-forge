import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  checkBotHealth,
  formatUptime,
  type BotHealthStatus,
} from "../../lib/discord-bot-status";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";

interface RoleMapping {
  id: string;
  arm: string;
  user_type?: string;
  discord_role: string;
  server_id?: string;
  created_at: string;
}

const ARMS = [
  { value: "labs", label: "Labs", color: "bg-yellow-500/20" },
  { value: "gameforge", label: "GameForge", color: "bg-green-500/20" },
  { value: "corp", label: "Corp", color: "bg-blue-500/20" },
  { value: "foundation", label: "Foundation", color: "bg-red-500/20" },
  { value: "devlink", label: "Dev-Link", color: "bg-cyan-500/20" },
];

export function AdminDiscordManagement() {
  const [mappings, setMappings] = useState<RoleMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMapping, setNewMapping] = useState({
    arm: "labs",
    discord_role_name: "",
    server_id: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRegisteringCommands, setIsRegisteringCommands] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [botHealth, setBotHealth] = useState<BotHealthStatus | null>(null);
  const [botHealthLoading, setBotHealthLoading] = useState(false);

  useEffect(() => {
    fetchMappings();
    checkBotHealthStatus();

    // Refresh bot health every 30 seconds
    const interval = setInterval(checkBotHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkBotHealthStatus = async () => {
    setBotHealthLoading(true);
    try {
      const health = await checkBotHealth();
      setBotHealth(health);
    } catch (err) {
      console.error("Error checking bot health:", err);
    } finally {
      setBotHealthLoading(false);
    }
  };

  const fetchMappings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/discord/role-mappings`);

      // Read body only once
      let data: any;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(
          "API returned non-JSON response (likely a deployment error)",
        );
      }

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch mappings");
      }

      setMappings(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to load role mappings";
      console.error("Error fetching mappings:", err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMapping.discord_role_name) {
      setError("Discord role name is required");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/discord/role-mappings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMapping),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create mapping");
      }

      setMappings([...mappings, data]);
      setNewMapping({ arm: "labs", discord_role_name: "", server_id: "" });
      setSuccess("Role mapping created successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create role mapping";
      console.error("Error creating mapping:", err);
      setError(errorMsg);
    }
  };

  const handleDeleteMapping = async (id: string) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/discord/role-mappings?id=${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete mapping");
      setMappings(mappings.filter((m) => m.id !== id));
      setSuccess("Role mapping deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting mapping:", err);
      setError("Failed to delete role mapping");
    } finally {
      setDeleteId(null);
    }
  };

  const getArmLabel = (armValue: string) => {
    return ARMS.find((a) => a.value === armValue)?.label || armValue;
  };

  const handleRegisterCommands = async () => {
    try {
      setIsRegisteringCommands(true);
      setRegisterError(null);
      setRegisterSuccess(null);

      const adminToken = prompt(
        "Enter admin registration token (from environment variables):",
      );
      if (!adminToken) {
        setRegisterError("Registration cancelled");
        return;
      }

      console.log("[Discord] Registering commands with token...");

      const response = await fetch(
        `${API_BASE}/api/discord/admin-register-commands`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      console.log("[Discord] Response status:", response.status);

      // Read body only once
      const data = await response.json().catch(() => ({}));

      console.log("[Discord] Response data:", data);

      if (!response.ok) {
        const errorMsg = data?.discordError
          ? `Discord API error: ${JSON.stringify(data.discordError)}`
          : data?.error ||
            `Server error (${response.status}): Failed to register commands`;
        throw new Error(errorMsg);
      }

      setRegisterSuccess(
        data.message || "Discord commands registered successfully!",
      );
      setTimeout(() => setRegisterSuccess(null), 5000);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to register commands";
      console.error("Error registering commands:", err);
      setRegisterError(errorMsg);
    } finally {
      setIsRegisteringCommands(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Command Registration */}
      <Card className="border-blue-500/30 bg-blue-950/20">
        <CardHeader>
          <CardTitle>Discord Commands</CardTitle>
          <CardDescription>Register or update slash commands</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {registerError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm">
              ❌ {registerError}
            </div>
          )}
          {registerSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-sm">
              ✅ {registerSuccess}
            </div>
          )}
          <p className="text-sm text-gray-400">
            Register Discord slash commands: /verify, /set-realm, /profile,
            /unlink, /verify-role
          </p>
          <Button
            onClick={handleRegisterCommands}
            disabled={isRegisteringCommands}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isRegisteringCommands ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Commands"
            )}
          </Button>
          <p className="text-xs text-gray-500">
            You'll be prompted to enter your admin registration token. This is a
            one-time setup.
          </p>
        </CardContent>
      </Card>

      {/* Bot Status */}
      <Card className="border-purple-500/30 bg-purple-950/20">
        <CardHeader>
          <CardTitle>Discord Bot Status</CardTitle>
          <CardDescription>Real-time bot configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              onClick={checkBotHealthStatus}
              disabled={botHealthLoading}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {botHealthLoading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Now"
              )}
            </Button>
            {botHealth?.timestamp && (
              <p className="text-xs text-gray-400 self-center">
                Last check: {new Date(botHealth.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>

          {botHealth?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm mb-4">
              ⚠️ {botHealth.error}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`bg-gradient-to-br p-4 rounded-lg border ${
                botHealth?.status === "online"
                  ? "from-green-500/10 to-green-600/5 border-green-500/20"
                  : "from-red-500/10 to-red-600/5 border-red-500/20"
              }`}
            >
              <p className="text-sm text-gray-300">Bot Status</p>
              <p
                className={`text-lg font-bold mt-1 ${
                  botHealth?.status === "online"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {botHealth
                  ? botHealth.status === "online"
                    ? "🟢 Online"
                    : "🔴 Offline"
                  : "..."}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-4 rounded-lg border border-blue-500/20">
              <p className="text-sm text-blue-300">Guilds</p>
              <p className="text-lg font-bold text-blue-400 mt-1">
                {botHealth?.guilds ?? "—"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-4 rounded-lg border border-purple-500/20">
              <p className="text-sm text-purple-300">Commands</p>
              <p className="text-lg font-bold text-purple-400 mt-1">
                {botHealth?.commands ?? "—"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 p-4 rounded-lg border border-pink-500/20">
              <p className="text-sm text-pink-300">Uptime</p>
              <p className="text-lg font-bold text-pink-400 mt-1">
                {botHealth ? formatUptime(botHealth.uptime) : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Mappings */}
      <Card className="border-purple-500/30 bg-purple-950/20">
        <CardHeader>
          <CardTitle>Discord Role Mappings</CardTitle>
          <CardDescription>
            Configure which Discord roles are assigned for each arm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-sm">
              {success}
            </div>
          )}

          {/* Add New Mapping Form */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/20">
            <h4 className="font-semibold mb-4">Add New Role Mapping</h4>
            <form onSubmit={handleCreateMapping} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-gray-300">Arm</label>
                  <select
                    value={newMapping.arm}
                    onChange={(e) =>
                      setNewMapping({ ...newMapping, arm: e.target.value })
                    }
                    className="w-full mt-1 bg-gray-800 border border-purple-500/30 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    {ARMS.map((arm) => (
                      <option key={arm.value} value={arm.value}>
                        {arm.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-300">
                    Discord Role Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Labs Member"
                    value={newMapping.discord_role_name}
                    onChange={(e) =>
                      setNewMapping({
                        ...newMapping,
                        discord_role_name: e.target.value,
                      })
                    }
                    className="w-full mt-1 bg-gray-800 border border-purple-500/30 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">
                    Server ID (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Discord Server ID"
                    value={newMapping.server_id}
                    onChange={(e) =>
                      setNewMapping({
                        ...newMapping,
                        server_id: e.target.value,
                      })
                    }
                    className="w-full mt-1 bg-gray-800 border border-purple-500/30 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Add Mapping
              </Button>
            </form>
          </div>

          {/* Mappings Table */}
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Loading mappings...
            </div>
          ) : mappings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No role mappings configured yet. Add one above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-purple-500/30">
                  <tr>
                    <th className="text-left py-2 px-3 text-purple-300">Arm</th>
                    <th className="text-left py-2 px-3 text-purple-300">
                      Discord Role
                    </th>
                    <th className="text-left py-2 px-3 text-purple-300">
                      Server ID
                    </th>
                    <th className="text-left py-2 px-3 text-purple-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((mapping) => (
                    <tr
                      key={mapping.id}
                      className="border-b border-purple-500/10 hover:bg-purple-500/5"
                    >
                      <td className="py-3 px-3">
                        <Badge variant="outline">
                          {getArmLabel(mapping.arm)}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-gray-300">
                        {mapping.discord_role_name || mapping.discord_role}
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-xs">
                        {mapping.server_id || "Global"}
                      </td>
                      <td className="py-3 px-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => setDeleteId(mapping.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role Mapping?</AlertDialogTitle>
            <AlertDialogDescription>
              This role mapping will be permanently deleted. Users will no
              longer receive this role when setting this arm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteId && handleDeleteMapping(deleteId)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
