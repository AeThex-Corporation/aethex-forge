import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { ensureDemoSeed } from "@/lib/demo-feed";
import { useNavigate } from "react-router-dom";
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
  const [demoProfiles, setDemoProfiles] = useState<any[]>([]);
  type Studio = { name: string; tagline?: string; metrics?: string; specialties?: string[] };
  const [studios, setStudios] = useState<Studio[]>([
    { name: "Lone Star Studio", tagline: "Indie craftsmanship with AAA polish", metrics: "Top-rated indie hits", specialties: ["Unity", "Unreal", "Pixel Art"] },
    { name: "AeThex | GameForge", tagline: "High-performance cross-platform experiences", metrics: "Billions of player sessions", specialties: ["Roblox", "Backend", "LiveOps"] },
    { name: "Gaming Control", tagline: "Strategy, simulation, and systems-first design", metrics: "Award-winning franchises", specialties: ["Simulation", "AI/ML", "Economy"] },
  ]);

  useEffect(() => {
    try {
      ensureDemoSeed();
      const list = JSON.parse(localStorage.getItem("demo_profiles") || "[]");
      setDemoProfiles(Array.isArray(list) ? list : []);
    } catch {
      setDemoProfiles([]);
    }
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

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-lg">Site Settings</CardTitle>
                </div>
                <CardDescription>Branding, legal, integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() => navigate("/get-started")}
                >
                  Open Settings
                </Button>
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
