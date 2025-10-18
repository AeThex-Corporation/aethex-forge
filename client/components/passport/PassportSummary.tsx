import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ShieldCheck, Trophy, Users } from "lucide-react";
import type {
  AethexAchievement,
  AethexUserProfile,
} from "@/lib/aethex-database-adapter";
import { cn } from "@/lib/utils";

const realmMeta: Record<
  string,
  { label: string; description: string; gradient: string }
> = {
  game_developer: {
    label: "Development Forge",
    description: "Building immersive experiences and advanced systems.",
    gradient: "from-neon-purple to-aethex-500",
  },
  client: {
    label: "Strategist Nexus",
    description: "Partner in high-impact delivery and technical direction.",
    gradient: "from-neon-blue to-aethex-400",
  },
  community_member: {
    label: "Innovation Commons",
    description: "Connecting innovators, researchers, and trailblazers.",
    gradient: "from-neon-green to-aethex-600",
  },
  customer: {
    label: "Experience Hub",
    description: "Unlocking AeThex products and premium adventures.",
    gradient: "from-amber-400 to-aethex-700",
  },
};

const providerMeta: Record<
  string,
  { label: string; color: string; accent: string }
> = {
  google: {
    label: "Google",
    color: "bg-red-500/10 text-red-300",
    accent: "border-red-500/40",
  },
  github: {
    label: "GitHub",
    color: "bg-slate-500/10 text-slate-100",
    accent: "border-slate-500/40",
  },
};

interface PassportSummaryProps {
  profile: Partial<AethexUserProfile> & { email?: string | null };
  achievements: AethexAchievement[];
  interests?: string[];
  isSelf: boolean;
  linkedProviders?: Array<{ provider: string; lastSignInAt?: string }>;
}

const MAX_HERO_ACHIEVEMENTS = 3;

const PassportSummary = ({
  profile,
  achievements,
  interests,
  isSelf,
  linkedProviders,
}: PassportSummaryProps) => {
  const realm = realmMeta[(profile as any)?.user_type || "game_developer"];
  const level = profile.level ?? 1;
  const totalXp = profile.total_xp ?? 0;
  const loyaltyPoints = (profile as any)?.loyalty_points ?? 0;
  const godModeUnlocked = achievements.some(
    (achievement) => achievement.name?.toLowerCase() === "god mode",
  );
  const isLegendary = godModeUnlocked || level >= 100;
  const progressToNextLevel = isLegendary
    ? 100
    : Math.min(((totalXp % 1000) / 1000) * 100, 100);
  const featureAchievements = achievements.slice(0, MAX_HERO_ACHIEVEMENTS);

  const getAchievementEmoji = (icon?: string, name?: string) => {
    const key = (icon || name || "").toLowerCase();
    if (/founding|founder/.test(key)) return "🎖️";
    if (/trophy|award|medal|badge/.test(key)) return "🏆";
    if (/welcome/.test(key)) return "🎉";
    if (/star/.test(key)) return "⭐";
    if (/rocket|launch/.test(key)) return "🚀";
    return icon && icon.length <= 3 ? icon : "✨";
  };

  return (
    <Card className="bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-slate-950/90 border border-slate-800 shadow-2xl">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <Badge
            variant="outline"
            className={cn(
              "w-fit border-aethex-500/50 text-xs uppercase tracking-[0.2em] text-aethex-100",
            )}
          >
            AeThex Passport
          </Badge>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-white">
              {profile.full_name || profile.username || "AeThex Explorer"}
            </CardTitle>
            {profile.email && (
              <CardDescription className="text-slate-300">
                {profile.email}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                "text-white shadow-lg",
                realm?.gradient
                  ? `bg-gradient-to-r ${realm.gradient}`
                  : "bg-aethex-500",
              )}
            >
              {realm?.label || "Innovation Commons"}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-600/60 text-slate-200"
            >
              Level {level}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-600/60 text-slate-200"
            >
              {totalXp} XP
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-600/60 text-slate-200"
            >
              {loyaltyPoints} Loyalty
            </Badge>
            {godModeUnlocked && (
              <Badge className="bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 text-slate-900 font-semibold shadow-lg shadow-yellow-400/40">
                GOD Mode
              </Badge>
            )}
          </div>
        </div>
        <div className="w-full max-w-xs space-y-3 rounded-xl bg-slate-900/60 p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-200">
            <span className="text-sm font-medium uppercase tracking-wider">
              {isLegendary
                ? "Legendary Status"
                : `Progress to Level ${level + 1}`}
            </span>
            <span className="text-sm text-slate-300">
              {isLegendary
                ? "MAX"
                : `${(progressToNextLevel || 0).toFixed(0)}%`}
            </span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
          {realm && (
            <p className="text-xs text-slate-400 leading-relaxed">
              {realm.description}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-sm font-medium">Realm Alignment</span>
              <Sparkles className="h-4 w-4 text-aethex-300" />
            </div>
            <p className="mt-2 text-sm text-slate-200">
              {(profile as any)?.user_type?.replace("_", " ") ||
                "community member"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-sm font-medium">Projects Completed</span>
              <Trophy className="h-4 w-4 text-aethex-300" />
            </div>
            <p className="mt-2 text-sm text-slate-200">
              {(profile as any)?.completed_projects ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-sm font-medium">Community Reach</span>
              <Users className="h-4 w-4 text-aethex-300" />
            </div>
            <p className="mt-2 text-sm text-slate-200">
              {(profile as any)?.community_reach ?? "Growing"}
            </p>
          </div>
        </div>

        {featureAchievements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Featured Achievements
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featureAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                >
                  <div className="flex items-center gap-2 text-slate-100">
                    <span className="text-xl">
                      {getAchievementEmoji(
                        achievement.icon as any,
                        achievement.name,
                      )}
                    </span>
                    <span className="text-sm font-medium">
                      {achievement.name}
                    </span>
                  </div>
                  {achievement.description && (
                    <p className="mt-2 text-xs text-slate-400">
                      {achievement.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {interests && interests.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Interests & Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="border-slate-600/60 text-slate-200"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {linkedProviders && linkedProviders.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Linked Accounts
            </h3>
            <div className="flex flex-wrap gap-2">
              {linkedProviders.map((provider) => {
                const meta = providerMeta[provider.provider] || {
                  label: provider.provider,
                  color: "bg-slate-500/10 text-slate-100",
                  accent: "border-slate-500/40",
                };
                return (
                  <Badge
                    key={provider.provider}
                    variant="outline"
                    className={cn(meta.color, meta.accent, "border text-xs")}
                  >
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    {meta.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {isSelf && (
          <>
            <Separator className="border-slate-800" />
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="border-slate-700 text-slate-100"
              >
                <Link to="/dashboard?tab=profile">Edit Profile</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
              >
                <Link to="/dashboard?tab=connections">
                  Manage Passport Links
                </Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PassportSummary;
