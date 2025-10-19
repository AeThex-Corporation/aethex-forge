import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { devconnect } from "@/lib/supabase-devconnect";
import { useEffect, useMemo, useState } from "react";

function initials(name?: string | null) {
  const parts = (name || "").trim().split(/\s+/);
  return (
    ((parts[0] || "").charAt(0) + (parts[1] || "").charAt(0)).toUpperCase() ||
    "A"
  );
}

export default function Directory() {
  const [query, setQuery] = useState("");
  const [hideAeThex, setHideAeThex] = useState(true);
  const source = devconnect ? "DevConnect" : "AeThex";
  type BasicDev = {
    id: string;
    name: string;
    avatar_url?: string | null;
    location?: string | null;
    user_type?: string | null;
    experience_level?: string | null;
    tags?: string[] | null;
    verified?: boolean;
    updated_at?: string | null;
    total_xp?: number | null;
  };
  const [devs, setDevs] = useState<BasicDev[]>([]);
  type StudioMember = { id: string; name: string; avatar_url?: string | null };
  type Studio = {
    id: string;
    name: string;
    description?: string | null;
    type?: string | null;
    is_recruiting?: boolean | null;
    recruiting_roles?: string[] | null;
    tags?: string[] | null;
    slug?: string | null;
    visibility?: string | null;
    members_count?: number;
    members?: StudioMember[];
  };
  const [studios, setStudios] = useState<Studio[]>([]);
  const [skillFilter, setSkillFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [sortMode, setSortMode] = useState<string>("relevance");

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
      tags: u.tags || u.skills || null,
      verified: Boolean(
        u.is_verified ||
          (u.subscription &&
            String(u.subscription).toLowerCase().includes("pro")) ||
          (u.badges && String(u.badges).toLowerCase().includes("verified")),
      ),
      updated_at: u.updated_at || null,
      total_xp: u.total_xp || u.xp || null,
    });

    if (client === devconnect) {
      fetch(`/api/devconnect/rest/${userTable}?select=*&limit=200`)
        .then(async (r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((data) => {
          if (Array.isArray(data) && data.length) return setDevs(data.map(normalize));
          return devconnect
            ?.from<any>(userTable as any)
            .select("*")
            .limit(200)
            .then(({ data }) => setDevs((data || []).map(normalize)));
        })
        .catch(() => {
          devconnect
            ?.from<any>(userTable as any)
            .select("*")
            .limit(200)
            .then(({ data }) => setDevs((data || []).map(normalize)));
        });
    } else {
      client
        .from<any>(userTable as any)
        .select("*")
        .limit(200)
        .then(({ data }) => setDevs((data || []).map(normalize)));
    }

    const studiosTable = client === devconnect ? "collectives" : "teams";
    const mapStudio = (r: any): Studio => ({
      id: String(r.id),
      name: r.name,
      description: r.description || null,
      type: r.type || r.visibility || null,
      is_recruiting: r.is_recruiting ?? null,
      recruiting_roles: r.recruiting_roles ?? null,
      tags: r.tags ?? null,
      slug: r.slug || null,
      visibility: r.visibility || null,
      members_count:
        Array.isArray(r.collective_members) && r.collective_members.length
          ? Number(r.collective_members[0]?.count ?? 0)
          : Array.isArray(r.team_memberships) && r.team_memberships.length
            ? Number(r.team_memberships[0]?.count ?? 0)
            : undefined,
    });

    if (client === devconnect) {
      const sel = encodeURIComponent(
        "id,name,description,type,is_recruiting,recruiting_roles,tags,slug,created_at, collective_members:collective_members(count)",
      );
      fetch(`/api/devconnect/rest/${studiosTable}?select=${sel}&limit=200`)
        .then(async (r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((data) => {
          if (Array.isArray(data) && data.length) return setStudios(data.map(mapStudio));
          return devconnect
            ?.from<any>(studiosTable as any)
            .select(
              "id,name,description,type,is_recruiting,recruiting_roles,tags,slug,created_at, collective_members:collective_members(count)",
            )
            .limit(200)
            .then(({ data }) => setStudios((data || []).map(mapStudio)));
        })
        .catch(() => {
          devconnect
            ?.from<any>(studiosTable as any)
            .select(
              "id,name,description,type,is_recruiting,recruiting_roles,tags,slug,created_at, collective_members:collective_members(count)",
            )
            .limit(200)
            .then(({ data }) => setStudios((data || []).map(mapStudio)));
        });
    } else {
      client
        .from<any>(studiosTable as any)
        .select(
          "id,name,description,visibility,created_at, team_memberships:team_memberships(count)",
        )
        .limit(200)
        .then(({ data }) => setStudios((data || []).map(mapStudio)));
    }
    // Fetch member avatars for studios (DevConnect only)
    if (client === devconnect) {
      const ids = studios.map((s) => s.id).slice(0, 30);
      if (ids.length) {
        const list = encodeURIComponent(ids.join(","));
        fetch(
          `/api/devconnect/rest/collective_members?select=collective_id,profile_id&collective_id=in.(${list})&limit=200`,
        )
          .then(async (r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
          .then(async (rows) => {
            const byCollective: Record<string, string[]> = {};
            (rows || []).forEach((row: any) => {
              const cid = String(row.collective_id);
              if (!byCollective[cid]) byCollective[cid] = [];
              if (byCollective[cid].length < 5)
                byCollective[cid].push(String(row.profile_id));
            });
            const profileIds = Array.from(new Set(Object.values(byCollective).flat()));
            if (profileIds.length) {
              const pids = encodeURIComponent(profileIds.join(","));
              let profs: any[] = [];
              try {
                profs = await fetch(
                  `/api/devconnect/rest/profiles?select=id,display_name,avatar_url&id=in.(${pids})`,
                ).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))));
              } catch {
                const { data } = await devconnect
                  ?.from<any>("profiles" as any)
                  .select("id,display_name,avatar_url")
                  .in("id", profileIds);
                profs = data || [];
              }
              const map: Record<string, StudioMember> = {};
              (profs || []).forEach((p: any) => {
                map[String(p.id)] = {
                  id: String(p.id),
                  name: p.display_name || "Member",
                  avatar_url: p.avatar_url || null,
                };
              });
              setStudios((prev) =>
                prev.map((s) => ({
                  ...s,
                  members: (byCollective[s.id] || [])
                    .map((pid) => map[pid])
                    .filter(Boolean),
                })),
              );
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  const filteredDevs = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = devs.filter((u) => {
      if (hideAeThex && u.user_type === "staff") return false;
      if (!q) return true;
      return (
        (u.name || "").toLowerCase().includes(q) ||
        (u.location || "").toLowerCase().includes(q)
      );
    });

    if (skillFilter !== "all") {
      list = list.filter(
        (u) =>
          (u.tags || [])
            .map(String)
            .map((s) => s.toLowerCase())
            .includes(skillFilter.toLowerCase()) ||
          (u.user_type || "").toLowerCase() === skillFilter.toLowerCase(),
      );
    }
    if (regionFilter !== "all") {
      list = list.filter((u) =>
        (u.location || "").toLowerCase().includes(regionFilter.toLowerCase()),
      );
    }
    if (sortMode === "active") {
      list = [...list].sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0));
    } else if (sortMode === "recent") {
      list = [...list].sort(
        (a, b) =>
          new Date(b.updated_at || 0).getTime() -
          new Date(a.updated_at || 0).getTime(),
      );
    }
    return list;
  }, [devs, query, hideAeThex, skillFilter, regionFilter, sortMode]);

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
              <Badge
                variant="outline"
                className="border-aethex-400/50 text-aethex-300"
              >
                Directory
              </Badge>
              <h1 className="mt-2 text-4xl font-extrabold text-gradient">
                Creators & Studios
              </h1>
              <p className="text-muted-foreground max-w-2xl mt-1">
                Browse non‑AeThex creators and studios. Opt‑in visibility;
                public info only.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Source:</span>
                <Badge variant="outline" className="uppercase tracking-wide">
                  {source}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={hideAeThex}
                  onChange={(e) => setHideAeThex(e.target.checked)}
                />
                Hide AeThex‑affiliated (staff)
              </label>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Input
              placeholder="Search name, handle, or location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="md:col-span-2"
            />
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger aria-label="Skill">
                <SelectValue placeholder="Skill / Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All skills</SelectItem>
                {[
                  ...new Set(
                    devs
                      .flatMap((d) => (d.tags || []).map(String))
                      .concat(devs.map((d) => d.user_type || []).flat()),
                  ),
                ]
                  .filter(Boolean)
                  .slice(0, 30)
                  .map((s) => (
                    <SelectItem key={String(s)} value={String(s)}>
                      {String(s)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger aria-label="Region">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {[
                  ...new Set(
                    devs
                      .map((d) => (d.location || "").split(",").pop()?.trim())
                      .filter(Boolean),
                  ),
                ]
                  .slice(0, 30)
                  .map((r) => (
                    <SelectItem key={String(r)} value={String(r)}>
                      {String(r)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={sortMode} onValueChange={setSortMode}>
              <SelectTrigger aria-label="Sort">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="active">Most active</SelectItem>
                <SelectItem value="recent">Recently updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 mt-6">
          <Tabs defaultValue="devs">
            <TabsList>
              <TabsTrigger value="devs">Developers</TabsTrigger>
              <TabsTrigger value="studios">Studios</TabsTrigger>
            </TabsList>

            <TabsContent value="devs">
              <div className="mb-4 rounded-lg border border-border/40 bg-background/60 p-3 text-xs text-muted-foreground">
                Showing {filteredDevs.length} creators from{" "}
                <span className="font-medium">{source}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredDevs.map((u) => (
                  <Card
                    key={u.id}
                    className="border-border/40 bg-card/60 backdrop-blur transition hover:border-aethex-400/50"
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={u.avatar_url || undefined}
                          alt={u.name || "Developer"}
                        />
                        <AvatarFallback>{initials(u.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate flex items-center gap-2">
                          {u.name || "Developer"}
                          {u.verified && (
                            <Badge className="bg-emerald-500/10 text-emerald-200 border-emerald-400/40">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {u.location || "Global"}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {u.user_type && (
                            <Badge variant="outline">{u.user_type}</Badge>
                          )}
                          {u.experience_level && (
                            <Badge variant="outline">
                              {u.experience_level}
                            </Badge>
                          )}
                          {(u.tags || []).slice(0, 3).map((t) => (
                            <Badge
                              key={String(t)}
                              variant="outline"
                              className="text-xs"
                            >
                              {String(t)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="studios">
              <div className="mb-4 rounded-lg border border-border/40 bg-background/60 p-3 text-xs text-muted-foreground">
                Showing {filteredStudios.length} studios from{" "}
                <span className="font-medium">{source}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredStudios.map((t) => (
                  <Card
                    key={t.id}
                    className="border-border/40 bg-card/60 backdrop-blur transition hover:border-aethex-400/50"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-lg">{t.name}</CardTitle>
                        {t.is_recruiting && (
                          <Badge className="bg-emerald-500/10 text-emerald-200 border-emerald-400/40">
                            Recruiting
                          </Badge>
                        )}
                      </div>
                      {(t.type || t.visibility) && (
                        <CardDescription className="capitalize">
                          {t.type || t.visibility}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {t.description || ""}
                      </p>
                      {t.members && t.members.length > 0 && (
                        <div className="flex -space-x-2">
                          {t.members.slice(0, 5).map((m) => (
                            <Avatar
                              key={m.id}
                              className="h-7 w-7 ring-2 ring-background"
                            >
                              <AvatarImage
                                src={m.avatar_url || undefined}
                                alt={m.name}
                              />
                              <AvatarFallback>
                                {initials(m.name)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          {typeof t.members_count === "number" && (
                            <span>{t.members_count} members</span>
                          )}
                          {t.recruiting_roles &&
                            t.recruiting_roles.length > 0 && (
                              <span>
                                Roles: {t.recruiting_roles!.join(", ")}
                              </span>
                            )}
                        </div>
                        {t.slug && (
                          <Button asChild size="sm" variant="outline">
                            <a
                              href={`https://devconnect.sbs/collectives/${t.slug}`}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              Apply
                            </a>
                          </Button>
                        )}
                      </div>
                      {t.tags && t.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {t.tags!.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
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
