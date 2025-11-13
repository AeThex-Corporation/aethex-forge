const API_BASE = import.meta.env.VITE_API_BASE || "";

export interface BotHealthStatus {
  status: "online" | "offline";
  guilds: number;
  commands: number;
  uptime: number;
  timestamp: string;
  error?: string;
}

export async function checkBotHealth(): Promise<BotHealthStatus> {
  try {
    const response = await fetch(`${API_BASE}/api/discord/bot-health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        status: "offline",
        guilds: 0,
        commands: 0,
        uptime: 0,
        timestamp: new Date().toISOString(),
        error: `HTTP ${response.status}: Failed to reach bot`,
      };
    }

    const data = await response.json();
    return {
      status: data.status || "online",
      guilds: data.guilds || 0,
      commands: data.commands || 0,
      uptime: data.uptime || 0,
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    console.error("[Discord Bot Status] Error checking health:", error);
    return {
      status: "offline",
      guilds: 0,
      commands: 0,
      uptime: 0,
      timestamp: new Date().toISOString(),
      error:
        error instanceof Error
          ? error.message
          : "Failed to reach bot health endpoint",
    };
  }
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.length > 0 ? parts.join(" ") : "< 1m";
}
