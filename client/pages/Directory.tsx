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
  const [devs, setDevs] = useState<any[]>([]);
  const [studios, setStudios] = useState<any[]>([]);

  useEffect(() => {
    const client = devconnect || supabase;
    client
      .from<any>("user_profiles" as any)
      .select("id,full_name,username,avatar_url,location,user_type,experience_level,website_url,github_url,linkedin_url")
      .limit(200)
      .then(({ data, error }) => {
        if (!error && data) setDevs(data);
        else if (client !== supabase) {
          supabase
            .from<any>("user_profiles" as any)
            .select("id,full_name,username,avatar_url,location,user_type,experience_level,website_url,github_url,linkedin_url")
            .limit(200)
            .then(({ data: d2 }) => setDevs(d2 || []));
        }
      });

    client
      .from<any>("teams" as any)
      .select("id,name,description,visibility,created_at")
      .limit(200)
      .then(({ data, error }) => {
        if (!error && data) setStudios(data);
        else if (client !== supabase) {
          supabase
            .from<any>("teams" as any)
            .select("id,name,description,visibility,created_at")
            .limit(200)
            .then(({ data: d2 }) => setStudios(d2 || []));
        }
      });
  }, []);

  const filteredDevs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return devs.filter((u) => {
      if (hideAeThex && u.user_type === "staff") return false;
      if (!q) return true;
      return (
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
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
        (t.description || "").toLowerCase().includes(q)
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
                        <AvatarImage src={u.avatar_url || undefined} alt={u.full_name || u.username || "Developer"} />
                        <AvatarFallback>{initials(u.full_name || u.username)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{u.full_name || u.username || "Developer"}</div>
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
                      <CardTitle className="text-lg">{t.name}</CardTitle>
                      {t.visibility && <CardDescription className="capitalize">{t.visibility}</CardDescription>}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-3">{t.description || ""}</p>
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
