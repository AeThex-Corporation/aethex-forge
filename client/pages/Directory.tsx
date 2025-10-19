import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { devconnect, hasDevConnect } from "@/lib/supabase-devconnect";
import { useEffect, useMemo, useState } from "react";

function initials(name?: string | null) {
  const parts = (name || "").trim().split(/\s+/);
  return ((parts[0] || "").charAt(0) + (parts[1] || "").charAt(0)).toUpperCase() || "A";
}

export default function Directory() {
  const [query, setQuery] = useState("");
  const [hideAeThex, setHideAeThex] = useState(true);
  type BasicDev = { id: string; name: string; avatar_url?: string | null; location?: string | null; user_type?: string | null; experience_level?: string | null };
  const [devs, setDevs] = useState<BasicDev[]>([]);
  type Studio = { id: string; name: string; description?: string | null; type?: string | null; is_recruiting?: boolean | null; recruiting_roles?: string[] | null; tags?: string[] | null; slug?: string | null; visibility?: string | null };
  const [studios, setStudios] = useState<Studio[]>([]);

  useEffect(() => {
    const client = devconnect || supabase;
    const userTable = client === devconnect ? "profiles" : "user_profiles";
    const normalize = (u: any): BasicDev => ({
      id: String(u.id),
      name: u.full_name || u.display_name || u.username || "Developer",
      avatar_url: u.avatar_url || u.image_url || u.photo_url || null,
      location: u.location || u.city || u.country || null,
      user_type: u.user_type || u.role || null,
      experience_level: u.experience_level || u.seniority || null,
    });

    client
      .from<any>(userTable as any)
      .select("*")
      .limit(200)
      .then(({ data, error }) => {
        if (!error && Array.isArray(data)) setDevs(data.map(normalize));
        else if (client !== supabase) {
          supabase
            .from<any>("user_profiles" as any)
            .select("*")
            .limit(200)
            .then(({ data: d2 }) => setDevs((d2 || []).map(normalize)));
        }
      });

    const studiosTable = client === devconnect ? "collectives" : "teams";
    const mapStudio = (r: any): Studio => ({
      id: String(r.id),
      name: r.name,
      description: r.description || null,
      type: r.type || (r.visibility || null),
      is_recruiting: r.is_recruiting ?? null,
      recruiting_roles: r.recruiting_roles ?? null,
      tags: r.tags ?? null,
      slug: r.slug || null,
      visibility: r.visibility || null,
    });

    client
      .from<any>(studiosTable as any)
      .select(client === devconnect ? "id,name,description,type,is_recruiting,recruiting_roles,tags,slug,created_at" : "id,name,description,visibility,created_at")
      .limit(200)
      .then(({ data, error }) => {
        if (!error && Array.isArray(data)) setStudios(data.map(mapStudio));
        else if (client !== supabase) {
          supabase
            .from<any>("teams" as any)
            .select("id,name,description,visibility,created_at")
            .limit(200)
            .then(({ data: d2 }) => setStudios((d2 || []).map(mapStudio)));
        }
      });
  }, []);

  const filteredDevs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return devs.filter((u) => {
      if (hideAeThex && u.user_type === "staff") return false;
      if (!q) return true;
      return (
        (u.name || "").toLowerCase().includes(q) ||
        (u.location || "").toLowerCase().includes(q)
      );
    });
  }, [devs, query, hideAeThex]);

  const filteredStudios = useMemo(() => {
    const q = query.trim().toLowerCase();
    return studios.filter((t) => {
      if (!q) return true;
      return (
        (t.name || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.tags || []).join(" ").toLowerCase().includes(q)
      );
    });
  }, [studios, query]);

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <section className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <Badge variant="outline" className="border-aethex-400/50 text-aethex-300">Directory</Badge>
              <h1 className="mt-2 text-4xl font-extrabold text-gradient">Creators & Studios</h1>
              <p className="text-muted-foreground max-w-2xl mt-1">Browse non‑AeThex creators and studios. Opt‑in visibility; public info only.</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={hideAeThex} onChange={(e) => setHideAeThex(e.target.checked)} />
                Hide AeThex‑affiliated (staff)
              </label>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Input placeholder="Search name, handle, or location" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 mt-6">
          <Tabs defaultValue="devs">
            <TabsList>
              <TabsTrigger value="devs">Developers</TabsTrigger>
              <TabsTrigger value="studios">Studios</TabsTrigger>
            </TabsList>

            <TabsContent value="devs">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredDevs.map((u) => (
                  <Card key={u.id} className="border-border/40 bg-card/60 backdrop-blur">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={u.avatar_url || undefined} alt={u.name || "Developer"} />
                        <AvatarFallback>{initials(u.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{u.name || "Developer"}</div>
                        <div className="text-xs text-muted-foreground truncate">{u.location || "Global"}</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <Badge variant="outline">{u.user_type}</Badge>
                          {u.experience_level && <Badge variant="outline">{u.experience_level}</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="studios">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredStudios.map((t) => (
                  <Card key={t.id} className="border-border/40 bg-card/60 backdrop-blur">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-lg">{t.name}</CardTitle>
                        {t.is_recruiting && (
                          <Badge className="bg-emerald-500/10 text-emerald-200 border-emerald-400/40">Recruiting</Badge>
                        )}
                      </div>
                      {(t.type || t.visibility) && (
                        <CardDescription className="capitalize">{t.type || t.visibility}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">{t.description || ""}</p>
                      {(t.tags && t.tags.length > 0) && (
                        <div className="flex flex-wrap gap-2">
                          {t.tags!.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                      {(t.recruiting_roles && t.recruiting_roles.length > 0) && (
                        <div className="text-xs text-muted-foreground">Roles: {t.recruiting_roles!.join(", ")}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </Layout>
  );
}
