import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import LoadingScreen from "@/components/LoadingScreen";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import BlogHero from "@/components/blog/BlogHero";
import BlogTrendingRail from "@/components/blog/BlogTrendingRail";
import BlogCategoryChips from "@/components/blog/BlogCategoryChips";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import BlogNewsletterSection from "@/components/blog/BlogNewsletterSection";
import BlogCTASection from "@/components/blog/BlogCTASection";
import { blogSeedPosts } from "@/data/blogSeed";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, ListFilter, Newspaper } from "lucide-react";
import type { BlogCategory, BlogPost } from "@/components/blog/types";

const buildSlug = (post: BlogPost): string =>
  post.slug || post.id?.toString() || "article";

const normalizeCategory = (value?: string | null) =>
  (value || "general")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

const Blog = () => {
  const toast = useAethexToast();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const staticPosts = useMemo<BlogPost[]>(() => blogSeedPosts, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Use relative path for API calls to work in both dev and prod
        const res = await fetch(`/api/blog?limit=50`);
        let data: any = [];
        try {
          if (res.ok) {
            data = await res.json();
          }
        } catch (error) {
          console.warn(
            "Failed to parse blog API response, falling back to Supabase",
            error,
          );
        }

        if (
          (!Array.isArray(data) || !data.length) &&
          import.meta.env.VITE_SUPABASE_URL &&
          import.meta.env.VITE_SUPABASE_ANON_KEY
        ) {
          try {
            const sbUrl = import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, "");
            const url = `${sbUrl}/rest/v1/blog_posts?select=slug,title,excerpt,author,date,read_time,category,image,likes,comments,published_at&order=published_at.desc&limit=50`;
            const fallbackRes = await fetch(url, {
              headers: {
                apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
            });
            if (fallbackRes.ok) {
              data = await fallbackRes.json();
            }
          } catch (error) {
            console.warn("Supabase fallback failed", error);
          }
        }

        if (!cancelled && Array.isArray(data)) {
          const mapped: BlogPost[] = data.map((record: any) => ({
            id: record.id ?? record.slug,
            slug: record.slug,
            title: record.title,
            excerpt: record.excerpt ?? record.summary ?? null,
            author: record.author ?? "AeThex Team",
            date: record.date ?? record.published_at,
            readTime: record.read_time ?? record.readTime ?? null,
            category: record.category ?? "General",
            image: record.image ?? null,
            likes: typeof record.likes === "number" ? record.likes : null,
            comments:
              typeof record.comments === "number" ? record.comments : null,
            trending:
              Boolean(record.trending) ||
              (typeof record.likes === "number" && record.likes > 250),
            body: record.body_html ?? record.body ?? null,
          }));
          setPosts(mapped);
        }
      } catch (error) {
        console.warn("Blog fetch failed", error);
        toast.system("Loaded curated AeThex articles");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const dataset = posts.length ? posts : staticPosts;

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return dataset.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" ||
        normalizeCategory(post.category) === selectedCategory;
      if (!matchesCategory) return false;

      if (!query) return true;
      const haystack = [post.title, post.excerpt, post.author]
        .filter(Boolean)
        .map((value) => value!.toLowerCase())
        .join(" ");
      return haystack.includes(query);
    });
  }, [dataset, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    if (!filteredPosts.length) {
      return dataset.find((post) => post.trending) ?? dataset[0] ?? null;
    }
    return (
      filteredPosts.find((post) => post.trending) ?? filteredPosts[0] ?? null
    );
  }, [dataset, filteredPosts]);

  const displayedPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.filter(
      (post) => buildSlug(post) !== buildSlug(featuredPost),
    );
  }, [filteredPosts, featuredPost]);

  const trendingPosts = useMemo(() => {
    const sorted = [...dataset]
      .filter((post) => post.trending || (post.likes ?? 0) >= 200)
      .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    return sorted.slice(0, 3);
  }, [dataset]);

  const categories: BlogCategory[] = useMemo(() => {
    const counts = new Map<string, BlogCategory>();
    dataset.forEach((post) => {
      const id = normalizeCategory(post.category);
      const name = post.category || "General";
      counts.set(id, {
        id,
        name,
        count: (counts.get(id)?.count ?? 0) + 1,
      });
    });

    const ordered = [
      { id: "all", name: "All posts", count: dataset.length },
      ...Array.from(counts.values()).sort((a, b) => b.count - a.count),
    ];

    return ordered;
  }, [dataset]);

  const insights = useMemo(
    () => [
      {
        label: "Teams publishing",
        value: new Set(
          dataset.map((post) => (post.author || "AeThex Team").split(" ")[0]),
        ).size,
        helper: "Active contributors this month",
        icon: <Layers className="h-4 w-4" />,
      },
      {
        label: "Focus areas",
        value: new Set(dataset.map((post) => post.category || "General")).size,
        helper: "Distinct categories covered",
        icon: <ListFilter className="h-4 w-4" />,
      },
      {
        label: "Stories published",
        value: dataset.length,
        helper: "All-time AeThex blog posts",
        icon: <Newspaper className="h-4 w-4" />,
      },
    ],
    [dataset],
  );

  if (isLoading) {
    return <LoadingScreen message="Loading AeThex blog" showProgress />;
  }

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <>
      <SEO
        pageTitle="Blog"
        description="Insights and updates from AeThex: tutorials, platform news, and community highlights."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />
      <Layout>
        <div className="bg-slate-950 text-foreground">
          <BlogHero
            featured={featuredPost}
            totalCount={dataset.length}
            search={searchQuery}
            onSearchChange={setSearchQuery}
            onViewAll={handleResetFilters}
          />

          <section className="border-b border-border/30 bg-background/60 py-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                    Filter by track
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    Navigate the AeThex knowledge graph
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="self-start lg:self-auto"
                >
                  Reset filters
                </Button>
              </div>
              <div className="mt-6">
                <BlogCategoryChips
                  categories={categories}
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                />
              </div>
            </div>
          </section>

          <BlogTrendingRail posts={trendingPosts} />

          <section className="border-b border-border/30 bg-background/80 py-16">
            <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
              {insights.map((insight) => (
                <Card
                  key={insight.label}
                  className="border-border/40 bg-background/60 backdrop-blur transition hover:border-aethex-400/50"
                >
                  <CardContent className="flex items-center gap-4 p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-background/70 text-aethex-200">
                      {insight.icon}
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {insight.label}
                      </p>
                      <p className="text-2xl font-semibold text-white">
                        {insight.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {insight.helper}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto space-y-12 px-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                    Latest updates
                  </p>
                  <h2 className="text-3xl font-semibold text-white">
                    Fresh from the AeThex ship room
                  </h2>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="self-start border-border/60 text-sm"
                >
                  <Link to="/changelog">
                    View changelog
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <BlogPostGrid posts={displayedPosts} />
            </div>
          </section>

          <BlogNewsletterSection />

          <BlogCTASection variant="both" />

          <section className="bg-background/70 py-16">
            <div className="container mx-auto px-4">
              <div className="rounded-2xl border border-border/40 bg-background/80 p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                      Explore more
                    </p>
                    <h3 className="text-2xl font-semibold text-white">
                      Dive into AeThex documentation
                    </h3>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                      Looking for implementation guides, deployment recipes, or
                      program onboarding materials? Visit our documentation hub
                      for developer tutorials, platform references, and
                      community playbooks.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-aethex-500 to-neon-blue"
                  >
                    <Link to="/docs">Open documentation hub</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default Blog;
