import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aethexToast } from "@/lib/aethex-toast";
import {
  aethexAchievementService,
  type AethexAchievement,
  type AethexUserProfile,
} from "@/lib/aethex-database-adapter";
import { formatDistanceToNowStrict } from "date-fns";
import { Award, Gift, Loader2, Sparkles } from "lucide-react";

interface AdminAchievementManagerProps {
  targetUser: AethexUserProfile | null;
}

const AdminAchievementManager = ({
  targetUser,
}: AdminAchievementManagerProps) => {
  const [achievements, setAchievements] = useState<AethexAchievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<AethexAchievement[]>(
    [],
  );
  const [selectedAchievementId, setSelectedAchievementId] =
    useState<string>("");
  const [loadingList, setLoadingList] = useState(false);
  const [loadingUserAchievements, setLoadingUserAchievements] = useState(false);
  const [awarding, setAwarding] = useState(false);
  const [activatingRewards, setActivatingRewards] = useState(false);

  const loadAchievements = useCallback(async () => {
    setLoadingList(true);
    try {
      const list = await aethexAchievementService.getAllAchievements();
      setAchievements(list);
    } catch (error) {
      console.warn("Failed to load achievements", error);
      setAchievements([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadUserAchievements = useCallback(async (userId: string) => {
    setLoadingUserAchievements(true);
    try {
      const list = await aethexAchievementService.getUserAchievements(userId);
      setUserAchievements(list);
    } catch (error) {
      console.warn("Failed to load user achievements", error);
      setUserAchievements([]);
    } finally {
      setLoadingUserAchievements(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements().catch(() => undefined);
  }, [loadAchievements]);

  useEffect(() => {
    if (targetUser?.id) {
      loadUserAchievements(targetUser.id).catch(() => undefined);
    } else {
      setUserAchievements([]);
    }
  }, [targetUser?.id, loadUserAchievements]);

  const selectedAchievement = useMemo(
    () =>
      achievements.find(
        (achievement) => achievement.id === selectedAchievementId,
      ) ?? null,
    [achievements, selectedAchievementId],
  );

  const awardAchievement = async () => {
    if (!targetUser?.id || !selectedAchievementId) {
      aethexToast.error({
        title: "Select achievement",
        description: "Choose an achievement and member before awarding.",
      });
      return;
    }
    setAwarding(true);
    try {
      await aethexAchievementService.awardAchievement(
        targetUser.id,
        selectedAchievementId,
      );
      aethexToast.success({
        title: "Achievement awarded",
        description: `${selectedAchievement?.name ?? "Achievement"} granted to ${targetUser.full_name ?? targetUser.email ?? "member"}.`,
      });
      await loadUserAchievements(targetUser.id);
    } catch (error: any) {
      console.error("Failed to award achievement", error);
      const extractErrorMessage = (err: any) => {
        if (!err) return "Supabase rejected the award operation.";
        if (typeof err === "string") return err;
        if (err.message) return err.message;
        try {
          return JSON.stringify(err);
        } catch (e) {
          return String(err);
        }
      };
      aethexToast.error({
        title: "Award failed",
        description: extractErrorMessage(error),
      });
    } finally {
      setAwarding(false);
    }
  };

  const activateRewards = async () => {
    if (!targetUser) {
      aethexToast.error({
        title: "Select member",
        description: "Choose a member before running rewards automation.",
      });
      return;
    }
    setActivatingRewards(true);
    try {
      const result = await aethexAchievementService.activateCommunityRewards({
        email: targetUser.email ?? undefined,
        username: targetUser.username ?? undefined,
      });
      if (!result) {
        aethexToast.error({
          title: "Activation failed",
          description:
            "No rewards were activated. Check server logs for details.",
        });
      } else {
        const awarded = result.awardedAchievementIds?.length ?? 0;
        aethexToast.success({
          title: "Rewards activated",
          description:
            awarded > 0
              ? `${awarded} achievement${awarded === 1 ? "" : "s"} added for ${targetUser.full_name ?? targetUser.email ?? "member"}.`
              : "Rewards automation completed with no new awards.",
        });
        if (targetUser.id) {
          await loadUserAchievements(targetUser.id);
        }
      }
    } catch (error: any) {
      console.error("Failed to activate rewards", error);
      aethexToast.error({
        title: "Automation failed",
        description: error?.message || "Could not trigger rewards function.",
      });
    } finally {
      setActivatingRewards(false);
    }
  };

  return (
    <Card className="bg-card/60 border-border/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-300" />
          Achievement control
        </CardTitle>
        <CardDescription>
          Grant rewards, run automations, and inspect achievement history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Target member</p>
            {targetUser ? (
              <div className="rounded border border-border/40 bg-background/40 p-3">
                <p className="font-medium text-foreground">
                  {targetUser.full_name ??
                    targetUser.username ??
                    targetUser.email ??
                    "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {targetUser.email ?? "No email on record"}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Select a member from the directory to enable rewards management.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Choose achievement</p>
            <Select
              value={selectedAchievementId}
              onValueChange={setSelectedAchievementId}
              disabled={!targetUser || loadingList}
            >
              <SelectTrigger className="bg-background/60">
                <SelectValue
                  placeholder={
                    loadingList ? "Loading achievements…" : "Select achievement"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {achievements.map((achievement) => (
                  <SelectItem key={achievement.id} value={achievement.id}>
                    {achievement.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={awardAchievement}
            disabled={awarding || !targetUser}
          >
            {awarding ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Gift className="mr-2 h-4 w-4" />
            )}
            Award achievement
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={activateRewards}
            disabled={activatingRewards || !targetUser}
          >
            {activatingRewards ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Run rewards automation
          </Button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Achievement history
            </p>
            {loadingUserAchievements ? (
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
              </span>
            ) : null}
          </div>
          {targetUser ? (
            <ScrollArea className="h-[220px] rounded border border-border/40 bg-background/40 p-3">
              {userAchievements.length ? (
                <ul className="space-y-3 text-sm">
                  {userAchievements.map((achievement) => (
                    <li
                      key={achievement.id}
                      className="flex items-start justify-between gap-3 rounded border border-border/30 bg-background/40 p-3"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {achievement.name}
                        </p>
                        {achievement.description ? (
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        ) : null}
                      </div>
                      <Badge
                        variant="outline"
                        className="whitespace-nowrap text-xs"
                      >
                        {achievement.xp_reward ?? 0} XP
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No achievements recorded yet.
                </p>
              )}
            </ScrollArea>
          ) : (
            <p className="text-xs text-muted-foreground">
              Select a member to view and manage their achievements.
            </p>
          )}
        </div>

        {selectedAchievement ? (
          <div className="rounded border border-border/40 bg-background/40 p-3 text-xs text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">
              {selectedAchievement.name}
            </p>
            {selectedAchievement.description ? (
              <p className="mb-1">{selectedAchievement.description}</p>
            ) : null}
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide">
              <Badge variant="outline">
                {selectedAchievement.xp_reward ?? 0} XP
              </Badge>
              <Badge variant="outline">ID: {selectedAchievement.id}</Badge>
              <Badge variant="outline">
                Created{" "}
                {(() => {
                  const raw = selectedAchievement.created_at;
                  try {
                    const d = raw ? new Date(raw) : null;
                    if (!d || Number.isNaN(d.getTime())) return "unknown";
                    return formatDistanceToNowStrict(d, { addSuffix: true });
                  } catch (e) {
                    return "unknown";
                  }
                })()}
              </Badge>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default AdminAchievementManager;
