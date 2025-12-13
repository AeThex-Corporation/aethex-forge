import { useEffect, useState, useCallback, useRef } from "react";
import { useDiscordActivity } from "@/contexts/DiscordActivityContext";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Heart,
  MessageCircle,
  Zap,
  Gamepad2,
  Briefcase,
  BookOpen,
  Sparkles,
  Shield,
  ExternalLink,
  Flame,
  Star,
  Target,
  Gift,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Users,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const APP_URL = "https://aethex.dev";

type ArmType = "labs" | "gameforge" | "corp" | "foundation" | "nexus" | "staff";

const ARM_CONFIG: Record<ArmType, { label: string; icon: any; color: string; gradient: string; glow: string }> = {
  labs: { label: "Labs", icon: Zap, color: "#facc15", gradient: "from-yellow-500/20 via-amber-500/10 to-transparent", glow: "shadow-yellow-500/30" },
  gameforge: { label: "GameForge", icon: Gamepad2, color: "#4ade80", gradient: "from-green-500/20 via-emerald-500/10 to-transparent", glow: "shadow-green-500/30" },
  corp: { label: "Corp", icon: Briefcase, color: "#60a5fa", gradient: "from-blue-500/20 via-sky-500/10 to-transparent", glow: "shadow-blue-500/30" },
  foundation: { label: "Foundation", icon: BookOpen, color: "#f87171", gradient: "from-red-500/20 via-rose-500/10 to-transparent", glow: "shadow-red-500/30" },
  nexus: { label: "Nexus", icon: Sparkles, color: "#c084fc", gradient: "from-purple-500/20 via-violet-500/10 to-transparent", glow: "shadow-purple-500/30" },
  staff: { label: "Staff", icon: Shield, color: "#818cf8", gradient: "from-indigo-500/20 via-blue-500/10 to-transparent", glow: "shadow-indigo-500/30" },
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

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url?: string;
  total_xp: number;
  level: number;
  current_streak?: number;
}

interface UserStats {
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  rank?: number;
}

function XPRing({ xp, level, size = 64, strokeWidth = 4, color }: { xp: number; level: number; size?: number; strokeWidth?: number; color: string }) {
  const xpForLevel = 1000;
  const xpInCurrentLevel = xp % xpForLevel;
  const progress = xpInCurrentLevel / xpForLevel;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2b2d31"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-sm">{level}</span>
      </div>
    </div>
  );
}

function XPGainAnimation({ amount, onComplete }: { amount: number; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
    >
      <span className="font-bold">+{amount} XP</span>
    </motion.div>
  );
}

function ConfettiEffect() {
  const colors = ["#facc15", "#4ade80", "#60a5fa", "#c084fc", "#f87171"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ 
            y: "100vh", 
            opacity: 0,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            x: (Math.random() - 0.5) * 200
          }}
          transition={{ 
            duration: 2 + Math.random() * 2, 
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}

function FeedTab({ openExternalLink, userId }: { openExternalLink: (url: string) => Promise<void>; userId?: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingPost, setLikingPost] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/feed?limit=10");
      if (!response.ok) throw new Error("Failed to load");
      const data = await response.json();
      setPosts(data.data || []);
    } catch {
      setError("Couldn't load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQuickLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId || likingPost) return;
    
    setLikingPost(postId);
    try {
      const response = await fetch(`/api/feed/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setLikedPosts(prev => new Set(prev).add(postId));
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
        ));
      }
    } catch {
      // Silent fail for likes
    } finally {
      setLikingPost(null);
    }
  };

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  if (loading) return (
    <div className="flex justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
    </div>
  );
  
  if (error) return (
    <div className="text-center py-6">
      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
      <p className="text-[#b5bac1] text-sm mb-3">{error}</p>
      <button onClick={fetchPosts} className="text-purple-400 text-sm hover:underline">Try again</button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {posts.length === 0 ? (
        <button onClick={() => openExternalLink(`${APP_URL}/community/feed`)} className="w-full p-4 rounded-xl bg-[#232428] hover:bg-[#2b2d31] transition-all text-left border border-[#3f4147]">
          <p className="text-[#b5bac1] text-sm">No posts yet</p>
          <p className="text-purple-400 text-xs mt-1 flex items-center gap-1">Open Feed <ChevronRight className="w-3 h-3" /></p>
        </button>
      ) : (
        posts.map((post, index) => {
          const config = ARM_CONFIG[post.arm_affiliation] || ARM_CONFIG.nexus;
          const isLiked = likedPosts.has(post.id);
          const isLiking = likingPost === post.id;
          
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button 
                onClick={() => openExternalLink(`${APP_URL}/community/feed/${post.id}`)} 
                className="w-full p-3 rounded-xl bg-[#232428] hover:bg-[#2b2d31] transition-all text-left border border-[#3f4147] group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-1 h-full rounded-full self-stretch" style={{ backgroundColor: config.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors">{post.title}</p>
                    <p className="text-[#949ba4] text-xs line-clamp-2 mt-0.5">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={(e) => handleQuickLike(post.id, e)}
                        disabled={isLiked || isLiking || !userId}
                        className={`flex items-center gap-1 text-xs transition-all ${isLiked ? 'text-pink-400' : 'text-[#949ba4] hover:text-pink-400'}`}
                      >
                        {isLiking ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        )}
                        {post.likes_count}
                      </button>
                      <span className="flex items-center gap-1 text-[#949ba4] text-xs">
                        <MessageCircle className="w-3.5 h-3.5" />{post.comments_count}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#4e5058] group-hover:text-[#b5bac1] transition-colors shrink-0 mt-1" />
                </div>
              </button>
            </motion.div>
          );
        })
      )}
      <button onClick={() => openExternalLink(`${APP_URL}/community/feed`)} className="w-full py-2 text-purple-400 text-sm hover:underline flex items-center justify-center gap-1">
        View all posts <ExternalLink className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

function RealmsTab({ currentRealm, openExternalLink }: { currentRealm: ArmType; openExternalLink: (url: string) => Promise<void> }) {
  const realms = Object.entries(ARM_CONFIG) as [ArmType, typeof ARM_CONFIG[ArmType]][];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-2">
        {realms.map(([key, config], index) => {
          const Icon = config.icon;
          const isActive = currentRealm === key;
          return (
            <motion.button 
              key={key} 
              onClick={() => openExternalLink(`${APP_URL}/${key}`)} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-xl transition-all flex items-center gap-3 border ${
                isActive 
                  ? `bg-gradient-to-br ${config.gradient} border-[${config.color}]/30 shadow-lg ${config.glow}` 
                  : "bg-[#232428] hover:bg-[#2b2d31] border-[#3f4147]"
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-black/20' : 'bg-[#1e1f22]'}`}>
                <Icon className="w-5 h-5" style={{ color: config.color }} />
              </div>
              <span className={`text-sm ${isActive ? "text-white font-semibold" : "text-[#b5bac1]"}`}>{config.label}</span>
              {isActive && <CheckCircle className="w-4 h-4 ml-auto" style={{ color: config.color }} />}
            </motion.button>
          );
        })}
      </div>
      <p className="text-center text-[#949ba4] text-xs mt-4">Tap to explore each realm</p>
    </motion.div>
  );
}

function LeaderboardTab({ openExternalLink, currentUserId }: { openExternalLink: (url: string) => Promise<void>; currentUserId?: string }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard?limit=10");
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data.data || []);
          if (currentUserId) {
            const rank = data.data?.findIndex((e: LeaderboardEntry) => e.user_id === currentUserId);
            if (rank !== -1) setUserRank(rank + 1);
          }
        }
      } catch {
        // Use fallback data
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [currentUserId]);

  const medals = ["🥇", "🥈", "🥉"];

  if (loading) return (
    <div className="flex justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {userRank && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-medium">Your Rank</span>
            <span className="text-purple-300 font-bold">#{userRank}</span>
          </div>
        </motion.div>
      )}
      
      {leaderboard.length === 0 ? (
        <div className="text-center py-6">
          <TrendingUp className="w-8 h-8 text-[#4e5058] mx-auto mb-2" />
          <p className="text-[#949ba4] text-sm">Leaderboard loading...</p>
        </div>
      ) : (
        leaderboard.map((entry, index) => (
          <motion.div 
            key={entry.user_id} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-xl flex items-center gap-3 border ${
              index < 3 
                ? "bg-gradient-to-r from-[#232428] to-[#2b2d31] border-[#4e5058]" 
                : "bg-[#1e1f22] border-[#3f4147]"
            }`}
          >
            <span className="w-8 text-center text-lg">{medals[index] || `#${index + 1}`}</span>
            {entry.avatar_url ? (
              <img src={entry.avatar_url} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-bold">
                {entry.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{entry.username}</p>
              <p className="text-[#949ba4] text-xs">Lvl {entry.level} · {entry.total_xp.toLocaleString()} XP</p>
            </div>
            {entry.current_streak && entry.current_streak > 0 && (
              <motion.span 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-1 text-orange-400 text-xs font-medium"
              >
                <Flame className="w-3.5 h-3.5" />{entry.current_streak}
              </motion.span>
            )}
          </motion.div>
        ))
      )}
      <button onClick={() => openExternalLink(`${APP_URL}/leaderboard`)} className="w-full py-2 text-purple-400 text-sm hover:underline flex items-center justify-center gap-1">
        Full leaderboard <ExternalLink className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

function QuestsTab({ userId, onXPGain }: { userId?: string; onXPGain: (amount: number) => void }) {
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const claimDailyXP = async () => {
    if (!userId || claiming || dailyClaimed) return;
    setClaiming(true);
    try {
      const response = await fetch("/api/xp/daily-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setDailyClaimed(true);
        onXPGain(data.xp_awarded || 25);
      }
    } catch {
      // Silent fail
    } finally {
      setClaiming(false);
    }
  };

  const quests = [
    { id: "daily", title: "Daily Login", description: "Log in today", xp: 25, icon: Calendar, canClaim: !dailyClaimed, onClaim: claimDailyXP, claiming },
    { id: "post", title: "Share Your Work", description: "Create a post", xp: 20, icon: Star, progress: 0, total: 1 },
    { id: "like", title: "Show Support", description: "Like 5 posts", xp: 15, icon: Heart, progress: 3, total: 5 },
    { id: "explore", title: "Realm Explorer", description: "Visit 3 realms", xp: 30, icon: Sparkles, progress: 2, total: 3 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-sm font-medium">Daily Quests</span>
        <span className="text-[#949ba4] text-xs">Resets at midnight UTC</span>
      </div>
      
      {quests.map((quest, index) => {
        const Icon = quest.icon;
        const isCompleted = quest.progress !== undefined && quest.progress >= (quest.total || 1);
        
        return (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-xl border transition-all ${
              isCompleted || (quest.canClaim === false) 
                ? "bg-green-500/10 border-green-500/30" 
                : "bg-[#232428] border-[#3f4147]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isCompleted || (quest.canClaim === false) ? 'bg-green-500/20' : 'bg-[#1e1f22]'}`}>
                <Icon className={`w-5 h-5 ${isCompleted || (quest.canClaim === false) ? 'text-green-400' : 'text-purple-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isCompleted || (quest.canClaim === false) ? 'text-green-300' : 'text-white'}`}>
                    {quest.title}
                  </span>
                  <span className="text-amber-400 text-xs font-medium">+{quest.xp} XP</span>
                </div>
                <p className="text-[#949ba4] text-xs">{quest.description}</p>
                
                {quest.progress !== undefined && quest.total && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#1e1f22] rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-[10px] text-[#949ba4]">{quest.progress}/{quest.total}</span>
                  </div>
                )}
              </div>
              
              {quest.canClaim !== undefined && (
                <motion.button
                  onClick={quest.onClaim}
                  disabled={!quest.canClaim || quest.claiming}
                  whileHover={quest.canClaim ? { scale: 1.05 } : {}}
                  whileTap={quest.canClaim ? { scale: 0.95 } : {}}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    quest.canClaim 
                      ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {quest.claiming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : quest.canClaim ? (
                    "Claim"
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </motion.button>
              )}
              
              {isCompleted && !quest.canClaim && (
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function JobsTab({ openExternalLink }: { openExternalLink: (url: string) => Promise<void> }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/opportunities?limit=5&status=active");
        if (response.ok) {
          const data = await response.json();
          setJobs(data.data || []);
        }
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const categories = [
    { label: "Full-Time", icon: Briefcase, color: "#60a5fa" },
    { label: "Contract", icon: Target, color: "#4ade80" },
    { label: "Freelance", icon: Star, color: "#facc15" },
  ];

  if (loading) return (
    <div className="flex justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-3 gap-2">
        {categories.map(({ label, icon: Icon, color }, index) => (
          <motion.button 
            key={label} 
            onClick={() => openExternalLink(`${APP_URL}/opportunities?type=${label.toLowerCase()}`)} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 rounded-xl bg-[#232428] hover:bg-[#2b2d31] transition-all flex flex-col items-center gap-2 border border-[#3f4147]"
          >
            <Icon className="w-5 h-5" style={{ color }} />
            <span className="text-[#b5bac1] text-xs">{label}</span>
          </motion.button>
        ))}
      </div>
      
      {jobs.length > 0 && (
        <div className="space-y-2">
          <p className="text-[#949ba4] text-xs font-medium">Latest Opportunities</p>
          {jobs.slice(0, 3).map((job, index) => (
            <motion.button
              key={job.id}
              onClick={() => openExternalLink(`${APP_URL}/opportunities/${job.id}`)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="w-full p-3 rounded-xl bg-[#232428] hover:bg-[#2b2d31] transition-all text-left border border-[#3f4147] group"
            >
              <p className="text-white text-sm font-medium truncate group-hover:text-purple-300">{job.title}</p>
              <p className="text-[#949ba4] text-xs truncate">{job.company_name || "Remote"}</p>
            </motion.button>
          ))}
        </div>
      )}
      
      <motion.button 
        onClick={() => openExternalLink(`${APP_URL}/opportunities`)} 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all text-white text-sm font-medium shadow-lg shadow-purple-500/20"
      >
        Browse All Opportunities
      </motion.button>
    </motion.div>
  );
}

function BadgesTab({ userId, openExternalLink }: { userId?: string; openExternalLink: (url: string) => Promise<void> }) {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/user/${userId}/badges`);
        if (response.ok) {
          const data = await response.json();
          setBadges(data.badges || []);
        }
      } catch {
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, [userId]);

  const exampleBadges = [
    { id: "1", name: "Early Adopter", icon: "🚀", description: "Joined during beta", unlocked: true },
    { id: "2", name: "First Post", icon: "✨", description: "Created your first post", unlocked: true },
    { id: "3", name: "Realm Explorer", icon: "🗺️", description: "Visited all 6 realms", unlocked: false, progress: 4, total: 6 },
    { id: "4", name: "Social Butterfly", icon: "🦋", description: "Made 10 connections", unlocked: false, progress: 6, total: 10 },
    { id: "5", name: "Top Contributor", icon: "👑", description: "Reach top 10 leaderboard", unlocked: false },
  ];

  const displayBadges = badges.length > 0 ? badges : exampleBadges;

  if (loading) return (
    <div className="flex justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-sm font-medium">Your Badges</span>
        <span className="text-[#949ba4] text-xs">{displayBadges.filter(b => b.unlocked).length}/{displayBadges.length} unlocked</span>
      </div>
      
      {displayBadges.map((badge, index) => (
        <motion.div 
          key={badge.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-3 rounded-xl flex items-center gap-3 border transition-all ${
            badge.unlocked 
              ? "bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500/30" 
              : "bg-[#232428] border-[#3f4147]"
          }`}
        >
          <span className={`text-2xl ${badge.unlocked ? "" : "grayscale opacity-50"}`}>{badge.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${badge.unlocked ? "text-green-300" : "text-[#b5bac1]"}`}>
                {badge.name}
              </span>
              {badge.unlocked && <Award className="w-4 h-4 text-green-400" />}
            </div>
            <p className="text-[#949ba4] text-xs">{badge.description}</p>
            {!badge.unlocked && badge.progress !== undefined && badge.total && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#1e1f22] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-purple-500 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(badge.progress / badge.total) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
                <span className="text-[10px] text-[#949ba4]">{badge.progress}/{badge.total}</span>
              </div>
            )}
          </div>
          {badge.unlocked && <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />}
        </motion.div>
      ))}
      
      <button onClick={() => openExternalLink(`${APP_URL}/profile`)} className="w-full py-2 text-purple-400 text-sm hover:underline flex items-center justify-center gap-1">
        View all badges <ExternalLink className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

export default function Activity() {
  const { isActivity, isLoading, user, error, openExternalLink } = useDiscordActivity();
  const [activeTab, setActiveTab] = useState("feed");
  const [xpGain, setXpGain] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({ total_xp: 0, level: 1, current_streak: 0, longest_streak: 0 });
  const currentRealm: ArmType = (user?.primary_arm as ArmType) || "nexus";

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/user/${user.id}/stats`);
        if (response.ok) {
          const data = await response.json();
          setUserStats(data);
        }
      } catch {
        // Use defaults
      }
    };
    fetchUserStats();
  }, [user?.id]);

  const handleXPGain = useCallback((amount: number) => {
    setXpGain(amount);
    setUserStats(prev => ({
      ...prev,
      total_xp: prev.total_xp + amount,
      level: Math.max(1, Math.floor((prev.total_xp + amount) / 1000) + 1)
    }));
    
    const newLevel = Math.max(1, Math.floor((userStats.total_xp + amount) / 1000) + 1);
    if (newLevel > userStats.level) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [userStats]);

  if (isLoading) return <LoadingScreen message="Connecting to AeThex..." showProgress={true} duration={3000} />;

  if (error) return (
    <div className="min-h-screen bg-[#313338] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-xs"
      >
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-white font-medium mb-2">Connection Error</p>
        <p className="text-[#949ba4] text-sm mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-xl transition-colors">
          Retry
        </button>
      </motion.div>
    </div>
  );

  if (!isActivity) return (
    <div className="min-h-screen bg-[#313338] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xs"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <p className="text-white font-semibold text-lg mb-2">AeThex Activity</p>
        <p className="text-[#949ba4] text-sm mb-4">Launch this within Discord to access the full experience.</p>
        <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-purple-400 text-sm hover:underline">
          Visit aethex.dev <ExternalLink className="w-3 h-3" />
        </a>
      </motion.div>
    </div>
  );

  const tabs = [
    { id: "feed", label: "Feed", icon: MessageCircle },
    { id: "realms", label: "Realms", icon: Sparkles },
    { id: "quests", label: "Quests", icon: Target },
    { id: "top", label: "Top", icon: TrendingUp },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "badges", label: "Badges", icon: Award },
  ];

  const realmConfig = ARM_CONFIG[currentRealm];
  const RealmIcon = realmConfig.icon;

  return (
    <div className="min-h-screen bg-[#313338]">
      <AnimatePresence>
        {showConfetti && <ConfettiEffect />}
        {xpGain && <XPGainAnimation amount={xpGain} onComplete={() => setXpGain(null)} />}
      </AnimatePresence>
      
      <div className="max-w-md mx-auto">
        {/* Dynamic Gradient Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden bg-gradient-to-br ${realmConfig.gradient} border-b border-[#1e1f22]`}
        >
          <div className="absolute inset-0 bg-[#2b2d31]/80" />
          <div className="relative px-4 py-4">
            <div className="flex items-center gap-3">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-12 h-12 rounded-full ring-2 ring-white/10" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {user?.username?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{user?.full_name || user?.username || "Builder"}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/20" style={{ borderColor: realmConfig.color }}>
                    <RealmIcon className="w-3 h-3" style={{ color: realmConfig.color }} />
                    <span className="text-xs font-medium" style={{ color: realmConfig.color }}>{realmConfig.label}</span>
                  </div>
                  {userStats.current_streak > 0 && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span className="text-xs font-medium text-orange-400">{userStats.current_streak}d</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <XPRing xp={userStats.total_xp} level={userStats.level} size={48} strokeWidth={3} color={realmConfig.color} />
                <button onClick={() => openExternalLink(`${APP_URL}/profile`)} className="p-2 hover:bg-black/20 rounded-xl transition-colors">
                  <ExternalLink className="w-4 h-4 text-[#b5bac1]" />
                </button>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[#949ba4]">{userStats.total_xp.toLocaleString()} XP</span>
              <span className="text-[#949ba4]">{1000 - (userStats.total_xp % 1000)} XP to Level {userStats.level + 1}</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex bg-[#2b2d31] border-b border-[#1e1f22] px-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all relative whitespace-nowrap ${
                  isActive ? "text-white" : "text-[#949ba4] hover:text-[#dbdee1]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-1 right-1 h-0.5 bg-purple-500 rounded-full" 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
          <AnimatePresence mode="wait">
            {activeTab === "feed" && <FeedTab key="feed" openExternalLink={openExternalLink} userId={user?.id} />}
            {activeTab === "realms" && <RealmsTab key="realms" currentRealm={currentRealm} openExternalLink={openExternalLink} />}
            {activeTab === "quests" && <QuestsTab key="quests" userId={user?.id} onXPGain={handleXPGain} />}
            {activeTab === "top" && <LeaderboardTab key="top" openExternalLink={openExternalLink} currentUserId={user?.id} />}
            {activeTab === "jobs" && <JobsTab key="jobs" openExternalLink={openExternalLink} />}
            {activeTab === "badges" && <BadgesTab key="badges" userId={user?.id} openExternalLink={openExternalLink} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
