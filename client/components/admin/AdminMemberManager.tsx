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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  aethexRoleService,
  aethexUserService,
  type AethexUserProfile,
} from "@/lib/aethex-database-adapter";
import { aethexToast } from "@/lib/aethex-toast";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  UserCog,
} from "lucide-react";

const roleOptions = [
  "owner",
  "admin",
  "founder",
  "moderator",
  "creator",
  "mentor",
  "staff",
  "member",
];

const experienceOptions = ["beginner", "intermediate", "advanced", "expert"];
const userTypeOptions = [
  "game_developer",
  "client",
  "community_member",
  "customer",
];

interface AdminMemberManagerProps {
  profiles: AethexUserProfile[];
  selectedId: string | null;
  onSelectedIdChange: (id: string) => void;
  onRefresh: () => Promise<void>;
  ownerEmail: string;
}

interface ProfileDraft {
  full_name: string;
  location: string;
  bio: string;
  experience_level: string;
  user_type: string;
  level: string;
  total_xp: string;
  loyalty_points: string;
}

const buildProfileDraft = (profile: AethexUserProfile): ProfileDraft => ({
  full_name: profile.full_name ?? "",
  location: profile.location ?? "",
  bio: profile.bio ?? "",
  experience_level: profile.experience_level ?? "beginner",
  user_type: profile.user_type ?? "game_developer",
  level: profile.level != null ? String(profile.level) : "",
  total_xp: profile.total_xp != null ? String(profile.total_xp) : "",
  loyalty_points:
    (profile as any).loyalty_points != null
      ? String((profile as any).loyalty_points)
      : "0",
});

const ensureOwnerRoles = (
  roles: string[],
  profile: AethexUserProfile | null,
  ownerEmail: string,
) => {
  if (!profile) return roles;
  if ((profile.email ?? "").toLowerCase() !== ownerEmail.toLowerCase()) {
    return roles;
  }
  const required = new Set(["owner", "admin", "founder", ...roles]);
  return Array.from(required);
};

const normalizeRoles = (roles: string[]): string[] => {
  const normalized = roles
    .map((role) => role.trim().toLowerCase())
    .filter((role) => role.length > 0);
  const unique = Array.from(new Set(normalized));
  return unique.length ? unique : ["member"];
};

const AdminMemberManager = ({
  profiles,
  selectedId,
  onSelectedIdChange,
  onRefresh,
  ownerEmail,
}: AdminMemberManagerProps) => {
  const [roles, setRoles] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [savingRoles, setSavingRoles] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [customRole, setCustomRole] = useState("");
  const [query, setQuery] = useState("");
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null);

  const selectedProfile = useMemo(
    () =>
      profiles && Array.isArray(profiles)
        ? (profiles.find((profile) => profile.id === selectedId) ?? null)
        : null,
    [profiles, selectedId],
  );

  useEffect(() => {
    if (!selectedId && profiles.length) {
      onSelectedIdChange(profiles[0].id);
    }
  }, [profiles, selectedId, onSelectedIdChange]);

  const loadRoles = useCallback(async (id: string) => {
    setLoadingRoles(true);
    try {
      const fetched = await aethexRoleService.getUserRoles(id);
      setRoles(normalizeRoles(fetched));
    } catch (error) {
      console.warn("Failed to load user roles", error);
      setRoles(["member"]);
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      setProfileDraft(buildProfileDraft(selectedProfile));
      loadRoles(selectedProfile.id).catch(() => undefined);
    } else {
      setProfileDraft(null);
      setRoles([]);
    }
  }, [selectedProfile, loadRoles]);

  const filteredProfiles = useMemo(() => {
    if (!profiles || !Array.isArray(profiles)) return [];
    const value = query.trim().toLowerCase();
    if (!value) return profiles;
    return profiles.filter((profile) => {
      const haystack = [
        profile.full_name,
        profile.username,
        profile.email,
        profile.bio,
        profile.location,
        profile.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(value);
    });
  }, [profiles, query]);

  const handleRoleToggle = (role: string) => {
    setRoles((prev) =>
      prev.includes(role.toLowerCase())
        ? prev.filter((item) => item !== role.toLowerCase())
        : [...prev, role.toLowerCase()],
    );
  };

  const addCustomRole = () => {
    const value = customRole.trim().toLowerCase();
    if (!value) return;
    setRoles((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setCustomRole("");
  };

  const saveRoles = async () => {
    if (!selectedProfile) return;
    setSavingRoles(true);
    try {
      const enforced = ensureOwnerRoles(
        normalizeRoles(roles),
        selectedProfile,
        ownerEmail,
      );
      await aethexRoleService.setUserRoles(selectedProfile.id, enforced);
      setRoles(enforced);
      aethexToast.success({
        title: "Roles updated",
        description: `${selectedProfile.full_name ?? selectedProfile.email ?? "Member"} now has ${enforced.join(", ")}.`,
      });
    } catch (error: any) {
      console.error("Failed to set user roles", error);
      aethexToast.error({
        title: "Role update failed",
        description:
          error?.message || "Unable to update roles. Check Supabase policies.",
      });
    } finally {
      setSavingRoles(false);
    }
  };

  const saveProfile = async () => {
    if (!selectedProfile || !profileDraft) return;
    setSavingProfile(true);
    try {
      const updates: Partial<AethexUserProfile> = {
        full_name: profileDraft.full_name.trim() || null,
        location: profileDraft.location.trim() || null,
        bio: profileDraft.bio.trim() || null,
        experience_level: profileDraft.experience_level as any,
        user_type: profileDraft.user_type as any,
      };
      if (profileDraft.level.trim().length) {
        updates.level = Number(profileDraft.level) || 0;
      }
      if (profileDraft.total_xp.trim().length) {
        updates.total_xp = Number(profileDraft.total_xp) || 0;
      }
      if (profileDraft.loyalty_points.trim().length) {
        (updates as any).loyalty_points =
          Number(profileDraft.loyalty_points) || 0;
      }
      await aethexUserService.updateProfile(selectedProfile.id, updates);
      aethexToast.success({
        title: "Profile updated",
        description: `${selectedProfile.full_name ?? selectedProfile.email ?? "Member"} profile saved.`,
      });
      await onRefresh();
    } catch (error: any) {
      console.error("Failed to update profile", error);
      const extractErrorMessage = (err: any) => {
        if (!err)
          return "Supabase rejected the update. Review payload and RLS policies.";
        if (typeof err === "string") return err;
        if (err.message) return err.message;
        try {
          return JSON.stringify(err);
        } catch (e) {
          return String(err);
        }
      };
      aethexToast.error({
        title: "Profile update failed",
        description: extractErrorMessage(error),
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const resetDraft = () => {
    if (!selectedProfile) return;
    setProfileDraft(buildProfileDraft(selectedProfile));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
      <Card className="bg-card/60 border-border/40 backdrop-blur">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Directory</CardTitle>
              <CardDescription>
                Search and select members to administer.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await onRefresh();
                if (selectedProfile) {
                  loadRoles(selectedProfile.id).catch(() => undefined);
                }
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
          <Input
            placeholder="Search by name, email, or role"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="bg-background/60"
          />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[420px] pr-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => {
                  const active = profile.id === selectedId;
                  return (
                    <TableRow
                      key={profile.id}
                      data-state={active ? "selected" : undefined}
                      className={cn(
                        "cursor-pointer",
                        active ? "bg-aethex-500/10" : "hover:bg-background/60",
                      )}
                      onClick={() => onSelectedIdChange(profile.id)}
                    >
                      <TableCell className="font-medium text-foreground/90">
                        <div className="flex flex-col">
                          <span>
                            {profile.full_name || profile.username || "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {profile.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {profile.email || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {(profile.role || "member").toLowerCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!filteredProfiles.length ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-card/60 border-border/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-teal-300" />
              Member controls
            </CardTitle>
            <CardDescription>
              Update profile data, loyalty, and Supabase attributes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProfile && profileDraft ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="member-full-name">Full name</Label>
                    <Input
                      id="member-full-name"
                      value={profileDraft.full_name}
                      onChange={(event) =>
                        setProfileDraft((draft) =>
                          draft
                            ? { ...draft, full_name: event.target.value }
                            : draft,
                        )
                      }
                      className="bg-background/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-location">Location</Label>
                    <Input
                      id="member-location"
                      value={profileDraft.location}
                      onChange={(event) =>
                        setProfileDraft((draft) =>
                          draft
                            ? { ...draft, location: event.target.value }
                            : draft,
                        )
                      }
                      className="bg-background/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Experience level</Label>
                    <Select
                      value={profileDraft.experience_level}
                      onValueChange={(value) =>
                        setProfileDraft((draft) =>
                          draft ? { ...draft, experience_level: value } : draft,
                        )
                      }
                    >
                      <SelectTrigger className="bg-background/60">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceOptions.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="capitalize"
                          >
                            {option.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>User type</Label>
                    <Select
                      value={profileDraft.user_type}
                      onValueChange={(value) =>
                        setProfileDraft((draft) =>
                          draft ? { ...draft, user_type: value } : draft,
                        )
                      }
                    >
                      <SelectTrigger className="bg-background/60 capitalize">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypeOptions.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="capitalize"
                          >
                            {option.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={profileDraft.bio}
                    onChange={(event) =>
                      setProfileDraft((draft) =>
                        draft ? { ...draft, bio: event.target.value } : draft,
                      )
                    }
                    className="bg-background/60"
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="member-level">Level</Label>
                    <Input
                      id="member-level"
                      value={profileDraft.level}
                      onChange={(event) =>
                        setProfileDraft((draft) =>
                          draft
                            ? { ...draft, level: event.target.value }
                            : draft,
                        )
                      }
                      inputMode="numeric"
                      className="bg-background/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-total-xp">Total XP</Label>
                    <Input
                      id="member-total-xp"
                      value={profileDraft.total_xp}
                      onChange={(event) =>
                        setProfileDraft((draft) =>
                          draft
                            ? { ...draft, total_xp: event.target.value }
                            : draft,
                        )
                      }
                      inputMode="numeric"
                      className="bg-background/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-loyalty">Loyalty points</Label>
                    <Input
                      id="member-loyalty"
                      value={profileDraft.loyalty_points}
                      onChange={(event) =>
                        setProfileDraft((draft) =>
                          draft
                            ? { ...draft, loyalty_points: event.target.value }
                            : draft,
                        )
                      }
                      inputMode="numeric"
                      className="bg-background/60"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={saveProfile}
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <BadgeCheck className="mr-2 h-4 w-4" />
                    )}
                    Save profile
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetDraft}>
                    Reset changes
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a member to adjust their profile.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              Role management
            </CardTitle>
            <CardDescription>
              Assign Supabase roles and governance permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProfile ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {roleOptions.map((role) => {
                    const active = roles.includes(role);
                    return (
                      <Button
                        key={role}
                        type="button"
                        variant={active ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleRoleToggle(role)}
                        className={cn(
                          "capitalize",
                          active && "bg-aethex-500/80",
                        )}
                      >
                        {role}
                      </Button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    placeholder="Custom role"
                    value={customRole}
                    onChange={(event) => setCustomRole(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCustomRole();
                      }
                    }}
                    className="bg-background/60 max-w-[200px]"
                  />
                  <Button variant="outline" size="sm" onClick={addCustomRole}>
                    <Plus className="mr-2 h-4 w-4" /> Add role
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  {loadingRoles ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading roles…
                    </span>
                  ) : (
                    roles.map((role) => (
                      <Badge
                        key={role}
                        variant="outline"
                        className="capitalize"
                      >
                        {role}
                      </Badge>
                    ))
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={saveRoles}
                    disabled={savingRoles || loadingRoles}
                  >
                    {savingRoles ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="mr-2 h-4 w-4" />
                    )}
                    Save roles
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      selectedProfile && loadRoles(selectedProfile.id)
                    }
                    disabled={loadingRoles}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Reload
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a member to manage their roles and permissions.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMemberManager;
