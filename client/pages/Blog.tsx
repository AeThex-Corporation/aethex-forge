import { useState, useEffect, useRef, useMemo } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";
import { Link } from "react-router-dom";
import {
  PenTool,
  Calendar,
  User,
  ArrowRight,
  Search,
  Filter,
  Bookmark,
  Share,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

type BlogPost = {
  id?: string | number;
  slug?: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime?: string;
  category?: string;
  image?: string | null;
  likes?: number;
  comments?: number;
  trending?: boolean;
};

const normalizeCategory = (value?: string) =>
  value
    ? value
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "general";

const buildSlug = (post: BlogPost): string => {
  const base = (post.slug || post.id || post.title || "").toString();
  const sanitized = base
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return sanitized || "article";
};

export default function Blog() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const toastShownRef = useRef(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  const staticPosts = useMemo<BlogPost[]>(
    () => [
      {
        id: "static-1",
        slug: "building-scalable-game-architecture",
        title: "Building Scalable Game Architecture with Microservices",
        excerpt:
          "Learn how to design game backends that can handle millions of concurrent players using modern microservices patterns.",
        author: "Marcus Rodriguez",
        date: "December 12, 2024",
        readTime: "6 min read",
        category: "Technology",
        likes: 89,
        comments: 15,
        trending: true,
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "static-2",
        slug: "advanced-unity-optimization-techniques",
        title: "Advanced Unity Optimization Techniques",
        excerpt:
          "Performance optimization strategies that can boost your Unity game's frame rate by up to 300%.",
        author: "Alex Thompson",
        date: "December 10, 2024",
        readTime: "12 min read",
        category: "Tutorials",
        likes: 156,
        comments: 34,
        trending: false,
        image:
          "https://images.unsplash.com/photo-1527443224154-dcc0707b462b?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "static-3",
        slug: "aethex-labs-neural-network-compression",
        title: "AeThex Labs: Breakthrough in Neural Network Compression",
        excerpt:
          "Our research team achieves 90% model size reduction while maintaining accuracy for mobile game AI.",
        author: "Dr. Aisha Patel",
        date: "December 8, 2024",
        readTime: "5 min read",
        category: "Research",
        likes: 203,
        comments: 41,
        trending: true,
        image:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "static-4",
        slug: "introducing-aethex-cloud-gaming-platform",
        title: "Introducing AeThex Cloud Gaming Platform",
        excerpt:
          "Launch games instantly across any device with our new cloud gaming infrastructure and global CDN.",
        author: "AeThex Team",
        date: "December 5, 2024",
        readTime: "4 min read",
        category: "Company News",
        likes: 278,
        comments: 52,
        trending: false,
        image:
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "static-5",
        slug: "real-time-ray-tracing-in-web-games",
        title: "Real-time Ray Tracing in Web Games",
        excerpt:
          "Tutorial: Implementing hardware-accelerated ray tracing in browser-based games using WebGPU.",
        author: "Jordan Kim",
        date: "December 3, 2024",
        readTime: "15 min read",
        category: "Tutorials",
        likes: 94,
        comments: 18,
        trending: false,
        image:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "static-6",
        slug: "the-evolution-of-game-ai",
        title: "The Evolution of Game AI: From Scripts to Neural Networks",
        excerpt:
          "A comprehensive look at how artificial intelligence in games has evolved and where it's heading next.",
        author: "Dr. Michael Chen",
        date: "December 1, 2024",
        readTime: "10 min read",
        category: "Technology",
        likes: 167,
        comments: 29,
        trending: false,
        image:
          "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/blog?limit=50");
        const data = res.ok ? await res.json() : [];
        if (!cancelled && Array.isArray(data)) {
          const mapped: BlogPost[] = data.map((r: any) => ({
            id: r.id,
            slug: r.slug ?? r.id ?? undefined,
            title: r.title,
            excerpt: r.excerpt,
            author: r.author,
            date: r.date,
            readTime: r.read_time ?? r.readTime,
            category: r.category ?? "General",
            image: r.image ?? null,
            likes: typeof r.likes === "number" ? r.likes : 0,
            comments: typeof r.comments === "number" ? r.comments : 0,
            trending: Boolean(r.trending),
          }));
          setPosts(mapped);
          const highlighted = mapped.find((post) => post.trending) ?? mapped[0] ?? null;
          setFeaturedPost(highlighted);
        }
      } catch (e) {
        console.warn("Blog fetch failed:", e);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          if (!toastShownRef.current) {
            aethexToast.system("AeThex Blog loaded successfully");
            toastShownRef.current = true;
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      return;
    }
    const dataset = posts.length ? posts : staticPosts;
    const hasCategory = dataset.some(
      (post) => normalizeCategory(post.category) === selectedCategory,
    );
    if (!hasCategory) {
      setSelectedCategory("all");
    }
  }, [posts, staticPosts, selectedCategory]);

  const categories = useMemo(() => {
    const dataset = posts.length ? posts : staticPosts;
    const counts = new Map<string, { name: string; count: number }>();
    dataset.forEach((post) => {
      const name = post.category || "General";
      const id = normalizeCategory(name);
      const existing = counts.get(id);
      counts.set(id, {
        name,
        count: (existing?.count ?? 0) + 1,
      });
    });
    const preferredOrder = [
      "technology",
      "tutorials",
      "research",
      "company-news",
      "general",
    ];
    const ordered: { id: string; name: string; count: number }[] = [];
    preferredOrder.forEach((id) => {
      const entry = counts.get(id);
      if (entry) {
        ordered.push({ id, name: entry.name, count: entry.count });
        counts.delete(id);
      }
    });
    counts.forEach((value, id) => {
      ordered.push({ id, name: value.name, count: value.count });
    });
    return [
      { id: "all", name: "All Posts", count: dataset.length },
      ...ordered,
    ];
  }, [posts, staticPosts]);

  const filteredPosts = useMemo(() => {
    const dataset = posts.length ? posts : staticPosts;
    if (selectedCategory === "all") {
      return dataset;
    }
    return dataset.filter(
      (post) => normalizeCategory(post.category) === selectedCategory,
    );
  }, [posts, staticPosts, selectedCategory]);

  const activeFeaturedPost = useMemo(() => {
    const dataset = posts.length ? posts : staticPosts;
    if (featuredPost) {
      return featuredPost;
    }
    return dataset.find((post) => post.trending) ?? dataset[0] ?? null;
  }, [featuredPost, posts, staticPosts]);

  const displayedPosts = useMemo(() => {
    if (!activeFeaturedPost) {
      return filteredPosts;
    }
    const featuredSlug = buildSlug(activeFeaturedPost);
    return filteredPosts.filter((post) => buildSlug(post) !== featuredSlug);
  }, [filteredPosts, activeFeaturedPost]);

  const placeholderImage = "/placeholder.svg";

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading AeThex Blog..."
        showProgress={true}
        duration={1000}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge
                variant="outline"
                className="border-aethex-400/50 text-aethex-400 animate-bounce-gentle"
              >
                <PenTool className="h-3 w-3 mr-1" />
                AeThex Blog
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient-purple">
                  Insights & Innovation
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Stay updated with the latest developments in game technology, AI
                research, and industry insights from the AeThex team.
              </p>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm focus:border-aethex-400 focus:outline-none"
                  />
                </div>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {categories.map((category, index) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`animate-scale-in ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-aethex-500 to-neon-blue"
                      : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {activeFeaturedPost && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <Card className="max-w-4xl mx-auto overflow-hidden border-border/50 hover:border-aethex-400/50 transition-all duration-300 animate-scale-in">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={activeFeaturedPost.image ?? placeholderImage}
                      alt={activeFeaturedPost.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <Badge className="mb-4 bg-gradient-to-r from-aethex-500 to-neon-blue">
                      Featured
                    </Badge>
                    <CardTitle className="text-2xl mb-4 text-gradient">
                      {activeFeaturedPost.title}
                    </CardTitle>
                    <CardDescription className="text-base mb-6">
                      {activeFeaturedPost.excerpt}
                    </CardDescription>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{activeFeaturedPost.author || "AeThex Team"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{activeFeaturedPost.date}</span>
                        </div>
                      </div>
                      {activeFeaturedPost.readTime && (
                        <Badge variant="outline">{activeFeaturedPost.readTime}</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Button asChild>
                        <Link to={`/blog/${buildSlug(activeFeaturedPost)}`}>
                          Read Article
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{activeFeaturedPost.likes ?? 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{activeFeaturedPost.comments ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Recent Posts */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Recent Articles
              </h2>
              <p className="text-lg text-muted-foreground">
                Latest insights and tutorials from our team
              </p>
            </div>

            {displayedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {displayedPosts.map((post, index) => (
                  <Card
                    key={buildSlug(post)}
                    className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {post.category || "General"}
                        </Badge>
                        {post.trending && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg hover:text-gradient transition-colors cursor-pointer">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span>{post.author || "AeThex Team"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date || "Coming soon"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {post.readTime ? (
                          <Badge variant="outline" className="text-xs">
                            {post.readTime}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Quick read
                          </span>
                        )}
                        <div className="flex items-center space-x-3">
                          <Button size="sm" variant="ghost">
                            <Bookmark className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{post.likes ?? 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.comments ?? 0}</span>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link to={`/blog/${buildSlug(post)}`}>
                            Read More
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="max-w-3xl mx-auto rounded-lg border border-border/40 bg-background/60 p-10 text-center text-muted-foreground animate-slide-up">
                No articles available in this category yet. Please check back soon.
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8 animate-scale-in">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient-purple">
                Stay in the Loop
              </h2>
              <p className="text-xl text-muted-foreground">
                Subscribe to our newsletter for the latest articles, tutorials,
                and technology insights delivered directly to your inbox.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm focus:border-aethex-400 focus:outline-none"
                />
                <Button className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue">
                  Subscribe
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Join 10,000+ developers getting weekly insights. Unsubscribe
                anytime.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
