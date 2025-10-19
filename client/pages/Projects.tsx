import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShowcaseCard from "@/components/showcase/ShowcaseCard";
import { SHOWCASE } from "@/data/showcase";

export default function Projects() {
  const hasProjects = Array.isArray(SHOWCASE) && SHOWCASE.length > 0;

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <section className="container mx-auto max-w-6xl px-4">
          <Badge variant="outline" className="border-aethex-400/50 text-aethex-300">Showcase</Badge>
          <h1 className="mt-2 text-4xl font-extrabold text-gradient">Projects & Testimonials</h1>
          <p className="text-muted-foreground max-w-2xl mt-1">Studio initiatives across AeThex Platform, Labs, and Studio.</p>
        </section>

        <section className="container mx-auto max-w-7xl px-4 mt-6">
          {hasProjects ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {SHOWCASE.map((p) => (
                <ShowcaseCard key={p.id} p={p} />
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
