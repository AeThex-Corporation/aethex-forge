import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Microscope,
  Sparkles,
  ArrowRight,
  Rocket,
  Layers,
  Users,
  BookOpen,
  Terminal,
  Shield,
  Compass,
  Zap,
  Gamepad2,
  Briefcase,
  Network,
  TrendingUp,
  Heart,
  MessageSquare,
  Avatar,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { communityService } from "@/lib/supabase-service";

const ARMS = [
  {
    id: "labs",
    label: "AeThex Labs",
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    description: "Experimental interfaces and prototypes",
    focus: "R&D, Innovation, Emerging tech",
  },
  {
    id: "gameforge",
    label: "GameForge",
    icon: Gamepad2,
    color: "from-green-500 to-emerald-600",
    description: "Game development studios and tools",
    focus: "Game Development, Studios, Tools",
  },
  {
    id: "corp",
    label: "AeThex Corp",
    icon: Briefcase,
    color: "from-blue-500 to-indigo-600",
    description: "Enterprise consulting & architecture",
    focus: "Consulting, Architecture, Delivery",
  },
  {
    id: "foundation",
    label: "Foundation",
    icon: BookOpen,
    color: "from-red-500 to-rose-600",
    description: "Education, mentorship & learning",
    focus: "Education, Mentorship, Guidance",
  },
  {
    id: "devlink",
    label: "Dev-Link",
    icon: Network,
    color: "from-cyan-500 to-blue-600",
    description: "Developer community & connections",
    focus: "Community, Networking, Resources",
  },
  {
    id: "nexus",
    label: "Nexus",
    icon: Sparkles,
    color: "from-purple-500 to-pink-600",
    description: "Opportunities and collaborations",
    focus: "Opportunities, Collaborations, Growth",
  },
  {
    id: "staff",
    label: "Staff",
    icon: Shield,
    color: "from-indigo-500 to-purple-600",
    description: "Internal operations and governance",
    focus: "Operations, Governance, Support",
  },
];

export default function Explore() {
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [topCreators, setTopCreators] = useState<any[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        const posts = await communityService.getPosts(12);
        const sorted = posts
          .sort((a: any) => (a.likes_count || 0) - (a.comments_count || 0))
          .slice(0, 6);
        setFeaturedPosts(sorted);

        const creators = new Map<string, any>();
        posts.forEach((post: any) => {
          const author = post.user_profiles;
          if (author?.id) {
            if (!creators.has(author.id)) {
              creators.set(author.id, {
                ...author,
                posts: 1,
                likes: post.likes_count || 0,
              });
            } else {
              const existing = creators.get(author.id);
              existing.posts += 1;
              existing.likes += post.likes_count || 0;
            }
          }
        });

        const topCreatorsArray = Array.from(creators.values())
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 4);
        setTopCreators(topCreatorsArray);
      } catch (error) {
        console.error("Failed to load featured content:", error);
      } finally {
        setIsLoadingFeed(false);
      }
    };

    loadFeaturedContent();
  }, []);

  const achievements = useMemo(
    () => [
      { metric: "10K+", label: "Active Creators" },
      { metric: "500+", label: "Projects Shipped" },
      { metric: "99.99%", label: "Feature Quality" },
      { metric: "24/7", label: "Global Community" },
    ],
    [],
  );

  const serviceOfferings = useMemo(
    () => [
      {
        title: "Game Development",
        description: "Studios and indie support",
        link: "/game-development",
        tags: ["Studios", "Tools"],
        icon: Rocket,
        cardClass:
          "border-blue-500/40 bg-gradient-to-br from-blue-950/60 via-indigo-950/30 to-purple-900/40 text-blue-100 hover:border-blue-400/80 hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]",
        titleClass: "text-blue-100",
        descriptionClass: "text-blue-100/70",
        buttonClass:
          "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-400 hover:via-indigo-400 hover:to-purple-400 text-white shadow-[0_0_18px_rgba(59,130,246,0.25)]",
      },
      {
        title: "Consulting",
        description: "Architecture & delivery",
        link: "/consulting",
        tags: ["Architecture", "Delivery"],
        icon: Layers,
        cardClass:
          "border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/60 via-rose-950/30 to-purple-900/40 text-fuchsia-100 hover:border-fuchsia-400/80 hover:shadow-[0_0_25px_rgba(217,70,239,0.35)]",
        titleClass: "text-fuchsia-100",
        descriptionClass: "text-fuchsia-100/70",
        buttonClass:
          "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:from-fuchsia-400 hover:via-pink-400 hover:to-rose-400 text-white shadow-[0_0_18px_rgba(236,72,153,0.25)]",
      },
      {
        title: "Mentorship",
        description: "Programs and guidance",
        link: "/mentorship",
        tags: ["Programs", "Guidance"],
        icon: Users,
        cardClass:
          "border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 via-teal-950/30 to-blue-900/40 text-emerald-100 hover:border-emerald-400/80 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]",
        titleClass: "text-emerald-100",
        descriptionClass: "text-emerald-100/70",
        buttonClass:
          "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-black font-semibold shadow-[0_0_18px_rgba(20,184,166,0.25)]",
      },
    ],
    [],
  );

  const resourceOfferings = useMemo(
    () => [
      {
        title: "Documentation",
        description: "Guides and tutorials",
        tags: ["Guides", "Tutorials"],
        icon: BookOpen,
        cardClass:
          "border-cyan-400/40 bg-gradient-to-br from-cyan-950/50 via-sky-950/25 to-blue-900/30 text-cyan-100 hover:border-cyan-300/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
        titleClass: "text-cyan-100",
        descriptionClass: "text-cyan-100/70",
        actions: [
          {
            label: "Docs",
            href: "/docs",
            variant: "outline",
            buttonClass:
              "border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100",
          },
          {
            label: "Tutorials",
            href: "/docs/tutorials",
            variant: "outline",
            buttonClass:
              "border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100",
          },
        ],
      },
      {
        title: "Community",
        description: "News and discussions",
        tags: ["Blog", "Hub"],
        icon: Shield,
        cardClass:
          "border-orange-400/40 bg-gradient-to-br from-amber-950/50 via-orange-950/25 to-rose-900/30 text-orange-100 hover:border-orange-300/70 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]",
        titleClass: "text-orange-100",
        descriptionClass: "text-orange-100/70",
        actions: [
          {
            label: "Community",
            href: "/community",
            variant: "outline",
            buttonClass:
              "border-orange-400/60 text-orange-200 hover:bg-orange-500/10 hover:text-orange-100",
          },
          {
            label: "Blog",
            href: "/blog",
            variant: "outline",
            buttonClass:
              "border-orange-400/60 text-orange-200 hover:bg-orange-500/10 hover:text-orange-100",
          },
        ],
      },
      {
        title: "Company",
        description: "About and contact",
        tags: ["About", "Contact"],
        icon: Compass,
        cardClass:
          "border-indigo-400/40 bg-gradient-to-br from-indigo-950/50 via-blue-950/25 to-slate-900/30 text-indigo-100 hover:border-indigo-300/70 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]",
        titleClass: "text-indigo-100",
        descriptionClass: "text-indigo-100/70",
        actions: [
          {
            label: "About",
            href: "/about",
            variant: "outline",
            buttonClass:
              "border-indigo-400/60 text-indigo-200 hover:bg-indigo-500/10 hover:text-indigo-100",
          },
          {
            label: "Contact",
            href: "/contact",
            variant: "outline",
            buttonClass:
              "border-indigo-400/60 text-indigo-200 hover:bg-indigo-500/10 hover:text-indigo-100",
          },
        ],
      },
    ],
    [],
  );

  return (
    <Layout>
      {/* Achievements Section */}
      <section id="overview" className="py-16 sm:py-20 bg-background/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h1 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Explore AeThex
              </h1>
              <p className="text-lg text-muted-foreground">
                Our impact across the digital landscape
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="text-center space-y-4 animate-scale-in hover-lift"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative">
                    <div className="text-4xl lg:text-5xl font-bold text-gradient-purple animate-pulse-glow">
                      {achievement.metric}
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-aethex-400/20 to-neon-blue/20 rounded-lg blur-xl opacity-50" />
                  </div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">
                    {achievement.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Areas */}
      <section id="services" className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
              Core Areas
            </h2>
            <p className="text-muted-foreground mt-2">
              Services, programs, resources, and community
            </p>
          </div>

          {(() => {
            const combined = [...serviceOfferings, ...resourceOfferings];
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {combined.map((offering: any, idx: number) => (
                  <Card
                    key={offering.title}
                    className={`relative overflow-hidden border transition-all duration-500 group hover:-translate-y-1 h-full flex flex-col bg-card/60 border-border/50 ${offering.cardClass}`}
                    style={{ animationDelay: `${idx * 0.06}s` }}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                    <CardHeader className="relative space-y-3 min-h-[110px]">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-lg ${offering.titleClass}`}>
                          {offering.title}
                        </CardTitle>
                        {offering.icon && (
                          <div className="w-9 h-9 rounded-md bg-white/10 grid place-items-center">
                            {/* @ts-ignore */}
                            <offering.icon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <CardDescription
                        className={`text-sm ${offering.descriptionClass}`}
                      >
                        {offering.description}
                      </CardDescription>
                      {offering.tags && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {offering.tags.map((t: string) => (
                            <span
                              key={t}
                              className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-white/10 text-white/80"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="relative pt-2 mt-auto">
                      {offering.link ? (
                        <Button
                          asChild
                          className={`w-full ${offering.buttonClass || "bg-gradient-to-r from-aethex-500 to-neon-blue"}`}
                        >
                          <Link to={offering.link}>Learn More</Link>
                        </Button>
                      ) : (
                        <>
                          {offering.actions?.[0] ? (
                            <Button
                              asChild
                              variant={offering.actions[0].variant as any}
                              className={`w-full ${offering.actions[0].buttonClass || "border-border"}`}
                            >
                              {offering.actions[0].external ? (
                                <a
                                  href={offering.actions[0].href}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {offering.actions[0].label}
                                </a>
                              ) : (
                                <Link to={offering.actions[0].href}>
                                  {offering.actions[0].label}
                                </Link>
                              )}
                            </Button>
                          ) : null}
                          {offering.actions && offering.actions.length > 1 ? (
                            <div className="mt-2 flex flex-wrap gap-3 justify-center text-xs text-muted-foreground">
                              {offering.actions.slice(1).map((a: any) =>
                                a.external ? (
                                  <a
                                    key={a.label}
                                    href={a.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-foreground/80"
                                  >
                                    {a.label}
                                  </a>
                                ) : (
                                  <Link
                                    key={a.label}
                                    to={a.href}
                                    className="hover:text-foreground/80"
                                  >
                                    {a.label}
                                  </Link>
                                ),
                              )}
                            </div>
                          ) : null}
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Arms Directory */}
      <section id="arms" className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
              The 7 Arms of AeThex
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore each specialized division shaping the future
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {ARMS.map((arm, idx) => {
              const Icon = arm.icon;
              return (
                <Card
                  key={arm.id}
                  className="relative overflow-hidden bg-card/40 border-border/50 hover:border-aethex-400/50 transition-all duration-500 hover-lift group h-full"
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <CardContent className="p-4 space-y-3 flex flex-col h-full">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${arm.color} grid place-items-center`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {arm.label}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {arm.description}
                      </p>
                    </div>
                    <div className="mt-auto pt-2">
                      <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                        Focus:
                      </p>
                      <p className="text-xs text-foreground/80 mt-1">
                        {arm.focus}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {!isLoadingFeed && featuredPosts.length > 0 && (
        <section
          id="featured-posts"
          className="py-16 sm:py-20 bg-background/50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
                Community Highlights
              </h2>
              <p className="text-muted-foreground mt-2">
                Top posts from the AeThex community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post: any, idx: number) => {
                const author = post.user_profiles;
                return (
                  <Card
                    key={post.id}
                    className="relative overflow-hidden bg-card/60 border-border/50 hover:border-aethex-400/50 transition-all duration-500 hover-lift group"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <AvatarComponent className="h-10 w-10">
                            <AvatarImage
                              src={author?.avatar_url}
                              alt={author?.full_name}
                            />
                            <AvatarFallback>
                              {author?.full_name?.[0]?.toUpperCase() || "C"}
                            </AvatarFallback>
                          </AvatarComponent>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">
                              {author?.full_name || "Community member"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-foreground line-clamp-3">
                          {post.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5" />
                          <span>{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{post.comments_count || 0}</span>
                        </div>
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Link to="/feed">View Post</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg" variant="outline">
                <Link to="/feed">Explore Full Feed</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Creator Spotlights Section */}
      {!isLoadingFeed && topCreators.length > 0 && (
        <section id="creators" className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
                Top Creators
              </h2>
              <p className="text-muted-foreground mt-2">
                Meet the most engaged members of our community
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCreators.map((creator: any, idx: number) => (
                <Card
                  key={creator.id}
                  className="relative overflow-hidden bg-card/60 border-border/50 hover:border-aethex-400/50 transition-all duration-500 hover-lift group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className="flex justify-center">
                      <AvatarComponent className="h-16 w-16">
                        <AvatarImage
                          src={creator.avatar_url}
                          alt={creator.full_name}
                        />
                        <AvatarFallback>
                          {creator.full_name?.[0]?.toUpperCase() || "C"}
                        </AvatarFallback>
                      </AvatarComponent>
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">
                        {creator.full_name || creator.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {creator.username}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold text-gradient-purple">
                          {creator.posts}
                        </p>
                        <p className="text-xs text-muted-foreground">Posts</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gradient-purple">
                          {creator.likes}
                        </p>
                        <p className="text-xs text-muted-foreground">Likes</p>
                      </div>
                    </div>

                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
                    >
                      <Link to="/feed">Follow</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Labs Spotlight */}
      <section id="labs" className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border border-yellow-400/40 bg-black/85 text-yellow-100 shadow-[0_0_24px_rgba(250,204,21,0.15)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent" />
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 px-3 py-1 text-xs uppercase tracking-widest">
                  R&D
                </div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-yellow-300" /> AeThex Labs
                </h3>
                <p className="text-yellow-100/80">
                  Experimental interfaces, prototypes, and internal tooling.
                  Enter the BlackSite to see what's next.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  asChild
                  className="bg-yellow-400 text-black hover:bg-yellow-300"
                >
                  <Link to="/research">Open Interface</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-yellow-400/60 text-yellow-200 hover:bg-yellow-500/10"
                >
                  <a
                    href="https://labs.aethex.biz"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit labs.aethex.biz
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technology Showcase */}
      <section
        id="technology"
        className="py-16 sm:py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-aethex-900/20 via-transparent to-neon-blue/20" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <div className="animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                What We Build
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Systems, tools, and experiences that power creators and teams.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {[
                {
                  name: "Game Studios",
                  status: "Active",
                  color: "from-purple-500 to-blue-600",
                  icon: Rocket,
                  desc: "Production pipelines, content tooling, and live ops.",
                },
                {
                  name: "Design Systems",
                  status: "Evolving",
                  color: "from-blue-500 to-green-600",
                  icon: Layers,
                  desc: "Unified components and patterns across apps.",
                },
                {
                  name: "Creator Tools",
                  status: "Live",
                  color: "from-green-500 to-yellow-600",
                  icon: Terminal,
                  desc: "CLI, automation, and workflow accelerators.",
                },
                {
                  name: "Launch Ops",
                  status: "Scaling",
                  color: "from-yellow-500 to-red-600",
                  icon: Shield,
                  desc: "Release orchestration, quality gates, and metrics.",
                },
                {
                  name: "Content Pipeline",
                  status: "In Progress",
                  color: "from-red-500 to-purple-600",
                  icon: BookOpen,
                  desc: "Publishing, assets, and distribution systems.",
                },
                {
                  name: "Edge Experiences",
                  status: "Deployed",
                  color: "from-purple-500 to-pink-600",
                  icon: Users,
                  desc: "Low-latency interfaces on the edge.",
                },
              ].map((tech, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden bg-card/40 border-border/50 hover:border-aethex-400/50 transition-all duration-500 hover-lift group animate-scale-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-md bg-gradient-to-r ${tech.color} grid place-items-center`}
                        >
                          {/* @ts-ignore */}
                          <tech.icon className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {tech.name}
                        </h3>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-muted-foreground">
                        {tech.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tech.desc}</p>
                    <div
                      className={`mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r ${tech.color} opacity-60 group-hover:opacity-100 transition-opacity`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6 animate-slide-up">
              <h3 className="text-2xl font-bold text-gradient-purple">
                Ready to Build the Future?
              </h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift interactive-scale"
                >
                  <Link
                    to="/onboarding"
                    className="flex items-center space-x-2 group"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Join AeThex</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-aethex-400/50 hover:border-aethex-400 hover-lift interactive-scale"
                >
                  <Link to="/dashboard">Explore Platform</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
