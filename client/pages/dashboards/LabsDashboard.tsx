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
} from "lucide-react";
import { ResearchWidget } from "@/components/ResearchWidget";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function LabsDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useArmTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [researchTracks, setResearchTracks] = useState<any[]>([]);
  const [bounties, setBounties] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [ipPortfolio, setIpPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      try {
        const tracksRes = await fetch(`${API_BASE}/api/labs/research-tracks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          tracksRes.ok &&
          tracksRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await tracksRes.json();
          setResearchTracks(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const bountiesRes = await fetch(`${API_BASE}/api/labs/bounties`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          bountiesRes.ok &&
          bountiesRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await bountiesRes.json();
          setBounties(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const pubRes = await fetch(`${API_BASE}/api/labs/publications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          pubRes.ok &&
          pubRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await pubRes.json();
          setPublications(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const ipRes = await fetch(`${API_BASE}/api/labs/ip-portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          ipRes.ok &&
          ipRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await ipRes.json();
          setIpPortfolio(data);
          setIsAdmin(data?.is_admin || false);
        }
      } catch (err) {
        // Silently ignore API errors
      }
    } catch (error) {
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
              Research LABS
            </h1>
            <p className="text-gray-400">Discover cutting-edge R&D</p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-lg py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className={`min-h-screen bg-gradient-to-b from-black to-black py-8 ${theme.fontClass}`}
        style={{ backgroundImage: theme.wallpaperPattern }}
      >
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-slide-down">
            <h1
              className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${theme.accentColor} bg-clip-text text-transparent`}
            >
              Research LABS
            </h1>
            <p className="text-gray-400 text-lg">
              R&D Workshop | Blueprint Technical
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
              style={{ fontFamily: theme.fontFamily }}
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="bounties">Bounties</TabsTrigger>
              <TabsTrigger value="pubs">Publications</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-sm text-gray-400">Active Tracks</p>
                    <p className="text-3xl font-bold text-white">
                      {researchTracks.length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-950/40 to-yellow-900/20 border-yellow-500/20">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-sm text-gray-400">Available Bounties</p>
                    <p className="text-3xl font-bold text-white">
                      {bounties.length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-950/40 to-orange-900/20 border-orange-500/20">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-sm text-gray-400">Publications</p>
                    <p className="text-3xl font-bold text-white">
                      {publications.length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Publications */}
              {publications.length > 0 && (
                <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20">
                  <CardHeader>
                    <CardTitle>Recent Publications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {publications.slice(0, 3).map((pub: any) => (
                      <a
                        key={pub.id}
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-black/30 rounded-lg border border-amber-500/10 hover:border-amber-500/30 transition block"
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">
                              {pub.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(
                                pub.published_date,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Submit Research Proposal CTA */}
              <Card className="bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border-amber-500/40">
                <CardContent className="p-8 text-center space-y-4">
                  <h3
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: theme.fontFamily }}
                  >
                    Have a Research Idea?
                  </h3>
                  <p className="text-gray-300">
                    Submit your research proposal for the LABS pipeline
                  </p>
                  <Button
                    onClick={() => navigate("/labs/submit-proposal")}
                    className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
                    style={{ fontFamily: theme.fontFamily }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Research Proposal
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Research Tracks Tab */}
            <TabsContent value="tracks" className="space-y-4 animate-fade-in">
              <ResearchWidget
                tracks={researchTracks.map((t: any) => ({
                  id: t.id,
                  title: t.title,
                  description: t.description,
                  status: t.status,
                  progress: t.progress || 0,
                  publications: t.publications || [],
                  whitepaper_url: t.whitepaper_url,
                  lead: t.lead?.full_name,
                }))}
                title="Active Research Tracks"
                description="Internal R&D projects"
                accentColor="amber"
              />
            </TabsContent>

            {/* Bounties Tab */}
            <TabsContent value="bounties" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20">
                <CardHeader>
                  <CardTitle>Research Bounties</CardTitle>
                  <CardDescription>
                    High-difficulty opportunities from NEXUS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bounties.length === 0 ? (
                    <div className="text-center py-12">
                      <Zap className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
                      <p className="text-gray-400">No bounties available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bounties.map((bounty: any) => (
                        <div
                          key={bounty.id}
                          className="p-4 bg-black/30 rounded-lg border border-amber-500/10 hover:border-amber-500/30 transition"
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h4 className="font-semibold text-white">
                              {bounty.title}
                            </h4>
                            <p className="text-lg font-bold text-amber-400">
                              ${bounty.reward?.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm text-gray-400">
                            {bounty.description}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                          >
                            View Details <ArrowRight className="h-3 w-3 ml-2" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Publications Tab */}
            <TabsContent value="pubs" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/20">
                <CardHeader>
                  <CardTitle>Publication Pipeline</CardTitle>
                  <CardDescription>
                    Upcoming whitepapers and technical blog posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {publications.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
                      <p className="text-gray-400">No publications</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {publications.map((pub: any) => (
                        <a
                          key={pub.id}
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-black/30 rounded-lg border border-amber-500/10 hover:border-amber-500/30 transition block"
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h4 className="font-semibold text-white">
                              {pub.title}
                            </h4>
                            <Badge
                              className={
                                pub.status === "published"
                                  ? "bg-green-600/50 text-green-100"
                                  : "bg-blue-600/50 text-blue-100"
                              }
                            >
                              {pub.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            {pub.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(pub.published_date).toLocaleDateString()}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* IP Dashboard - Admin Only */}
            {isAdmin && (
              <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-red-500" />
                    IP Dashboard (Admin Only)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ipPortfolio ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-black/30 rounded-lg border border-red-500/20">
                        <p className="text-sm text-gray-400">Patents Filed</p>
                        <p className="text-3xl font-bold text-white">
                          {ipPortfolio.patents_count || 0}
                        </p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg border border-red-500/20">
                        <p className="text-sm text-gray-400">Trademarks</p>
                        <p className="text-3xl font-bold text-white">
                          {ipPortfolio.trademarks_count || 0}
                        </p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg border border-red-500/20">
                        <p className="text-sm text-gray-400">Trade Secrets</p>
                        <p className="text-3xl font-bold text-white">
                          {ipPortfolio.trade_secrets_count || 0}
                        </p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg border border-red-500/20">
                        <p className="text-sm text-gray-400">Copyrights</p>
                        <p className="text-3xl font-bold text-white">
                          {ipPortfolio.copyrights_count || 0}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      IP portfolio data not available
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
