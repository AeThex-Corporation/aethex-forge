import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Rocket, Target, Flame, Sparkles, Waypoints } from "lucide-react";

export interface PhaseSummary {
  id: "now" | "month1" | "month2" | "month3";
  label: string;
  percent: number; // 0..100
}

export default function GalaxyMap({
  phases,
  onSelect,
}: {
  phases: PhaseSummary[];
  onSelect?: (id: PhaseSummary["id"]) => void;
}) {
  const iconFor: Record<PhaseSummary["id"], any> = {
    now: Target,
    month1: Flame,
    month2: Rocket,
    month3: Sparkles,
  };

  return (
    <div className="relative rounded-xl border border-border/40 bg-background/50 p-6 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 800 240"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="g" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(99,102,241,0.35)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="120" cy="120" r="90" fill="url(#g)" />
          <circle cx="400" cy="80" r="70" fill="url(#g)" />
          <circle cx="680" cy="140" r="100" fill="url(#g)" />
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
        {phases.map((p) => {
          const Icon = iconFor[p.id];
          return (
            <button
              key={p.id}
              onClick={() => onSelect?.(p.id)}
              className="group relative rounded-xl border border-border/40 bg-background/60 p-4 backdrop-blur hover:border-aethex-400/50 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-aethex-300" />
                  <span className="font-semibold text-foreground">
                    {p.label}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {p.percent}%
                </Badge>
              </div>
              <div className="mt-3 h-2 w-full rounded bg-border/50 overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-gradient-to-r from-aethex-500 to-neon-blue transition-all",
                  )}
                  style={{
                    width: `${Math.max(0, Math.min(100, Math.round(p.percent)))}%`,
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Tap to focus this phase
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Waypoints className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Planets represent phases. Progress fills as quests are claimed.
        </p>
      </div>
    </div>
  );
}
