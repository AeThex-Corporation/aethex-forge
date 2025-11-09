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
      "useDiscordActivity must be used within DiscordActivityProvider",
    );
  }
  return context;
};

interface DiscordActivityProviderProps {
  children: React.ReactNode;
}

export const DiscordActivityProvider: React.FC<
  DiscordActivityProviderProps
> = ({ children }) => {
  const [isActivity, setIsActivity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [discordSdk, setDiscordSdk] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    const initializeActivity = async () => {
      // Check if we're running inside a Discord Activity
      // Discord passes frame_id as a query parameter when launching an Activity
      const searchParams = new URLSearchParams(window.location.search);
      const frameId = searchParams.get("frame_id");
      const isInDiscordActivity = frameId !== null;

      console.log("[Discord Activity] Initialization starting...", {
        frameId,
        isInDiscordActivity,
        userAgent: navigator.userAgent,
        href: window.location.href,
      });

      if (isInDiscordActivity) {
        try {
          setIsActivity(true);
          setIsLoading(true);

          // Import the Discord SDK dynamically
          const { DiscordSDK } = await import("@discord/embedded-app-sdk");

          const clientId =
            import.meta.env.VITE_DISCORD_CLIENT_ID || "578971245454950421";

          console.log(
            "[Discord Activity] Creating SDK with clientId:",
            clientId,
          );

          const sdk = new DiscordSDK({
            clientId,
          });

          setDiscordSdk(sdk);

          // Wait for SDK to be ready
          console.log("[Discord Activity] Waiting for SDK to be ready...");
          await sdk.ready();
          console.log("[Discord Activity] SDK is ready");

          // Authenticate the session with Discord
          console.log("[Discord Activity] Authenticating session...");
          await sdk.authenticate();
          console.log("[Discord Activity] Session authenticated");

          // Get the current user from the SDK
          const currentUser = await sdk.user.getUser();
          console.log(
            "[Discord Activity] Current user:",
            currentUser ? "exists" : "null",
          );

          if (!currentUser) {
            // User not authenticated, authorize them
            console.log("[Discord Activity] Authorizing user...");
            const { access_token } = await sdk.commands.authorize({
              scopes: ["identify", "guilds"],
            });

            console.log(
              "[Discord Activity] Got access token, calling activity-auth...",
            );
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
              const errMsg = errorData.error || "Failed to authenticate";
              console.error("[Discord Activity] Auth failed:", errMsg);
              setError(errMsg);
              setIsLoading(false);
              return;
            }

            const data = await response.json();
            if (data.success && data.user) {
              console.log("[Discord Activity] User authenticated successfully");
              setUser(data.user);
              setError(null);
            } else {
              console.error(
                "[Discord Activity] Authentication response invalid:",
                data,
              );
              setError("Authentication failed");
            }
          } else {
            // User already authenticated, just fetch via our proxy
            console.log(
              "[Discord Activity] User already authenticated, fetching user data...",
            );
            const response = await fetch("/api/discord/activity-auth", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token: currentUser.access_token || "",
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              const errMsg = errorData.error || "Failed to fetch user data";
              console.error("[Discord Activity] Fetch failed:", errMsg);
              setError(errMsg);
              setIsLoading(false);
              return;
            }

            const data = await response.json();
            if (data.success && data.user) {
              console.log("[Discord Activity] User data loaded successfully");
              setUser(data.user);
              setError(null);
            } else {
              console.error(
                "[Discord Activity] User data response invalid:",
                data,
              );
              setError("Failed to load user data");
            }
          }
        } catch (err: any) {
          console.error("Discord Activity initialization error:", err);
          console.error("Error details:", {
            message: err?.message,
            code: err?.code,
            stack: err?.stack,
          });
          setError(
            `${err?.message || "Failed to initialize Discord Activity"}. Check browser console for details.`,
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        // Not in a Discord iframe
        console.log(
          "[Discord Activity] Not in Discord Activity context (no frame_id)",
        );
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
