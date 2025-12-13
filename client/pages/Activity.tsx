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
  BarChart3,
  Plus,
  Vote,
  Trophy,
  Clock,
  ThumbsUp,
  Layers,
  Eye,
  UserPlus,
  Crosshair,
  Crown,
  Dice6,
  Video,
  Mic,
  MapPin,
  FileText,
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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/activity/leaderboard');
        if (response.ok) {
          const data = await response.json();
          const entries = (data.data || data || []).map((e: any, i: number) => ({
            rank: i + 1,
            user_id: e.user_id || e.id,
            username: e.username || e.full_name || 'Anonymous',
            avatar_url: e.avatar_url,
            total_xp: e.total_xp || 0,
            level: e.level || Math.floor((e.total_xp || 0) / 1000) + 1,
            current_streak: e.current_streak || 0,
          }));
          setLeaderboard(entries);
          if (currentUserId) {
            const userIdx = entries.findIndex((e: any) => e.user_id === currentUserId);
            if (userIdx >= 0) setUserRank(userIdx + 1);
          }
        }
      } catch {
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [currentUserId]);

  const medals = ["🥇", "🥈", "🥉"];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

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
          <span className="text-purple-300 font-bold">{userRank ? `#${userRank}` : 'Unranked'}</span>
        </div>
        <p className="text-[#949ba4] text-xs mt-1">Keep earning XP to climb!</p>
      </motion.div>

      {leaderboard.length === 0 && (
        <div className="text-center py-6">
          <Trophy className="w-8 h-8 text-[#4e5058] mx-auto mb-2" />
          <p className="text-[#949ba4] text-sm">No leaderboard data yet</p>
        </div>
      )}
      
      {leaderboard.map((entry, index) => (
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
        )
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

function JobsTab({ openExternalLink, userId }: { openExternalLink: (url: string) => Promise<void>; userId?: string }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('aethex_job_applications');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState<string | null>(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

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

  const handleQuickApply = (jobId: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!userId) return;
    setShowApplyModal(jobId);
    setApplyMessage("");
  };

  const submitApplication = () => {
    if (!showApplyModal || !userId) return;
    setApplyingTo(showApplyModal);
    
    setTimeout(() => {
      const newApplied = new Set(appliedJobs).add(showApplyModal);
      setAppliedJobs(newApplied);
      try {
        localStorage.setItem('aethex_job_applications', JSON.stringify([...newApplied]));
      } catch {}
      
      setApplySuccess(showApplyModal);
      setApplyingTo(null);
      setShowApplyModal(null);
      setApplyMessage("");
      
      setTimeout(() => setApplySuccess(null), 3000);
    }, 800);
  };

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

  const selectedJob = jobs.find(j => j.id === showApplyModal);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <AnimatePresence>
        {applySuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm">Application submitted!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showApplyModal && selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowApplyModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2b2d31] rounded-2xl p-5 w-full max-w-sm border border-[#3f4147] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Quick Apply</h3>
                <button onClick={() => setShowApplyModal(null)} className="text-[#949ba4] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-3 rounded-xl bg-[#1e1f22] mb-4">
                <p className="text-white text-sm font-medium">{selectedJob.title}</p>
                <p className="text-[#949ba4] text-xs">{selectedJob.company_name || "Remote Opportunity"}</p>
              </div>

              <div className="mb-4">
                <label className="text-[#b5bac1] text-xs block mb-2">Quick message (optional)</label>
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="Introduce yourself briefly..."
                  className="w-full p-3 rounded-xl bg-[#1e1f22] border border-[#3f4147] text-white text-sm placeholder-[#949ba4] resize-none focus:outline-none focus:border-purple-500"
                  rows={3}
                />
              </div>

              <p className="text-[#949ba4] text-xs mb-4 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Your profile and portfolio will be shared
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowApplyModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1e1f22] text-[#b5bac1] text-sm hover:bg-[#232428] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={submitApplication}
                  disabled={applyingTo === showApplyModal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium flex items-center justify-center gap-2"
                >
                  {applyingTo === showApplyModal ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Apply Now
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          {jobs.slice(0, 5).map((job, index) => {
            const hasApplied = appliedJobs.has(job.id);
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="p-3 rounded-xl bg-[#232428] hover:bg-[#2b2d31] transition-all border border-[#3f4147] group"
              >
                <div className="flex items-start justify-between gap-2">
                  <button 
                    onClick={() => openExternalLink(`${APP_URL}/opportunities/${job.id}`)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-white text-sm font-medium truncate group-hover:text-purple-300">{job.title}</p>
                    <p className="text-[#949ba4] text-xs truncate">{job.company_name || "Remote"}</p>
                  </button>
                  
                  {userId ? (
                    hasApplied ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs shrink-0">
                        <CheckCircle className="w-4 h-4" />
                        Applied
                      </span>
                    ) : (
                      <motion.button
                        onClick={(e) => handleQuickApply(job.id, e)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-colors shrink-0 flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        Quick Apply
                      </motion.button>
                    )
                  ) : (
                    <button
                      onClick={() => openExternalLink(`${APP_URL}/opportunities/${job.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#1e1f22] text-[#949ba4] text-xs shrink-0"
                    >
                      View
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
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

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

function BadgesTab({ userId, openExternalLink }: { userId?: string; openExternalLink: (url: string) => Promise<void> }) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const endpoint = userId ? `/api/activity/badges/${userId}` : '/api/activity/badges';
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.data || data || []).map((b: any) => ({
            id: b.id || b.badge_id,
            name: b.name || b.badge_name,
            icon: b.icon || b.emoji || '🏆',
            description: b.description || '',
            unlocked: b.unlocked || b.earned || false,
            progress: b.progress,
            total: b.total || b.requirement,
          }));
          setBadges(mapped);
        }
      } catch {
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <Award className="w-8 h-8 text-[#4e5058] mx-auto mb-2" />
        <p className="text-[#949ba4] text-sm">No badges available yet</p>
        <p className="text-[#4e5058] text-xs mt-1">Complete activities to earn badges!</p>
      </motion.div>
    );
  }

  const displayBadges = badges;

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

interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  createdBy: string;
  createdByName: string;
  createdAt: number;
  expiresAt: number;
  votedUsers: string[];
}

function PollsTab({ userId, username }: { userId?: string; username?: string }) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('/api/activity/polls');
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.data || data || []).map((p: any) => ({
            id: p.id,
            question: p.question,
            options: (p.options || []).map((opt: any, i: number) => ({
              id: opt.id || `opt-${i}`,
              text: opt.text || opt.option_text,
              votes: opt.votes || opt.vote_count || 0,
            })),
            createdBy: p.creator_id || p.created_by || 'system',
            createdByName: p.creator_name || 'Anonymous',
            createdAt: new Date(p.created_at).getTime(),
            expiresAt: new Date(p.expires_at).getTime(),
            votedUsers: p.voted_users || [],
          }));
          setPolls(mapped.filter((p: Poll) => p.expiresAt > Date.now()));
        }
      } catch {
        setPolls([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const createPoll = async () => {
    if (!userId || !newQuestion.trim() || newOptions.filter(o => o.trim()).length < 2) return;
    
    setCreating(true);
    try {
      const response = await fetch('/api/activity/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQuestion.trim(),
          options: newOptions.filter(o => o.trim()),
          creator_id: userId,
          creator_name: username || 'Anonymous',
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const newPoll: Poll = {
          id: data.id || `${Date.now()}`,
          question: newQuestion.trim(),
          options: newOptions.filter(o => o.trim()).map((text, i) => ({
            id: `opt-${i}`,
            text: text.trim(),
            votes: 0
          })),
          createdBy: userId,
          createdByName: username || 'Anonymous',
          createdAt: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          votedUsers: []
        };
        setPolls(prev => [newPoll, ...prev]);
      }
    } catch {}
    
    setNewQuestion('');
    setNewOptions(['', '']);
    setShowCreate(false);
    setCreating(false);
  };

  const vote = async (pollId: string, optionId: string) => {
    if (!userId) return;
    
    const poll = polls.find(p => p.id === pollId);
    if (!poll || poll.votedUsers.includes(userId)) return;
    
    setPolls(prev => prev.map(p => {
      if (p.id !== pollId) return p;
      return {
        ...p,
        options: p.options.map(opt => 
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        ),
        votedUsers: [...p.votedUsers, userId]
      };
    }));
    
    try {
      await fetch(`/api/activity/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, option_id: optionId }),
      });
    } catch {}
  };

  const deletePoll = async (pollId: string) => {
    setPolls(prev => prev.filter(p => p.id !== pollId));
    try {
      await fetch(`/api/activity/polls/${pollId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
    } catch {}
  };

  const formatTimeRemaining = (expiresAt: number) => {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) return 'Expired';
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-[#232428] border border-[#3f4147] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">Create Poll</span>
                <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-[#3f4147] rounded-lg transition-colors">
                  <X className="w-4 h-4 text-[#949ba4]" />
                </button>
              </div>
              
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full bg-[#1e1f22] text-white placeholder-[#949ba4] px-3 py-2 rounded-lg border border-[#3f4147] focus:border-purple-500 focus:outline-none text-sm"
              />
              
              <div className="space-y-2">
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newOptions];
                        updated[i] = e.target.value;
                        setNewOptions(updated);
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 bg-[#1e1f22] text-white placeholder-[#949ba4] px-3 py-2 rounded-lg border border-[#3f4147] focus:border-purple-500 focus:outline-none text-sm"
                    />
                    {newOptions.length > 2 && (
                      <button 
                        onClick={() => setNewOptions(prev => prev.filter((_, idx) => idx !== i))}
                        className="p-2 hover:bg-[#3f4147] rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-[#949ba4]" />
                      </button>
                    )}
                  </div>
                ))}
                {newOptions.length < 5 && (
                  <button 
                    onClick={() => setNewOptions(prev => [...prev, ''])}
                    className="w-full py-2 text-purple-400 text-sm hover:underline flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add option
                  </button>
                )}
              </div>
              
              <motion.button
                onClick={createPoll}
                disabled={!newQuestion.trim() || newOptions.filter(o => o.trim()).length < 2 || creating}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:bg-[#3f4147] disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Poll'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showCreate && userId && (
        <motion.button
          onClick={() => setShowCreate(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3 rounded-xl bg-[#232428] hover:bg-[#2b2d31] border border-[#3f4147] text-[#b5bac1] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create a Poll
        </motion.button>
      )}

      {polls.length === 0 && (
        <div className="text-center py-6">
          <Vote className="w-8 h-8 text-[#4e5058] mx-auto mb-2" />
          <p className="text-[#949ba4] text-sm">No active polls</p>
          <p className="text-[#4e5058] text-xs mt-1">Be the first to create one!</p>
        </div>
      )}

      {polls.map((poll, pollIndex) => {
        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
        const hasVoted = userId && poll.votedUsers.includes(userId);
        const isOwner = userId === poll.createdBy;
        
        return (
          <motion.div
            key={poll.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pollIndex * 0.05 }}
            className="p-4 rounded-xl bg-[#232428] border border-[#3f4147]"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white text-sm font-medium">{poll.question}</p>
                <p className="text-[#949ba4] text-xs mt-0.5">
                  by {poll.createdByName} · {totalVotes} vote{totalVotes !== 1 ? 's' : ''} · {formatTimeRemaining(poll.expiresAt)}
                </p>
              </div>
              {isOwner && (
                <button 
                  onClick={() => deletePoll(poll.id)}
                  className="p-1.5 hover:bg-[#3f4147] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-[#949ba4]" />
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => vote(poll.id, option.id)}
                    disabled={!userId || hasVoted}
                    whileHover={!hasVoted && userId ? { scale: 1.01 } : {}}
                    whileTap={!hasVoted && userId ? { scale: 0.99 } : {}}
                    className={`w-full relative overflow-hidden rounded-lg text-left transition-all ${
                      hasVoted 
                        ? 'bg-[#1e1f22] cursor-default' 
                        : 'bg-[#1e1f22] hover:bg-[#2b2d31] cursor-pointer'
                    }`}
                  >
                    {hasVoted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-y-0 left-0 bg-purple-500/20"
                      />
                    )}
                    <div className="relative px-3 py-2.5 flex items-center justify-between">
                      <span className={`text-sm ${hasVoted ? 'text-white' : 'text-[#b5bac1]'}`}>{option.text}</span>
                      {hasVoted && (
                        <span className="text-sm text-purple-400 font-medium">{percentage}%</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {!userId && (
              <p className="text-center text-[#4e5058] text-xs mt-3">Sign in to vote</p>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

interface AethexEvent {
  id: string;
  title: string;
  description: string;
  type: 'stream' | 'workshop' | 'tournament' | 'ama' | 'meetup';
  startTime: number;
  endTime: number;
  host: string;
  hostAvatar?: string;
  realm: ArmType;
  attendees: number;
  maxAttendees?: number;
}

function EventCalendarTab({ userId, openExternalLink }: { userId?: string; openExternalLink: (url: string) => Promise<void> }) {
  const [events, setEvents] = useState<AethexEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpEvents, setRsvpEvents] = useState<Set<string>>(new Set());
  const [rsvping, setRsvping] = useState<string | null>(null);

  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/activity/events');
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.data || data || []).map((e: any) => ({
            id: e.id,
            title: e.title,
            description: e.description || '',
            type: e.event_type || 'stream',
            startTime: new Date(e.start_time).getTime(),
            endTime: new Date(e.end_time).getTime(),
            host: e.host_name || 'AeThex',
            realm: e.realm || 'nexus',
            attendees: e.attendee_count || 0,
            maxAttendees: e.max_attendees,
          }));
          setEvents(mapped);
          const userRsvps = (data.data || data || [])
            .filter((e: any) => e.user_rsvp)
            .map((e: any) => e.id);
          setRsvpEvents(new Set(userRsvps));
        }
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const toggleRsvp = async (eventId: string) => {
    if (!userId || rsvping) return;
    setRsvping(eventId);
    const hasRsvp = rsvpEvents.has(eventId);
    
    try {
      const response = await fetch(`/api/activity/events/${eventId}/rsvp`, {
        method: hasRsvp ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (response.ok) {
        setRsvpEvents(prev => {
          const next = new Set(prev);
          if (hasRsvp) {
            next.delete(eventId);
          } else {
            next.add(eventId);
          }
          return next;
        });
        setEvents(prev => prev.map(e => 
          e.id === eventId 
            ? { ...e, attendees: e.attendees + (hasRsvp ? -1 : 1) } 
            : e
        ));
      }
    } catch {
    } finally {
      setRsvping(null);
    }
  };

  const formatEventTime = (startTime: number) => {
    const diff = startTime - now;
    if (diff < hour) return 'Starting soon';
    if (diff < day) return `In ${Math.floor(diff / hour)}h`;
    return `In ${Math.floor(diff / day)}d`;
  };

  const getEventIcon = (type: AethexEvent['type']) => {
    switch (type) {
      case 'stream': return Video;
      case 'workshop': return BookOpen;
      case 'tournament': return Trophy;
      case 'ama': return Mic;
      case 'meetup': return MapPin;
      default: return Calendar;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Upcoming Events</p>
            <p className="text-[#949ba4] text-xs">{events.length} events this week</p>
          </div>
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-center py-6">
          <Calendar className="w-8 h-8 text-[#4e5058] mx-auto mb-2" />
          <p className="text-[#949ba4] text-sm">No upcoming events</p>
          <p className="text-[#4e5058] text-xs mt-1">Check back later for new events!</p>
        </div>
      )}

      {events.map((event, index) => {
        const config = ARM_CONFIG[event.realm];
        const EventIcon = getEventIcon(event.type);
        const hasRsvp = rsvpEvents.has(event.id);
        const isFull = event.maxAttendees && event.attendees >= event.maxAttendees;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-[#232428] border border-[#3f4147]"
          >
            <div className="flex items-start gap-3">
              <div 
                className="p-2 rounded-lg shrink-0"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <EventIcon className="w-5 h-5" style={{ color: config.color }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium truncate">{event.title}</span>
                  <span 
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium capitalize"
                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                  >
                    {event.type}
                  </span>
                </div>
                <p className="text-[#949ba4] text-xs line-clamp-1 mt-0.5">{event.description}</p>
                
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[#4e5058] text-xs">
                    <Clock className="w-3 h-3" /> {formatEventTime(event.startTime)}
                  </span>
                  <span className="flex items-center gap-1 text-[#4e5058] text-xs">
                    <Users className="w-3 h-3" /> {event.attendees}{event.maxAttendees ? `/${event.maxAttendees}` : ''}
                  </span>
                  <span className="text-[#4e5058] text-xs">by {event.host}</span>
                </div>
              </div>
              
              <motion.button
                onClick={() => toggleRsvp(event.id)}
                disabled={!userId || (isFull && !hasRsvp)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  hasRsvp 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : isFull
                    ? 'bg-[#3f4147] text-[#4e5058] cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {hasRsvp ? 'Going' : isFull ? 'Full' : 'RSVP'}
              </motion.button>
            </div>
          </motion.div>
        );
      })}
      
      <button 
        onClick={() => openExternalLink(`${APP_URL}/events`)} 
        className="w-full py-2 text-blue-400 text-sm hover:underline flex items-center justify-center gap-1"
      >
        View all events <ExternalLink className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

interface TeamListing {
  id: string;
  projectTitle: string;
  description: string;
  creator: string;
  creatorAvatar?: string;
  realm: ArmType;
  rolesNeeded: string[];
  teamSize: number;
  maxTeam: number;
  createdAt: number;
}

function TeamFinderTab({ userId, openExternalLink }: { userId?: string; openExternalLink: (url: string) => Promise<void> }) {
  const [listings, setListings] = useState<TeamListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedTeams, setAppliedTeams] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/activity/teams');
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.data || data || []).map((t: any) => ({
            id: t.id,
            projectTitle: t.project_title || t.title,
            description: t.description || '',
            creator: t.creator_name || 'Unknown',
            creatorAvatar: t.creator_avatar,
            realm: t.realm || 'gameforge',
            rolesNeeded: t.roles_needed || [],
            teamSize: t.team_size || 1,
            maxTeam: t.max_team || 5,
            createdAt: new Date(t.created_at).getTime(),
          }));
          setListings(mapped);
          const userApps = (data.data || data || [])
            .filter((t: any) => t.user_applied)
            .map((t: any) => t.id);
          setAppliedTeams(new Set(userApps));
        }
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const applyToTeam = async (teamId: string) => {
    if (!userId || appliedTeams.has(teamId) || applying) return;
    setApplying(teamId);
    
    try {
      const response = await fetch(`/api/activity/teams/${teamId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (response.ok) {
        setAppliedTeams(prev => new Set(prev).add(teamId));
      }
    } catch {
    } finally {
      setApplying(null);
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-green-400" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <UserPlus className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Team Finder</p>
              <p className="text-[#949ba4] text-xs">{listings.length} teams looking for members</p>
            </div>
          </div>
          <button
            onClick={() => openExternalLink(`${APP_URL}/gameforge/teams/create`)}
            className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Create Team
          </button>
        </div>
      </div>

      {listings.length === 0 && (
        <div className="text-center py-6">
          <UserPlus className="w-8 h-8 text-[#4e5058] mx-auto mb-2" />
          <p className="text-[#949ba4] text-sm">No teams looking for members</p>
          <p className="text-[#4e5058] text-xs mt-1">Be the first to post a team listing!</p>
        </div>
      )}

      {listings.map((listing, index) => {
        const config = ARM_CONFIG[listing.realm];
        const hasApplied = appliedTeams.has(listing.id);
        const isFull = listing.teamSize >= listing.maxTeam;

        return (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-[#232428] border border-[#3f4147]"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{listing.projectTitle}</span>
                  <config.icon className="w-4 h-4" style={{ color: config.color }} />
                </div>
                <p className="text-[#949ba4] text-xs mt-0.5">{listing.description}</p>
              </div>
              <span className="text-[#4e5058] text-xs">{formatTime(listing.createdAt)}</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-3">
              {listing.rolesNeeded.map(role => (
                <span key={role} className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                  {role}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[#4e5058] text-xs">
                  <Users className="w-3 h-3" /> {listing.teamSize}/{listing.maxTeam} members
                </span>
                <span className="text-[#4e5058] text-xs">by {listing.creator}</span>
              </div>
              
              <motion.button
                onClick={() => applyToTeam(listing.id)}
                disabled={!userId || hasApplied || isFull}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  hasApplied 
                    ? 'bg-green-500/20 text-green-400'
                    : isFull
                    ? 'bg-[#3f4147] text-[#4e5058] cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {hasApplied ? 'Applied' : isFull ? 'Full' : 'Apply'}
              </motion.button>
            </div>
          </motion.div>
        );
      })}
      
      <button 
        onClick={() => openExternalLink(`${APP_URL}/gameforge/teams`)} 
        className="w-full py-2 text-green-400 text-sm hover:underline flex items-center justify-center gap-1"
      >
        Browse all teams <ExternalLink className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

interface SpotlightCreator {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio: string;
  realm: ArmType;
  followers: number;
  projects: number;
  votes: number;
  featured: boolean;
}

function CreatorSpotlightTab({ userId, openExternalLink }: { userId?: string; openExternalLink: (url: string) => Promise<void> }) {
  const [creators, setCreators] = useState<SpotlightCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedCreators, setVotedCreators] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const response = await fetch('/api/activity/spotlight');
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.data || data || []).map((c: any) => ({
            id: c.id || c.user_id,
            username: c.username,
            displayName: c.display_name || c.full_name || c.username,
            avatar: c.avatar_url,
            bio: c.bio || '',
            realm: (c.realm || c.primary_arm || 'nexus') as ArmType,
            followers: c.followers_count || c.followers || 0,
            projects: c.projects_count || c.projects || 0,
            votes: c.votes_count || c.votes || 0,
            featured: c.featured || false,
          }));
          setCreators(mapped);
          
          const voted = (data.user_votes || []);
          setVotedCreators(new Set(voted));
        }
      } catch {
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSpotlight();
  }, []);

  const voteCreator = async (creatorId: string) => {
    if (!userId || votedCreators.has(creatorId)) return;
    
    setVotedCreators(prev => new Set(prev).add(creatorId));
    setCreators(prev => prev.map(c => 
      c.id === creatorId ? { ...c, votes: c.votes + 1 } : c
    ));
    
    try {
      await fetch(`/api/activity/spotlight/${creatorId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  const featuredCreator = creators.find(c => c.featured);
  const otherCreators = creators.filter(c => !c.featured).sort((a, b) => b.votes - a.votes);

  if (creators.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <Crown className="w-8 h-8 text-[#4e5058] mx-auto mb-2" />
        <p className="text-[#949ba4] text-sm">No spotlight creators yet</p>
        <p className="text-[#4e5058] text-xs mt-1">Featured creators will appear here</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {featuredCreator && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Featured Creator of the Week</span>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {featuredCreator.displayName[0]}
            </div>
            
            <div className="flex-1 min-w-0">
              <button 
                onClick={() => openExternalLink(`${APP_URL}/profile/${featuredCreator.username}`)}
                className="text-white text-lg font-semibold hover:text-amber-300 transition-colors"
              >
                {featuredCreator.displayName}
              </button>
              <p className="text-[#949ba4] text-sm mt-1">{featuredCreator.bio}</p>
              
              <div className="flex items-center gap-4 mt-3">
                <span className="text-[#4e5058] text-xs">{featuredCreator.followers.toLocaleString()} followers</span>
                <span className="text-[#4e5058] text-xs">{featuredCreator.projects} projects</span>
                <span className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                  <Star className="w-3 h-3 fill-current" /> {featuredCreator.votes} votes
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-white text-sm font-medium">Vote for Next Week's Spotlight</span>
        <span className="text-[#949ba4] text-xs">Resets Sunday</span>
      </div>

      {otherCreators.map((creator, index) => {
        const config = ARM_CONFIG[creator.realm];
        const hasVoted = votedCreators.has(creator.id);

        return (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-[#232428] border border-[#3f4147] flex items-center gap-3"
          >
            <span className="text-[#4e5058] text-lg font-bold w-6 text-center">#{index + 1}</span>
            
            <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-white font-bold shrink-0">
              {creator.displayName[0]}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openExternalLink(`${APP_URL}/profile/${creator.username}`)}
                  className="text-white text-sm font-medium hover:text-purple-300 transition-colors truncate"
                >
                  {creator.displayName}
                </button>
                <config.icon className="w-3.5 h-3.5 shrink-0" style={{ color: config.color }} />
              </div>
              <p className="text-[#949ba4] text-xs truncate">{creator.bio}</p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-sm font-medium ${hasVoted ? 'text-amber-400' : 'text-[#949ba4]'}`}>
                {creator.votes}
              </span>
              <motion.button
                onClick={() => voteCreator(creator.id)}
                disabled={!userId || hasVoted}
                whileHover={!hasVoted && userId ? { scale: 1.1 } : {}}
                whileTap={!hasVoted && userId ? { scale: 0.9 } : {}}
                className={`p-2 rounded-lg transition-colors ${
                  hasVoted 
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-[#1e1f22] text-[#949ba4] hover:text-amber-400 hover:bg-[#3f4147]'
                }`}
              >
                <Star className={`w-5 h-5 ${hasVoted ? 'fill-current' : ''}`} />
              </motion.button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

interface MiniGameScore {
  game: string;
  score: number;
  playedAt: number;
}

function MiniGamesTab({ userId }: { userId?: string }) {
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaAnswer, setTriviaAnswer] = useState<number | null>(null);
  const [triviaCorrect, setTriviaCorrect] = useState<boolean | null>(null);
  const [triviaStreak, setTriviaStreak] = useState(() => {
    try {
      return parseInt(localStorage.getItem('aethex_trivia_streak') || '0');
    } catch {
      return 0;
    }
  });
  const [typingRace, setTypingRace] = useState<{ text: string; startTime: number; input: string } | null>(null);
  const [typingWPM, setTypingWPM] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const triviaQuestions = [
    { question: "How many realms are there in AeThex?", options: ["4", "5", "6", "7"], correct: 2 },
    { question: "What is the GameForge realm focused on?", options: ["Business", "Game Development", "Research", "Education"], correct: 1 },
    { question: "What does XP stand for?", options: ["Extra Points", "Experience Points", "Exchange Points", "Expansion Points"], correct: 1 },
    { question: "Which realm handles R&D projects?", options: ["Nexus", "Labs", "Corp", "Foundation"], correct: 1 },
    { question: "What's the color associated with the Labs realm?", options: ["Green", "Blue", "Yellow", "Purple"], correct: 2 },
  ];

  const typingTexts = [
    "Build the future with AeThex platform",
    "Create amazing games in GameForge",
    "Explore experimental features in Labs",
    "Join the creator community today",
    "Level up your skills and earn XP",
  ];

  const handleTriviaAnswer = (answerIndex: number) => {
    if (triviaAnswer !== null) return;
    setTriviaAnswer(answerIndex);
    const isCorrect = answerIndex === triviaQuestions[triviaIndex].correct;
    setTriviaCorrect(isCorrect);
    
    if (isCorrect) {
      const newStreak = triviaStreak + 1;
      setTriviaStreak(newStreak);
      localStorage.setItem('aethex_trivia_streak', String(newStreak));
    } else {
      setTriviaStreak(0);
      localStorage.setItem('aethex_trivia_streak', '0');
    }
  };

  const nextTrivia = () => {
    setTriviaIndex((prev) => (prev + 1) % triviaQuestions.length);
    setTriviaAnswer(null);
    setTriviaCorrect(null);
  };

  const startTypingRace = () => {
    const text = typingTexts[Math.floor(Math.random() * typingTexts.length)];
    setTypingRace({ text, startTime: Date.now(), input: '' });
    setTypingWPM(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!typingRace) return;
    const input = e.target.value;
    setTypingRace({ ...typingRace, input });
    
    if (input === typingRace.text) {
      const timeTaken = (Date.now() - typingRace.startTime) / 1000 / 60;
      const words = typingRace.text.split(' ').length;
      const wpm = Math.round(words / timeTaken);
      setTypingWPM(wpm);
    }
  };

  const currentQuestion = triviaQuestions[triviaIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-500/20">
            <Dice6 className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Mini-Games</p>
            <p className="text-[#949ba4] text-xs">Play games, earn bragging rights</p>
          </div>
        </div>
      </div>

      {/* AeThex Trivia */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-[#232428] border border-[#3f4147]"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-sm font-medium flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-purple-400" /> AeThex Trivia
          </span>
          {triviaStreak > 0 && (
            <span className="flex items-center gap-1 text-amber-400 text-xs font-medium">
              <Flame className="w-3.5 h-3.5" /> {triviaStreak} streak
            </span>
          )}
        </div>
        
        <p className="text-white text-sm mb-3">{currentQuestion.question}</p>
        
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => {
            const isSelected = triviaAnswer === index;
            const isCorrect = index === currentQuestion.correct;
            const showResult = triviaAnswer !== null;
            
            return (
              <motion.button
                key={index}
                onClick={() => handleTriviaAnswer(index)}
                disabled={triviaAnswer !== null}
                whileHover={triviaAnswer === null ? { scale: 1.02 } : {}}
                whileTap={triviaAnswer === null ? { scale: 0.98 } : {}}
                className={`w-full p-3 rounded-lg text-sm text-left transition-all ${
                  showResult
                    ? isCorrect
                      ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                      : isSelected
                      ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                      : 'bg-[#1e1f22] border border-transparent text-[#949ba4]'
                    : 'bg-[#1e1f22] hover:bg-[#2b2d31] border border-transparent text-white'
                }`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
        
        {triviaAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center justify-between"
          >
            <span className={`text-sm font-medium ${triviaCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {triviaCorrect ? '🎉 Correct!' : '❌ Wrong!'}
            </span>
            <button
              onClick={nextTrivia}
              className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium transition-colors"
            >
              Next Question
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Typing Race */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-xl bg-[#232428] border border-[#3f4147]"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Typing Race
          </span>
          {typingWPM !== null && (
            <span className="text-amber-400 text-sm font-medium">{typingWPM} WPM</span>
          )}
        </div>
        
        {!typingRace ? (
          <button
            onClick={startTypingRace}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium transition-colors"
          >
            Start Race
          </button>
        ) : typingWPM !== null ? (
          <div className="text-center py-4">
            <p className="text-green-400 text-lg font-bold mb-2">🏆 {typingWPM} WPM</p>
            <p className="text-[#949ba4] text-sm mb-3">Great typing!</p>
            <button
              onClick={startTypingRace}
              className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium transition-colors"
            >
              Race Again
            </button>
          </div>
        ) : (
          <div>
            <p className="text-[#949ba4] text-sm mb-3 font-mono bg-[#1e1f22] p-3 rounded-lg">
              {typingRace.text.split('').map((char, i) => {
                const inputChar = typingRace.input[i];
                const isCorrect = inputChar === char;
                const isTyped = i < typingRace.input.length;
                
                return (
                  <span
                    key={i}
                    className={
                      isTyped
                        ? isCorrect
                          ? 'text-green-400'
                          : 'text-red-400 bg-red-500/20'
                        : 'text-[#949ba4]'
                    }
                  >
                    {char}
                  </span>
                );
              })}
            </p>
            <input
              ref={inputRef}
              type="text"
              value={typingRace.input}
              onChange={handleTypingInput}
              placeholder="Start typing..."
              className="w-full bg-[#1e1f22] text-white placeholder-[#949ba4] px-4 py-3 rounded-lg border border-[#3f4147] focus:border-yellow-500 focus:outline-none transition-colors text-sm"
            />
          </div>
        )}
      </motion.div>
      
      <p className="text-center text-[#949ba4] text-xs">
        More mini-games coming soon!
      </p>
    </motion.div>
  );
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: 'daily' | 'weekly';
  requirement: number;
  icon: string;
  endsAt: number;
}

function ChallengesTab({ userId, onXPGain }: { userId?: string; onXPGain: (amount: number) => void }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedChallenges, setClaimedChallenges] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/activity/challenges');
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.data || data || []).map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            xpReward: c.xp_reward || c.xpReward || 100,
            type: c.type || 'weekly',
            requirement: c.requirement || 1,
            icon: c.icon || '🎯',
            endsAt: new Date(c.ends_at || c.endsAt).getTime(),
          }));
          setChallenges(mapped.filter((c: Challenge) => c.endsAt > Date.now()));
          
          const progressData: Record<string, number> = {};
          const claimedData: string[] = [];
          mapped.forEach((c: any) => {
            if (c.user_progress) progressData[c.id] = c.user_progress;
            if (c.claimed) claimedData.push(c.id);
          });
          setProgress(progressData);
          setClaimedChallenges(new Set(claimedData));
        }
      } catch {
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const getWeekEnd = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSunday = 7 - dayOfWeek;
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + daysUntilSunday);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek.getTime();
  };

  const formatTimeRemaining = (endsAt: number) => {
    const remaining = endsAt - Date.now();
    if (remaining <= 0) return 'Ended';
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const claimReward = async (challenge: Challenge) => {
    if (!userId || claimedChallenges.has(challenge.id) || claiming) return;
    const currentProgress = progress[challenge.id] || 0;
    if (currentProgress < challenge.requirement) return;
    
    setClaiming(challenge.id);
    setClaimedChallenges(prev => new Set(prev).add(challenge.id));
    onXPGain(challenge.xpReward);
    
    try {
      await fetch(`/api/activity/challenges/${challenge.id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
    } catch {}
    
    setClaiming(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Weekly Challenges</p>
            <p className="text-[#949ba4] text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeRemaining(getWeekEnd())}
            </p>
          </div>
          <div className="text-right">
            <p className="text-amber-400 font-bold">{challenges.filter(c => claimedChallenges.has(c.id)).length}/{challenges.length}</p>
            <p className="text-[#949ba4] text-xs">Completed</p>
          </div>
        </div>
      </div>

      {challenges.length === 0 && (
        <div className="text-center py-6">
          <Target className="w-8 h-8 text-[#4e5058] mx-auto mb-2" />
          <p className="text-[#949ba4] text-sm">No active challenges</p>
          <p className="text-[#4e5058] text-xs mt-1">Check back soon!</p>
        </div>
      )}

      {challenges.map((challenge, index) => {
        const currentProgress = progress[challenge.id] ?? 0;
        const isCompleted = currentProgress >= challenge.requirement;
        const isClaimed = claimedChallenges.has(challenge.id);
        const isClaiming = claiming === challenge.id;
        const progressPercent = Math.min((currentProgress / challenge.requirement) * 100, 100);
        
        return (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border transition-all ${
              isClaimed 
                ? 'bg-green-500/10 border-green-500/30' 
                : isCompleted
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-[#232428] border-[#3f4147]'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`text-2xl ${isClaimed ? '' : 'grayscale-0'}`}>{challenge.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isClaimed ? 'text-green-300' : 'text-white'}`}>
                    {challenge.title}
                  </span>
                  <span className="text-amber-400 text-xs font-medium">+{challenge.xpReward} XP</span>
                </div>
                <p className="text-[#949ba4] text-xs mt-0.5">{challenge.description}</p>
                
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#1e1f22] rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${isClaimed ? 'bg-green-500' : isCompleted ? 'bg-amber-500' : 'bg-purple-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-[11px] text-[#949ba4] shrink-0">{currentProgress}/{challenge.requirement}</span>
                </div>
              </div>
              
              {isClaimed ? (
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
              ) : isCompleted ? (
                <motion.button
                  onClick={() => claimReward(challenge)}
                  disabled={isClaiming}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium transition-colors shrink-0"
                >
                  {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Claim'}
                </motion.button>
              ) : null}
            </div>
          </motion.div>
        );
      })}
      
      <p className="text-center text-[#949ba4] text-xs">
        Complete challenges to earn bonus XP and exclusive badges!
      </p>
    </motion.div>
  );
}

interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  realm: ArmType;
  thumbnail: string;
  votes: number;
  views: number;
  tags: string[];
}

function ProjectsTab({ userId, openExternalLink }: { userId?: string; openExternalLink: (url: string) => Promise<void> }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedProjects, setVotedProjects] = useState<Set<string>>(new Set());
  const [voting, setVoting] = useState<string | null>(null);
  const [filter, setFilter] = useState<ArmType | 'all'>('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/activity/projects');
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.data || data || []).map((p: any) => ({
            id: p.id,
            title: p.title || p.name,
            description: p.description || '',
            author: p.author_name || p.creator_name || 'Anonymous',
            authorAvatar: p.author_avatar,
            realm: p.realm || 'nexus',
            thumbnail: p.thumbnail || p.image_url || '🚀',
            votes: p.upvote_count || p.votes || 0,
            views: p.view_count || p.views || 0,
            tags: p.tags || [],
          }));
          setProjects(mapped);
          const userVotes = (data.data || data || [])
            .filter((p: any) => p.user_voted)
            .map((p: any) => p.id);
          setVotedProjects(new Set(userVotes));
        }
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const voteProject = async (projectId: string) => {
    if (!userId || votedProjects.has(projectId) || voting) return;
    setVoting(projectId);
    
    try {
      const response = await fetch(`/api/activity/projects/${projectId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (response.ok) {
        setVotedProjects(prev => new Set(prev).add(projectId));
        setProjects(prev => prev.map(p => 
          p.id === projectId ? { ...p, votes: p.votes + 1 } : p
        ));
      }
    } catch {
    } finally {
      setVoting(null);
    }
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.realm === filter);

  const sortedProjects = [...filteredProjects].sort((a, b) => b.votes - a.votes);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
            filter === 'all' ? 'bg-purple-500 text-white' : 'bg-[#232428] text-[#b5bac1] hover:bg-[#2b2d31]'
          }`}
        >
          All
        </button>
        {(Object.keys(ARM_CONFIG) as ArmType[]).map(realm => {
          const config = ARM_CONFIG[realm];
          return (
            <button
              key={realm}
              onClick={() => setFilter(realm)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filter === realm 
                  ? 'text-white' 
                  : 'bg-[#232428] text-[#b5bac1] hover:bg-[#2b2d31]'
              }`}
              style={filter === realm ? { backgroundColor: config.color } : {}}
            >
              <config.icon className="w-3 h-3" />
              {config.label}
            </button>
          );
        })}
      </div>

      {sortedProjects.map((project, index) => {
        const config = ARM_CONFIG[project.realm];
        const hasVoted = votedProjects.has(project.id);
        
        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-[#232428] border border-[#3f4147] group"
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: `${config.color}20` }}
              >
                {project.thumbnail}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openExternalLink(`${APP_URL}/projects/${project.id}`)}
                    className="text-white text-sm font-medium truncate hover:text-purple-300 transition-colors"
                  >
                    {project.title}
                  </button>
                  <div 
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                  >
                    {config.label}
                  </div>
                </div>
                <p className="text-[#949ba4] text-xs line-clamp-2 mt-0.5">{project.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[#4e5058] text-xs">by {project.author}</span>
                  <span className="flex items-center gap-1 text-[#4e5058] text-xs">
                    <Eye className="w-3 h-3" /> {project.views}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-[#1e1f22] text-[#949ba4] text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-1 shrink-0">
                <motion.button
                  onClick={() => voteProject(project.id)}
                  disabled={!userId || hasVoted}
                  whileHover={!hasVoted && userId ? { scale: 1.1 } : {}}
                  whileTap={!hasVoted && userId ? { scale: 0.9 } : {}}
                  className={`p-2 rounded-lg transition-colors ${
                    hasVoted 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-[#1e1f22] text-[#949ba4] hover:text-white hover:bg-[#3f4147]'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${hasVoted ? 'fill-current' : ''}`} />
                </motion.button>
                <span className={`text-sm font-medium ${hasVoted ? 'text-green-400' : 'text-white'}`}>
                  {project.votes}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
      
      <button 
        onClick={() => openExternalLink(`${APP_URL}/projects`)} 
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Layers className="w-4 h-4" /> Browse All Projects
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/activity/chat');
        if (response.ok) {
          const data = await response.json();
          const mapped = (data.data || data || []).map((m: any) => ({
            id: m.id,
            userId: m.user_id || m.userId,
            username: m.username || m.user_name || 'Anonymous',
            avatar: m.avatar_url || m.avatar || null,
            content: m.content || m.message,
            timestamp: new Date(m.created_at || m.timestamp).getTime(),
          }));
          setMessages(mapped);
        }
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = useCallback(async () => {
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
    
    try {
      await fetch('/api/activity/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          username: username || 'Anonymous',
          avatar_url: avatar,
          content: inputValue.trim(),
        }),
      });
    } catch {}
    
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }
  
  const displayMessages = messages;
  
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
        
        {displayMessages.length === 0 && (
          <div className="text-center py-8">
            <MessagesSquare className="w-8 h-8 text-[#4e5058] mx-auto mb-2" />
            <p className="text-[#949ba4] text-sm">No messages yet</p>
            <p className="text-[#4e5058] text-xs mt-1">Be the first to say hi!</p>
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
          Chat with the community
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
    { id: "polls", label: "Polls", icon: BarChart3 },
    { id: "challenges", label: "Challenges", icon: Trophy },
    { id: "projects", label: "Projects", icon: Layers },
    { id: "events", label: "Events", icon: Calendar },
    { id: "teams", label: "Teams", icon: UserPlus },
    { id: "spotlight", label: "Spotlight", icon: Crown },
    { id: "games", label: "Games", icon: Dice6 },
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
          {activeTab === "polls" && <PollsTab key="polls" userId={user?.id} username={user?.username || undefined} />}
          {activeTab === "challenges" && <ChallengesTab key="challenges" userId={user?.id} onXPGain={handleXPGain} />}
          {activeTab === "projects" && <ProjectsTab key="projects" userId={user?.id} openExternalLink={openExternalLink} />}
          {activeTab === "events" && <EventCalendarTab key="events" userId={user?.id} openExternalLink={openExternalLink} />}
          {activeTab === "teams" && <TeamFinderTab key="teams" userId={user?.id} openExternalLink={openExternalLink} />}
          {activeTab === "spotlight" && <CreatorSpotlightTab key="spotlight" userId={user?.id} openExternalLink={openExternalLink} />}
          {activeTab === "games" && <MiniGamesTab key="games" userId={user?.id} />}
          {activeTab === "realms" && <RealmsTab key="realms" currentRealm={currentRealm} openExternalLink={openExternalLink} />}
          {activeTab === "quests" && <QuestsTab key="quests" userId={user?.id} onXPGain={handleXPGain} />}
          {activeTab === "top" && <LeaderboardTab key="top" openExternalLink={openExternalLink} currentUserId={user?.id} />}
          {activeTab === "jobs" && <JobsTab key="jobs" openExternalLink={openExternalLink} userId={user?.id} />}
          {activeTab === "badges" && <BadgesTab key="badges" userId={user?.id} openExternalLink={openExternalLink} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
