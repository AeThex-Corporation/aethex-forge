import { useEffect, useState, useCallback } from "react";
import { useDiscordActivity } from "@/contexts/DiscordActivityContext";
import LoadingScreen from "@/components/LoadingScreen";
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
  ChevronRight,
} from "lucide-react";

const APP_URL = "https://aethex.dev";

type ArmType = "labs" | "gameforge" | "corp" | "foundation" | "devlink" | "nexus" | "staff";

const ARM_CONFIG: Record<ArmType, { label: string; icon: any; color: string; accent: string }> = {
  labs: { label: "Labs", icon: Zap, color: "#facc15", accent: "bg-yellow-500" },
  gameforge: { label: "GameForge", icon: Gamepad2, color: "#4ade80", accent: "bg-green-500" },
  corp: { label: "Corp", icon: Briefcase, color: "#60a5fa", accent: "bg-blue-500" },
  foundation: { label: "Foundation", icon: BookOpen, color: "#f87171", accent: "bg-red-500" },
  devlink: { label: "Dev-Link", icon: Network, color: "#22d3ee", accent: "bg-cyan-500" },
  nexus: { label: "Nexus", icon: Sparkles, color: "#c084fc", accent: "bg-purple-500" },
  staff: { label: "Staff", icon: Shield, color: "#818cf8", accent: "bg-indigo-500" },
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
  user_profiles?: { id: string; username?: string; full_name?: string; avatar_url?: string };
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
  xp: number;
  level: number;
  streak?: number;
}

function FeedTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/feed?limit=8");
      if (!response.ok) throw new Error("Failed to load");
      const data = await response.json();
      setPosts(data.data || []);
    } catch {
      setError("Couldn't load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-[#b5bac1]" /></div>;
  if (error) return (
    <div className="text-center py-6">
      <p className="text-[#b5bac1] text-sm mb-3">{error}</p>
      <button onClick={fetchPosts} className="text-[#00a8fc] text-sm hover:underline">Try again</button>
    </div>
  );

  return (
    <div className="space-y-2">
      {posts.length === 0 ? (
        <button onClick={() => openExternalLink(`${APP_URL}/community/feed`)} className="w-full p-4 rounded-lg bg-[#232428] hover:bg-[#2b2d31] transition-colors text-left">
          <p className="text-[#b5bac1] text-sm">No posts yet</p>
          <p className="text-[#00a8fc] text-xs mt-1">Open Feed →</p>
        </button>
      ) : (
        posts.map((post) => {
          const config = ARM_CONFIG[post.arm_affiliation] || ARM_CONFIG.labs;
          return (
            <button key={post.id} onClick={() => openExternalLink(`${APP_URL}/community/feed/${post.id}`)} className="w-full p-3 rounded-lg bg-[#232428] hover:bg-[#2b2d31] transition-colors text-left border-l-2" style={{ borderColor: config.color }}>
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{post.title}</p>
                  <p className="text-[#949ba4] text-xs truncate mt-0.5">{post.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-[#949ba4] text-xs">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes_count}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comments_count}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#4e5058] shrink-0 mt-1" />
              </div>
            </button>
          );
        })
      )}
      <button onClick={() => openExternalLink(`${APP_URL}/community/feed`)} className="w-full py-2 text-[#00a8fc] text-sm hover:underline">
        View all posts →
      </button>
    </div>
  );
}

function RealmsTab({ currentRealm, openExternalLink }: { currentRealm: ArmType; openExternalLink: (url: string) => Promise<void> }) {
  const realms = Object.entries(ARM_CONFIG) as [ArmType, typeof ARM_CONFIG[ArmType]][];
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {realms.map(([key, config]) => {
          const Icon = config.icon;
          const isActive = currentRealm === key;
          return (
            <button key={key} onClick={() => openExternalLink(`${APP_URL}/${key}`)} className={`p-3 rounded-lg transition-all flex items-center gap-2 ${isActive ? "bg-[#404249] ring-1 ring-[#5865f2]" : "bg-[#232428] hover:bg-[#2b2d31]"}`}>
              <Icon className="w-5 h-5" style={{ color: config.color }} />
              <span className={`text-sm ${isActive ? "text-white font-medium" : "text-[#b5bac1]"}`}>{config.label}</span>
            </button>
          );
        })}
      </div>
      <button onClick={() => openExternalLink(`${APP_URL}/profile/settings`)} className="w-full py-2 text-[#00a8fc] text-sm hover:underline">
        Change primary realm →
      </button>
    </div>
  );
}

function BadgesTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  const achievements: Achievement[] = [
    { id: "1", name: "First Post", description: "Create your first post", icon: "📝", xp_reward: 50, unlocked: true },
    { id: "2", name: "Social Butterfly", description: "Follow 5 realms", icon: "🦋", xp_reward: 100, unlocked: true },
    { id: "3", name: "Realm Explorer", description: "Visit all 7 realms", icon: "🗺️", xp_reward: 150, unlocked: false, progress: 5, total: 7 },
    { id: "4", name: "Community Leader", description: "Get 100 likes", icon: "👑", xp_reward: 500, unlocked: false, progress: 42, total: 100 },
  ];

  return (
    <div className="space-y-2">
      {achievements.map((a) => (
        <div key={a.id} className={`p-3 rounded-lg flex items-center gap-3 ${a.unlocked ? "bg-[#2d4f2d]" : "bg-[#232428]"}`}>
          <span className={`text-xl ${a.unlocked ? "" : "grayscale opacity-50"}`}>{a.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${a.unlocked ? "text-[#57f287]" : "text-[#b5bac1]"}`}>{a.name}</span>
              <span className="text-xs text-[#faa61a]">+{a.xp_reward} XP</span>
            </div>
            <p className="text-[#949ba4] text-xs">{a.description}</p>
            {!a.unlocked && a.progress !== undefined && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#1e1f22] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5865f2] rounded-full" style={{ width: `${(a.progress / (a.total || 1)) * 100}%` }} />
                </div>
                <span className="text-[10px] text-[#949ba4]">{a.progress}/{a.total}</span>
              </div>
            )}
          </div>
          {a.unlocked && <CheckCircle className="w-4 h-4 text-[#57f287] shrink-0" />}
        </div>
      ))}
      <button onClick={() => openExternalLink(`${APP_URL}/profile`)} className="w-full py-2 text-[#00a8fc] text-sm hover:underline">
        View all badges →
      </button>
    </div>
  );
}

function TopTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, user_id: "1", username: "CodeMaster", xp: 12500, level: 25, streak: 14 },
    { rank: 2, user_id: "2", username: "DevNinja", xp: 11200, level: 23, streak: 7 },
    { rank: 3, user_id: "3", username: "BuilderX", xp: 9800, level: 21, streak: 21 },
    { rank: 4, user_id: "4", username: "CreatorPro", xp: 8500, level: 19, streak: 5 },
    { rank: 5, user_id: "5", username: "ForgeHero", xp: 7200, level: 17, streak: 3 },
  ];

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-2">
      {leaderboard.map((entry) => (
        <div key={entry.user_id} className={`p-3 rounded-lg flex items-center gap-3 ${entry.rank <= 3 ? "bg-[#232428]" : "bg-[#1e1f22]"}`}>
          <span className="w-6 text-center text-lg">{medals[entry.rank - 1] || `#${entry.rank}`}</span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{entry.username}</p>
            <p className="text-[#949ba4] text-xs">Lvl {entry.level} · {entry.xp.toLocaleString()} XP</p>
          </div>
          {entry.streak && entry.streak > 0 && (
            <span className="flex items-center gap-1 text-[#ed4245] text-xs"><Flame className="w-3 h-3" />{entry.streak}d</span>
          )}
        </div>
      ))}
      <button onClick={() => openExternalLink(`${APP_URL}/leaderboard`)} className="w-full py-2 text-[#00a8fc] text-sm hover:underline">
        Full leaderboard →
      </button>
    </div>
  );
}

function JobsTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  const categories = [
    { label: "Full-Time", icon: Briefcase },
    { label: "Contract", icon: Target },
    { label: "Freelance", icon: Star },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[#b5bac1] text-sm">Browse opportunities from the AeThex community.</p>
      <div className="grid grid-cols-3 gap-2">
        {categories.map(({ label, icon: Icon }) => (
          <button key={label} onClick={() => openExternalLink(`${APP_URL}/opportunities?type=${label.toLowerCase()}`)} className="p-3 rounded-lg bg-[#232428] hover:bg-[#2b2d31] transition-colors flex flex-col items-center gap-2">
            <Icon className="w-5 h-5 text-[#5865f2]" />
            <span className="text-[#b5bac1] text-xs">{label}</span>
          </button>
        ))}
      </div>
      <button onClick={() => openExternalLink(`${APP_URL}/opportunities`)} className="w-full py-3 rounded-lg bg-[#5865f2] hover:bg-[#4752c4] transition-colors text-white text-sm font-medium">
        Browse All Jobs
      </button>
    </div>
  );
}

function QuestsTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  const quests: Quest[] = [
    { id: "1", title: "Share Your Work", description: "Post an update", xp_reward: 25, completed: false, progress: 0, total: 1, type: "daily" },
    { id: "2", title: "Engage & Support", description: "Like 5 posts", xp_reward: 15, completed: false, progress: 3, total: 5, type: "daily" },
    { id: "3", title: "Realm Hopper", description: "Visit 3 realms", xp_reward: 20, completed: true, progress: 3, total: 3, type: "daily" },
    { id: "4", title: "Weekly Contributor", description: "Make 7 posts", xp_reward: 150, completed: false, progress: 4, total: 7, type: "weekly" },
  ];

  return (
    <div className="space-y-2">
      {quests.map((q) => (
        <div key={q.id} className={`p-3 rounded-lg ${q.completed ? "bg-[#2d4f2d]" : "bg-[#232428]"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {q.completed ? <CheckCircle className="w-4 h-4 text-[#57f287]" /> : <Target className="w-4 h-4 text-[#949ba4]" />}
              <span className={`text-sm ${q.completed ? "text-[#57f287] line-through" : "text-white"}`}>{q.title}</span>
            </div>
            <span className="text-xs text-[#faa61a]">+{q.xp_reward} XP</span>
          </div>
          {!q.completed && (
            <div className="mt-2 ml-6 flex items-center gap-2">
              <div className="flex-1 h-2 bg-[#1e1f22] rounded-full overflow-hidden">
                <div className="h-full bg-[#5865f2] rounded-full transition-all" style={{ width: `${(q.progress / q.total) * 100}%` }} />
              </div>
              <span className="text-xs text-[#949ba4] w-8">{q.progress}/{q.total}</span>
            </div>
          )}
        </div>
      ))}
      <button onClick={() => openExternalLink(`${APP_URL}/profile`)} className="w-full py-2 text-[#00a8fc] text-sm hover:underline">
        View progress →
      </button>
    </div>
  );
}

export default function Activity() {
  const { isActivity, isLoading, user, error, openExternalLink } = useDiscordActivity();
  const [activeTab, setActiveTab] = useState("feed");
  const currentRealm: ArmType = (user?.primary_arm as ArmType) || "labs";

  if (isLoading) return <LoadingScreen message="Loading..." showProgress={true} duration={3000} />;

  if (error) return (
    <div className="min-h-screen bg-[#313338] flex items-center justify-center p-4">
      <div className="text-center max-w-xs">
        <AlertCircle className="w-10 h-10 text-[#ed4245] mx-auto mb-3" />
        <p className="text-white font-medium mb-2">Something went wrong</p>
        <p className="text-[#949ba4] text-sm mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm rounded-lg transition-colors">
          Retry
        </button>
      </div>
    </div>
  );

  if (!isActivity) return (
    <div className="min-h-screen bg-[#313338] flex items-center justify-center p-4">
      <div className="text-center max-w-xs">
        <p className="text-white font-medium mb-2">Discord Activity</p>
        <p className="text-[#949ba4] text-sm mb-4">Open this within Discord to get started.</p>
        <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="text-[#00a8fc] text-sm hover:underline">
          Visit aethex.dev
        </a>
      </div>
    </div>
  );

  const tabs = [
    { id: "feed", label: "Feed" },
    { id: "realms", label: "Realms" },
    { id: "badges", label: "Badges" },
    { id: "top", label: "Top" },
    { id: "jobs", label: "Jobs" },
    { id: "quests", label: "Quests" },
  ];

  const realmConfig = ARM_CONFIG[currentRealm];
  const RealmIcon = realmConfig.icon;

  return (
    <div className="min-h-screen bg-[#313338]">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#2b2d31] border-b border-[#1e1f22]">
          {user?.avatar_url && <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.full_name || user?.username}</p>
            <div className="flex items-center gap-1">
              <RealmIcon className="w-3 h-3" style={{ color: realmConfig.color }} />
              <span className="text-xs" style={{ color: realmConfig.color }}>{realmConfig.label}</span>
            </div>
          </div>
          <button onClick={() => openExternalLink(`${APP_URL}/profile`)} className="p-2 hover:bg-[#404249] rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4 text-[#b5bac1]" />
          </button>
        </div>

        <div className="flex bg-[#2b2d31] border-b border-[#1e1f22] px-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 text-xs font-medium transition-colors relative ${activeTab === tab.id ? "text-white" : "text-[#949ba4] hover:text-[#dbdee1]"}`}>
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#5865f2] rounded-full" />}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 100px)" }}>
          {activeTab === "feed" && <FeedTab openExternalLink={openExternalLink} />}
          {activeTab === "realms" && <RealmsTab currentRealm={currentRealm} openExternalLink={openExternalLink} />}
          {activeTab === "badges" && <BadgesTab openExternalLink={openExternalLink} />}
          {activeTab === "top" && <TopTab openExternalLink={openExternalLink} />}
          {activeTab === "jobs" && <JobsTab openExternalLink={openExternalLink} />}
          {activeTab === "quests" && <QuestsTab openExternalLink={openExternalLink} />}
        </div>
      </div>
    </div>
  );
}
