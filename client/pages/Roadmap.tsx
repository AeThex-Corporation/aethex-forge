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
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import {
  Sparkles,
  Lock,
  Gift,
  Rocket,
  Target,
  Flame,
  Eye,
  CheckCircle2,
  TimerReset,
} from "lucide-react";
import Timeline from "@/components/roadmap/Timeline";
import GalaxyMap from "@/components/roadmap/GalaxyMap";
import Achievements from "@/components/roadmap/Achievements";
import VoteWidget from "@/components/roadmap/VoteWidget";

interface Quest {
  id: string;
  title: string;
  xp: number;
  phase: "now" | "month1" | "month2" | "month3";
  description: string;
}

interface Peek {
  id: string;
  title: string;
  phase: Quest["phase"];
  teaser: string;
  image?: string;
}

const QUESTS: Quest[] = [
  {
    id: "realm-gating",
    title: "Finalize realm gating",
    xp: 120,
    phase: "now",
    description: "Tight access across routes with glossy redirects.",
  },
  {
    id: "nav-ia",
    title: "Unify navigation",
    xp: 80,
    phase: "now",
    description: "Consistent top-level labels, fewer detours.",
  },
  {
    id: "mentor-admin",
    title: "Mentorship admin flows",
    xp: 100,
    phase: "now",
    description: "Accept / reject, filters, analytics.",
  },
  {
    id: "mentor-polish",
    title: "Mentor directory polish",
    xp: 120,
    phase: "month1",
    description: "Filters, profiles, and smoother requests.",
  },
  {
    id: "featured-studios",
    title: "Featured studios persistence",
    xp: 90,
    phase: "month1",
    description: "Curation + partner spotlight.",
  },
  {
    id: "blog-seo",
    title: "Blog editor + SEO",
    xp: 130,
    phase: "month1",
    description: "Meta/OG, list pages, Supabase sync.",
  },
  {
    id: "opps-tooling",
    title: "Opportunities tooling",
    xp: 140,
    phase: "month2",
    description: "Applicant review, statuses, filters.",
  },
  {
    id: "pricing-funnels",
    title: "Engage/pricing funnels",
    xp: 120,
    phase: "month2",
    description: "Plans and conversion events.",
  },
  {
    id: "observability",
    title: "Observability + Sentry",
    xp: 110,
    phase: "month2",
    description: "Errors, alerts, status surfacing.",
  },
  {
    id: "collab-teams",
    title: "Teams & projects enhancements",
    xp: 150,
    phase: "month3",
    description: "Membership, board UX, notifications.",
  },
  {
    id: "advanced-mentoring",
    title: "Advanced mentoring flows",
    xp: 150,
    phase: "month3",
    description: "Availability, pricing, scheduling hooks.",
  },
  {
    id: "public-roadmap",
    title: "Public roadmap page",
    xp: 100,
    phase: "month3",
    description: "This page—interactive and fun.",
  },
];

const PEEKS: Peek[] = [
  {
    id: "peek-1",
    title: "Squads mode UI",
    phase: "month1",
    teaser: "Form elite pods, tackle quests, earn badges.",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "peek-2",
    title: "Realtime collab canvas",
    phase: "month2",
    teaser: "Sketch systems and flows together, live.",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "peek-3",
    title: "Mentor marketplace",
    phase: "month3",
    teaser: "Book sessions, verified tracks, loot drops.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop",
  },
];

const storageKey = "aethex_roadmap_unlocks_v1";

export default function Roadmap() {
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [focusedPhase, setFocusedPhase] = useState<Quest["phase"] | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setUnlocked(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(unlocked));
    } catch {}
  }, [unlocked]);

  const totalXp = useMemo(() => QUESTS.reduce((s, q) => s + q.xp, 0), []);
  const earnedXp = useMemo(
    () => QUESTS.reduce((s, q) => s + (claimed[q.id] ? q.xp : 0), 0),
    [claimed],
  );
  const progress = Math.min(100, Math.round((earnedXp / totalXp) * 100));

  const phaseTotals = useMemo(() => {
    const res: Record<
      string,
      { total: number; earned: number; count: number }
    > = {};
    for (const q of QUESTS) {
      const key = q.phase;
      res[key] = res[key] || { total: 0, earned: 0, count: 0 };
      res[key].total += q.xp;
      res[key].count += 1;
      if (claimed[q.id]) res[key].earned += q.xp;
    }
    return res;
  }, [claimed]);

  const phaseClaims: Record<string, number> = useMemo(() => {
    const res: Record<string, number> = {};
    for (const q of QUESTS) {
      if (claimed[q.id]) res[q.phase] = (res[q.phase] || 0) + 1;
    }
    return res;
  }, [claimed]);

  const toggleClaim = (id: string) =>
    setClaimed((m) => ({ ...m, [id]: !m[id] }));
  const toggleUnlock = (id: string) => {
    if (!user) {
      try {
        aethexToast.info({
          title: "Sign in required",
          description:
            "Create an account to unlock Dev Drops and save progress.",
        });
      } catch {}
      return;
    }
    setUnlocked((m) => ({ ...m, [id]: !m[id] }));
  };

  const PhaseIcon: Record<string, any> = {
    now: Target,
    month1: Flame,
    month2: Rocket,
    month3: Sparkles,
  };

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <section className="container mx-auto max-w-6xl px-4">
          <div className="mb-6">
            <Badge
              variant="outline"
              className="border-aethex-400/50 text-aethex-300"
            >
              Roadmap
            </Badge>
            <h1 className="mt-2 text-4xl font-extrabold text-gradient">
              The AeThex Roadmap
            </h1>
            <p className="text-muted-foreground max-w-2xl mt-1">
              Follow along, earn XP, and unlock sneak peeks. New drops roll out
              regularly.
            </p>
          </div>

          <div className="rounded-lg border border-border/40 bg-background/60 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-[240px]">
                <p className="text-sm text-muted-foreground">Community XP</p>
                <div className="mt-2 h-2 w-full rounded bg-border/50 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-aethex-500 to-neon-blue"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {earnedXp} / {totalXp} XP
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  Now
                </Badge>
                <Badge variant="outline" className="capitalize">
                  Next
                </Badge>
                <Badge variant="outline" className="capitalize">
                  Later
                </Badge>
                <Badge className="bg-gradient-to-r from-aethex-500 to-neon-blue">
                  Legendary
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href="/changelog">Patch notes</a>
                </Button>
                <Button asChild size="sm">
                  <a href="#sneak-peeks">
                    Sneak peeks <Sparkles className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <GalaxyMap
              phases={["now", "month1", "month2", "month3"].map((id) => ({
                id: id as Quest["phase"],
                label:
                  id === "now"
                    ? "Now"
                    : id === "month1"
                      ? "Month 1"
                      : id === "month2"
                        ? "Month 2"
                        : "Month 3",
                percent: phaseTotals[id]?.total
                  ? Math.round(
                      (phaseTotals[id].earned / phaseTotals[id].total) * 100,
                    )
                  : 0,
              }))}
              onSelect={(id) => setFocusedPhase(id)}
            />
            <Timeline
              events={QUESTS.map((q) => ({
                id: q.id,
                title: q.title,
                phase: q.phase,
                xp: q.xp,
                claimed: !!claimed[q.id],
              }))}
              onSelectPhase={(p) => setFocusedPhase(p)}
              onToggleClaim={(id) => toggleClaim(id)}
            />
          </div>
        </section>

        {/* Phases */}
        <section className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {(focusedPhase
              ? [focusedPhase]
              : ["now", "month1", "month2", "month3"]
            ).map((phase) => {
              const Icon = PhaseIcon[phase] || Target;
              const items = QUESTS.filter((q) => q.phase === phase);
              const title =
                phase === "now"
                  ? "Now"
                  : phase === "month1"
                    ? "Month 1"
                    : phase === "month2"
                      ? "Month 2"
                      : "Month 3";
              return (
                <Card
                  key={phase}
                  className="bg-card/60 border-border/40 backdrop-blur"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-aethex-300" />
                      <CardTitle>{title}</CardTitle>
                    </div>
                    <CardDescription>{items.length} quests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((q) => (
                      <div
                        key={q.id}
                        className="rounded border border-border/40 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium">{q.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {q.description}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{q.xp} XP</Badge>
                            <Button
                              size="sm"
                              onClick={() => toggleClaim(q.id)}
                              variant={claimed[q.id] ? "outline" : "default"}
                            >
                              {claimed[q.id] ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 mr-1" />{" "}
                                  Claimed
                                </>
                              ) : (
                                "Claim"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4">
          <Achievements earnedXp={earnedXp} phaseClaims={phaseClaims} />
        </section>

        {/* Sneak peeks */}
        <section
          id="sneak-peeks"
          className="container mx-auto max-w-7xl px-4 section-cozy"
        >
          <div className="mb-4">
            <Badge
              variant="outline"
              className="border-purple-500/40 text-purple-300"
            >
              Sneak peeks
            </Badge>
            <h2 className="mt-2 text-2xl font-bold">Dev Drops</h2>
            <p className="text-sm text-muted-foreground">
              Unlock previews as we get closer. Collect them all.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PEEKS.map((p) => (
              <Card
                key={p.id}
                className="bg-card/60 border-border/40 backdrop-blur overflow-hidden group"
              >
                <div className="relative h-40 w-full">
                  <img
                    src={p.image}
                    alt={p.title}
                    className={cn(
                      "h-full w-full object-cover transition-all duration-300",
                      unlocked[p.id]
                        ? ""
                        : "blur-sm scale-[1.02] brightness-[0.7]",
                    )}
                    loading="lazy"
                  />
                  {!unlocked[p.id] && (
                    <div className="absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" /> Locked
                      </div>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-aethex-300" />
                    <CardTitle className="text-base">{p.title}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {p.teaser}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-2 pt-0 pb-4">
                  <Badge variant="outline" className="capitalize">
                    {p.phase === "now"
                      ? "Now"
                      : p.phase === "month1"
                        ? "Month 1"
                        : p.phase === "month2"
                          ? "Month 2"
                          : "Month 3"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleUnlock(p.id)}
                      disabled={!user}
                      className={
                        !user ? "cursor-not-allowed opacity-60" : undefined
                      }
                      title={!user ? "Sign in to unlock" : undefined}
                    >
                      {unlocked[p.id] ? (
                        <>
                          Hide <TimerReset className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Unlock <Gift className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button size="sm" asChild>
                      <a href="/community#spotlight">Follow</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <VoteWidget
              options={PEEKS.map((p) => ({ id: p.id, label: p.title }))}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
