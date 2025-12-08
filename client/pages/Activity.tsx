import { useEffect, useState, useCallback } from "react";
import { useDiscordActivity } from "@/contexts/DiscordActivityContext";
import LoadingScreen from "@/components/LoadingScreen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  MessageCircle,
  Trophy,
  Zap,
  Gamepad2,
  Briefcase,
  BookOpen,
  Network,
  Sparkles,
  Shield,
  RefreshCw,
  ExternalLink,
  Flame,
  Star,
  Target,
  Gift,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const APP_URL = "https://aethex.dev";

type ArmType = "labs" | "gameforge" | "corp" | "foundation" | "devlink" | "nexus" | "staff";

const ARM_CONFIG: Record<ArmType, { label: string; icon: any; color: string; bgClass: string; borderClass: string }> = {
  labs: { label: "Labs", icon: Zap, color: "text-yellow-400", bgClass: "bg-yellow-500/20", borderClass: "border-yellow-500" },
  gameforge: { label: "GameForge", icon: Gamepad2, color: "text-green-400", bgClass: "bg-green-500/20", borderClass: "border-green-500" },
  corp: { label: "Corp", icon: Briefcase, color: "text-blue-400", bgClass: "bg-blue-500/20", borderClass: "border-blue-500" },
  foundation: { label: "Foundation", icon: BookOpen, color: "text-red-400", bgClass: "bg-red-500/20", borderClass: "border-red-500" },
  devlink: { label: "Dev-Link", icon: Network, color: "text-cyan-400", bgClass: "bg-cyan-500/20", borderClass: "border-cyan-500" },
  nexus: { label: "Nexus", icon: Sparkles, color: "text-purple-400", bgClass: "bg-purple-500/20", borderClass: "border-purple-500" },
  staff: { label: "Staff", icon: Shield, color: "text-indigo-400", bgClass: "bg-indigo-500/20", borderClass: "border-indigo-500" },
};

interface Post {
  id: string;
  title: string;
  content: string;
  arm_affiliation: ArmType;
  author_id: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  tags?: string[];
  user_profiles?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  job_type: string;
  arm_affiliation: ArmType;
  salary_min?: number;
  salary_max?: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  completed: boolean;
  progress: number;
  total: number;
  type: "daily" | "weekly";
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url?: string;
  xp: number;
  level: number;
  streak?: number;
}

function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
      <p className="text-red-400 text-sm mb-3">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
    </div>
  );
}

function FeedTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNeedsAuth(false);
    try {
      const response = await fetch("/api/feed?limit=10");
      if (response.status === 401 || response.status === 403) {
        setNeedsAuth(true);
        return;
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch posts (${response.status})`);
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err: any) {
      console.error("[Activity Feed] Error:", err);
      setError(err.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <LoadingSpinner />;
  if (needsAuth) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">Sign in on the web to view the community feed</p>
        <Button variant="outline" size="sm" onClick={() => openExternalLink(`${APP_URL}/community/feed`)}>
          Open Feed
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }
  if (error) return <ErrorMessage message={error} onRetry={fetchPosts} />;

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3 pr-2">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No posts yet. Be the first to share!</p>
            <Button variant="outline" size="sm" onClick={() => openExternalLink(`${APP_URL}/community/feed`)}>
              Go to Feed
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          posts.map((post) => {
            const config = ARM_CONFIG[post.arm_affiliation] || ARM_CONFIG.labs;
            const Icon = config.icon;
            return (
              <Card key={post.id} className={`${config.bgClass} border-l-4 ${config.borderClass} bg-gray-800/50`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {post.user_profiles?.avatar_url && (
                      <img src={post.user_profiles.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm truncate">
                          {post.user_profiles?.full_name || post.user_profiles?.username || "Anonymous"}
                        </span>
                        <Badge variant="outline" className={`text-xs ${config.color} border-current`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-1 line-clamp-1">{post.title}</h4>
                      <p className="text-gray-400 text-xs line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-gray-400">
                          <Heart className="w-3.5 h-3.5" />
                          <span className="text-xs">{post.likes_count || 0}</span>
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="text-xs">{post.comments_count || 0}</span>
                        </span>
                        <button
                          onClick={() => openExternalLink(`${APP_URL}/community/feed`)}
                          className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors ml-auto"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
        {posts.length > 0 && (
          <Button variant="outline" className="w-full mt-2" onClick={() => openExternalLink(`${APP_URL}/community/feed`)}>
            View Full Feed
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </ScrollArea>
  );
}

function RealmSwitcher({
  currentRealm,
  openExternalLink,
}: {
  currentRealm: ArmType;
  openExternalLink: (url: string) => Promise<void>;
}) {
  const realms = Object.entries(ARM_CONFIG) as [ArmType, typeof ARM_CONFIG.labs][];

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-white font-semibold mb-1">Your Realms</h2>
        <p className="text-gray-400 text-xs">Explore the different realms of AeThex</p>
      </div>
      
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
        <p className="text-purple-300 text-xs text-center">
          Your current realm: <strong>{ARM_CONFIG[currentRealm]?.label || "Labs"}</strong>
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {realms.map(([key, config]) => {
          const Icon = config.icon;
          const isActive = currentRealm === key;
          return (
            <button
              key={key}
              onClick={() => openExternalLink(`${APP_URL}/${key}`)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? `${config.bgClass} ${config.borderClass} ring-2 ring-offset-2 ring-offset-gray-900`
                  : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? config.color : "text-gray-400"}`} />
              <p className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-400"}`}>
                {config.label}
              </p>
            </button>
          );
        })}
      </div>
      
      <Button className="w-full mt-4" onClick={() => openExternalLink(`${APP_URL}/profile/settings`)}>
        Change Primary Realm
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function AchievementsTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  const achievements: Achievement[] = [
    { id: "1", name: "First Post", description: "Create your first community post", icon: "📝", xp_reward: 50, unlocked: true },
    { id: "2", name: "Social Butterfly", description: "Follow 5 different realms", icon: "🦋", xp_reward: 100, unlocked: true },
    { id: "3", name: "Realm Explorer", description: "Visit all 7 realms", icon: "🗺️", xp_reward: 150, unlocked: false, progress: 5, total: 7 },
    { id: "4", name: "Community Leader", description: "Get 100 likes on your posts", icon: "👑", xp_reward: 500, unlocked: false, progress: 42, total: 100 },
    { id: "5", name: "Mentor", description: "Complete 10 mentorship sessions", icon: "🎓", xp_reward: 300, unlocked: false, progress: 3, total: 10 },
    { id: "6", name: "Hot Streak", description: "Log in 7 days in a row", icon: "🔥", xp_reward: 200, unlocked: false, progress: 4, total: 7 },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 pr-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">{unlockedCount}/{achievements.length} Unlocked</span>
          </div>
          <span className="text-xs text-amber-400/80">Preview</span>
        </div>
        
        {achievements.slice(0, 5).map((achievement) => (
          <div key={achievement.id} className={`rounded-lg border p-3 ${achievement.unlocked ? "bg-yellow-900/20 border-yellow-500/40" : "bg-gray-900/80 border-gray-600"}`}>
            <div className="flex items-center gap-2">
              <span className={`text-lg ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>{achievement.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <h4 className={`font-medium text-sm ${achievement.unlocked ? "text-white" : "text-gray-400"}`}>{achievement.name}</h4>
                    {achievement.unlocked && <CheckCircle className="w-3 h-3 text-green-400" />}
                  </div>
                  <Badge className="shrink-0 bg-yellow-500/20 text-yellow-300 border-yellow-500/50 text-[10px] px-1.5">+{achievement.xp_reward}</Badge>
                </div>
                <p className="text-gray-500 text-xs truncate">{achievement.description}</p>
              </div>
            </div>
            {!achievement.unlocked && achievement.progress !== undefined && (
              <div className="mt-2 pl-7">
                <div className="flex items-center gap-2">
                  <Progress value={(achievement.progress / (achievement.total || 1)) * 100} className="h-2 flex-1 bg-gray-700" />
                  <span className="text-xs text-gray-400 shrink-0">{achievement.progress}/{achievement.total}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full" onClick={() => openExternalLink(`${APP_URL}/profile`)}>
          View All Achievements
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </ScrollArea>
  );
}

function LeaderboardTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, user_id: "1", username: "CodeMaster", xp: 12500, level: 25, streak: 14 },
    { rank: 2, user_id: "2", username: "DevNinja", xp: 11200, level: 23, streak: 7 },
    { rank: 3, user_id: "3", username: "BuilderX", xp: 9800, level: 21, streak: 21 },
    { rank: 4, user_id: "4", username: "CreatorPro", xp: 8500, level: 19, streak: 5 },
    { rank: 5, user_id: "5", username: "ForgeHero", xp: 7200, level: 17, streak: 3 },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: "text-yellow-400", bg: "bg-yellow-500/20", icon: "🥇" };
    if (rank === 2) return { color: "text-gray-300", bg: "bg-gray-400/20", icon: "🥈" };
    if (rank === 3) return { color: "text-orange-400", bg: "bg-orange-500/20", icon: "🥉" };
    return { color: "text-gray-400", bg: "bg-gray-700/50", icon: null };
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 pr-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-white text-sm font-medium">Top Creators This Week</span>
          </div>
          <span className="text-xs text-amber-400/80">Preview</span>
        </div>
        {leaderboard.map((entry) => {
          const badge = getRankBadge(entry.rank);
          return (
            <div key={entry.user_id} className={`flex items-center gap-3 p-3 rounded-lg ${badge.bg} border border-gray-700/50`}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${badge.bg} ${badge.color} font-bold text-sm`}>
                {badge.icon || `#${entry.rank}`}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{entry.username}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Lvl {entry.level}</span>
                  {entry.streak && entry.streak > 0 && (
                    <span className="flex items-center gap-0.5 text-orange-400">
                      <Flame className="w-3 h-3" />{entry.streak}d
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${badge.color}`}>{entry.xp.toLocaleString()}</p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
            </div>
          );
        })}
        <Button variant="outline" className="w-full mt-2" onClick={() => openExternalLink(`${APP_URL}/creators`)}>
          View All Creators
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </ScrollArea>
  );
}

function OpportunitiesTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3 pr-2">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold">Open Opportunities</span>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
          <p className="text-blue-300 text-sm mb-3">
            Browse job opportunities, contracts, and gigs from the AeThex community.
          </p>
          <Button onClick={() => openExternalLink(`${APP_URL}/opportunities`)}>
            View Opportunities
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="mt-4 space-y-2">
          <p className="text-gray-400 text-xs text-center">Quick categories:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Full-Time", icon: Briefcase },
              { label: "Contract", icon: Target },
              { label: "Freelance", icon: Star },
            ].map(({ label, icon: Icon }) => (
              <Button
                key={label}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => openExternalLink(`${APP_URL}/opportunities?type=${label.toLowerCase()}`)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

function QuestsTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  const quests: Quest[] = [
    { id: "1", title: "Share Your Work", description: "Post an update to the community feed", xp_reward: 25, completed: false, progress: 0, total: 1, type: "daily" },
    { id: "2", title: "Engage & Support", description: "Like 5 posts from other creators", xp_reward: 15, completed: false, progress: 3, total: 5, type: "daily" },
    { id: "3", title: "Realm Hopper", description: "Visit 3 different realm feeds", xp_reward: 20, completed: true, progress: 3, total: 3, type: "daily" },
    { id: "4", title: "Weekly Contributor", description: "Make 7 posts this week", xp_reward: 150, completed: false, progress: 4, total: 7, type: "weekly" },
  ];

  const dailyQuests = quests.filter((q) => q.type === "daily");
  const weeklyQuests = quests.filter((q) => q.type === "weekly");

  const QuestCard = ({ quest }: { quest: Quest }) => (
    <div className={`rounded-lg border p-3 ${quest.completed ? "bg-green-900/30 border-green-500/50" : "bg-gray-900/80 border-gray-600"}`}>
      <div className="flex items-center gap-2">
        <div className={`shrink-0 p-1.5 rounded ${quest.completed ? "bg-green-500/30" : "bg-gray-700"}`}>
          {quest.completed ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Target className="w-4 h-4 text-gray-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`font-medium text-sm truncate ${quest.completed ? "text-green-400 line-through" : "text-white"}`}>{quest.title}</h4>
            <Badge className="shrink-0 bg-yellow-500/20 text-yellow-300 border-yellow-500/50 text-[10px] px-1.5">+{quest.xp_reward} XP</Badge>
          </div>
          <p className="text-gray-500 text-xs truncate">{quest.description}</p>
        </div>
      </div>
      {!quest.completed && (
        <div className="mt-2 pl-8">
          <div className="flex items-center gap-2">
            <Progress value={(quest.progress / quest.total) * 100} className="h-2 flex-1 bg-gray-700" />
            <span className="text-xs text-gray-400 shrink-0">{quest.progress}/{quest.total}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3 pr-2">
        <div className="flex items-center gap-2 text-xs text-amber-400/80">
          <Star className="w-3 h-3" />
          <span>Preview - Quest system coming soon</span>
        </div>
        
        <div className="space-y-2">
          {dailyQuests.map((quest) => <QuestCard key={quest.id} quest={quest} />)}
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <Gift className="w-4 h-4 text-purple-400" />
          <span className="text-white text-sm font-medium">Weekly Quests</span>
        </div>
        <div className="space-y-2">
          {weeklyQuests.map((quest) => <QuestCard key={quest.id} quest={quest} />)}
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => openExternalLink(`${APP_URL}/profile`)}>
          View Your Progress
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </ScrollArea>
  );
}

export default function Activity() {
  const { isActivity, isLoading, user, error, openExternalLink } = useDiscordActivity();
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  const currentRealm: ArmType = (user?.primary_arm as ArmType) || "labs";

  useEffect(() => {
    if (isActivity && !isLoading) {
      setShowContent(true);
    }
  }, [isActivity, isLoading]);

  if (isLoading) {
    return <LoadingScreen message="Initializing Discord Activity..." showProgress={true} duration={5000} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Activity Error</h1>
          <p className="text-gray-300 mb-6 text-sm">{error}</p>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-2 text-sm">Troubleshooting:</h3>
            <ol className="text-gray-400 text-xs space-y-1 list-decimal list-inside">
              <li>Clear your browser cache</li>
              <li>Close Discord completely</li>
              <li>Reopen Discord and try again</li>
            </ol>
          </div>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isActivity && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-white mb-4">Discord Activity</h1>
          <p className="text-gray-300 mb-6">This page is designed to run as a Discord Activity. Open it within Discord to get started!</p>
          <a href="https://aethex.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline text-sm">
            Visit aethex.dev
          </a>
        </div>
      </div>
    );
  }

  if (user && showContent) {
    const realmConfig = ARM_CONFIG[currentRealm];
    const RealmIcon = realmConfig.icon;

    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-lg mx-auto">
          <div className={`${realmConfig.bgClass} border-b ${realmConfig.borderClass} px-3 py-2`}>
            <div className="flex items-center gap-2">
              {user.avatar_url && <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full ring-2 ring-white/20" />}
              <div className="flex-1 min-w-0">
                <h1 className="text-white font-semibold text-sm truncate">{user.full_name || user.username}</h1>
                <Badge variant="outline" className={`${realmConfig.color} border-current text-[10px] px-1.5 py-0`}>
                  <RealmIcon className="w-2.5 h-2.5 mr-0.5" />{realmConfig.label}
                </Badge>
              </div>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openExternalLink(`${APP_URL}/profile`)}>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-gray-800/50 border-b border-gray-700 rounded-none px-1 gap-0.5 h-8">
              <TabsTrigger value="feed" className="text-[11px] data-[state=active]:bg-gray-700 px-2 py-1 h-6">Feed</TabsTrigger>
              <TabsTrigger value="realms" className="text-[11px] data-[state=active]:bg-gray-700 px-2 py-1 h-6">Realms</TabsTrigger>
              <TabsTrigger value="achievements" className="text-[11px] data-[state=active]:bg-gray-700 px-2 py-1 h-6">Badges</TabsTrigger>
              <TabsTrigger value="leaderboard" className="text-[11px] data-[state=active]:bg-gray-700 px-2 py-1 h-6">Top</TabsTrigger>
              <TabsTrigger value="opportunities" className="text-[11px] data-[state=active]:bg-gray-700 px-2 py-1 h-6">Jobs</TabsTrigger>
              <TabsTrigger value="quests" className="text-[11px] data-[state=active]:bg-gray-700 px-2 py-1 h-6">Quests</TabsTrigger>
            </TabsList>

            <div className="p-3">
              <TabsContent value="feed" className="mt-0"><FeedTab openExternalLink={openExternalLink} /></TabsContent>
              <TabsContent value="realms" className="mt-0">
                <RealmSwitcher currentRealm={currentRealm} openExternalLink={openExternalLink} />
              </TabsContent>
              <TabsContent value="achievements" className="mt-0"><AchievementsTab openExternalLink={openExternalLink} /></TabsContent>
              <TabsContent value="leaderboard" className="mt-0"><LeaderboardTab openExternalLink={openExternalLink} /></TabsContent>
              <TabsContent value="opportunities" className="mt-0"><OpportunitiesTab openExternalLink={openExternalLink} /></TabsContent>
              <TabsContent value="quests" className="mt-0"><QuestsTab openExternalLink={openExternalLink} /></TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }

  return <LoadingScreen message="Loading your profile..." showProgress={true} duration={5000} />;
}
