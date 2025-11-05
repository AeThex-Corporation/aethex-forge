import { useEffect, useState } from 'react';
import { useDiscord } from '@/contexts/DiscordContext';
import LoadingScreen from '@/components/LoadingScreen';

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
        // Discord SDK should be loaded by the script in index.html
        if (!(window as any).DiscordSDK) {
          throw new Error('Discord SDK not loaded');
        }

        const discord = (window as any).DiscordSDK as DiscordSDK;
        
        // Ready the SDK
        await discord.ready();
        setSdkReady(true);

        // Subscribe to close events
        if (discord.subscribe) {
          discord.subscribe('ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE', (data: any) => {
            console.log('Discord participants updated:', data);
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Failed to initialize Discord SDK:', err);
        setError(errorMessage);
      }
    };

    if (!sdkReady) {
      initDiscordSDK();
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Discord Activity Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">
            Make sure you're running this as a Discord Activity within a Discord server.
          </p>
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
          <h1 className="text-2xl font-bold text-foreground">Welcome to AeThex</h1>
          <p className="text-muted-foreground">Discord user information unavailable</p>
        </div>
      </div>
    );
  }

  // Activity is ready and user is authenticated via Discord
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 text-sm text-muted-foreground border-b border-border/50">
        <p>👋 Welcome <strong>{discordUser.username}</strong> to AeThex Discord Activity</p>
      </div>
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">AeThex Community</h1>
          <p className="text-muted-foreground">Full platform access from Discord</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
            <a
              href="/feed"
              className="p-4 rounded-lg border border-border/50 hover:border-aethex-400/50 transition text-left"
            >
              <div className="font-semibold">Community Feed</div>
              <p className="text-sm text-muted-foreground mt-1">View posts and engage with creators</p>
            </a>
            <a
              href="/community"
              className="p-4 rounded-lg border border-border/50 hover:border-aethex-400/50 transition text-left"
            >
              <div className="font-semibold">Community Hub</div>
              <p className="text-sm text-muted-foreground mt-1">Connect with mentors and developers</p>
            </a>
            <a
              href="/dashboard"
              className="p-4 rounded-lg border border-border/50 hover:border-aethex-400/50 transition text-left"
            >
              <div className="font-semibold">Dashboard</div>
              <p className="text-sm text-muted-foreground mt-1">Manage your projects and profile</p>
            </a>
            <a
              href="/roadmap"
              className="p-4 rounded-lg border border-border/50 hover:border-aethex-400/50 transition text-left"
            >
              <div className="font-semibold">Roadmap</div>
              <p className="text-sm text-muted-foreground mt-1">Vote on upcoming features</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
