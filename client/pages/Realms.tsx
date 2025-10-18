import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RealmSwitcher, {
  REALM_OPTIONS,
  RealmKey,
} from "@/components/settings/RealmSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Realms() {
  const { user, profile, roles, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activating, setActivating] = useState<string | null>(null);
  const [selectedRealm, setSelectedRealm] = useState<RealmKey | null>(
    (profile as any)?.user_type ?? null,
  );
  const [experience, setExperience] = useState<string>(
    (profile as any)?.experience_level || "beginner",
  );
  const [saving, setSaving] = useState(false);
  const lastRealm = (profile as any)?.user_type as RealmKey | undefined;
  const canSeeStaff = useMemo(
    () =>
      roles.some((r) =>
        ["owner", "admin", "founder", "staff", "employee"].includes(
          r.toLowerCase(),
        ),
      ),
    [roles],
  );
  const visible = useMemo(
    () => REALM_OPTIONS.filter((o) => (o.id === "staff" ? canSeeStaff : true)),
    [canSeeStaff],
  );

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">
            Realms
          </Badge>
          <h1 className="text-3xl font-bold">Choose your realm</h1>
          <p className="text-muted-foreground">
            Your dashboard adapts to the selected realm. Last used realm is
            highlighted.
          </p>
        </div>

        {/* Realm & Path manager */}
        <div className="mb-8">
          <RealmSwitcher
            selectedRealm={selectedRealm}
            onRealmChange={setSelectedRealm}
            selectedExperience={experience}
            onExperienceChange={setExperience}
            hasChanges={
              selectedRealm !== ((profile as any)?.user_type ?? null) ||
              experience !== ((profile as any)?.experience_level || "beginner")
            }
            onSave={async () => {
              if (!selectedRealm) return;
              if (!user) {
                navigate("/onboarding");
                return;
              }
              setSaving(true);
              try {
                await updateProfile({
                  user_type: selectedRealm,
                  experience_level: experience,
                } as any);
                navigate("/dashboard", { replace: true });
              } finally {
                setSaving(false);
              }
            }}
            saving={saving}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => navigate(user ? "/dashboard" : "/onboarding")}>
            {user ? "Open Dashboard" : "Start Onboarding"}
          </Button>
        </div>

        <section className="mt-12 space-y-6">
          <div>
            <Badge variant="outline">Contributor network</Badge>
            <h2 className="mt-2 text-2xl font-semibold">
              Mentors, Maintainers, and Shipmates
            </h2>
            <p className="text-muted-foreground">
              Grow the platform with us—teach, steward projects, and ship
              products together.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Mentors</CardTitle>
                <CardDescription>
                  Guide builders through 1:1 sessions, clinics, and code
                  reviews.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button asChild>
                  <Link to="/community/mentorship/apply">Become a mentor</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/community/mentorship">Request mentorship</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Maintainers</CardTitle>
                <CardDescription>
                  Own modules, triage issues, and lead roadmap execution.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to="/developers">Browse developers</Link>
                </Button>
                <Button asChild>
                  <Link to="/projects/new">Start a project</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Shipmates</CardTitle>
                <CardDescription>
                  Join product squads shipping across Labs, Platform, and
                  Community.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button asChild>
                  <Link to="/teams">Open Teams</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/labs">Explore Labs</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <div>
            <Badge variant="outline">Teams hiring now</Badge>
            <h2 className="mt-2 text-2xl font-semibold">
              Across Labs, Platform, and Community
            </h2>
            <p className="text-muted-foreground">
              Apply to active squads and help us accelerate delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Labs squads</CardTitle>
                <CardDescription>
                  R&amp;D and experimental products.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Realtime Engine</li>
                  <li>Gameplay Systems</li>
                  <li>Mentorship Programs</li>
                </ul>
                <div className="mt-3">
                  <Button asChild size="sm">
                    <Link to="/teams">View openings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Platform squads</CardTitle>
                <CardDescription>
                  Core app, APIs, and reliability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Edge Functions &amp; Status</li>
                  <li>Auth &amp; Profiles</li>
                  <li>Content &amp; Docs</li>
                </ul>
                <div className="mt-3">
                  <Button asChild size="sm">
                    <Link to="/teams">View openings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Community squads</CardTitle>
                <CardDescription>Growth, safety, and events.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Moderation &amp; Safety</li>
                  <li>Events &amp; Partnerships</li>
                  <li>Creator Success</li>
                </ul>
                <div className="mt-3">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/community">Open community</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
