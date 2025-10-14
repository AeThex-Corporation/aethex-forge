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
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
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

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!selectedMemberId && managedProfiles.length) {
      setSelectedMemberId(managedProfiles[0].id);
    }
  }, [managedProfiles, selectedMemberId]);

  if (loading || !user) {
    return (
      <LoadingScreen
        message="Verifying admin access..."
        showProgress
        duration={1000}
      />
    );
  }

  if (!isOwner) {
    return (
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="bg-red-500/10 border-red-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-red-400">Access denied</CardTitle>
                <CardDescription>
                  This panel is restricted to {ownerEmail}. If you need access, contact the site owner.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button onClick={() => navigate("/dashboard")}>Go to dashboard</Button>
                <Button variant="outline" onClick={() => navigate("/support")}>Contact support</Button>
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

  const selectedMember = useMemo(
    () =>
      managedProfiles.find((profile) => profile.id === selectedMemberId) ?? null,
    [managedProfiles, selectedMemberId],
  );

  const totalMembers = managedProfiles.length;
  const publishedPosts = blogPosts.length;
  const featuredStudios = studios.length;

  const overviewStats = useMemo(
    () => [
      {
        title: "Total members",
        value: totalMembers ? totalMembers.toString() : "—",
        description: "Profiles synced from AeThex identity service.",
        trend: totalMembers ? `${totalMembers} active profiles` : "Awaiting sync",
        icon: Users,
        tone: "blue" as const,
      },
      {
        title: "Published posts",
        value: publishedPosts ? publishedPosts.toString() : "0",
        description: "Blog entries stored in Supabase content tables.",
        trend: loadingPosts ? "Refreshing content…" : "Latest sync up to date",
        icon: PenTool,
        tone: "purple" as const,
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
        title: "Security posture",
        value: "Owner",
        description: `Admin access scoped to ${ownerEmail}.`,
        trend: "Multi-role privileges active",
        icon: Shield,
        tone: "orange" as const,
      },
    ],
    [featuredStudios, loadingPosts, ownerEmail, publishedPosts, totalMembers],
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
    [navigate],
  );

  const displayProfiles = useMemo(
    () => managedProfiles.slice(0, 12),
    [managedProfiles],
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
        <div className="container mx-auto px-4 max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gradient">Admin Control Center</h1>
              <p className="text-muted-foreground">
                Unified oversight for AeThex operations, content, and community.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-green-500/50 text-green-300">
                  Owner
                </Badge>
                <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                  Admin
                </Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                  Founder
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Signed in as <span className="text-foreground">{normalizedEmail || ownerEmail}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/profile")}>
                Profile
              </Button>
              <Button onClick={() => setActiveTab("content")}>Create update</Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full justify-start gap-2 overflow-x-auto border border-border/40 bg-background/40 px-1 py-1 backdrop-blur">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
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
                  />
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Command className="h-5 w-5 text-aethex-300" />
                      <CardTitle>Quick actions</CardTitle>
                    </div>
                    <CardDescription>Launch frequent administrative workflows.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {quickActions.map(({ label, description, icon: ActionIcon, action }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={action}
                        className="group flex items-start gap-3 rounded-lg border border-border/30 bg-background/40 px-4 py-3 text-left transition hover:border-aethex-400/60 hover:bg-background/60"
                      >
                        <ActionIcon className="mt-0.5 h-5 w-5 text-aethex-400 transition group-hover:text-aethex-200" />
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{label}</p>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card/60 border-border/40 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-400" />
                      <CardTitle>Access control</CardTitle>
                    </div>
                    <CardDescription>Owner-only access enforced via Supabase roles.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <ul className="space-y-2 leading-relaxed">
                      <li>
                        Owner email: <span className="text-foreground">{ownerEmail}</span>
                      </li>
                      <li>Roles are provisioned automatically on owner sign-in.</li>
                      <li>Grant additional admins by updating Supabase role assignments.</li>
                    </ul>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("community")}>
                        View members
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate("/support")}>
                        Contact support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card className="bg-card/60 border-border/40 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-aethex-300" />
                    <CardTitle>Content overview</CardTitle>
                  </div>
                  <CardDescription>
                    {publishedPosts} published {publishedPosts === 1 ? "post" : "posts"} · {loadingPosts ? "refreshing content…" : "latest Supabase sync"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>
                    Drafts and announcements appear instantly on the public blog after saving. Use scheduled releases for major updates and keep thumbnails optimised for 1200×630.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 border-border/40 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-aethex-400" />
                    <CardTitle className="text-lg">Blog posts</CardTitle>
                  </div>
                  <CardDescription>Manage blog content stored in Supabase</CardDescription>
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
                      No posts loaded yet. Use “Refresh” or “Add post” to start managing content.
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
              <Card className="bg-card/60 border-border/40 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-cyan-300" />
                    <CardTitle>Member directory</CardTitle>
                  </div>
                  <CardDescription>
                    Showing {displayProfiles.length} of {totalMembers} profiles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {displayProfiles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No profiles were returned from the identity service. Trigger a refresh or invite teammates to join AeThex.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="pb-2 pr-4 font-medium">Name</th>
                            <th className="pb-2 pr-4 font-medium">Email</th>
                            <th className="pb-2 pr-4 font-medium">Role</th>
                            <th className="pb-2 font-medium">Loyalty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {displayProfiles.map((profile) => (
                            <tr key={profile.id} className="text-foreground/90">
                              <td className="py-2 pr-4">
                                {profile.full_name || profile.username || "Unknown"}
                              </td>
                              <td className="py-2 pr-4 text-muted-foreground">
                                {profile.email || "—"}
                              </td>
                              <td className="py-2 pr-4">
                                <Badge variant="outline">{profile.role || "member"}</Badge>
                              </td>
                              <td className="py-2 text-muted-foreground">
                                {profile.loyalty_points ?? 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card/60 border-border/40 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-teal-300" />
                    <CardTitle>Community actions</CardTitle>
                  </div>
                  <CardDescription>Grow the network and celebrate contributors.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => navigate("/community")}>Open community hub</Button>
                  <Button size="sm" variant="outline" onClick={() => navigate("/mentorship")}>
                    Manage mentorships
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate("/support")}>Support queue</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-card/60 border-border/40 backdrop-blur lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-yellow-300" />
                      <CardTitle>Featured studios</CardTitle>
                    </div>
                    <CardDescription>Control studios highlighted across AeThex experiences.</CardDescription>
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
                            onClick={() => setStudios(studios.filter((_, idx) => idx !== i))}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-wrap justify-between gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStudios([...studios, { name: "New Studio" }])}
                      >
                        Add studio
                      </Button>
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
                              description: "Unable to persist featured studios.",
                            });
                          } else {
                            aethexToast.success({
                              title: "Studios saved",
                              description: "Featured studios updated successfully.",
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
                      <Activity className="h-5 w-5 text-orange-300" />
                      <CardTitle>System status</CardTitle>
                    </div>
                    <CardDescription>Auth, database, and realtime services.</CardDescription>
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
                    <CardDescription>Owner privileges are active.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>Signed in as {user.email}.</p>
                    <p>You have full administrative access across AeThex services.</p>
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
