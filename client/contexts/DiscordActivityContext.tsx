import React, { createContext, useContext, useEffect, useState } from "react";

interface DiscordUser {
  id: string;
  discord_id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  user_type: string | null;
  primary_arm: string | null;
}

interface DiscordActivityContextType {
  isActivity: boolean;
  isLoading: boolean;
  user: DiscordUser | null;
  error: string | null;
  discordSdk: any | null;
}

const DiscordActivityContext = createContext<DiscordActivityContextType>({
  isActivity: false,
  isLoading: false,
  user: null,
  error: null,
  discordSdk: null,
});

export const useDiscordActivity = () => {
  const context = useContext(DiscordActivityContext);
  if (!context) {
    throw new Error(
      "useDiscordActivity must be used within DiscordActivityProvider"
    );
  }
  return context;
};

interface DiscordActivityProviderProps {
  children: React.ReactNode;
}

export const DiscordActivityProvider: React.FC<DiscordActivityProviderProps> = ({
  children,
}) => {
  const [isActivity, setIsActivity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [discordSdk, setDiscordSdk] = useState<any>(null);

  useEffect(() => {
    const initializeActivity = async () => {
      // Check if we're running inside a Discord iframe
      if (window.location !== window.parent.location) {
        try {
          setIsActivity(true);
          setIsLoading(true);

          // Import the Discord SDK dynamically
          const { DiscordSDKMixin } = await import(
            "@discord/embedded-app-sdk"
          );

          const sdk = new DiscordSDKMixin({
            clientId: import.meta.env.VITE_DISCORD_CLIENT_ID || "578971245454950421",
          });

          setDiscordSdk(sdk);

          // Wait for SDK to be ready
          await sdk.ready();

          // Authorize with Discord
          const { access_token } = await sdk.commands.authorize({
            client_id: import.meta.env.VITE_DISCORD_CLIENT_ID || "578971245454950421",
            response_type: "token",
            scope: ["identify", "guilds"],
          });

          // Exchange access token for user data via our proxy
          const response = await fetch("/api/discord/activity-auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ access_token }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.error || "Failed to authenticate");
            setIsLoading(false);
            return;
          }

          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            setError(null);
          } else {
            setError("Authentication failed");
          }
        } catch (err: any) {
          console.error("Discord Activity initialization error:", err);
          setError(err?.message || "Failed to initialize Discord Activity");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Not in a Discord iframe
        setIsActivity(false);
        setIsLoading(false);
      }
    };

    initializeActivity();
  }, []);

  return (
    <DiscordActivityContext.Provider
      value={{
        isActivity,
        isLoading,
        user,
        error,
        discordSdk,
      }}
    >
      {children}
    </DiscordActivityContext.Provider>
  );
};

export default DiscordActivityContext;
