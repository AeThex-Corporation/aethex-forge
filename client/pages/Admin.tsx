import Layout from "@/components/Layout";
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
} from "lucide-react";

export default function Admin() {
  const { user, loading, roles } = useAuth();
  const navigate = useNavigate();
  const ownerEmail = "mrpiglr@gmail.com";
  const normalizedEmail = user?.email?.toLowerCase() ?? "";
  const isOwner =
    (Array.isArray(roles) && roles.includes("owner")) ||
    normalizedEmail === ownerEmail;
  const [managedProfiles, setManagedProfiles] = useState<AethexUserProfile[]>(
    [],
  );
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
  const [opportunityApplications, setOpportunityApplications] = useState<
    OpportunityApplication[]
  >([]);
  const [opportunityApplicationsLoading, setOpportunityApplicationsLoading] =
    useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

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
        `/api/applications?owner=${encodeURIComponent(user.id)}`,
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
        `/api/opportunities/applications?email=${encodeURIComponent(email)}`,
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
    // Do not redirect unauthenticated users; show inline access UI instead
  }, [user, loading, navigate]);

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
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="bg-red-500/10 border-red-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-red-400">Access denied</CardTitle>
                <CardDescription>
                  This panel is restricted to {ownerEmail}. If you need access,
                  contact the site owner.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button onClick={() => navigate("/dashboard")}>
                  Go to dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate("/support")}>
                  Contact support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const resolvedBlogPosts = blogPosts.length ? blogPosts : blogSeedPosts;

  const blogHighlights = useMemo(
    () =>
      resolvedBlogPosts.slice(0, 4).map((post) => ({
        slug: post.slug || String(post.id || "post"),
        title: post.title || "Untitled",
        category: post.category || "General",
        date: post.date || post.published_at || null,
      })),
    [resolvedBlogPosts],
  );

  type ChangelogEntry = (typeof changelogEntries)[number];

  const latestChangelog = useMemo<ChangelogEntry[]>(
    () => changelogEntries.slice(0, 3),
    [],
  );

  const statusSnapshot = useMemo(
    () => [
      {
        name: "Core API",
        status: "operational" as const,
        uptime: "99.98%",
        responseTime: 145,
        icon: Server,
      },
      {
        name: "Database",
        status: "operational" as const,
        uptime: "99.99%",
        responseTime: 89,
        icon: Database,
      },
      {
        name: "Realtime",
        status: "operational" as const,
        uptime: "99.95%",
        responseTime: 112,
        icon: Wifi,
      },
      {
        name: "Deploy & CDN",
        status: "operational" as const,
        uptime: "99.94%",
        responseTime: 76,
        icon: Zap,
      },
    ],
    [],
  );

  const overallStatus = useMemo(() => {
    const base = {
      label: "All systems operational",
      accentClass: "text-emerald-300",
      badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
      Icon: CheckCircle,
    } as const;

    if (!statusSnapshot.length) return base;

    if (statusSnapshot.some((service) => service.status === "outage")) {
      return {
        label: "Service disruption",
        accentClass: "text-red-300",
        badgeClass: "border-red-500/40 bg-red-500/10 text-red-200",
        Icon: XCircle,
      };
    }

    if (statusSnapshot.some((service) => service.status === "degraded")) {
      return {
        label: "Partial degradation",
        accentClass: "text-yellow-300",
        badgeClass: "border-yellow-500/40 bg-yellow-500/10 text-yellow-200",
        Icon: AlertTriangle,
      };
    }

    return base;
  }, [statusSnapshot]);

  const blogReach = useMemo(
    () =>
      resolvedBlogPosts.reduce((total, post) => total + (post.likes ?? 0), 0),
    [resolvedBlogPosts],
  );

  const selectedMember = useMemo(
    () =>
      managedProfiles.find((profile) => profile.id === selectedMemberId) ??
      null,
    [managedProfiles, selectedMemberId],
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

  const infrastructureMetrics = useMemo(() => {
    if (!statusSnapshot.length) {
      return {
        averageResponseTime: null as number | null,
        averageUptime: null as number | null,
        degradedServices: 0,
        healthyServices: 0,
        totalServices: 0,
      };
    }

    const totalServices = statusSnapshot.length;
    const degradedServices = statusSnapshot.filter(
      (service) => service.status !== "operational",
    ).length;
    const averageResponseTime = Math.round(
      statusSnapshot.reduce((sum, service) => sum + service.responseTime, 0) /
        totalServices,
    );
    const uptimeAccumulator = statusSnapshot.reduce(
      (acc, service) => {
        const numeric = Number.parseFloat(service.uptime);
        if (Number.isFinite(numeric)) {
          return { total: acc.total + numeric, count: acc.count + 1 };
        }
        return acc;
      },
      { total: 0, count: 0 },
    );
    const averageUptime = uptimeAccumulator.count
      ? uptimeAccumulator.total / uptimeAccumulator.count
      : null;

    return {
      averageResponseTime,
      averageUptime,
      degradedServices,
      healthyServices: totalServices - degradedServices,
      totalServices,
    };
  }, [statusSnapshot]);

  const overviewStats = useMemo(
    () => [
      {
        title: "Total members",
        value: totalMembers ? totalMembers.toString() : "—",
        description: "Profiles synced from AeThex identity service.",
        trend: totalMembers
          ? `${totalMembers} active profiles`
          : "Awaiting sync",
        icon: Users,
        tone: "blue" as const,
      },
      {
        title: "Published posts",
        value: publishedPosts ? publishedPosts.toString() : "0",
        description: "Blog entries stored in Supabase content tables.",
        trend: loadingPosts
          ? "Refreshing content…"
          : blogHighlights.length
            ? `Latest: ${blogHighlights[0].title}`
            : "Curate new stories",
        icon: PenTool,
        tone: "purple" as const,
      },
      {
        title: "Blog engagement",
        value: blogReach ? `${blogReach.toLocaleString()} applause` : "—",
        description: "Aggregate reactions across highlighted AeThex posts.",
        trend:
          blogHighlights.length > 1
            ? `Next up: ${blogHighlights[1].title}`
            : "Share a new update",
        icon: Activity,
        tone: "red" as const,
      },
      {
        title: "Average latency",
        value:
          infrastructureMetrics.averageResponseTime !== null
            ? `${infrastructureMetrics.averageResponseTime} ms`
            : "—",
        description:
          "Mean response time across monitored infrastructure services.",
        trend:
          infrastructureMetrics.degradedServices > 0
            ? `${infrastructureMetrics.degradedServices} service${infrastructureMetrics.degradedServices === 1 ? "" : "s"} above SLA target`
            : "All services meeting SLA",
        icon: Zap,
        tone: "purple" as const,
      },
      {
        title: "Reliability coverage",
        value:
          infrastructureMetrics.totalServices > 0
            ? `${infrastructureMetrics.healthyServices}/${infrastructureMetrics.totalServices} healthy`
            : "—",
        description: "Operational services within the AeThex platform stack.",
        trend:
          infrastructureMetrics.averageUptime !== null
            ? `Avg uptime ${infrastructureMetrics.averageUptime.toFixed(2)}%`
            : "Awaiting uptime telemetry",
        icon: Shield,
        tone: "green" as const,
      },
      {
        title: "Featured studios",
        value: featuredStudios ? featuredStudios.toString() : "0",
        description: "Studios highlighted on community landing pages.",
        trend: "Synced nightly from partner directory",
        icon: Rocket,
        tone: "green" as const,
      },
      {
        title: "Pending project applications",
        value: projectApplicationsLoading
          ? "…"
          : pendingProjectApplications.toString(),
        description: "Project collaboration requests awaiting review.",
        trend: projectApplicationsLoading
          ? "Fetching submissions…"
          : `${projectApplications.length} total submissions`,
        icon: ClipboardList,
        tone: "orange" as const,
      },
      {
        title: "Opportunity pipeline",
        value: opportunityApplicationsLoading
          ? "…"
          : opportunityApplications.length.toString(),
        description:
          "Contributor & career submissions captured via Opportunities.",
        trend: opportunityApplicationsLoading
          ? "Syncing applicant data…"
          : `${opportunityApplications.filter((app) => (app.status ?? "new").toLowerCase() === "new").length} awaiting review`,
        icon: Rocket,
        tone: "green" as const,
      },
    ],
    [
      projectApplications.length,
      projectApplicationsLoading,
      opportunityApplications.length,
      opportunityApplicationsLoading,
      featuredStudios,
      loadingPosts,
      pendingProjectApplications,
      publishedPosts,
      totalMembers,
      blogReach,
      blogHighlights,
      infrastructureMetrics,
    ],
  );

  const quickActions = useMemo(
    () => [
      {
        label: "Review dashboard",
        description: "Jump to the live product dashboard and KPIs.",
        icon: Activity,
        action: () => navigate("/dashboard"),
      },
      {
        label: "Manage content",
        description: "Create, edit, and publish new blog updates.",
        icon: PenTool,
        action: () => setActiveTab("content"),
      },
      {
        label: "Member directory",
        description: "Audit profiles, roles, and onboarding progress.",
        icon: Users,
        action: () => setActiveTab("community"),
      },
      {
        label: "Operations runbook",
        description: "Review featured studios and partner programs.",
        icon: Settings,
        action: () => setActiveTab("operations"),
      },
      {
        label: "Review applications",
        description: "Approve partnership or project requests.",
        icon: ClipboardList,
        action: () => setActiveTab("operations"),
      },
      {
        label: "Opportunity applicants",
        description:
          "Review contributor and career applications from Opportunities.",
        icon: Users,
        action: () => {
          setActiveTab("operations");
          if (typeof window !== "undefined") {
            setTimeout(() => {
              document
                .getElementById("opportunity-applications")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 75);
          }
        },
      },
      {
        label: "System status",
        description: "Monitor uptime and live incidents for AeThex services.",
        icon: Server,
        action: () => navigate("/status"),
      },
      {
        label: "Open Builder CMS",
        description: "Edit marketing pages and landing content in Builder.io.",
        icon: ExternalLink,
        action: () => {
          if (typeof window !== "undefined") {
            window.open("https://builder.io", "_blank", "noopener");
          }
        },
      },
      {
        label: "Invite teammates",
        description: "Send access links and assign admin roles.",
        icon: UserCog,
        action: () => setActiveTab("community"),
      },
    ],
    [navigate, setActiveTab],
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

  const savePost = async (idx: number) => {
    const p = blogPosts[idx];
    const payload = {
      ...p,
      slug: (p.slug || p.title || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    };
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok)
      return aethexToast.error({
        title: "Save failed",
        description: await res.text().catch(() => ""),
      });
    const saved = await res.json();
    const next = blogPosts.slice();
    next[idx] = saved;
    setBlogPosts(next);
    aethexToast.success({ title: "Saved", description: saved.title });
  };

  const deletePost = async (idx: number) => {
    const p = blogPosts[idx];
    const res = await fetch(`/api/blog/${encodeURIComponent(p.slug)}`, {
      method: "DELETE",
    });
    if (!res.ok)
      return aethexToast.error({
        title: "Delete failed",
        description: await res.text().catch(() => ""),
      });
    setBlogPosts(blogPosts.filter((_, i) => i !== idx));
    aethexToast.info({ title: "Deleted", description: p.title });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gradient">
                Admin Control Center
              </h1>
              <p className="text-muted-foreground">
                Unified oversight for AeThex operations, content, and community.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-green-500/50 text-green-300"
                >
                  Owner
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-500/50 text-blue-300"
                >
                  Admin
                </Badge>
                <Badge
                  variant="outline"
                  className="border-purple-500/50 text-purple-300"
                >
                  Founder
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Signed in as{" "}
                <span className="text-foreground">
                  {normalizedEmail || ownerEmail}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/profile")}>
                Profile
              </Button>
              <Button onClick={() => setActiveTab("content")}>
                Create update
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="w-full justify-start gap-2 overflow-x-auto border border-border/40 bg-background/40 px-1 py-1 backdrop-blur">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="system-map">System Map</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {overviewStats.map((stat) => (
                  <AdminStatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    description={stat.description}
                    trend={stat.trend}
                    icon={stat.icon}
                    tone={stat.tone}
                    actions={
                      stat.title === "Featured studios" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate("/community#featured-studios")
                            }
                          >
                            Open community
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setActiveTab("operations")}
                          >
                            Manage studios
                          </Button>
                        </div>
                      ) : undefined
                    }
                  />
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <AdminStatusOverview
                  services={statusSnapshot}
                  overall={overallStatus}
                  onViewStatus={() => navigate("/status")}
                />

                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Command className="h-5 w-5 text-aethex-300" />
                      <CardTitle>Quick actions</CardTitle>
                    </div>
                    <CardDescription>
                      Launch frequent administrative workflows.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {quickActions.map(
                      ({ label, description, icon: ActionIcon, action }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={action}
                          className="group flex items-start gap-3 rounded-lg border border-border/30 bg-background/40 px-4 py-3 text-left transition hover:border-aethex-400/60 hover:bg-background/60"
                        >
                          <ActionIcon className="mt-0.5 h-5 w-5 text-aethex-400 transition group-hover:text-aethex-200" />
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {description}
                            </p>
                          </div>
                        </button>
                      ),
                    )}
                  </CardContent>
                </Card>

                <AdminChangelogDigest
                  entries={latestChangelog}
                  onViewChangelog={() => navigate("/changelog")}
                />

                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-400" />
                      <CardTitle>Access control</CardTitle>
                    </div>
                    <CardDescription>
                      Owner-only access enforced via Supabase roles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <ul className="space-y-2 leading-relaxed">
                      <li>
                        Owner email:{" "}
                        <span className="text-foreground">{ownerEmail}</span>
                      </li>
                      <li>
                        Roles are provisioned automatically on owner sign-in.
                      </li>
                      <li>
                        Grant additional admins by updating Supabase role
                        assignments.
                      </li>
                    </ul>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("community")}
                      >
                        View members
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/support")}
                      >
                        Contact support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                    <CardTitle>Content overview</CardTitle>
                  </div>
                  <CardDescription>
                    {publishedPosts} published{" "}
                    {publishedPosts === 1 ? "post" : "posts"} ·{" "}
                    {loadingPosts
                      ? "refreshing content…"
                      : "latest Supabase sync"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>
                    Drafts and announcements appear instantly on the public blog
                    after saving. Use scheduled releases for major updates and
                    keep thumbnails optimised for 1200×630.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 border-border/40 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-aethex-400" />
                    <CardTitle className="text-lg">Blog posts</CardTitle>
                  </div>
                  <CardDescription>
                    Manage blog content stored in Supabase
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
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
                      {loadingPosts ? "Refreshing…" : "Refresh"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        setBlogPosts([
                          {
                            title: "New Post",
                            slug: "new-post",
                            category: "General",
                          },
                          ...blogPosts,
                        ])
                      }
                    >
                      Add post
                    </Button>
                  </div>

                  {blogPosts.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No posts loaded yet. Use “Refresh” or “Add post” to start
                      managing content.
                    </p>
                  )}

                  {blogPosts.map((p, i) => (
                    <div
                      key={p.id || p.slug || i}
                      className="space-y-2 rounded border border-border/40 bg-background/40 p-3"
                    >
                      <div className="grid gap-2 md:grid-cols-2">
                        <input
                          className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                          placeholder="Title"
                          value={p.title || ""}
                          onChange={(e) => {
                            const next = blogPosts.slice();
                            next[i] = { ...next[i], title: e.target.value };
                            setBlogPosts(next);
                          }}
                        />
                        <input
                          className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                          placeholder="Slug"
                          value={p.slug || ""}
                          onChange={(e) => {
                            const next = blogPosts.slice();
                            next[i] = { ...next[i], slug: e.target.value };
                            setBlogPosts(next);
                          }}
                        />
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <input
                          className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                          placeholder="Author"
                          value={p.author || ""}
                          onChange={(e) => {
                            const n = blogPosts.slice();
                            n[i] = { ...n[i], author: e.target.value };
                            setBlogPosts(n);
                          }}
                        />
                        <input
                          className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                          placeholder="Date"
                          value={p.date || ""}
                          onChange={(e) => {
                            const n = blogPosts.slice();
                            n[i] = { ...n[i], date: e.target.value };
                            setBlogPosts(n);
                          }}
                        />
                      </div>
                      <div className="grid gap-2 md:grid-cols-3">
                        <input
                          className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                          placeholder="Read time (e.g., 8 min read)"
                          value={p.read_time || ""}
                          onChange={(e) => {
                            const n = blogPosts.slice();
                            n[i] = { ...n[i], read_time: e.target.value };
                            setBlogPosts(n);
                          }}
                        />
                        <input
                          className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                          placeholder="Category"
                          value={p.category || ""}
                          onChange={(e) => {
                            const n = blogPosts.slice();
                            n[i] = { ...n[i], category: e.target.value };
                            setBlogPosts(n);
                          }}
                        />
                        <input
                          className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                          placeholder="Image URL"
                          value={p.image || ""}
                          onChange={(e) => {
                            const n = blogPosts.slice();
                            n[i] = { ...n[i], image: e.target.value };
                            setBlogPosts(n);
                          }}
                        />
                      </div>
                      <textarea
                        className="w-full bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                        rows={2}
                        placeholder="Excerpt"
                        value={p.excerpt || ""}
                        onChange={(e) => {
                          const n = blogPosts.slice();
                          n[i] = { ...n[i], excerpt: e.target.value };
                          setBlogPosts(n);
                        }}
                      />
                      <textarea
                        className="w-full bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                        rows={6}
                        placeholder="Body HTML"
                        value={p.body_html || ""}
                        onChange={(e) => {
                          const n = blogPosts.slice();
                          n[i] = { ...n[i], body_html: e.target.value };
                          setBlogPosts(n);
                        }}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePost(i)}
                        >
                          Delete
                        </Button>
                        <Button size="sm" onClick={() => savePost(i)}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <AdminMemberManager
                profiles={managedProfiles}
                selectedId={selectedMemberId}
                onSelectedIdChange={(id) => setSelectedMemberId(id)}
                onRefresh={loadProfiles}
                ownerEmail={ownerEmail}
              />

              <AdminAchievementManager targetUser={selectedMember} />

              <AdminSpotlightManager profiles={managedProfiles} />

              <Card className="bg-card/60 border-border/40 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-teal-300" />
                    <CardTitle>Community actions</CardTitle>
                  </div>
                  <CardDescription>
                    Grow the network and celebrate contributors.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => navigate("/community")}>
                    Open community hub
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("mentorship")}
                  >
                    Manage mentorships
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/support")}
                  >
                    Support queue
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentorship" className="space-y-6">
              <AdminMentorshipManager />
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-card/60 border-border/40 backdrop-blur lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-yellow-300" />
                      <CardTitle>Featured studios</CardTitle>
                    </div>
                    <CardDescription>
                      Control studios highlighted across AeThex experiences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {studios.map((s, i) => (
                      <div
                        key={`${s.name}-${i}`}
                        className="space-y-2 rounded border border-border/40 bg-background/40 p-3"
                      >
                        <div className="grid gap-2 md:grid-cols-2">
                          <input
                            className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                            value={s.name}
                            onChange={(e) => {
                              const next = studios.slice();
                              next[i] = { ...next[i], name: e.target.value };
                              setStudios(next);
                            }}
                            placeholder="Studio name"
                          />
                          <input
                            className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                            value={s.tagline || ""}
                            onChange={(e) => {
                              const next = studios.slice();
                              next[i] = { ...next[i], tagline: e.target.value };
                              setStudios(next);
                            }}
                            placeholder="Tagline"
                          />
                        </div>
                        <div className="grid gap-2 md:grid-cols-2">
                          <input
                            className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                            value={s.metrics || ""}
                            onChange={(e) => {
                              const next = studios.slice();
                              next[i] = { ...next[i], metrics: e.target.value };
                              setStudios(next);
                            }}
                            placeholder="Metrics (e.g., 1B+ sessions)"
                          />
                          <input
                            className="bg-background/50 border border-border/40 rounded px-2 py-1 text-sm"
                            value={(s.specialties || []).join(", ")}
                            onChange={(e) => {
                              const next = studios.slice();
                              next[i] = {
                                ...next[i],
                                specialties: e.target.value
                                  .split(",")
                                  .map((v) => v.trim())
                                  .filter(Boolean),
                              };
                              setStudios(next);
                            }}
                            placeholder="Specialties (comma separated)"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setStudios(studios.filter((_, idx) => idx !== i))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-wrap justify-between gap-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setStudios([...studios, { name: "New Studio" }])
                          }
                        >
                          Add studio
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate("/community#featured-studios")
                          }
                        >
                          Open community
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={async () => {
                          const resp = await fetch("/api/featured-studios", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ studios }),
                          });
                          if (!resp.ok) {
                            aethexToast.error({
                              title: "Save failed",
                              description:
                                "Unable to persist featured studios.",
                            });
                          } else {
                            aethexToast.success({
                              title: "Studios saved",
                              description:
                                "Featured studios updated successfully.",
                            });
                          }
                        }}
                      >
                        Save studios
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-sky-300" />
                      <CardTitle>Project applications</CardTitle>
                    </div>
                    <CardDescription>
                      Review collaboration requests and prioritize approvals.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p>
                        {projectApplicationsLoading
                          ? "Loading application data…"
                          : `${projectApplications.length} total submissions (${pendingProjectApplications} waiting)`}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadProjectApplications}
                        disabled={projectApplicationsLoading}
                      >
                        {projectApplicationsLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Refresh
                      </Button>
                    </div>
                    {projectApplicationsLoading ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin text-aethex-300" />
                        Synchronizing with Supabase…
                      </div>
                    ) : projectApplications.length ? (
                      <div className="grid gap-2">
                        {projectApplications.slice(0, 6).map((app) => (
                          <div
                            key={
                              app.id ||
                              `${app.applicant_email ?? "applicant"}-${app.projects?.id ?? "project"}`
                            }
                            className="space-y-1 rounded border border-border/30 bg-background/40 p-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-medium text-foreground">
                                {app.applicant_name ||
                                  app.applicant_email ||
                                  "Unknown applicant"}
                              </p>
                              <Badge variant="outline" className="capitalize">
                                {(app.status ?? "pending").toLowerCase()}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {app.projects?.title ?? "No project title"}
                            </p>
                            {app.created_at ? (
                              <p className="text-[11px] text-muted-foreground/80">
                                Submitted{" "}
                                {new Date(app.created_at).toLocaleString()}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>
                        No project applications on file. Encourage partners to
                        apply via briefs.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card
                  id="opportunity-applications"
                  className="bg-card/60 border-border/40 backdrop-blur"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-emerald-300" />
                      <CardTitle>Opportunity applications</CardTitle>
                    </div>
                    <CardDescription>
                      View contributor and career submissions captured on the
                      Opportunities page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p>
                        {opportunityApplicationsLoading
                          ? "Loading opportunity applicants…"
                          : `${opportunityApplications.length} submissions`}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadOpportunityApplications}
                        disabled={opportunityApplicationsLoading}
                      >
                        {opportunityApplicationsLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Refresh
                      </Button>
                    </div>
                    {opportunityApplicationsLoading ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin text-aethex-300" />
                        Syncing with Supabase…
                      </div>
                    ) : opportunityApplications.length ? (
                      <div className="grid gap-2">
                        {opportunityApplications.slice(0, 6).map((app) => (
                          <div
                            key={
                              app.id ||
                              `${app.email ?? "candidate"}-${app.submitted_at ?? "time"}`
                            }
                            className="space-y-2 rounded border border-border/30 bg-background/40 p-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="font-medium text-foreground">
                                  {app.full_name || app.email || "Anonymous"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {app.email || "No email provided"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">
                                  {(app.type ?? "contributor").toLowerCase()}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {(app.status ?? "new").toLowerCase()}
                                </Badge>
                              </div>
                            </div>
                            <div className="grid gap-1 text-xs text-muted-foreground">
                              {app.role_interest ? (
                                <p>
                                  <span className="font-medium text-foreground/80">
                                    Role:
                                  </span>{" "}
                                  {app.role_interest}
                                </p>
                              ) : null}
                              {app.primary_skill ? (
                                <p>
                                  <span className="font-medium text-foreground/80">
                                    Skill:
                                  </span>{" "}
                                  {app.primary_skill}
                                </p>
                              ) : null}
                              {app.availability ? (
                                <p>
                                  <span className="font-medium text-foreground/80">
                                    Availability:
                                  </span>{" "}
                                  {app.availability}
                                </p>
                              ) : null}
                              {app.experience_level ? (
                                <p>
                                  <span className="font-medium text-foreground/80">
                                    Experience:
                                  </span>{" "}
                                  {app.experience_level}
                                </p>
                              ) : null}
                              {app.submitted_at ? (
                                <p>
                                  <span className="font-medium text-foreground/80">
                                    Submitted:
                                  </span>{" "}
                                  {new Date(app.submitted_at).toLocaleString()}
                                </p>
                              ) : null}
                            </div>
                            {app.message ? (
                              <p className="rounded bg-background/60 p-2 text-xs text-muted-foreground">
                                {app.message}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>
                        No opportunity applications yet. Share the Opportunities
                        page to grow the pipeline.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-orange-300" />
                      <CardTitle>System status</CardTitle>
                    </div>
                    <CardDescription>
                      Auth, database, and realtime services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p>Auth: Operational</p>
                    <p>Database: Operational (mock fallback available)</p>
                    <p>Realtime: Operational</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <UserCog className="h-5 w-5 text-teal-300" />
                      <CardTitle>Your account</CardTitle>
                    </div>
                    <CardDescription>
                      Owner privileges are active.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>Signed in as {user.email}.</p>
                    <p>
                      You have full administrative access across AeThex
                      services.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
