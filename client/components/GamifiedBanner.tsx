import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Trophy, Gamepad2 } from "lucide-react";

type Props = {
  text: string;
  enabled?: boolean;
  style?: string | null;
};

const ACCENTS: Record<
  string,
  {
    grad: string;
    glowRing: string;
    pill: string;
    icon: any;
  }
> = {
  quest: {
    grad: "from-emerald-500/20 via-aethex-500/15 to-neon-blue/20",
    glowRing:
      "ring-1 ring-emerald-400/30 shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    pill: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    icon: Trophy,
  },
  info: {
    grad: "from-aethex-500/20 via-aethex-400/15 to-sky-500/20",
    glowRing:
      "ring-1 ring-aethex-400/30 shadow-[0_0_30px_rgba(99,102,241,0.25)]",
    pill: "bg-aethex-500/15 text-aethex-200 border-aethex-400/30",
    icon: Sparkles,
  },
  arcade: {
    grad: "from-fuchsia-500/20 via-purple-500/15 to-indigo-500/20",
    glowRing:
      "ring-1 ring-fuchsia-400/30 shadow-[0_0_30px_rgba(217,70,239,0.25)]",
    pill: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/30",
    icon: Gamepad2,
  },
  alert: {
    grad: "from-amber-500/20 via-orange-500/15 to-rose-500/20",
    glowRing:
      "ring-1 ring-amber-400/30 shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    pill: "bg-amber-500/15 text-amber-100 border-amber-400/30",
    icon: Sparkles,
  },
};

export function GamifiedBanner({ text, enabled, style }: Props) {
  const accentKey = (style || "quest").toLowerCase();
  const accent = ACCENTS[accentKey] || ACCENTS.quest;
  const Icon = accent.icon;

  // Simple entrance progress for "charging" bar
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(100), 80);
    return () => clearTimeout(t);
  }, []);

  const parts = useMemo(() => {
    // If user prefixed an emoji, use it
    const m = /^([\p{Emoji}\p{Extended_Pictographic}]+)\s*(.*)$/u.exec(
      text || "",
    );
    return {
      emoji: m?.[1] || "🎮",
      body: (m?.[2] || text || "").trim(),
    };
  }, [text]);

  if (enabled === false) return null;

  return (
    <div className="relative z-20 w-full border-b border-border/30 overflow-hidden">
      {/* Ambient gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-r", accent.grad)} />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute text-emerald-300/70 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${8 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          >
            {"◆●▲■".charAt(Math.floor(Math.random() * 4))}
          </div>
        ))}
      </div>

      <div className={cn("relative container mx-auto px-4 py-2")}>
        {/* Content pill */}
        <div
          className={cn(
            "mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-sm",
            accent.pill,
            accent.glowRing,
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="text-xs font-semibold tracking-wide">
            {parts.emoji} {parts.body}
          </span>
          <span className="ml-1 animate-pulse">•</span>
        </div>

        {/* Charge bar */}
        <div className="mt-2 mx-auto h-1 w-full max-w-xl rounded-full bg-white/10 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-emerald-400 via-aethex-400 to-neon-blue transition-all",
            )}
            style={{ width: `${progress}%`, transitionDuration: "1200ms" }}
          />
        </div>
      </div>
    </div>
  );
}

export default GamifiedBanner;
