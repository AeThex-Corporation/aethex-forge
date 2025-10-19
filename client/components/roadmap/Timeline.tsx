import { useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Rocket,
  Target,
  Flame,
  Sparkles,
} from "lucide-react";

export type RoadmapPhase = "now" | "month1" | "month2" | "month3";

export interface TimelineEvent {
  id: string;
  title: string;
  phase: RoadmapPhase;
  xp: number;
  claimed?: boolean;
}

export default function Timeline({
  events,
  onSelectPhase,
  onToggleClaim,
}: {
  events: TimelineEvent[];
  onSelectPhase?: (p: RoadmapPhase) => void;
  onToggleClaim?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const phases: RoadmapPhase[] = ["now", "month1", "month2", "month3"];
  const iconFor: Record<RoadmapPhase, any> = {
    now: Target,
    month1: Flame,
    month2: Rocket,
    month3: Sparkles,
  };

  const grouped = useMemo(() => {
    const map: Record<RoadmapPhase, TimelineEvent[]> = {
      now: [],
      month1: [],
      month2: [],
      month3: [],
    };
    for (const e of events) map[e.phase].push(e);
    return map;
  }, [events]);

  const scrollToPhase = (p: RoadmapPhase) => {
    const el = containerRef.current?.querySelector<HTMLDivElement>(
      `[data-phase="${p}"]`,
    );
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    onSelectPhase?.(p);
  };

  return (
    <div className="rounded-xl border border-border/40 bg-background/60 p-6 backdrop-blur">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {phases.map((p) => {
            const Icon = iconFor[p];
            const label =
              p === "now"
                ? "Now"
                : p === "month1"
                  ? "Month 1"
                  : p === "month2"
                    ? "Month 2"
                    : "Month 3";
            return (
              <Button
                key={p}
                size="sm"
                variant="outline"
                onClick={() => scrollToPhase(p)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4 text-aethex-300" /> {label}
              </Button>
            );
          })}
        </div>
        <Badge variant="outline">Interactive timeline</Badge>
      </div>

      <div ref={containerRef} className="mt-4 overflow-x-auto">
        <div className="w-full relative">
          <div className="absolute left-0 right-0 top-8 h-0.5 bg-border/50" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((p, idx) => (
              <div key={p} data-phase={p} className="col-span-1">
                {/* Phase header */}
                <div className="mb-2 flex items-center gap-2">
                  {(() => {
                    const Icon = iconFor[p];
                    return <Icon className="h-4 w-4 text-aethex-300" />;
                  })()}
                  <span className="text-sm font-medium">
                    {p === "now"
                      ? "Now"
                      : p === "month1"
                        ? "Month 1"
                        : p === "month2"
                          ? "Month 2"
                          : "Month 3"}
                  </span>
                </div>
                {/* Events for phase */}
                <div className="space-y-3">
                  {grouped[p].map((e) => (
                    <button
                      key={e.id}
                      className={cn(
                        "relative w-full rounded-lg border border-border/40 bg-background/70 p-3 pl-8 text-left transition hover:border-aethex-400/50",
                        e.claimed && "ring-1 ring-emerald-400/30",
                      )}
                      onClick={() => onToggleClaim?.(e.id)}
                      title={e.title}
                    >
                      <div className="absolute left-2 top-1/2 -translate-y-1/2">
                        {e.claimed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium leading-tight">
                            {e.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Tap to {e.claimed ? "unclaim" : "claim"} • {e.xp} XP
                          </div>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {e.xp} XP
                        </Badge>
                      </div>
                    </button>
                  ))}
                  {grouped[p].length === 0 && (
                    <div className="rounded border border-border/40 p-3 text-xs text-muted-foreground">
                      No quests yet
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
