import { useEffect, useState, useCallback, useRef, useMemo, type MouseEvent } from "react";
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
  X,
  Send,
  MessagesSquare,
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

  const handleQuickLike = async (postId: string, e: MouseEvent<HTMLButtonElement>) => {
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
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, user_id: "1", username: "PixelMaster", total_xp: 15420, level: 16, current_streak: 21 },
    { rank: 2, user_id: "2", username: "CodeNinja", total_xp: 12800, level: 13, current_streak: 14 },
    { rank: 3, user_id: "3", username: "BuilderX", total_xp: 11250, level: 12, current_streak: 7 },
    { rank: 4, user_id: "4", username: "GameDev_Pro", total_xp: 9800, level: 10, current_streak: 5 },
    { rank: 5, user_id: "5", username: "ForgeHero", total_xp: 8500, level: 9, current_streak: 12 },
    { rank: 6, user_id: "6", username: "NexusCreator", total_xp: 7200, level: 8, current_streak: 3 },
    { rank: 7, user_id: "7", username: "LabsExplorer", total_xp: 6100, level: 7 },
  ];

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium">Your Rank</span>
          <span className="text-purple-300 font-bold">#12</span>
        </div>
        <p className="text-[#949ba4] text-xs mt-1">Keep earning XP to climb!</p>
      </motion.div>
      
      {(
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
  const [dailyClaimed, setDailyClaimed] = useState(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const lastClaim = localStorage.getItem('aethex_daily_claim');
      return lastClaim === today;
    } catch {
      return false;
    }
  });
  const [claiming, setClaiming] = useState(false);

  const claimDailyXP = () => {
    if (claiming || dailyClaimed) return;
    setClaiming(true);
    
    setTimeout(() => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem('aethex_daily_claim', today);
      } catch {}
      
      setDailyClaimed(true);
      onXPGain(25);
      setClaiming(false);
    }, 500);
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
  const displayBadges = [
    { id: "1", name: "Early Adopter", icon: "🚀", description: "Joined during beta", unlocked: true },
    { id: "2", name: "First Post", icon: "✨", description: "Created your first post", unlocked: true },
    { id: "3", name: "Realm Explorer", icon: "🗺️", description: "Visited all 6 realms", unlocked: false, progress: 4, total: 6 },
    { id: "4", name: "Social Butterfly", icon: "🦋", description: "Made 10 connections", unlocked: false, progress: 6, total: 10 },
    { id: "5", name: "Top Contributor", icon: "👑", description: "Reach top 10 leaderboard", unlocked: false },
    { id: "6", name: "Week Warrior", icon: "⚔️", description: "7-day login streak", unlocked: false, progress: 3, total: 7 },
  ];

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

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string | null;
  content: string;
  timestamp: number;
}

function ChatTab({ 
  userId, 
  username, 
  avatar,
  participants 
}: { 
  userId?: string; 
  username?: string;
  avatar?: string | null;
  participants: any[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('aethex_activity_chat');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    try {
      localStorage.setItem('aethex_activity_chat', JSON.stringify(messages.slice(-50)));
    } catch {}
  }, [messages]);
  
  const sendMessage = useCallback(() => {
    if (!inputValue.trim() || !userId || sending) return;
    
    setSending(true);
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId,
      username: username || 'Anonymous',
      avatar: avatar || null,
      content: inputValue.trim(),
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setSending(false);
    inputRef.current?.focus();
  }, [inputValue, userId, username, avatar, sending]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const mockMessages: ChatMessage[] = [
    { id: '1', userId: 'bot', username: 'AeThex Bot', avatar: null, content: 'Welcome to Activity Chat! Say hi to your fellow builders.', timestamp: Date.now() - 300000 },
    { id: '2', userId: 'user1', username: 'GameDevPro', avatar: null, content: 'Hey everyone! Working on a new GameForge project 🎮', timestamp: Date.now() - 180000 },
    { id: '3', userId: 'user2', username: 'PixelArtist', avatar: null, content: 'Nice! What genre?', timestamp: Date.now() - 120000 },
  ];
  
  const displayMessages = messages.length > 0 ? messages : mockMessages;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full -m-4"
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {participants.length > 0 && (
          <div className="text-center py-2">
            <span className="text-xs text-[#949ba4] bg-[#232428] px-3 py-1 rounded-full">
              {participants.length} {participants.length === 1 ? 'person' : 'people'} in this Activity
            </span>
          </div>
        )}
        
        {displayMessages.map((msg, index) => {
          const isOwn = msg.userId === userId;
          const showAvatar = index === 0 || displayMessages[index - 1]?.userId !== msg.userId;
          
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
            >
              {showAvatar ? (
                msg.avatar ? (
                  <img 
                    src={msg.avatar}
                    alt={msg.username}
                    className="w-8 h-8 rounded-full shrink-0"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                    msg.userId === 'bot' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-[#5865f2]'
                  }`}>
                    {msg.username?.[0]?.toUpperCase() || '?'}
                  </div>
                )
              ) : (
                <div className="w-8 shrink-0" />
              )}
              
              <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
                {showAvatar && (
                  <div className={`flex items-center gap-2 mb-0.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-xs font-medium ${msg.userId === 'bot' ? 'text-purple-400' : 'text-white'}`}>
                      {msg.username}
                    </span>
                    <span className="text-[10px] text-[#949ba4]">{formatTime(msg.timestamp)}</span>
                  </div>
                )}
                <div className={`px-3 py-2 rounded-2xl text-sm ${
                  isOwn 
                    ? 'bg-purple-500 text-white rounded-tr-sm' 
                    : msg.userId === 'bot'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 rounded-tl-sm'
                    : 'bg-[#232428] text-white rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-[#2b2d31] border-t border-[#1e1f22]">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={!userId}
            className="flex-1 bg-[#1e1f22] text-white placeholder-[#949ba4] px-4 py-2.5 rounded-xl border border-[#3f4147] focus:border-purple-500 focus:outline-none transition-colors text-sm disabled:opacity-50"
          />
          <motion.button
            onClick={sendMessage}
            disabled={!inputValue.trim() || !userId || sending}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-purple-500 hover:bg-purple-600 disabled:bg-[#3f4147] disabled:opacity-50 rounded-xl transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </motion.button>
        </div>
        <p className="text-center text-[10px] text-[#4e5058] mt-2">
          Messages are local to this session
        </p>
      </div>
    </motion.div>
  );
}

interface ParticipantProfile {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  speaking?: boolean;
}

function ProfilePreviewModal({ 
  participant, 
  onClose, 
  openExternalLink 
}: { 
  participant: ParticipantProfile; 
  onClose: () => void; 
  openExternalLink: (url: string) => Promise<void>;
}) {
  const { mockBadges, mockLevel, mockXP } = useMemo(() => {
    const hash = participant.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const level = (hash % 15) + 1;
    return {
      mockBadges: [
        { icon: "🚀", name: "Early Adopter", unlocked: hash % 2 === 0 },
        { icon: "⚔️", name: "Realm Explorer", unlocked: hash % 3 === 0 },
        { icon: "🎮", name: "GameForge Member", unlocked: hash % 4 !== 0 },
        { icon: "✨", name: "First Post", unlocked: hash % 5 !== 0 },
      ],
      mockLevel: level,
      mockXP: level * 1000 - (hash % 800),
    };
  }, [participant.id]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#2b2d31] rounded-2xl w-full max-w-sm overflow-hidden border border-[#3f4147] shadow-xl"
      >
        <div className="relative bg-gradient-to-br from-purple-600/30 to-pink-600/30 p-6 pb-12">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
          
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            {participant.avatar ? (
              <img 
                src={`https://cdn.discordapp.com/avatars/${participant.id}/${participant.avatar}.png?size=128`}
                alt={participant.global_name || participant.username}
                className={`w-20 h-20 rounded-full border-4 border-[#2b2d31] ${participant.speaking ? 'ring-3 ring-green-400' : ''}`}
              />
            ) : (
              <div className={`w-20 h-20 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-2xl font-bold border-4 border-[#2b2d31] ${participant.speaking ? 'ring-3 ring-green-400' : ''}`}>
                {(participant.global_name || participant.username)?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            {participant.speaking && (
              <motion.div 
                className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-[#2b2d31] flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <span className="text-[8px]">🎤</span>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="pt-12 pb-4 px-4 text-center">
          <h3 className="text-white font-semibold text-lg">{participant.global_name || participant.username}</h3>
          <p className="text-[#949ba4] text-sm">@{participant.username}</p>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-white font-bold text-lg">{mockLevel}</p>
              <p className="text-[#949ba4] text-xs">Level</p>
            </div>
            <div className="w-px h-8 bg-[#3f4147]" />
            <div className="text-center">
              <p className="text-white font-bold text-lg">{mockXP.toLocaleString()}</p>
              <p className="text-[#949ba4] text-xs">XP</p>
            </div>
            <div className="w-px h-8 bg-[#3f4147]" />
            <div className="text-center">
              <p className="text-white font-bold text-lg">{mockBadges.filter(b => b.unlocked).length}</p>
              <p className="text-[#949ba4] text-xs">Badges</p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {mockBadges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
                  badge.unlocked 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-[#1e1f22] text-[#4e5058] grayscale'
                }`}
              >
                <span>{badge.icon}</span>
                <span className="text-xs">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="p-4 pt-0">
          <motion.button
            onClick={() => openExternalLink(`${APP_URL}/passport/${participant.id}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all text-white text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            View Full Passport <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ParticipantsBar({ 
  participants, 
  currentUserId,
  openExternalLink 
}: { 
  participants: any[]; 
  currentUserId?: string;
  openExternalLink: (url: string) => Promise<void>;
}) {
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantProfile | null>(null);
  const otherParticipants = participants.filter(p => p.id !== currentUserId);
  
  if (otherParticipants.length === 0) return null;
  
  return (
    <>
      <AnimatePresence>
        {selectedParticipant && (
          <ProfilePreviewModal
            participant={selectedParticipant}
            onClose={() => setSelectedParticipant(null)}
            openExternalLink={openExternalLink}
          />
        )}
      </AnimatePresence>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2b2d31] border-b border-[#1e1f22]">
        <Users className="w-4 h-4 text-[#949ba4]" />
        <span className="text-xs text-[#949ba4]">{otherParticipants.length} here</span>
        <div className="flex -space-x-2 ml-2">
          {otherParticipants.slice(0, 8).map((p) => (
            <motion.button
              key={p.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedParticipant(p)}
              className="relative cursor-pointer"
            >
              {p.avatar ? (
                <img 
                  src={`https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png?size=32`}
                  alt={p.global_name || p.username}
                  className={`w-7 h-7 rounded-full border-2 border-[#2b2d31] ${p.speaking ? 'ring-2 ring-green-400' : ''}`}
                  title={p.global_name || p.username}
                />
              ) : (
                <div 
                  className={`w-7 h-7 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-bold border-2 border-[#2b2d31] ${p.speaking ? 'ring-2 ring-green-400' : ''}`}
                  title={p.global_name || p.username}
                >
                  {(p.global_name || p.username)?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              {p.speaking && (
                <motion.div 
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-[#2b2d31]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
              )}
            </motion.button>
          ))}
          {otherParticipants.length > 8 && (
            <div className="w-7 h-7 rounded-full bg-[#4e5058] flex items-center justify-center text-white text-xs font-bold border-2 border-[#2b2d31]">
              +{otherParticipants.length - 8}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Activity() {
  const { isActivity, isLoading, user, error, openExternalLink, participants } = useDiscordActivity();
  const [activeTab, setActiveTab] = useState("feed");
  const [xpGain, setXpGain] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({ total_xp: 0, level: 1, current_streak: 0, longest_streak: 0 });
  const currentRealm: ArmType = (user?.primary_arm as ArmType) || "nexus";

  useEffect(() => {
    // Use mock data for user stats (no API endpoint available)
    setUserStats({
      total_xp: 2450,
      level: 3,
      current_streak: 5,
      longest_streak: 12,
      rank: 12
    });
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
    { id: "chat", label: "Chat", icon: MessagesSquare },
    { id: "realms", label: "Realms", icon: Sparkles },
    { id: "quests", label: "Quests", icon: Target },
    { id: "top", label: "Top", icon: TrendingUp },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "badges", label: "Badges", icon: Award },
  ];

  const realmConfig = ARM_CONFIG[currentRealm];
  const RealmIcon = realmConfig.icon;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#313338] overflow-hidden">
      <AnimatePresence>
        {showConfetti && <ConfettiEffect />}
        {xpGain && <XPGainAnimation amount={xpGain} onComplete={() => setXpGain(null)} />}
      </AnimatePresence>
      
      {/* Dynamic Gradient Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden bg-gradient-to-br ${realmConfig.gradient} border-b border-[#1e1f22] flex-shrink-0`}
      >
        <div className="absolute inset-0 bg-[#2b2d31]/80" />
        <div className="relative px-6 py-4">
          <div className="flex items-center gap-4">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-14 h-14 rounded-full ring-2 ring-white/10" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-lg truncate">{user?.full_name || user?.username || "Builder"}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20" style={{ borderColor: realmConfig.color }}>
                  <RealmIcon className="w-4 h-4" style={{ color: realmConfig.color }} />
                  <span className="text-sm font-medium" style={{ color: realmConfig.color }}>{realmConfig.label}</span>
                </div>
                {userStats.current_streak > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/20">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-orange-400">{userStats.current_streak}d</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <XPRing xp={userStats.total_xp} level={userStats.level} size={56} strokeWidth={4} color={realmConfig.color} />
              <button onClick={() => openExternalLink(`${APP_URL}/profile`)} className="p-2.5 hover:bg-black/20 rounded-xl transition-colors">
                <ExternalLink className="w-5 h-5 text-[#b5bac1]" />
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-[#949ba4]">{userStats.total_xp.toLocaleString()} XP</span>
            <span className="text-[#949ba4]">{1000 - (userStats.total_xp % 1000)} XP to Level {userStats.level + 1}</span>
          </div>
        </div>
      </motion.div>

      {/* Participants Bar */}
      <ParticipantsBar participants={participants} currentUserId={user?.id} openExternalLink={openExternalLink} />

      {/* Tab Navigation */}
      <div className="flex bg-[#2b2d31] border-b border-[#1e1f22] px-2 overflow-x-auto scrollbar-hide flex-shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
                isActive ? "text-white" : "text-[#949ba4] hover:text-[#dbdee1]"
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-purple-500 rounded-full" 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content - fills remaining space */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === "feed" && <FeedTab key="feed" openExternalLink={openExternalLink} userId={user?.id} />}
          {activeTab === "chat" && <ChatTab key="chat" userId={user?.id} username={user?.username || undefined} avatar={user?.avatar_url} participants={participants} />}
          {activeTab === "realms" && <RealmsTab key="realms" currentRealm={currentRealm} openExternalLink={openExternalLink} />}
          {activeTab === "quests" && <QuestsTab key="quests" userId={user?.id} onXPGain={handleXPGain} />}
          {activeTab === "top" && <LeaderboardTab key="top" openExternalLink={openExternalLink} currentUserId={user?.id} />}
          {activeTab === "jobs" && <JobsTab key="jobs" openExternalLink={openExternalLink} />}
          {activeTab === "badges" && <BadgesTab key="badges" userId={user?.id} openExternalLink={openExternalLink} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
