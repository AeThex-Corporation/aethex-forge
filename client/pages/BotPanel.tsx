import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { aethexToast } from "@/lib/aethex-toast";
import {
  Bot,
  Server,
  Terminal,
  Users,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  ArrowLeftRight,
  Hash,
  Activity,
} from "lucide-react";

interface BotStatus {
  status: string;
  bot: {
    tag: string;
    id: string;
    avatar: string;
  };
  guilds: Array<{
    id: string;
    name: string;
    memberCount: number;
    icon: string;
  }>;
  guildCount: number;
  commands: string[];
  commandCount: number;
  uptime: number;
  feedBridge: {
    enabled: boolean;
    channelId: string;
  };
  timestamp: string;
}

interface LinkedUser {
  discord_id: string;
  user_id: string;
  primary_arm: string;
  created_at: string;
  profile: {
    username: string;
    full_name: string;
    avatar_url: string;
  } | null;
}

interface FeedStats {
  totalPosts: number;
  discordPosts: number;
  websitePosts: number;
  recentPosts: Array<{
    id: string;
    content: string;
    source: string;
    created_at: string;
    discord_author_name: string;
  }>;
}

interface CommandInfo {
  name: string;
  description: string;
  options: number;
}

const API_BASE = "/api/discord";

export default function BotPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [feedStats, setFeedStats] = useState<FeedStats | null>(null);
  const [commands, setCommands] = useState<CommandInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }
    fetchAllData();
  }, [user, authLoading, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchBotStatus(),
      fetchLinkedUsers(),
      fetchFeedStats(),
      fetchCommands(),
    ]);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    aethexToast.success({ description: "Data refreshed successfully" });
  };

  const fetchBotStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/bot-status`);
      if (res.ok) {
        const data = await res.json();
        setBotStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch bot status:", error);
    }
  };

  const fetchLinkedUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/linked-users`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLinkedUsers(data.links || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch linked users:", error);
    }
  };

  const fetchFeedStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/feed-stats`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setFeedStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch feed stats:", error);
    }
  };

  const fetchCommands = async () => {
    try {
      const res = await fetch(`${API_BASE}/command-stats`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCommands(data.stats.commands || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch commands:", error);
    }
  };

  const registerCommands = async () => {
    try {
      const res = await fetch(`${API_BASE}/bot-register-commands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        aethexToast.success({
          title: "Commands Registered",
          description: `Successfully registered ${data.count} commands`,
        });
        await fetchCommands();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      aethexToast.error({
        description: error?.message || "Failed to register commands",
      });
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-purple-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Loading Bot Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Bot Panel</h1>
              <p className="text-gray-400">Manage your AeThex Discord bot</p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-purple-500/50 hover:bg-purple-500/20"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {botStatus?.status === "online" ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-xl font-bold text-green-500">Online</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-xl font-bold text-red-500">Offline</span>
                      </>
                    )}
                  </div>
                </div>
                <Activity className="w-10 h-10 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Servers</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {botStatus?.guildCount || 0}
                  </p>
                </div>
                <Server className="w-10 h-10 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Uptime</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {botStatus ? formatUptime(botStatus.uptime) : "--"}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Linked Users</p>
                  <p className="text-2xl font-bold text-white mt-1">{linkedUsers.length}</p>
                </div>
                <Users className="w-10 h-10 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="users">Linked Users</TabsTrigger>
            <TabsTrigger value="feed">Feed Bridge</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-400" />
                    Bot Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {botStatus?.bot && (
                    <div className="flex items-center gap-4">
                      {botStatus.bot.avatar && (
                        <img
                          src={botStatus.bot.avatar}
                          alt="Bot Avatar"
                          className="w-16 h-16 rounded-full border-2 border-purple-500"
                        />
                      )}
                      <div>
                        <p className="text-xl font-bold text-white">{botStatus.bot.tag}</p>
                        <p className="text-sm text-gray-400">ID: {botStatus.bot.id}</p>
                      </div>
                    </div>
                  )}
                  <Separator className="bg-gray-700" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Commands</p>
                      <p className="text-lg font-semibold text-white">
                        {botStatus?.commandCount || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Feed Bridge</p>
                      <Badge
                        variant={botStatus?.feedBridge?.enabled ? "default" : "secondary"}
                        className={
                          botStatus?.feedBridge?.enabled
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }
                      >
                        {botStatus?.feedBridge?.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-purple-400" />
                    Feed Bridge Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <p className="text-2xl font-bold text-white">{feedStats?.totalPosts || 0}</p>
                      <p className="text-sm text-gray-400">Total Posts</p>
                    </div>
                    <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">
                        {feedStats?.discordPosts || 0}
                      </p>
                      <p className="text-sm text-gray-400">From Discord</p>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">
                        {feedStats?.websitePosts || 0}
                      </p>
                      <p className="text-sm text-gray-400">From Website</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="servers">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-400" />
                  Connected Servers ({botStatus?.guildCount || 0})
                </CardTitle>
                <CardDescription className="text-gray-400">
                  All Discord servers where the bot is installed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {botStatus?.guilds?.map((guild) => (
                      <div
                        key={guild.id}
                        className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition"
                      >
                        <div className="flex items-center gap-4">
                          {guild.icon ? (
                            <img
                              src={guild.icon}
                              alt={guild.name}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                              <Server className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white">{guild.name}</p>
                            <p className="text-sm text-gray-400">ID: {guild.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{guild.memberCount} members</span>
                        </div>
                      </div>
                    ))}
                    {(!botStatus?.guilds || botStatus.guilds.length === 0) && (
                      <div className="text-center py-8 text-gray-400">
                        No servers connected yet
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-green-400" />
                      Slash Commands ({commands.length})
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      All available Discord slash commands
                    </CardDescription>
                  </div>
                  <Button
                    onClick={registerCommands}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Register Commands
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commands.map((cmd) => (
                    <div
                      key={cmd.name}
                      className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-4 h-4 text-purple-400" />
                        <span className="font-mono font-semibold text-white">/{cmd.name}</span>
                        {cmd.options > 0 && (
                          <Badge variant="outline" className="text-xs border-gray-600">
                            {cmd.options} options
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{cmd.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Linked Users ({linkedUsers.length})
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Discord accounts linked to AeThex profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {linkedUsers.map((link) => (
                      <div
                        key={link.discord_id}
                        className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {link.profile?.avatar_url ? (
                            <img
                              src={link.profile.avatar_url}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white">
                              {link.profile?.full_name || link.profile?.username || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-400">
                              Discord ID: {link.discord_id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {link.primary_arm && (
                            <Badge
                              variant="outline"
                              className="border-purple-500/50 text-purple-400"
                            >
                              {link.primary_arm}
                            </Badge>
                          )}
                          <span className="text-sm text-gray-400">
                            {formatDate(link.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {linkedUsers.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        No linked users yet
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feed">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  Recent Feed Activity
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Latest posts synced between Discord and AeThex
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {feedStats?.recentPosts?.map((post) => (
                      <div
                        key={post.id}
                        className="p-4 bg-gray-700/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={
                              post.source === "discord"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-blue-500/20 text-blue-400"
                            }
                          >
                            {post.source === "discord" ? "Discord" : "Website"}
                          </Badge>
                          {post.discord_author_name && (
                            <span className="text-sm text-gray-400">
                              by {post.discord_author_name}
                            </span>
                          )}
                          <span className="text-sm text-gray-500 ml-auto">
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-300 line-clamp-2">
                          {post.content?.slice(0, 200)}
                          {post.content?.length > 200 ? "..." : ""}
                        </p>
                      </div>
                    ))}
                    {(!feedStats?.recentPosts || feedStats.recentPosts.length === 0) && (
                      <div className="text-center py-8 text-gray-400">
                        No recent feed activity
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
