import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, PenTool, Search, TrendingUp } from "lucide-react";
import type { BlogPost } from "./types";

interface BlogHeroProps {
  featured: BlogPost | null;
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onViewAll?: () => void;
}

const BlogHero = ({
  featured,
  totalCount,
  search,
  onSearchChange,
  onViewAll,
}: BlogHeroProps) => {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 pb-20 pt-24 text-foreground">
      <div className="absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.15),_transparent_60%)]" />
      <div className="relative z-10">
        <div className="container mx-auto flex flex-col gap-12 px-4 lg:flex-row lg:items-end">
          <div className="flex-1 space-y-8">
            <Badge
              variant="outline"
              className="inline-flex items-center gap-2 border-aethex-500/60 bg-aethex-500/10 text-xs font-medium uppercase tracking-[0.2em] text-aethex-200"
            >
              <PenTool className="h-3.5 w-3.5" /> AeThex Blog
            </Badge>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Ideas, updates, and behind-the-scenes craft from the AeThex team
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Explore engineering deep dives, platform updates, community
                spotlights, and changelog summaries. We publish what we learn
                building AeThex across games, cloud, and creator ecosystems.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <label className="group relative flex items-center">
                <Search className="absolute left-4 h-4.5 w-4.5 text-muted-foreground transition group-focus-within:text-aethex-300" />
                <Input
                  value={search}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search by title, author, or keywords"
                  className="h-12 rounded-full border-border/50 bg-background/70 pl-12 text-sm text-foreground shadow-sm transition focus:border-aethex-400"
                />
              </label>
              <Button
                variant="outline"
                onClick={onViewAll}
                className="h-12 rounded-full border-border/60 bg-background/70 text-foreground"
              >
                Browse all {totalCount} articles
              </Button>
            </div>
          </div>

          <Card className="w-full max-w-xl border-border/50 bg-background/70 backdrop-blur">
            <CardContent className="space-y-6 p-8">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>Featured insight</span>
                <span className="flex items-center gap-1 text-aethex-200">
                  <TrendingUp className="h-3.5 w-3.5" /> Trending now
                </span>
              </div>
              {featured ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Badge className="bg-gradient-to-r from-aethex-500 to-neon-blue text-xs font-medium uppercase tracking-wide">
                      {featured.category || "General"}
                    </Badge>
                    <Link
                      to={`/blog/${featured.slug}`}
                      className="block text-2xl font-semibold leading-snug text-white transition hover:text-aethex-200"
                    >
                      {featured.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {featured.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{featured.author || "AeThex Team"}</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featured.date || "Recently published"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full border border-border/40 px-3 py-1">
                      {featured.readTime || "5 min read"}
                    </span>
                    <span className="rounded-full border border-border/40 px-3 py-1">
                      {featured.likes?.toLocaleString() ?? "0"} applauses
                    </span>
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/blog/${featured.slug}`}>
                      Read the full story
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-base">
                    We are preparing our latest feature article. Check back soon
                    for fresh insights straight from the AeThex ship room.
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full border border-border/40 px-3 py-1">
                      Weekly cadence
                    </span>
                    <span className="rounded-full border border-border/40 px-3 py-1">
                      Multi-team updates
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
