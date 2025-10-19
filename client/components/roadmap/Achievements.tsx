import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Crown, Compass } from "lucide-react";

export default function Achievements({
  earnedXp,
  phaseClaims,
}: {
  earnedXp: number;
  phaseClaims: Record<string, number>;
}) {
  const badges: {
    id: string;
    label: string;
    unlocked: boolean;
    icon: any;
    desc: string;
  }[] = [
    {
      id: "rookie",
      label: "Rookie Explorer",
      unlocked: earnedXp >= 100,
      icon: Compass,
      desc: "Earn 100+ XP",
    },
    {
      id: "seasoned",
      label: "Seasoned Adventurer",
      unlocked: earnedXp >= 300,
      icon: Trophy,
      desc: "Earn 300+ XP",
    },
    {
      id: "master",
      label: "Master Builder",
      unlocked: earnedXp >= 600,
      icon: Crown,
      desc: "Earn 600+ XP",
    },
    {
      id: "trailblazer",
      label: "Trailblazer",
      unlocked: ["now", "month1", "month2", "month3"].every(
        (k) => (phaseClaims[k] || 0) > 0,
      ),
      icon: Award,
      desc: "Complete a quest in every phase",
    },
  ];

  return (
    <Card className="bg-card/60 border-border/40 backdrop-blur">
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>
          Earn badges as you progress. Displayed publicly soon.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className="flex items-center gap-2 rounded border border-border/40 px-3 py-2"
            >
              <Icon
                className={
                  "h-4 w-4 " +
                  (b.unlocked ? "text-aethex-300" : "text-muted-foreground")
                }
              />
              <div className="text-sm">
                <div
                  className={
                    b.unlocked ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {b.label}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {b.desc}
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  b.unlocked
                    ? "ml-2 border-emerald-500/40 text-emerald-300"
                    : "ml-2"
                }
              >
                {b.unlocked ? "Unlocked" : "Locked"}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
