import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aethexToast } from "@/lib/aethex-toast";
import {
  aethexUserService,
  type AethexUserProfile,
} from "@/lib/aethex-database-adapter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminMemberManager from "@/components/admin/AdminMemberManager";
import AdminAchievementManager from "@/components/admin/AdminAchievementManager";
import AdminSpotlightManager from "@/components/admin/AdminSpotlightManager";
import AdminStatusOverview from "@/components/admin/AdminStatusOverview";
import AdminChangelogDigest from "@/components/admin/AdminChangelogDigest";
import AdminSystemMap from "@/components/admin/AdminSystemMap";
import AdminMentorshipManager from "@/components/admin/AdminMentorshipManager";
import AdminRoadmap from "@/components/admin/AdminRoadmap";
import { AdminDiscordManagement } from "@/components/admin/AdminDiscordManagement";
import BannerSettings from "@/components/admin/BannerSettings";
import { changelogEntries } from "@/pages/Changelog";
import { blogSeedPosts } from "@/data/blogSeed";
import {
  Shield,
  Users,
  Rocket,
  PenTool,
  Command,
  Activity,
  UserCog,
  Settings,
  ExternalLink,
  ClipboardList,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Server,
  Database,
  Wifi,
  Zap,
  Heart,
  BarChart3,
  Grid3x3,
  Gauge,
  MessageSquare,
  Lock,
  Globe,
} from "lucide-react";

type Studio = {
  name: string;
  tagline?: string;
  metrics?: string;
  specialties?: string[];
};

type ProjectApplication = {
  id: string;
  status?: string | null;
  applicant_email?: string | null;
  applicant_name?: string | null;
  created_at?: string | null;
  notes?: string | null;
  projects?: {
    id?: string | null;
    title?: string | null;
    user_id?: string | null;
  } | null;
};

type OpportunityApplication = {
  id: string;
  type?: string | null;
  full_name?: string | null;
  email?: string | null;
  status?: string | null;
  availability?: string | null;
  role_interest?: string | null;
  primary_skill?: string | null;
  experience_level?: string | null;
  submitted_at?: string | null;
  message?: string | null;
};

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const normalizedEmail = user?.email?.toLowerCase() ?? "";
  const ownerEmail = "admin@aethex.tech";
  const isOwner = normalizedEmail === ownerEmail.toLowerCase();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  const [managedProfiles, setManagedProfiles] = useState<AethexUserProfile[]>(
    []
  );
  const [studios, setStudios] = useState<Studio[]>([
    {
      name: "Lone Star Studio",
      tagline: "Indie craftsmanship with AAA polish",
      metrics: "Top-rated indie hits",
      specialties: ["Unity", "Unreal", "Pixel Art"],
    },
    {
      name: "AeThex | GameForge",
      tagline: "High-performance cross-platform experiences",
      metrics: "Billions of player sessions",
      specialties: ["Roblox", "Backend", "LiveOps"],
    },
    {
      name: "Gaming Control",
      tagline: "Strategy, simulation, and systems-first design",
      metrics: "Award-winning franchises",
      specialties: ["Simulation", "AI/ML", "Economy"],
    },
  ]);
  const [projectApplications, setProjectApplications] = useState<
    ProjectApplication[]
  >([]);
  const [projectApplicationsLoading, setProjectApplicationsLoading] =
    useState(false);
  const [opportunityApplications, setOpportunityApplications] = useState<
    OpportunityApplication[]
  >([]);
  const [opportunityApplicationsLoading, setOpportunityApplicationsLoading] =
    useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const loadProfiles = useCallback(async () => {
    try {
      const list = await aethexUserService.listProfiles(200);
      setManagedProfiles(list);
    } catch (error) {
      console.warn("Failed to load managed profiles:", error);
      setManagedProfiles([]);
    }
  }, []);

  useEffect(() => {
    loadProfiles().catch(() => undefined);
  }, [loadProfiles]);

  useEffect(() => {
    fetch("/api/featured-studios")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length) setStudios(data);
      })
      .catch(() => void 0);
  }, []);

  const loadProjectApplications = useCallback(async () => {
    if (!user?.id) return;
    setProjectApplicationsLoading(true);
    try {
      const response = await fetch(
        `/api/applications?owner=${encodeURIComponent(user.id)}`
      );
      if (response.ok) {
        const data = await response.json();
        setProjectApplications(Array.isArray(data) ? data : []);
      } else {
        setProjectApplications([]);
      }
    } catch (error) {
      console.warn("Failed to load project applications:", error);
      setProjectApplications([]);
    } finally {
      setProjectApplicationsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProjectApplications().catch(() => undefined);
  }, [loadProjectApplications]);

  const loadOpportunityApplications = useCallback(async () => {
    const email = user?.email?.toLowerCase();
    if (!email) return;
    setOpportunityApplicationsLoading(true);
    try {
      const response = await fetch(
        `/api/opportunities/applications?email=${encodeURIComponent(email)}`
      );
      if (response.ok) {
        const data = await response.json();
        setOpportunityApplications(Array.isArray(data) ? data : []);
      } else {
        const message = await response.text().catch(() => "");
        if (response.status === 403) {
          aethexToast.error({
            title: "Access denied",
            description:
              "You must be signed in as the owner to view opportunity applications.",
          });
        } else {
          console.warn("Opportunity applications request failed:", message);
        }
        setOpportunityApplications([]);
      }
    } catch (error) {
      console.warn("Failed to load opportunity applications:", error);
      setOpportunityApplications([]);
    } finally {
      setOpportunityApplicationsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadOpportunityApplications().catch(() => undefined);
  }, [loadOpportunityApplications]);

  useEffect(() => {
    if (!selectedMemberId && managedProfiles.length) {
      setSelectedMemberId(managedProfiles[0].id);
    }
  }, [managedProfiles, selectedMemberId]);

  if (loading) {
    return (
      <LoadingScreen
        message="Verifying admin access..."
        showProgress
        duration={1000}
      />
    );
  }

  if (!user || !isOwner) {
    return (
      <>
        <SEO
          pageTitle="Admin"
          description="Administrative controls for AeThex."
          canonical={
            typeof window !== "undefined"
              ? window.location.href
              : (undefined as any)
          }
        />
        <Layout>
          <div className="min-h-screen bg-aethex-gradient py-12">
            <div className="container mx-auto px-4 max-w-3xl">
              <Card className="bg-red-500/10 border-red-500/30 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-red-400">Access denied</CardTitle>
                  <CardDescription>
                    This panel is restricted to {ownerEmail}. If you need
                    access, contact the site owner.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button onClick={() => navigate("/dashboard")}>
                    Go to dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/support")}
                  >
                    Contact support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  const resolvedBlogPosts = blogPosts.length ? blogPosts : blogSeedPosts;
  const selectedMember = useMemo(
    () =>
      managedProfiles.find((profile) => profile.id === selectedMemberId) ??
      null,
    [managedProfiles, selectedMemberId]
  );

  const totalMembers = managedProfiles.length;
  const publishedPosts = resolvedBlogPosts.length;
  const featuredStudios = studios.length;
  const pendingProjectApplications = projectApplications.filter((app) => {
    const status = (app.status ?? "").toLowerCase();
    return (
      status !== "approved" && status !== "completed" && status !== "closed"
    );
  }).length;

  const blogHighlights = useMemo(
    () =>
      resolvedBlogPosts.slice(0, 4).map((post) => ({
        slug: post.slug || String(post.id || "post"),
        title: post.title || "Untitled",
        category: post.category || "General",
        date: post.date || post.published_at || null,
      })),
    [resolvedBlogPosts]
  );

  useEffect(() => {
    (async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch("/api/blog?limit=100");
        const data = res.ok ? await res.json() : [];
        if (Array.isArray(data)) setBlogPosts(data);
      } catch (e) {
        console.warn("Failed to load blog posts:", e);
      } finally {
        setLoadingPosts(false);
      }
    })();
  }, []);

  return (
    <>
      <SEO
        pageTitle="Admin Control Center"
        description="Administrative controls for AeThex platform management."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-aethex-200 mb-2">
                Control Center
              </h1>
              <p className="text-muted-foreground">
                Manage platform, users, content, and integrations
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="w-full justify-start gap-2 overflow-x-auto border border-border/40 bg-background/40 px-1 py-1 backdrop-blur flex-wrap h-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="system-map">System Map</TabsTrigger>
                <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
                <TabsTrigger value="arm-metrics">Arm Metrics</TabsTrigger>
                <TabsTrigger value="discord">Discord</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-card/60 border-border/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Members
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-aethex-200">
                        {totalMembers || "—"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Active profiles synced
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 border-border/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Published Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-aethex-200">
                        {publishedPosts || "0"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Blog entries available
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 border-border/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Featured Studios
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-aethex-200">
                        {featuredStudios}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Highlighted partners
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 border-border/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Pending Applications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-aethex-200">
                        {pendingProjectApplications}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Awaiting review
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Command className="h-5 w-5 text-aethex-300" />
                      <CardTitle>Quick Actions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                      className="justify-start h-auto py-3"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Dashboard</div>
                        <div className="text-xs text-muted-foreground">
                          View KPIs
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("content")}
                      className="justify-start h-auto py-3"
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Content</div>
                        <div className="text-xs text-muted-foreground">
                          Manage blog
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("community")}
                      className="justify-start h-auto py-3"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Members</div>
                        <div className="text-xs text-muted-foreground">
                          Manage users
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("operations")}
                      className="justify-start h-auto py-3"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Operations</div>
                        <div className="text-xs text-muted-foreground">
                          Settings & config
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("discord")}
                      className="justify-start h-auto py-3"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Discord</div>
                        <div className="text-xs text-muted-foreground">
                          Bot management
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => navigate("/status")}
                      className="justify-start h-auto py-3"
                    >
                      <Gauge className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Status</div>
                        <div className="text-xs text-muted-foreground">
                          System health
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system-map" className="space-y-6">
                <AdminSystemMap />
              </TabsContent>

              <TabsContent value="roadmap" className="space-y-6">
                <AdminRoadmap />
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <PenTool className="h-5 w-5 text-aethex-300" />
                      <CardTitle>Blog Management</CardTitle>
                    </div>
                    <CardDescription>
                      {publishedPosts} published{" "}
                      {publishedPosts === 1 ? "post" : "posts"} ·{" "}
                      {loadingPosts
                        ? "refreshing content…"
                        : "latest Supabase sync"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Drafts and announcements appear instantly on the public
                      blog after saving.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loadingPosts}
                      onClick={async () => {
                        try {
                          setLoadingPosts(true);
                          const res = await fetch("/api/blog?limit=100");
                          const data = res.ok ? await res.json() : [];
                          if (Array.isArray(data)) setBlogPosts(data);
                        } finally {
                          setLoadingPosts(false);
                        }
                      }}
                    >
                      {loadingPosts ? "Refreshing…" : "Refresh Blog Posts"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="community" className="space-y-6">
                <AdminMemberManager
                  onSelectedIdChange={(id) => setSelectedMemberId(id)}
                  onRefresh={loadProfiles}
                  ownerEmail={ownerEmail}
                />
                <AdminAchievementManager targetUser={selectedMember} />
                <AdminSpotlightManager profiles={managedProfiles} />
              </TabsContent>

              <TabsContent value="mentorship" className="space-y-6">
                <AdminMentorshipManager />
              </TabsContent>

              <TabsContent value="arm-metrics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card className="bg-card/60 border-border/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-400" />
                        <CardTitle className="text-sm">Labs</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Research</p>
                        <p className="text-lg font-bold">12 projects</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Team</p>
                        <p className="text-lg font-bold">24 members</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 border-border/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        <CardTitle className="text-sm">GameForge</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Games</p>
                        <p className="text-lg font-bold">45 shipped</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Players</p>
                        <p className="text-lg font-bold">2.8M MAU</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 border-border/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                        <CardTitle className="text-sm">Corp</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Clients</p>
                        <p className="text-lg font-bold">34 active</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ARR</p>
                        <p className="text-lg font-bold">$4.2M</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 border-border/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-400" />
                        <CardTitle className="text-sm">Foundation</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Learners</p>
                        <p className="text-lg font-bold">342 active</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completion</p>
                        <p className="text-lg font-bold">87.5%</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 border-border/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-400" />
                        <CardTitle className="text-sm">Nexus</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Creators</p>
                        <p className="text-lg font-bold">1,240 active</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Success Rate</p>
                        <p className="text-lg font-bold">68%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="discord" className="space-y-6">
                <AdminDiscordManagement />
              </TabsContent>

              <TabsContent value="operations" className="space-y-6">
                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-aethex-300" />
                      <CardTitle>Home Banner</CardTitle>
                    </div>
                    <CardDescription>
                      Controls the notice shown at the top of the home page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BannerSettings />
                  </CardContent>
                </Card>

                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Grid3x3 className="h-5 w-5 text-yellow-300" />
                      <CardTitle>Featured Studios</CardTitle>
                    </div>
                    <CardDescription>
                      Control studios highlighted across AeThex
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {studios.map((s, i) => (
                        <div
                          key={`${s.name}-${i}`}
                          className="p-3 border border-border/40 rounded-lg bg-background/40"
                        >
                          <p className="font-medium">{s.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {s.tagline}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </>
  );
}
