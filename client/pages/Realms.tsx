import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { REALM_OPTIONS, RealmKey } from "@/components/settings/RealmSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Realms() {
  const { profile, roles, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activating, setActivating] = useState<string | null>(null);
  const lastRealm = (profile as any)?.user_type as RealmKey | undefined;
  const canSeeStaff = useMemo(
    () => roles.some((r) => ["owner", "admin", "founder", "staff", "employee"].includes(r.toLowerCase())),
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
          <Badge variant="outline" className="mb-2">Realms</Badge>
          <h1 className="text-3xl font-bold">Choose your realm</h1>
          <p className="text-muted-foreground">Your dashboard adapts to the selected realm. Last used realm is highlighted.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((realm, i) => {
            const Icon = realm.icon;
            const active = lastRealm === realm.id;
            return (
              <Card key={realm.id} className={cn("relative border border-border/50 transition-all hover:border-aethex-400/50", active && "border-aethex-400/70 shadow-lg")} style={{ animationDelay: `${i * 0.05}s` }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-white shadow", `bg-gradient-to-br ${realm.gradient}`)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{realm.title}</CardTitle>
                      <CardDescription>{realm.name}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{realm.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {realm.highlights.slice(0, 3).map((h) => (
                      <Badge key={h} variant="outline" className="text-xs">{h}</Badge>
                    ))}
                  </div>
                  <div className="pt-2">
                    {active ? (
                      <Button disabled variant="outline">Current Realm</Button>
                    ) : (
                      <Button
                        onClick={async () => {
                          setActivating(realm.id);
                          try {
                            await updateProfile({ user_type: realm.id } as any);
                            navigate("/dashboard", { replace: true });
                          } finally {
                            setActivating(null);
                          }
                        }}
                        disabled={activating === realm.id}
                      >
                        {activating === realm.id ? "Activating…" : "Activate Realm"}
                      </Button>
                    )}
                  </div>
                </CardContent>
                {active && (
                  <div className="pointer-events-none absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-aethex-400 via-neon-blue to-aethex-400" />
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
