import { useCallback, useEffect, useState } from "react";
import {
  aethexUserService,
  aethexBadgeService,
  aethexTierService,
  type AethexUserProfile,
  type AethexBadge,
  type AethexUserBadge,
} from "@/lib/aethex-database-adapter";
import { aethexToast } from "@/lib/aethex-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Crown,
  Star,
  Sparkles,
  Search,
  Loader2,
  Plus,
  X,
  Shield,
} from "lucide-react";

interface AdminTierBadgeManagerProps {
  profiles?: AethexUserProfile[];
  onProfilesChange?: () => void;
}

export default function AdminTierBadgeManager({
  profiles: externalProfiles,
  onProfilesChange,
}: AdminTierBadgeManagerProps) {
  const [profiles, setProfiles] = useState<AethexUserProfile[]>([]);
  const [allBadges, setAllBadges] = useState<AethexBadge[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserBadges, setSelectedUserBadges] = useState<AethexUserBadge[]>([]);
  const [selectedUserTier, setSelectedUserTier] = useState<"free" | "pro" | "council">("free");
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [updatingTier, setUpdatingTier] = useState(false);
  const [updatingBadge, setUpdatingBadge] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileList, badgeList] = await Promise.all([
        externalProfiles ? Promise.resolve(externalProfiles) : aethexUserService.listProfiles(200),
        aethexBadgeService.getAllBadges(),
      ]);
      setProfiles(profileList);
      setAllBadges(badgeList);
    } catch (err) {
      console.warn("Failed to load data:", err);
      aethexToast.error({ description: "Failed to load user data" });
    } finally {
      setLoading(false);
    }
  }, [externalProfiles]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadSelectedUserData = useCallback(async (userId: string) => {
    setLoadingUserData(true);
    try {
      const [tier, badges] = await Promise.all([
        aethexTierService.getUserTier(userId),
        aethexBadgeService.getUserBadges(userId),
      ]);
      setSelectedUserTier(tier);
      setSelectedUserBadges(badges);
    } catch (err) {
      console.warn("Failed to load user tier/badges:", err);
    } finally {
      setLoadingUserData(false);
    }
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadSelectedUserData(selectedUserId);
    }
  }, [selectedUserId, loadSelectedUserData]);

  const handleTierChange = async (newTier: "free" | "pro" | "council") => {
    if (!selectedUserId) return;
    setUpdatingTier(true);
    try {
      const success = await aethexTierService.setUserTier(selectedUserId, newTier);
      if (success) {
        setSelectedUserTier(newTier);
        aethexToast.success({ description: `Tier updated to ${newTier.charAt(0).toUpperCase() + newTier.slice(1)}` });
        onProfilesChange?.();
      } else {
        aethexToast.error({ description: "Failed to update tier" });
      }
    } catch (err) {
      console.warn("Failed to update tier:", err);
      aethexToast.error({ description: "Failed to update tier" });
    } finally {
      setUpdatingTier(false);
    }
  };

  const handleAwardBadge = async (badgeSlug: string) => {
    if (!selectedUserId) return;
    setUpdatingBadge(badgeSlug);
    try {
      const success = await aethexBadgeService.awardBadge(selectedUserId, badgeSlug);
      if (success) {
        await loadSelectedUserData(selectedUserId);
        aethexToast.success({ description: "Badge awarded successfully" });
      } else {
        aethexToast.error({ description: "Failed to award badge" });
      }
    } catch (err) {
      console.warn("Failed to award badge:", err);
      aethexToast.error({ description: "Failed to award badge" });
    } finally {
      setUpdatingBadge(null);
    }
  };

  const handleRevokeBadge = async (badgeSlug: string) => {
    if (!selectedUserId) return;
    setUpdatingBadge(badgeSlug);
    try {
      const success = await aethexBadgeService.revokeBadge(selectedUserId, badgeSlug);
      if (success) {
        await loadSelectedUserData(selectedUserId);
        aethexToast.success({ description: "Badge revoked" });
      } else {
        aethexToast.error({ description: "Failed to revoke badge" });
      }
    } catch (err) {
      console.warn("Failed to revoke badge:", err);
      aethexToast.error({ description: "Failed to revoke badge" });
    } finally {
      setUpdatingBadge(null);
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      (p.username?.toLowerCase() || "").includes(query) ||
      (p.full_name?.toLowerCase() || "").includes(query) ||
      (p.email?.toLowerCase() || "").includes(query)
    );
  });

  const selectedProfile = profiles.find((p) => p.id === selectedUserId);
  const userBadgeSlugs = selectedUserBadges.map((ub) => ub.badge?.slug).filter(Boolean);
  const availableBadges = allBadges.filter((b) => !userBadgeSlugs.includes(b.slug));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-aethex-400" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <Card className="border-border/40 bg-background/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-aethex-300" />
            Select User
          </CardTitle>
          <CardDescription>
            Search and select a user to manage their tier and badges.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by username, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredProfiles.slice(0, 50).map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedUserId(profile.id)}
                className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                  selectedUserId === profile.id
                    ? "border-aethex-400 bg-aethex-500/10"
                    : "border-border/40 bg-background/50 hover:border-aethex-400/60"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {(profile.username || profile.full_name || "U")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {profile.username || profile.full_name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile.email || profile.id.slice(0, 8)}
                  </p>
                </div>
              </button>
            ))}
            {filteredProfiles.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                No users found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {selectedProfile ? (
          <>
            <Card className="border-border/40 bg-background/60">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedProfile.avatar_url || undefined} />
                    <AvatarFallback>
                      {(selectedProfile.username || selectedProfile.full_name || "U")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>
                      {selectedProfile.username || selectedProfile.full_name || "Unknown User"}
                    </CardTitle>
                    <CardDescription>{selectedProfile.email || selectedProfile.id}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground/80">
                    Subscription Tier
                  </h3>
                  {loadingUserData ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {selectedUserTier === "council" ? (
                          <Crown className="h-5 w-5 text-amber-400" />
                        ) : selectedUserTier === "pro" ? (
                          <Star className="h-5 w-5 text-purple-400" />
                        ) : (
                          <Sparkles className="h-5 w-5 text-slate-400" />
                        )}
                        <span className="font-medium capitalize">{selectedUserTier}</span>
                      </div>
                      <Select
                        value={selectedUserTier}
                        onValueChange={(value: "free" | "pro" | "council") => handleTierChange(value)}
                        disabled={updatingTier}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Change tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">
                            <span className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-slate-400" />
                              Free
                            </span>
                          </SelectItem>
                          <SelectItem value="pro">
                            <span className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-purple-400" />
                              Pro
                            </span>
                          </SelectItem>
                          <SelectItem value="council">
                            <span className="flex items-center gap-2">
                              <Crown className="h-4 w-4 text-amber-400" />
                              Council
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {updatingTier && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-background/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-300" />
                  User Badges
                </CardTitle>
                <CardDescription>
                  Manage badges for this user. Some badges unlock AI personas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingUserData ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading badges...
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-foreground/80">
                        Earned Badges ({selectedUserBadges.length})
                      </h4>
                      {selectedUserBadges.length > 0 ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {selectedUserBadges.map((ub) => (
                            <div
                              key={ub.id}
                              className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/50 p-3"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-aethex-500/30 to-neon-blue/30 text-sm">
                                {ub.badge?.icon || "🏆"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground text-sm truncate">
                                  {ub.badge?.name || "Badge"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(ub.earned_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={() => ub.badge?.slug && handleRevokeBadge(ub.badge.slug)}
                                disabled={updatingBadge === ub.badge?.slug}
                              >
                                {updatingBadge === ub.badge?.slug ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No badges earned yet.
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-foreground/80">
                        Award New Badge
                      </h4>
                      {availableBadges.length > 0 ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {availableBadges.map((badge) => (
                            <div
                              key={badge.id}
                              className="flex items-center gap-3 rounded-lg border border-dashed border-border/40 bg-background/30 p-3"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-500/20 text-sm">
                                {badge.icon || "🏅"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground text-sm truncate">
                                  {badge.name}
                                </p>
                                {badge.unlocks_persona && (
                                  <Badge variant="outline" className="text-xs border-green-500/60 text-green-300">
                                    Unlocks AI
                                  </Badge>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                onClick={() => handleAwardBadge(badge.slug)}
                                disabled={updatingBadge === badge.slug}
                              >
                                {updatingBadge === badge.slug ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {allBadges.length === 0
                            ? "No badges defined in the system yet."
                            : "User has all available badges."}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="border-border/40 bg-background/60">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center">
                <Shield className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a user from the list to manage their tier and badges.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
