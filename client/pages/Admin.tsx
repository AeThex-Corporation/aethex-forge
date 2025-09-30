import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
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
import {
  Shield,
  UserCog,
  Rocket,
  Settings,
  Users,
  Activity,
} from "lucide-react";

export default function Admin() {
  const { user, loading, roles } = useAuth();
  const navigate = useNavigate();
  const isOwner = Array.isArray(roles) && roles.includes("owner");
  const [managedProfiles, setManagedProfiles] = useState<AethexUserProfile[]>([]);
  type Studio = {
    name: string;
    tagline?: string;
    metrics?: string;
    specialties?: string[];
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

  useEffect(() => {
    try {
      if (!isSupabaseConfigured) {
        ensureDemoSeed();
        const list = JSON.parse(localStorage.getItem("demo_profiles") || "[]");
        setDemoProfiles(Array.isArray(list) ? list : []);
      } else {
        setDemoProfiles([]);
      }
    } catch {
      setDemoProfiles([]);
    }
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
            <Card className="bg-red-500/10 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400">Access Denied</CardTitle>
                <CardDescription>
                  You dont have permission to access the admin panel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Admin Panel</h1>
              <p className="text-muted-foreground">
                Site Owner • Admin • Founder
              </p>
              <div className="flex gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="border-green-500/50 text-green-400"
                >
                  Site Owner
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-500/50 text-blue-400"
                >
                  Admin
                </Badge>
                <Badge
                  variant="outline"
                  className="border-purple-500/50 text-purple-400"
                >
                  Founder
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/profile")}>
                Profile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-lg">Access Control</CardTitle>
                </div>
                <CardDescription>
                  Owner-only access is enforced by email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>
                    Owner:{" "}
                    <span className="text-foreground">mrpiglr@gmail.com</span>
                  </li>
                  <li>All other users are denied access</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-lg">Users & Roles</CardTitle>
                </div>
                <CardDescription>
                  Future: manage roles, invitations, and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>

            {/* Blog Posts Management */}
            <Card className="bg-card/50 border-border/50 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-aethex-400" />
                  <CardTitle className="text-lg">Blog Posts</CardTitle>
                </div>
                <CardDescription>
                  Manage blog content stored in Supabase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
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
                    Refresh
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
                    Add Post
                  </Button>
                </div>

                {blogPosts.map((p, i) => (
                  <div
                    key={p.id || p.slug || i}
                    className="p-3 rounded border border-border/40 space-y-2"
                  >
                    <div className="grid md:grid-cols-2 gap-2">
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
                    <div className="grid md:grid-cols-2 gap-2">
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
                    <div className="grid md:grid-cols-3 gap-2">
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

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-lg">Featured Studios</CardTitle>
                </div>
                <CardDescription>
                  Manage studios shown on Game Development page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {studios.map((s, i) => (
                  <div
                    key={i}
                    className="p-3 rounded border border-border/40 space-y-2"
                  >
                    <div className="grid md:grid-cols-2 gap-2">
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
                    <div className="grid md:grid-cols-2 gap-2">
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
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const next = studios.filter((_, idx) => idx !== i);
                          setStudios(next);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setStudios([...studios, { name: "New Studio" }])
                    }
                  >
                    Add Studio
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
                        alert("Failed to save studios");
                        return;
                      }
                    }}
                  >
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-400" />
                  <CardTitle className="text-lg">System Status</CardTitle>
                </div>
                <CardDescription>Auth, database, and services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Auth: Operational</li>
                  <li>Database: Operational (mock fallback available)</li>
                  <li>Realtime: Operational</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </div>
                <CardDescription>Common admin operations</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => navigate("/dashboard")}>
                  View Dashboard
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/onboarding")}
                >
                  Run Onboarding
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-teal-400" />
                  <CardTitle className="text-lg">Your Account</CardTitle>
                </div>
                <CardDescription>Signed in as {user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  You have full administrative access.
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-400" />
                  <CardTitle className="text-lg">Demo Accounts</CardTitle>
                </div>
                <CardDescription>
                  Managed by{" "}
                  <span className="text-foreground">mrpiglr@gmail.com</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoProfiles.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No demo accounts seeded yet.
                  </div>
                )}
                {demoProfiles.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded border border-border/40"
                  >
                    <div>
                      <div className="font-medium">
                        {p.full_name || p.username}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.email}
                      </div>
                    </div>
                    <Badge variant="outline">Managed</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
