import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SHOWCASE } from "@/data/showcase";
import { cn } from "@/lib/utils";

export default function Projects() {
  const hasProjects = Array.isArray(SHOWCASE) && SHOWCASE.length > 0;

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <section className="container mx-auto max-w-6xl px-4">
          <Badge variant="outline" className="border-aethex-400/50 text-aethex-300">Showcase</Badge>
          <h1 className="mt-2 text-4xl font-extrabold text-gradient">Projects & Testimonials</h1>
          <p className="text-muted-foreground max-w-2xl mt-1">Selected work, outcomes, and words from collaborators.</p>
        </section>

        <section className="container mx-auto max-w-7xl px-4 mt-6">
          {hasProjects ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SHOWCASE.map((p) => (
                <Card key={p.id} className="bg-card/60 border-border/40 backdrop-blur overflow-hidden group">
                  {p.image && (
                    <div className="relative h-40 w-full">
                      <img src={p.image} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{p.title}</CardTitle>
                    <CardDescription>
                      {[p.role, p.timeframe].filter(Boolean).join(" • ")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0 pb-4">
                    {p.description && (
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    )}
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    )}
                    {p.links && p.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {p.links.map((l) => (
                          <Button key={l.href} asChild size="sm" variant="outline">
                            <a href={l.href} target="_blank" rel="noreferrer noopener">{l.label}</a>
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card/60 border-border/40 backdrop-blur">
              <CardHeader>
                <CardTitle>No projects yet</CardTitle>
                <CardDescription>
                  Add entries in <code>code/client/data/showcase.ts</code> or manage them via CMS.
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
