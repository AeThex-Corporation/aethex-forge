import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShowcaseCard from "@/components/showcase/ShowcaseCard";
import { SHOWCASE, type ShowcaseProject } from "@/data/showcase";
import { useEffect, useMemo, useState } from "react";
import { fetchBuilderList, getBuilderApiKey } from "@/lib/builder";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Projects() {
  const { roles } = useAuth();
  const isOwner = Array.isArray(roles) && roles.includes("owner");
  const [dbItems, setDbItems] = useState<ShowcaseProject[] | null>(null);
  const [cmsItems, setCmsItems] = useState<ShowcaseProject[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try Supabase first (public read with RLS)
    setLoading(true);
    supabase
      .from<any>("showcase_projects" as any)
      .select(
        "id,title,org_unit,role,timeframe,description,tags,image, links:showcase_project_links(label,href), contributors:showcase_contributors(name,title,avatar)",
      )
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && Array.isArray(data) && data.length) {
          const mapped: ShowcaseProject[] = data.map((r: any) => ({
            id: r.id,
            title: r.title,
            orgUnit: r.org_unit as any,
            role: r.role ?? undefined,
            timeframe: r.timeframe ?? undefined,
            description: r.description ?? undefined,
            tags: r.tags ?? [],
            image: r.image ?? undefined,
            links: r.links ?? [],
            contributors: r.contributors ?? [],
          }));
          setDbItems(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (dbItems && dbItems.length) return; // Skip CMS if DB has content
    const apiKey = getBuilderApiKey();
    if (!apiKey) return;
    setLoading(true);
    fetchBuilderList<any>("showcase-project", { limit: 50 })
      .then((res) => {
        const items: ShowcaseProject[] = (res.results || []).map((r) => ({
          id: r.id,
          title: r.data?.title || r.name || "Untitled",
          orgUnit: r.data?.orgUnit,
          role: r.data?.role,
          timeframe: r.data?.timeframe,
          description: r.data?.description,
          tags: r.data?.tags || [],
          links: r.data?.links || [],
          contributors: r.data?.contributors || [],
          image: r.data?.image,
        }));
        setCmsItems(items);
      })
      .catch(() => setCmsItems(null))
      .finally(() => setLoading(false));
  }, [dbItems]);

  const items = useMemo(
    () =>
      dbItems && dbItems.length
        ? dbItems
        : cmsItems && cmsItems.length
          ? cmsItems
          : SHOWCASE,
    [dbItems, cmsItems],
  );
  const hasProjects = Array.isArray(items) && items.length > 0;

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
                Showcase
              </Badge>
              <h1 className="mt-2 text-4xl font-extrabold text-gradient">
                Projects & Testimonials
              </h1>
              <p className="text-muted-foreground max-w-2xl mt-1">
                Studio initiatives across AeThex Platform, Labs, and Studio.
              </p>
            </div>
            {isOwner && (
              <Button
                asChild
                variant="outline"
                size="sm"
                title="Edit in Builder CMS"
              >
                <a
                  href="https://builder.io/content"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Open CMS
                </a>
              </Button>
            )}
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 mt-6">
          {hasProjects ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((p) => (
                <ShowcaseCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <Card className="bg-card/60 border-border/40 backdrop-blur">
              <CardHeader>
                <CardTitle>No projects yet</CardTitle>
                <CardDescription>
                  Add entries in <code>code/client/data/showcase.ts</code> or
                  manage them via CMS.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2 pt-0 pb-6">
                <Button asChild>
                  <a href="/roadmap">Back to Roadmap</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </Layout>
  );
}
