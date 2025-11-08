import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDiscordActivity } from "@/contexts/DiscordActivityContext";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./Dashboard";

export default function Activity() {
  const navigate = useNavigate();
  const { isActivity, isLoading, user, error } = useDiscordActivity();
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (!isActivity && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [isActivity, isLoading, navigate]);

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
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            ❌ Activity Error
          </h1>
          <p className="text-gray-300 mb-8">{error}</p>
          <p className="text-gray-400 text-sm">
            Please try opening the Activity again in Discord.
          </p>
        </div>
      </div>
    );
  }

  if (!isActivity) {
    return null;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
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
              <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Change Realm
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              🚀 Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/creators"
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-center transition-colors"
              >
                🎨 Browse Creators
              </a>
              <a
                href="/opportunities"
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-center transition-colors"
              >
                💼 Find Opportunities
              </a>
              <a
                href="/profile/settings"
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-center transition-colors"
              >
                ⚙️ Settings
              </a>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-900 border border-blue-700 rounded-lg">
            <p className="text-blue-100">
              💡 <strong>Tip:</strong> Use Discord commands like{" "}
              <code className="bg-blue-800 px-2 py-1 rounded">/profile</code>,{" "}
              <code className="bg-blue-800 px-2 py-1 rounded">/set-realm</code>,
              and{" "}
              <code className="bg-blue-800 px-2 py-1 rounded">/verify-role</code>{" "}
              to manage your account within Discord.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadingScreen
      message="Loading your profile..."
      showProgress={true}
      duration={5000}
    />
  );
}
