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
import {
  aethexUserService,
  type AethexUserProfile,
} from "@/lib/aethex-database-adapter";
import { cn } from "@/lib/utils";
import { Search, RefreshCw, UserRound, Users, Sparkles } from "lucide-react";

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

interface DeveloperCardProps {
  profile: AethexUserProfile & { email?: string | null };
}

const DeveloperCard = ({ profile }: DeveloperCardProps) => {
  const realmStyle =
    realmBadgeStyles[profile.user_type] || "bg-aethex-500 text-white";
  const isGodMode = (profile.level ?? 1) >= 100;
  const passportHref = profile.username
    ? `/passport/${profile.username}`
    : `/passport/${profile.id}`;
  return (
    <Card className="group h-full border border-slate-800 bg-slate-900/60 transition-transform hover:-translate-y-1 hover:border-aethex-400/60">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              className={cn("text-xs uppercase tracking-wider", realmStyle)}
            >
              {profile.user_type.replace("_", " ")}
            </Badge>
            {isGodMode && (
              <Badge className="bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 text-slate-900 text-[10px] font-semibold shadow">
                GOD Mode
              </Badge>
            )}
          </div>
          <Badge
            variant="outline"
            className="border-slate-700/70 text-slate-300"
          >
            Level {profile.level ?? 1}
          </Badge>
        </div>
        <CardTitle className="text-xl text-white">
          {profile.full_name || profile.username || "AeThex Explorer"}
        </CardTitle>
        {profile.email && (
          <CardDescription className="text-slate-300">
            {profile.email}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-slate-200">
            <div className="text-xs uppercase tracking-wider text-slate-400">
              XP
            </div>
            <div className="text-lg font-semibold">{profile.total_xp ?? 0}</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-slate-200">
            <div className="text-xs uppercase tracking-wider text-slate-400">
              Loyalty
            </div>
            <div className="text-lg font-semibold">
              {(profile as any)?.loyalty_points ?? 0}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          {(profile as any)?.skills?.slice(0, 3)?.map((skill: string) => (
            <Badge
              key={skill}
              variant="outline"
              className="border-slate-700/70 text-slate-200"
            >
              {skill}
            </Badge>
          ))}
          {((profile as any)?.skills?.length || 0) > 3 && (
            <Badge
              variant="outline"
              className="border-slate-700/70 text-slate-200"
            >
              +{((profile as any)?.skills?.length || 0) - 3}
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
      return matchesRealm && matchesSearch;
    });
  }, [profiles, search, realmFilter]);

  const refreshProfiles = async () => {
    try {
      setLoading(true);
      const list = await aethexUserService.listProfiles(60);
      setProfiles(list);
    } catch (error) {
      console.error("Failed to load profiles", error);
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

          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
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
