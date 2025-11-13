import React, { createContext, useContext, useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

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
      if (typeof window === "undefined") {
        return; // Skip on server-side
      }

      const searchParams = new URLSearchParams(window.location.search);
      const frameId = searchParams.get("frame_id");
      const isInDiscordActivity = frameId !== null;

      console.log("[Discord Activity] Checking for Discord context...", {
        frameId,
        isInDiscordActivity,
      });

      // If we're NOT in Discord Activity, exit early - don't load Discord SDK
      if (!isInDiscordActivity) {
        console.log(
          "[Discord Activity] Not in Discord Activity - skipping SDK load",
        );
        setIsActivity(false);
        setIsLoading(false);
        return;
      }

      // Only initialize Discord SDK if we're actually in a Discord Activity
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
            const { code } = await sdk.commands.authorize({
              client_id: clientId,
              response_type: "code",
              state: "",
              scope: "identify email guilds",
              prompt: "none",
            });

            console.log(
              "[Discord Activity] Got authorization code, exchanging for token...",
            );

            // Exchange code for access token via our backend
            const tokenResponse = await fetch(`${API_BASE}/api/discord/token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code }),
            });

            if (!tokenResponse.ok) {
              const errorData = await tokenResponse.json();
              const errMsg = errorData.error || "Failed to exchange code";
              console.error(
                "[Discord Activity] Token exchange failed:",
                errMsg,
              );
              setError(errMsg);
              setIsLoading(false);
              return;
            }

            const tokenData = await tokenResponse.json();
            const access_token = tokenData.access_token;

            console.log(
              "[Discord Activity] Got access token, authenticating with SDK...",
            );

            // Authenticate with SDK using the access token
            const authResult = await sdk.commands.authenticate({
              access_token,
            });

            if (!authResult) {
              console.error("[Discord Activity] SDK authentication failed");
              setError("SDK authentication failed");
              setIsLoading(false);
              return;
            }

            console.log(
              "[Discord Activity] Authenticated with SDK, fetching user profile...",
            );
            setAuth(authResult);

            // Get user info using the access token
            const userResponse = await fetch(
              "https://discord.com/api/v10/users/@me",
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              },
            );

            if (!userResponse.ok) {
              console.error("[Discord Activity] Failed to fetch user profile");
              setError("Failed to fetch user profile");
              setIsLoading(false);
              return;
            }

            const discordUserData = await userResponse.json();
            console.log(
              "[Discord Activity] User profile fetched:",
              discordUserData.username,
            );

            // Store the user data
            const userData: DiscordUser = {
              id: discordUserData.id,
              discord_id: discordUserData.id,
              full_name:
                discordUserData.global_name || discordUserData.username,
              username: discordUserData.username,
              avatar_url: discordUserData.avatar
                ? `https://cdn.discordapp.com/avatars/${discordUserData.id}/${discordUserData.avatar}.png`
                : null,
              bio: null,
              user_type: "community_member",
              primary_arm: "labs",
            };

            setUser(userData);
            setError(null);
            console.log("[Discord Activity] User authenticated successfully");
          } else {
            // User already authenticated
            console.log("[Discord Activity] User already authenticated");
            const userData: DiscordUser = {
              id: currentUser.id,
              discord_id: currentUser.id,
              full_name: currentUser.global_name || currentUser.username,
              username: currentUser.username,
              avatar_url: currentUser.avatar
                ? `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png`
                : null,
              bio: null,
              user_type: "community_member",
              primary_arm: "labs",
            };
            setUser(userData);
            setError(null);
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
