import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useArmTheme } from "@/contexts/ArmThemeContext";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Lightbulb,
  FileText,
  Zap,
  Lock,
  ExternalLink,
  ArrowRight,
  AlertCircle,
  Send,
  Briefcase,
  TrendingUp,
  Code2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface ResearchTrack {
  id: string;
  title: string;
  description: string;
  status: "scoping" | "research" | "in-development" | "testing" | "released";
  progress: number;
  lead_name: string;
  team_size: number;
}

interface IPPortfolioItem {
  id: string;
  name: string;
  type: "patent" | "trademark" | "trade-secret" | "copyright";
  status: "filed" | "pending" | "secured" | "expired";
  filing_date: string;
  licensed_to: string;
}

interface Publication {
  id: string;
  title: string;
  description: string;
  status: "drafting" | "review" | "published";
  author: string;
  published_date: string;
  url?: string;
}

interface ResearchBounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: "intermediate" | "advanced" | "expert";
  applicants_count: number;
}

export default function LabsDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useArmTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAccessible, setIsAccessible] = useState(false);
  const [researchTracks, setResearchTracks] = useState<ResearchTrack[]>([]);
  const [ipPortfolio, setIpPortfolio] = useState<IPPortfolioItem[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [bounties, setBounties] = useState<ResearchBounty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      checkAccessAndLoadData();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const checkAccessAndLoadData = async () => {
    try {
      setLoading(true);

      // Check if user has labs affiliation
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error("No auth token");

      // Check arm affiliations
      const affiliationRes = await fetch(
        `${API_BASE}/api/user/arm-affiliations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      let hasLabsAccess = false;
      if (affiliationRes.ok) {
        const data = await affiliationRes.json();
        hasLabsAccess =
          data.arms?.includes("labs") || data.role === "admin" || data.verified;
      }

      setIsAccessible(hasLabsAccess);

      if (hasLabsAccess) {
        // Load research tracks
        try {
          const tracksRes = await fetch(
            `${API_BASE}/api/labs/research-tracks`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (tracksRes.ok) {
            const data = await tracksRes.json();
            setResearchTracks(Array.isArray(data) ? data : []);
          }
        } catch {
          // Silently ignore
        }

        // Load IP portfolio
        try {
          const ipRes = await fetch(`${API_BASE}/api/labs/ip-portfolio`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (ipRes.ok) {
            const data = await ipRes.json();
            setIpPortfolio(Array.isArray(data) ? data : []);
          }
        } catch {
          // Silently ignore
        }

        // Load publications (all)
        try {
          const pubRes = await fetch(`${API_BASE}/api/labs/publications`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (pubRes.ok) {
            const data = await pubRes.json();
            setPublications(Array.isArray(data) ? data : []);
          }
        } catch {
          // Silently ignore
        }

        // Load bounties
        try {
          const bountiesRes = await fetch(`${API_BASE}/api/labs/bounties`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (bountiesRes.ok) {
            const data = await bountiesRes.json();
            setBounties(Array.isArray(data) ? data : []);
          }
        } catch {
          // Silently ignore
        }
      }
    } catch {
      // Silently ignore errors
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading LABS..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/30 to-black flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <div className="space-y-2">
              <Code2 className="h-16 w-16 mx-auto text-amber-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent font-mono">
                AeThex LABS
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Our proprietary R&D skunkworks
            </p>
            <p className="text-sm text-gray-500">
              Access our cutting-edge research, IP portfolio, and publications
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-lg py-6"
            >
              Sign In to Continue
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAccessible) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/30 to-black py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/30">
              <CardContent className="p-12 text-center space-y-6">
                <div className="space-y-3">
                  <Lock className="h-16 w-16 mx-auto text-amber-400" />
                  <h2 className="text-3xl font-bold text-white font-mono">
                    Join LABS?
                  </h2>
                  <p className="text-gray-400 text-lg">
                    LABS is our internal R&D department for A-Corp employees
                  </p>
                </div>

                <div className="space-y-4 text-left bg-black/30 p-6 rounded-lg border border-amber-500/20">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
                    What is LABS?
                  </h3>
                  <p className="text-sm text-gray-400">
                    LABS is our proprietary, for-profit R&D department that
                    takes the open-source Axiom Protocol and builds competitive,
                    closed-source "secret weapons" on top of it.
                  </p>
                  <p className="text-sm text-gray-400">
                    We house active research tracks, manage our IP portfolio,
                    publish technical whitepapers, and post high-difficulty
                    research bounties to our elite architect community.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate("/labs")}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 h-12"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Explore Published Research
                  </Button>
                  <Button
                    onClick={() => navigate("/labs/join-request")}
                    variant="outline"
                    className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/10 h-12"
                  >
                    Request LABS Access
                  </Button>
                </div>

                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  To join LABS, you must be a verified A-Corp employee or
                  architect with proven expertise
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Main dashboard - user has access
  return (
    <Layout>
      <div
        className={`min-h-screen bg-gradient-to-b from-black to-black py-8 ${theme.fontClass}`}
        style={{ backgroundImage: theme.wallpaperPattern }}
      >
        <div className="container mx-auto px-4 max-w-6xl space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-slide-down">
            <div className="flex items-center gap-3">
              <Code2 className="h-8 w-8 text-amber-400" />
              <h1
                className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${theme.accentColor} bg-clip-text text-transparent font-mono`}
              >
                LABS
              </h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl">
              R&D Workshop | Proprietary Research & IP Management
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className="grid w-full grid-cols-4 bg-amber-950/30 border border-amber-500/20 p-1"
              style={{ fontFamily: "Monaco, Courier New, monospace" }}
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tracks">Research Tracks</TabsTrigger>
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="bounties">Bounties</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20">
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Active Tracks
                      </p>
                      <Lightbulb className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="text-3xl font-bold text-white font-mono">
                      {researchTracks.length}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-950/40 to-yellow-900/20 border-yellow-500/20">
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        IP Assets
                      </p>
                      <Lock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <p className="text-3xl font-bold text-white font-mono">
                      {ipPortfolio.length}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-950/40 to-orange-900/20 border-orange-500/20">
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Publications
                      </p>
                      <FileText className="h-5 w-5 text-orange-400" />
                    </div>
                    <p className="text-3xl font-bold text-white font-mono">
                      {publications.length}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20">
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Bounties
                      </p>
                      <Zap className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="text-3xl font-bold text-white font-mono">
                      {bounties.length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Featured Research Track */}
              {researchTracks.length > 0 && (
                <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20">
                  <CardHeader>
                    <CardTitle>Featured Research Track</CardTitle>
                    <CardDescription>
                      Our current flagship R&D initiative
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const featured = researchTracks[0];
                      return (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {featured.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {featured.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500 uppercase">
                                Lead
                              </p>
                              <p className="text-sm font-mono text-white">
                                {featured.lead_name}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500 uppercase">
                                Team Size
                              </p>
                              <p className="text-sm font-mono text-white">
                                {featured.team_size} members
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500 uppercase">
                                Progress
                              </p>
                              <p className="text-sm font-mono text-white">
                                {featured.progress}%
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400">
                                Overall Progress
                              </span>
                              <span className="font-mono text-amber-400">
                                {featured.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-black/30 rounded h-2 border border-amber-500/20 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                                style={{ width: `${featured.progress}%` }}
                              />
                            </div>
                          </div>

                          <Badge className="bg-amber-600/50 text-amber-100 capitalize w-fit">
                            {featured.status.replace("-", " ")}
                          </Badge>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Recent Publications */}
              {publications.filter((p) => p.status === "published").length >
                0 && (
                <Card className="bg-gradient-to-br from-orange-950/40 to-orange-900/20 border-orange-500/20">
                  <CardHeader>
                    <CardTitle>Recent Publications</CardTitle>
                    <CardDescription>
                      Latest technical whitepapers and blog posts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {publications
                      .filter((p) => p.status === "published")
                      .slice(0, 3)
                      .map((pub) => (
                        <a
                          key={pub.id}
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-black/30 rounded-lg border border-orange-500/10 hover:border-orange-500/30 transition block group"
                        >
                          <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-orange-400 flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-white group-hover:text-orange-300 transition truncate">
                                {pub.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                By {pub.author} •{" "}
                                {new Date(
                                  pub.published_date,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0 group-hover:text-orange-400 transition" />
                          </div>
                        </a>
                      ))}
                  </CardContent>
                </Card>
              )}

              {/* CTA Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border-amber-500/40">
                  <CardContent className="p-8 flex flex-col justify-center h-full space-y-4">
                    <h3
                      className="text-xl font-bold text-white font-mono"
                      style={{ fontFamily: "Monaco, Courier New, monospace" }}
                    >
                      Submit Research Proposal
                    </h3>
                    <p className="text-sm text-gray-300">
                      Propose a new R&D initiative for LABS
                    </p>
                    <Button
                      onClick={() => navigate("/labs/submit-proposal")}
                      className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 justify-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Proposal
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border-yellow-500/40">
                  <CardContent className="p-8 flex flex-col justify-center h-full space-y-4">
                    <h3
                      className="text-xl font-bold text-white font-mono"
                      style={{ fontFamily: "Monaco, Courier New, monospace" }}
                    >
                      Browse LABS Bounties
                    </h3>
                    <p className="text-sm text-gray-300">
                      High-difficulty research opportunities from NEXUS
                    </p>
                    <Button
                      onClick={() => navigate("/nexus?category=research")}
                      className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 justify-center"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Browse Bounties
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Research Tracks Tab */}
            <TabsContent value="tracks" className="space-y-4 animate-fade-in">
              {researchTracks.length === 0 ? (
                <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20">
                  <CardContent className="p-12 text-center space-y-4">
                    <Lightbulb className="h-12 w-12 mx-auto text-amber-500 opacity-50" />
                    <p className="text-gray-400">No active research tracks</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {researchTracks.map((track) => (
                    <Card
                      key={track.id}
                      className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20 hover:border-amber-500/40 transition"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base truncate">
                              {track.title}
                            </CardTitle>
                          </div>
                          <Badge className="capitalize shrink-0">
                            {track.status.replace("-", " ")}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-400">
                          {track.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase">
                              Lead
                            </p>
                            <p className="text-sm font-mono text-white">
                              {track.lead_name}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase">
                              Team
                            </p>
                            <p className="text-sm font-mono text-white">
                              {track.team_size} members
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Progress</span>
                            <span className="font-mono text-amber-400">
                              {track.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-black/30 rounded h-2 border border-amber-500/20 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                              style={{ width: `${track.progress}%` }}
                            />
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                        >
                          View Details <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Publications Tab */}
            <TabsContent
              value="publications"
              className="space-y-4 animate-fade-in"
            >
              {publications.length === 0 ? (
                <Card className="bg-gradient-to-br from-orange-950/40 to-orange-900/20 border-orange-500/20">
                  <CardContent className="p-12 text-center space-y-4">
                    <FileText className="h-12 w-12 mx-auto text-orange-500 opacity-50" />
                    <p className="text-gray-400">No publications yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {publications.map((pub) => (
                    <a
                      key={pub.id}
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-gradient-to-r from-orange-950/40 to-orange-900/20 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition block group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white group-hover:text-orange-300 transition truncate">
                            {pub.title}
                          </h4>
                        </div>
                        <Badge
                          className={
                            pub.status === "published"
                              ? "bg-green-600/50 text-green-100 capitalize shrink-0"
                              : "bg-blue-600/50 text-blue-100 capitalize shrink-0"
                          }
                        >
                          {pub.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {pub.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          By {pub.author} •{" "}
                          {new Date(pub.published_date).toLocaleDateString()}
                        </p>
                        {pub.url && (
                          <ExternalLink className="h-4 w-4 text-orange-400 group-hover:translate-x-0.5 transition" />
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Bounties Tab */}
            <TabsContent value="bounties" className="space-y-4 animate-fade-in">
              {bounties.length === 0 ? (
                <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20">
                  <CardContent className="p-12 text-center space-y-4">
                    <Zap className="h-12 w-12 mx-auto text-amber-500 opacity-50" />
                    <p className="text-gray-400">
                      No active research bounties at this time
                    </p>
                    <Button
                      onClick={() => navigate("/nexus")}
                      variant="outline"
                      className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                    >
                      Browse All NEXUS Bounties
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {bounties.map((bounty) => (
                    <Card
                      key={bounty.id}
                      className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20 hover:border-amber-500/40 transition"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white truncate">
                              {bounty.title}
                            </h4>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-amber-400 font-mono">
                              ${bounty.reward.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-3">
                          {bounty.description}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="outline"
                            className={
                              bounty.difficulty === "expert"
                                ? "border-red-500/50 text-red-300"
                                : bounty.difficulty === "advanced"
                                  ? "border-orange-500/50 text-orange-300"
                                  : "border-yellow-500/50 text-yellow-300"
                            }
                          >
                            {bounty.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {bounty.applicants_count} applicants
                          </span>
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
                        >
                          View & Apply <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* IP Portfolio - Admin Only */}
            {ipPortfolio.length > 0 && (
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-red-500" />
                    IP Portfolio
                  </CardTitle>
                  <CardDescription>
                    Proprietary intellectual property assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-red-500/20">
                          <th className="text-left py-3 px-3 font-semibold text-gray-400 uppercase text-xs">
                            IP Name
                          </th>
                          <th className="text-left py-3 px-3 font-semibold text-gray-400 uppercase text-xs">
                            Type
                          </th>
                          <th className="text-left py-3 px-3 font-semibold text-gray-400 uppercase text-xs">
                            Status
                          </th>
                          <th className="text-left py-3 px-3 font-semibold text-gray-400 uppercase text-xs">
                            Licensed To
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ipPortfolio.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-red-500/10 hover:bg-red-500/5 transition"
                          >
                            <td className="py-3 px-3 text-white font-mono text-xs">
                              {item.name}
                            </td>
                            <td className="py-3 px-3">
                              <Badge
                                variant="outline"
                                className="capitalize text-xs"
                              >
                                {item.type.replace("-", " ")}
                              </Badge>
                            </td>
                            <td className="py-3 px-3">
                              <Badge
                                className={
                                  item.status === "secured"
                                    ? "bg-green-600/50 text-green-100"
                                    : item.status === "filed"
                                      ? "bg-blue-600/50 text-blue-100"
                                      : "bg-yellow-600/50 text-yellow-100"
                                }
                              >
                                {item.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-3 text-gray-400 text-xs">
                              {item.licensed_to}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
