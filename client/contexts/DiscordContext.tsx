import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { DiscordUser } from '@/lib/discord-types';

interface DiscordContextType {
  isDiscordActivity: boolean;
  discordUser: DiscordUser | null;
  isLoading: boolean;
  error: string | null;
  initiateDiscordOAuth: () => Promise<void>;
}

const DiscordContext = createContext<DiscordContextType | undefined>(undefined);

export function DiscordProvider({ children }: { children: React.ReactNode }) {
  const [isDiscordActivity, setIsDiscordActivity] = useState(false);
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Discord SDK and check if running as Activity
  useEffect(() => {
    const initializeDiscord = async () => {
      try {
        // Check if Discord SDK is available
        if (typeof window !== 'undefined' && (window as any).DiscordSDK) {
          const discord = (window as any).DiscordSDK;
          
          // Initialize the Discord SDK
          await discord.ready();
          setIsDiscordActivity(true);

          // Get current user from Discord
          const user = await discord.user.getMe();
          if (user) {
            setDiscordUser({
              id: user.id,
              username: user.username,
              avatar: user.avatar,
              email: user.email,
              discriminator: user.discriminator,
            });
          }
        }
      } catch (err) {
        console.warn('Discord SDK not available or not in Discord Activity context:', err);
        setIsDiscordActivity(false);
      }
    };

    initializeDiscord();
  }, []);

  const initiateDiscordOAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID || '578971245454950421';
      const redirectUri = encodeURIComponent(`${window.location.origin}/discord/callback`);
      const scope = encodeURIComponent('identify email');
      
      const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
      
      if (isDiscordActivity && (window as any).DiscordSDK) {
        // In Discord Activity, use the SDK's OAuth flow
        await (window as any).DiscordSDK.commands.authorize({
          client_id: clientId,
          response_type: 'code',
          scope: ['identify', 'email'],
        });
      } else {
        // Fallback to standard OAuth flow
        window.location.href = oauthUrl;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Discord OAuth error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isDiscordActivity]);

  return (
    <DiscordContext.Provider
      value={{
        isDiscordActivity,
        discordUser,
        isLoading,
        error,
        initiateDiscordOAuth,
      }}
    >
      {children}
    </DiscordContext.Provider>
  );
}

export function useDiscord() {
  const context = useContext(DiscordContext);
  if (context === undefined) {
    throw new Error('useDiscord must be used within a DiscordProvider');
  }
  return context;
}
