import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Link {
  label: string;
  href: string;
}
interface Contributor {
  name: string;
  title?: string;
  avatar?: string;
}

export default function ProjectsAdmin() {
  const { user, roles, loading: authLoading } = useAuth();
  const isOwner = Boolean(
    user?.email?.toLowerCase() === "mrpiglr@gmail.com" ||
      (roles || []).some((r) =>
        ["owner", "admin", "founder", "staff"].includes(
          String(r).toLowerCase(),
        ),
      ),
  );
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<any>({
    title: "",
    org_unit: "Studio",
    timeframe: "",
    description: "",
    tags: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isOwner) return;
    setLoading(true);
    supabase
      .from<any>("showcase_projects" as any)
      .select("id,title,org_unit,role,timeframe,description,tags")
      .order("created_at", { ascending: false })
      .then(({ data }) => setList(data || []))
      .finally(() => setLoading(false));
  }, [authLoading, isOwner]);

  const create = async () => {
    const tags = (draft.tags || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    const { error } = await supabase
      .from<any>("showcase_projects" as any)
      .insert({
        title: draft.title,
        org_unit: draft.org_unit,
        role: "AeThex",
        timeframe: draft.timeframe || null,
        description: draft.description || null,
        tags,
      });
    if (!error) {
      setDraft({
        title: "",
        org_unit: "Studio",
        timeframe: "",
        description: "",
        tags: "",
      });
      const { data } = await supabase
        .from<any>("showcase_projects" as any)
        .select("id,title,org_unit,role,timeframe,description,tags")
        .order("created_at", { ascending: false });
      setList(data || []);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12">
          <section className="container mx-auto max-w-3xl px-4">
            <Card className="bg-card/60 border-border/40 backdrop-blur">
              <CardHeader>
                <CardTitle>Loading</CardTitle>
                <CardDescription>Checking access…</CardDescription>
              </CardHeader>
            </Card>
          </section>
        </div>
      </Layout>
    );
  }

  if (!isOwner) {
    return (
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12">
          <section className="container mx-auto max-w-3xl px-4">
            <Card className="bg-card/60 border-border/40 backdrop-blur">
              <CardHeader>
                <CardTitle>Access denied</CardTitle>
                <CardDescription>Owner account required.</CardDescription>
              </CardHeader>
            </Card>
          </section>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <section className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge
                variant="outline"
                className="border-aethex-400/50 text-aethex-300"
              >
                Admin
              </Badge>
              <h1 className="mt-2 text-3xl font-extrabold text-gradient">
                Projects Admin
              </h1>
              <p className="text-muted-foreground">
                Create and manage showcase entries (Supabase)
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="/projects">View page</a>
            </Button>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 mt-6 grid gap-6 md:grid-cols-2">
          <Card className="bg-card/60 border-border/40 backdrop-blur">
            <CardHeader>
              <CardTitle>New project</CardTitle>
              <CardDescription>Title and basics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="rounded border border-border/40 bg-background/70 px-3 py-2"
                  value={draft.org_unit}
                  onChange={(e) =>
                    setDraft({ ...draft, org_unit: e.target.value })
                  }
                >
                  <option>Studio</option>
                  <option>Labs</option>
                  <option>Platform</option>
                  <option>Community</option>
                </select>
                <Input
                  placeholder="Timeframe (e.g., Jan 2025 – Present)"
                  value={draft.timeframe}
                  onChange={(e) =>
                    setDraft({ ...draft, timeframe: e.target.value })
                  }
                />
              </div>
              <Textarea
                placeholder="Description"
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
              <Input
                placeholder="Tags (comma separated)"
                value={draft.tags}
                onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
              />
              <div className="flex justify-end">
                <Button onClick={create} disabled={!draft.title}>
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 border-border/40 backdrop-blur">
            <CardHeader>
              <CardTitle>Existing</CardTitle>
              <CardDescription>
                {loading ? "Loading..." : `${list.length} items`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {list.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded border border-border/40 p-2 text-sm"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.org_unit} • {p.timeframe || ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a href={`/projects/${p.id}`}>View</a>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        await supabase
                          .from<any>("showcase_projects" as any)
                          .delete()
                          .eq("id", p.id);
                        setList(list.filter((x) => x.id !== p.id));
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
