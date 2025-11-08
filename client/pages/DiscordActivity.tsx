import { useEffect, useState } from "react";
import { useDiscord } from "@/contexts/DiscordContext";
import LoadingScreen from "@/components/LoadingScreen";

interface DiscordSDK {
  ready: () => Promise<void>;
  user: {
    getMe: () => Promise<any>;
  };
  commands: {
    authorize: (options: any) => Promise<any>;
  };
}

export default function DiscordActivity() {
  const { isDiscordActivity, discordUser } = useDiscord();
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDiscordSDK = async () => {
      try {
        // Load Discord SDK on demand
        const loadDiscordSDK = (window as any).loadDiscordSDK;
        if (loadDiscordSDK) {
          await loadDiscordSDK();
        }

        // Discord SDK should now be loaded
        if (!(window as any).DiscordSDK) {
          throw new Error("Discord SDK not loaded");
        }

        const discord = (window as any).DiscordSDK as DiscordSDK;

        // Ready the SDK
        await discord.ready();
        setSdkReady(true);

        // Subscribe to close events
        if (discord.subscribe) {
          discord.subscribe(
            "ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE",
            (data: any) => {
              console.log("Discord participants updated:", data);
            },
          );
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Failed to initialize Discord SDK:", err);
        setError(errorMessage);
      }
    };

    if (!sdkReady) {
      initDiscordSDK();
    }
  }, []);

  if (error) {
    const isCloudflareError =
      error.includes("Direct IP access") || error.includes("Error 1003");
    const isSDKError = error.includes("Discord SDK");

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-red-400">
              Connection Error
            </h1>
            <p className="text-sm text-muted-foreground">
              Unable to initialize Discord Activity
            </p>
          </div>

          <div className="bg-red-950/40 border border-red-400/30 rounded-lg p-4 space-y-3">
            <p className="text-sm font-mono text-red-300">{error}</p>

            {isCloudflareError && (
              <div className="space-y-2 pt-2 border-t border-red-400/30">
                <p className="text-xs text-red-200 font-semibold">
                  🌐 Cloudflare Blocking Access
                </p>
                <p className="text-xs text-red-200/80">
                  This error occurs when accessing AeThex via an IP address.
                  Please access through the proper domain:
                </p>
                <code className="block text-xs bg-black/50 p-2 rounded text-yellow-300 break-all">
                  https://aethex.dev/discord
                </code>
              </div>
            )}

            {isSDKError && (
              <div className="space-y-2 pt-2 border-t border-red-400/30">
                <p className="text-xs text-red-200 font-semibold">
                  🎮 Discord SDK Issue
                </p>
                <p className="text-xs text-red-200/80">
                  Make sure you're opening this as a Discord Activity within a
                  Discord server, not as a standalone website.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Troubleshooting steps:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 text-left list-disc list-inside">
              <li>
                Access via domain:{" "}
                <span className="text-aethex-300">aethex.dev/discord</span>
              </li>
              <li>Open in Discord Activity, not as regular website</li>
              <li>Ensure Discord server has AeThex Activity installed</li>
              <li>Try refreshing the Discord window</li>
            </ul>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-aethex-500 text-white rounded-lg text-sm font-medium hover:bg-aethex-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isDiscordActivity || !sdkReady) {
    return (
      <LoadingScreen
        message="Initializing Discord Activity..."
        showProgress
        duration={1000}
      />
    );
  }

  if (!discordUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to AeThex
          </h1>
          <p className="text-muted-foreground">
            Discord user information unavailable
          </p>
        </div>
      </div>
    );
  }

  // Activity is ready and user is authenticated via Discord
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 text-sm text-muted-foreground border-b border-border/50">
        <p>
          👋 Welcome <strong>{discordUser.username}</strong> to AeThex Discord
          Activity
        </p>
      </div>
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            AeThex Community
          </h1>
          <p className="text-muted-foreground">
            Full platform access from Discord
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
            <a
              href="/feed"
              className="p-4 rounded-lg border border-border/50 hover:border-aethex-400/50 transition text-left"
            >
              <div className="font-semibold">Community Feed</div>
              <p className="text-sm text-muted-foreground mt-1">
                View posts and engage with creators
              </p>
            </a>
            <a
              href="/community"
              className="p-4 rounded-lg border border-border/50 hover:border-aethex-400/50 transition text-left"
            >
              <div className="font-semibold">Community Hub</div>
              <p className="text-sm text-muted-foreground mt-1">
                Connect with mentors and developers
              </p>
            </a>
            <a
              href="/dashboard"
              className="p-4 rounded-lg border border-border/50 hover:border-aethex-400/50 transition text-left"
            >
              <div className="font-semibold">Dashboard</div>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your projects and profile
              </p>
            </a>
            <a
              href="/roadmap"
              className="p-4 rounded-lg border border-border/50 hover:border-aethex-400/50 transition text-left"
            >
              <div className="font-semibold">Roadmap</div>
              <p className="text-sm text-muted-foreground mt-1">
                Vote on upcoming features
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
