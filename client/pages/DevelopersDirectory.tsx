import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import { useToast } from "@/hooks/use-toast";
import {
  aethexUserService,
  type AethexUserProfile,
} from "@/lib/aethex-database-adapter";
import { cn } from "@/lib/utils";
import { Search, RefreshCw, UserRound, Users, Sparkles } from "lucide-react";

const PLATFORM_OPTIONS = [
  { value: "all", label: "All Platforms" },
  { value: "roblox", label: "Roblox" },
  { value: "unity", label: "Unity" },
  { value: "unreal", label: "Unreal" },
  { value: "godot", label: "Godot" },
  { value: "cryengine", label: "CryEngine" },
  { value: "other", label: "Other" },
] as const;

const inferPlatforms = (profile: any): string[] => {
  const out = new Set<string>();
  const pushIf = (cond: boolean, v: string) => {
    if (cond) out.add(v);
  };
  const skills = Array.isArray(profile?.skills)
    ? (profile.skills as string[]).map((s) => String(s).toLowerCase())
    : [];
  const bio = String(profile?.bio || "").toLowerCase();
  const tags = Array.isArray(profile?.tags)
    ? (profile.tags as string[]).map((t) => String(t).toLowerCase())
    : [];
  const text = [skills.join(" "), tags.join(" "), bio].join(" ");
  pushIf(/roblox|rbx|luau|roact/.test(text), "roblox");
  pushIf(/unity|c#|csharp/.test(text), "unity");
  pushIf(/unreal|ue5|ue4|blueprint/.test(text), "unreal");
  pushIf(/godot|gdscript/.test(text), "godot");
  pushIf(/cryengine/.test(text), "cryengine");
  return Array.from(out);
};

const realmFilters: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Realms" },
  { value: "game_developer", label: "Development Forge" },
  { value: "client", label: "Strategist Nexus" },
  { value: "community_member", label: "Innovation Commons" },
  { value: "customer", label: "Experience Hub" },
];

const realmBadgeStyles: Record<string, string> = {
  game_developer: "bg-gradient-to-r from-neon-purple to-aethex-500 text-white",
  client: "bg-gradient-to-r from-neon-blue to-aethex-400 text-white",
  community_member: "bg-gradient-to-r from-neon-green to-aethex-600 text-white",
  customer: "bg-gradient-to-r from-amber-400 to-aethex-700 text-white",
};

const realmBannerFallbacks: Record<string, string> = {
  game_developer: "from-purple-900/70 via-indigo-800/50 to-slate-900",
  client: "from-blue-900/70 via-sky-800/50 to-slate-900",
  community_member: "from-emerald-900/70 via-teal-800/50 to-slate-900",
  customer: "from-amber-900/70 via-orange-800/50 to-slate-900",
};

const getAvailabilityLabel = (
  profile: AethexUserProfile & { [key: string]: unknown },
): string => {
  const explicit =
    (profile as any)?.availability_status ??
    (profile as any)?.availability ??
    (profile as any)?.availability_label ??
    (profile as any)?.status;
  if (typeof explicit === "string" && explicit.trim()) {
    return explicit.trim();
  }

  if ((profile as any)?.is_available === false) {
    return "Currently booked";
  }
  if ((profile as any)?.is_available === true) {
    return "Open for new projects";
  }

  const xp = Number(profile.total_xp ?? 0);
  const level = Number(profile.level ?? 0);

  if (xp >= 5000 || level >= 50) {
    return "Waitlist only";
  }
  if (xp >= 1500 || level >= 20) {
    return "Limited availability";
  }
  return "Open for collaboration";
};

const getAvailabilityStyles = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes("waitlist") || normalized.includes("booked")) {
    return {
      badge: "border-rose-500/40 bg-rose-500/10 text-rose-100",
      dot: "bg-rose-400",
    };
  }
  if (normalized.includes("limited") || normalized.includes("select")) {
    return {
      badge: "border-amber-400/40 bg-amber-400/10 text-amber-100",
      dot: "bg-amber-300",
    };
  }
  return {
    badge: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
    dot: "bg-emerald-300",
  };
};

interface DeveloperCardProps {
  profile: AethexUserProfile & { email?: string | null };
}

const DeveloperCard = ({ profile }: DeveloperCardProps) => {
  const realmStyle =
    realmBadgeStyles[profile.user_type] || "bg-aethex-500 text-white";
  const fallbackBanner =
    realmBannerFallbacks[profile.user_type] ||
    "from-slate-900 via-slate-800 to-slate-900";
  const isGodMode = (profile.level ?? 1) >= 100;
  const passportHref = profile.username
    ? `/passport/${profile.username}`
    : `/passport/${profile.id}`;
  const name = profile.full_name || profile.username || "AeThex Explorer";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((segment) => segment[0]?.toUpperCase())
      .join("")
      .slice(0, 2) || "AE";
  const totalXp = Math.max(0, Math.floor(Number(profile.total_xp ?? 0)));
  const levelValue = Math.max(1, Math.floor(Number(profile.level ?? 1)));
  const loyaltyPoints = Math.max(
    0,
    Math.floor(Number((profile as any)?.loyalty_points ?? totalXp)),
  );
  const availabilityLabel = getAvailabilityLabel(profile as any);
  const availabilityStyles = getAvailabilityStyles(availabilityLabel);
  const experienceLabel = profile.experience_level
    ? profile.experience_level.replace("_", " ")
    : null;

  return (
    <Card className="group h-full overflow-hidden border border-slate-800 bg-slate-950/60 shadow-xl transition-transform hover:-translate-y-1 hover:border-aethex-400/60">
      <div className="relative h-28 w-full overflow-hidden sm:h-32">
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105",
            profile.banner_url
              ? undefined
              : `bg-gradient-to-r ${fallbackBanner}`,
          )}
          style={
            profile.banner_url
              ? { backgroundImage: `url(${profile.banner_url})` }
              : undefined
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
      </div>
      <CardHeader className="space-y-4 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-16 w-16 border-2 border-slate-900 bg-slate-900 shadow-lg">
              <AvatarImage
                src={profile.avatar_url || undefined}
                alt={`${name} avatar`}
              />
              <AvatarFallback className="bg-slate-800 text-slate-100">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn("text-xs uppercase tracking-wider", realmStyle)}
                >
                  {profile.user_type.replace("_", " ")}
                </Badge>
                {experienceLabel && (
                  <Badge
                    variant="outline"
                    className="border-slate-700/60 text-xs uppercase tracking-wide text-slate-200"
                  >
                    {experienceLabel}
                  </Badge>
                )}
                {isGodMode && (
                  <Badge className="bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 text-slate-900 text-[10px] font-semibold shadow">
                    GOD Mode
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl text-white">{name}</CardTitle>
              {profile.email && (
                <CardDescription className="text-slate-300">
                  {profile.email}
                </CardDescription>
              )}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                {profile.location && (
                  <span className="inline-flex items-center gap-1">
                    {profile.location}
                  </span>
                )}
                <Badge
                  variant="outline"
                  className={cn(
                    "inline-flex items-center gap-2 border-slate-700/70 bg-slate-900/60 text-xs font-medium",
                    availabilityStyles.badge,
                  )}
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full shadow-inner",
                      availabilityStyles.dot,
                    )}
                  />
                  {availabilityLabel}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {((profile as any)?.platforms as string[] | undefined)?.length
                  ? ((profile as any).platforms as string[]).slice(0, 4).map((p) => (
                      <Badge key={p} variant="outline" className="border-slate-700/70 text-[10px] uppercase tracking-wide">
                        {p}
                      </Badge>
                    ))
                  : inferPlatforms(profile).slice(0, 4).map((p) => (
                      <Badge key={p} variant="outline" className="border-slate-700/70 text-[10px] uppercase tracking-wide">
                        {p}
                      </Badge>
                    ))}
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-slate-700/70 bg-slate-900/60 text-slate-300"
          >
            Level {levelValue.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {profile.bio && (
          <p className="text-sm text-slate-300 line-clamp-3">{profile.bio}</p>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-slate-200">
            <div className="text-xs uppercase tracking-wider text-slate-400">
              XP
            </div>
            <div className="text-lg font-semibold">
              {totalXp.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-slate-200">
            <div className="text-xs uppercase tracking-wider text-slate-400">
              Loyalty
            </div>
            <div className="text-lg font-semibold">
              {loyaltyPoints.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-slate-200">
            <div className="text-xs uppercase tracking-wider text-slate-400">
              Streak
            </div>
            <div className="text-lg font-semibold">
              {(profile.current_streak ?? 0).toLocaleString()} days
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          {(profile as any)?.skills?.slice(0, 4)?.map((skill: string) => (
            <Badge
              key={skill}
              variant="outline"
              className="border-slate-700/70 text-slate-200"
            >
              {skill}
            </Badge>
          ))}
          {((profile as any)?.skills?.length || 0) > 4 && (
            <Badge
              variant="outline"
              className="border-slate-700/70 text-slate-200"
            >
              +{((profile as any)?.skills?.length || 0) - 4}
            </Badge>
          )}
        </div>
        <Button
          asChild
          variant="outline"
          className="w-full border-slate-700/70 text-slate-100 transition-colors hover:border-aethex-400/60 hover:text-white"
        >
          <Link
            to={passportHref}
            className="flex items-center justify-center gap-2"
          >
            <UserRound className="h-4 w-4" />
            View Passport
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const DevelopersDirectory = () => {
  const [profiles, setProfiles] = useState<AethexUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [realmFilter, setRealmFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const { profile: authProfile } = useAuth();
  const myPassportHref = authProfile?.username
    ? `/passport/${authProfile.username}`
    : "/passport/me";

  const filteredProfiles = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return profiles.filter((profile) => {
      const matchesRealm =
        realmFilter === "all" || profile.user_type === realmFilter;
      const matchesSearch = lowerSearch
        ? [profile.full_name, profile.username, (profile as any)?.company]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(lowerSearch))
        : true;
      const platforms: string[] = ((profile as any)?.platforms as any[]) || inferPlatforms(profile);
      const matchesPlatform =
        platformFilter === "all" || platforms.map((p) => String(p).toLowerCase()).includes(platformFilter);
      return matchesRealm && matchesSearch && matchesPlatform;
    });
  }, [profiles, search, realmFilter, platformFilter]);

  const { toast } = useToast();

  const refreshProfiles = async () => {
    try {
      setLoading(true);
      const list = await aethexUserService.listProfiles(60);
      setProfiles(list);
    } catch (error: any) {
      console.error("Failed to load profiles", error);
      const msg =
        (typeof error === "string" && error) ||
        error?.message ||
        JSON.stringify(error, Object.getOwnPropertyNames(error)) ||
        "Unknown error";
      toast({
        variant: "destructive",
        title: "Failed to load profiles",
        description: msg,
      });
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfiles();
  }, []);

  if (loading) {
    return <LoadingScreen message="Syncing AeThex developers..." />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">
          <header className="space-y-4">
            <Badge className="bg-aethex-500/20 text-aethex-100">
              <Users className="mr-2 h-4 w-4" /> AeThex Developer Network
            </Badge>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">
                  Discover AeThex developers
                </h1>
                <p className="text-slate-300">
                  Browse verified builders, clients, and community members
                  across every AeThex realm.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={refreshProfiles}
                  className="border-slate-700/70 text-slate-100 hover:border-aethex-400/60"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
                >
                  <Link to={myPassportHref}>View my passport</Link>
                </Button>
              </div>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-[2fr,1fr,1fr]">
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <Search className="h-5 w-5 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, username, or company"
                className="border-0 bg-transparent text-slate-100 focus-visible:ring-0"
              />
            </div>
            <Select value={realmFilter} onValueChange={setRealmFilter}>
              <SelectTrigger className="rounded-xl border-slate-800 bg-slate-900/70 text-slate-100">
                <SelectValue placeholder="Filter by realm" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-slate-100">
                {realmFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="rounded-xl border-slate-800 bg-slate-900/70 text-slate-100">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-slate-100">
                {PLATFORM_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredProfiles.length === 0 ? (
            <Card className="border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-300">
              <Sparkles className="mx-auto mb-4 h-8 w-8 text-aethex-300" />
              <div className="text-lg font-semibold text-white">
                No developers found
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Try adjusting your search or realm filters. New developers join
                AeThex every day!
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProfiles.map((profile) => (
                <DeveloperCard key={profile.id} profile={profile as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DevelopersDirectory;
