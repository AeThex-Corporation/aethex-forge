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
  Code,
  Users,
  Briefcase,
  ExternalLink,
  ArrowRight,
  AlertCircle,
  Edit,
  Save,
} from "lucide-react";
import { TeamWidget } from "@/components/TeamWidget";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function DevLinkDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useArmTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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
        const profileRes = await fetch(`${API_BASE}/api/devlink/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          profileRes.ok &&
          profileRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await profileRes.json();
          setProfile(data);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const oppRes = await fetch(`${API_BASE}/api/devlink/opportunities`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          oppRes.ok &&
          oppRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await oppRes.json();
          setOpportunities(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const teamsRes = await fetch(`${API_BASE}/api/devlink/teams`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          teamsRes.ok &&
          teamsRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await teamsRes.json();
          setTeams(Array.isArray(data) ? data : []);
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
    return <LoadingScreen message="Loading DEV-LINK..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-cyan-950/30 to-black flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              DEV-LINK
            </h1>
            <p className="text-gray-400">Roblox Developer Network</p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-lg py-6"
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
              DEV-LINK
            </h1>
            <p className="text-gray-400 text-lg">
              Roblox Developer Network | Vibrant Cyan
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className="grid w-full grid-cols-4 bg-cyan-950/30 border border-cyan-500/20 p-1"
              style={{ fontFamily: theme.fontFamily }}
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile Editor</TabsTrigger>
              <TabsTrigger value="jobs">Roblox Jobs</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-sm text-gray-400">Profile Views</p>
                    <p className="text-3xl font-bold text-white">
                      {profile?.profile_views || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-500/20">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-sm text-gray-400">Job Matches</p>
                    <p className="text-3xl font-bold text-white">
                      {opportunities.length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-sm text-gray-400">Team Requests</p>
                    <p className="text-3xl font-bold text-white">
                      {teams.length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500/40">
                  <CardContent className="p-6 text-center space-y-4">
                    <h3
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: theme.fontFamily }}
                    >
                      Browse Roblox Jobs
                    </h3>
                    <Button
                      onClick={() => navigate("/dev-link/jobs")}
                      variant="outline"
                      className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                      style={{ fontFamily: theme.fontFamily }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View All Roblox Jobs
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/40">
                  <CardContent className="p-6 text-center space-y-4">
                    <h3
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: theme.fontFamily }}
                    >
                      Find a Teammate
                    </h3>
                    <Button
                      onClick={() => navigate("/dev-link/teams")}
                      variant="outline"
                      className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                      style={{ fontFamily: theme.fontFamily }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Search Teams
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Editor Tab */}
            <TabsContent value="profile" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>My dev-link Profile Editor</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-500/30"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? (
                        <Save className="h-4 w-4 mr-2" />
                      ) : (
                        <Edit className="h-4 w-4 mr-2" />
                      )}
                      {isEditing ? "Save" : "Edit"}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Customize your Roblox portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Roblox Creations */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white">
                      My Roblox Creations
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full px-4 py-2 bg-black/30 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500"
                        placeholder="List your Roblox creations and projects..."
                        defaultValue={profile?.creations || ""}
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-400">
                        {profile?.creations || "No creations listed yet"}
                      </p>
                    )}
                  </div>

                  {/* Experiences */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white">
                      My Experiences (Asset IDs)
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full px-4 py-2 bg-black/30 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500"
                        placeholder="List your Roblox experience IDs..."
                        defaultValue={profile?.experiences || ""}
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-400">
                        {profile?.experiences || "No experiences listed yet"}
                      </p>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white">
                      EdTech Certifications
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full px-4 py-2 bg-black/30 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500"
                        placeholder="List your FOUNDATION course certifications..."
                        defaultValue={profile?.certifications || ""}
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-400">
                        {profile?.certifications ||
                          "No certifications listed yet"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roblox Job Feed Tab */}
            <TabsContent value="jobs" className="space-y-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                <CardHeader>
                  <CardTitle>Roblox Job Feed</CardTitle>
                  <CardDescription>
                    Pre-filtered DEV-LINK opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {opportunities.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 mx-auto text-gray-500 opacity-50 mb-4" />
                      <p className="text-gray-400">
                        No matching jobs at this time
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {opportunities.map((job: any) => (
                        <div
                          key={job.id}
                          className="p-4 bg-black/30 rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition"
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h4 className="font-semibold text-white">
                              {job.title}
                            </h4>
                            <Badge className="bg-cyan-600/50 text-cyan-100">
                              Roblox
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            {job.description?.substring(0, 100)}...
                          </p>
                          <p className="text-sm font-semibold text-white mt-2">
                            ${job.budget?.toLocaleString()}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
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

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-4 animate-fade-in">
              <TeamWidget
                members={teams.flatMap((t: any) =>
                  (t.members || []).map((m: any) => ({
                    id: m.id,
                    name: m.full_name,
                    role: m.role || "Member",
                    type: m.role === "lead" ? "lead" : "member",
                    avatar: m.avatar_url,
                    team_name: t.name,
                  })),
                )}
                title="My dev-link Teams"
                description="Find and manage Roblox development teams"
                accentColor="cyan"
                onMemberClick={() => {}}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
