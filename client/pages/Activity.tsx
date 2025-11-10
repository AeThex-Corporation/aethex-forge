import { useEffect, useState } from "react";
import { useDiscordActivity } from "@/contexts/DiscordActivityContext";
import LoadingScreen from "@/components/LoadingScreen";

export default function Activity() {
  const { isActivity, isLoading, user, error } = useDiscordActivity();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Only show content if we're actually in a Discord Activity
    // This is a one-time check - we don't navigate away
    if (isActivity && !isLoading) {
      setShowContent(true);
    }
  }, [isActivity, isLoading]);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Initializing Discord Activity..."
        showProgress={true}
        duration={5000}
      />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            ❌ Activity Error
          </h1>
          <p className="text-gray-300 mb-8 text-sm">{error}</p>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-3">
              Troubleshooting Steps:
            </h3>
            <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
              <li>Clear your browser cache (Ctrl+Shift+Delete)</li>
              <li>Close Discord completely</li>
              <li>Reopen Discord</li>
              <li>Try opening the Activity again</li>
            </ol>
          </div>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3 mb-6">
            <p className="text-blue-300 text-xs">
              💡 Open browser console (F12) and look for messages starting with{" "}
              <code className="bg-blue-950 px-1 rounded">
                [Discord Activity]
              </code>
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            Retry
          </button>

          <p className="text-gray-500 text-xs mt-4">
            Still having issues? Check the{" "}
            <a
              href="/docs/troubleshooting"
              className="text-blue-400 hover:text-blue-300"
            >
              troubleshooting guide
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Not in Discord Activity - show informational message
  if (!isActivity && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">
            🎮 Discord Activity
          </h1>
          <p className="text-gray-300 mb-8">
            This page is designed to run as a Discord Activity. Open it within
            Discord to get started!
          </p>
          <p className="text-gray-500 text-sm">
            Not in Discord? Visit the main app at{" "}
            <a
              href="https://aethex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              aethex.dev
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingScreen
        message="Initializing Discord Activity..."
        showProgress={true}
        duration={5000}
      />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            ❌ Activity Error
          </h1>
          <p className="text-gray-300 mb-8 text-sm">{error}</p>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-3">
              Troubleshooting Steps:
            </h3>
            <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
              <li>Clear your browser cache (Ctrl+Shift+Delete)</li>
              <li>Close Discord completely</li>
              <li>Reopen Discord</li>
              <li>Try opening the Activity again</li>
            </ol>
          </div>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3 mb-6">
            <p className="text-blue-300 text-xs">
              💡 Open Discord DevTools (Ctrl+Shift+I) and check the console for
              messages starting with{" "}
              <code className="bg-blue-950 px-1 rounded">
                [Discord Activity]
              </code>
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (user && showContent) {
    const appBaseUrl = "https://aethex.dev";

    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Welcome to AeThex, {user.full_name || user.username}! 🎉
            </h1>
            <p className="text-gray-400 mt-2">Discord Activity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">
                👤 Your Profile
              </h2>
              {user.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || user.username}
                  className="w-16 h-16 rounded-full mb-4"
                />
              )}
              <p className="text-gray-300">
                <strong>Name:</strong> {user.full_name || "Not set"}
              </p>
              <p className="text-gray-300">
                <strong>Username:</strong> {user.username || "Not set"}
              </p>
              <p className="text-gray-300">
                <strong>Type:</strong> {user.user_type || "community_member"}
              </p>
              {user.bio && (
                <p className="text-gray-400 mt-2 italic">"{user.bio}"</p>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">
                ⚔️ Your Realm
              </h2>
              <p className="text-2xl font-bold text-purple-400 mb-4">
                {user.primary_arm?.toUpperCase() || "LABS"}
              </p>
              <p className="text-gray-400">
                Your primary realm determines your Discord role and access to
                realm-specific features.
              </p>
              <button
                onClick={() =>
                  window.open(`${appBaseUrl}/profile/settings`, "_blank")
                }
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Change Realm
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              🚀 Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => window.open(`${appBaseUrl}/creators`, "_blank")}
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-center transition-colors font-medium"
              >
                🎨 Browse Creators
              </button>
              <button
                onClick={() =>
                  window.open(`${appBaseUrl}/opportunities`, "_blank")
                }
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-center transition-colors font-medium"
              >
                💼 Find Opportunities
              </button>
              <button
                onClick={() =>
                  window.open(`${appBaseUrl}/profile/settings`, "_blank")
                }
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-center transition-colors font-medium"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <p className="text-blue-100 text-sm">
              💡 <strong>Discord Commands:</strong> Use{" "}
              <code className="bg-blue-950 px-2 py-1 rounded text-xs">
                /profile
              </code>
              ,{" "}
              <code className="bg-blue-950 px-2 py-1 rounded text-xs">
                /set-realm
              </code>
              , and{" "}
              <code className="bg-blue-950 px-2 py-1 rounded text-xs">
                /verify-role
              </code>{" "}
              to manage your account directly in Discord.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Still loading
  return (
    <LoadingScreen
      message="Loading your profile..."
      showProgress={true}
      duration={5000}
    />
  );
}
