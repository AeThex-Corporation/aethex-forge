import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";
import { aethexToast } from "@/lib/aethex-toast";
import { cn } from "@/lib/utils";
import {
  Loader2,
  RefreshCw,
  Save,
  Users,
  GraduationCap,
  MessageSquareText,
  DollarSign,
  Tag,
} from "lucide-react";

interface MentorRow {
  user_id: string;
  bio?: string | null;
  expertise?: string[];
  available?: boolean;
  hourly_rate?: number | null;
  user_profiles?: {
    id?: string;
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
  } | null;
}

interface MentorshipRequestRow {
  id: string;
  mentor_id: string;
  mentee_id: string;
  message?: string | null;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  created_at?: string | null;
  mentor?: {
    id?: string;
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  } | null;
  mentee?: {
    id?: string;
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  } | null;
}

const statusOptions = [
  "all",
  "pending",
  "accepted",
  "rejected",
  "cancelled",
] as const;

type StatusFilter = (typeof statusOptions)[number];

export default function AdminMentorshipManager() {
  const [mentors, setMentors] = useState<MentorRow[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [mentorQ, setMentorQ] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(true);

  const [requests, setRequests] = useState<MentorshipRequestRow[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  const draftsRef = useRef<Record<string, Partial<MentorRow>>>({});

  const expertiseQueryParam = useMemo(() => {
    return expertiseFilter.length ? expertiseFilter.join(",") : "";
  }, [expertiseFilter]);

  const loadMentors = useCallback(async () => {
    setLoadingMentors(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("available", String(availableOnly));
      if (expertiseQueryParam) params.set("expertise", expertiseQueryParam);
      if (mentorQ.trim()) params.set("q", mentorQ.trim());
      const resp = await fetch(`${API_BASE}/api/mentors?${params.toString()}`);
      if (!resp.ok) throw new Error(await resp.text().catch(() => "Failed"));
      const data = await resp.json();
      setMentors(Array.isArray(data) ? data : []);
    } catch (e: any) {
      aethexToast.error({
        title: "Failed to load mentors",
        description: String(e?.message || e),
      });
      setMentors([]);
    } finally {
      setLoadingMentors(false);
    }
  }, [availableOnly, expertiseQueryParam, mentorQ]);

  const loadRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "100");
      if (statusFilter !== "all") params.set("status", statusFilter);
      const resp = await fetch(
        `${API_BASE}/api/mentorship/requests/all?${params.toString()}`,
      );
      if (!resp.ok) throw new Error(await resp.text().catch(() => "Failed"));
      const data = await resp.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (e: any) {
      aethexToast.error({
        title: "Failed to load requests",
        description: String(e?.message || e),
      });
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadMentors().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableOnly, expertiseQueryParam]);

  useEffect(() => {
    loadRequests().catch(() => undefined);
  }, [loadRequests]);

  const setDraft = (userId: string, patch: Partial<MentorRow>) => {
    draftsRef.current[userId] = { ...draftsRef.current[userId], ...patch };
    setMentors((prev) => prev.slice());
  };

  const getDraftedMentor = (m: MentorRow): MentorRow => {
    const draft = draftsRef.current[m.user_id] || {};
    return {
      ...m,
      bio: draft.bio ?? m.bio,
      expertise: draft.expertise ?? m.expertise,
      available: draft.available ?? m.available,
      hourly_rate: draft.hourly_rate ?? m.hourly_rate,
    };
  };

  const saveMentor = async (m: MentorRow) => {
    const merged = getDraftedMentor(m);
    try {
      const payload = {
        user_id: merged.user_id,
        bio: merged.bio ?? null,
        expertise: Array.isArray(merged.expertise) ? merged.expertise : [],
        available: !!merged.available,
        hourly_rate:
          typeof merged.hourly_rate === "number" ? merged.hourly_rate : null,
      };
      const resp = await fetch(`${API_BASE}/api/mentors/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok)
        throw new Error(await resp.text().catch(() => "Save failed"));
      const updated = await resp.json();
      draftsRef.current[m.user_id] = {};
      setMentors((prev) =>
        prev.map((row) =>
          row.user_id === m.user_id ? { ...row, ...updated } : row,
        ),
      );
      aethexToast.success({
        title: "Mentor saved",
        description:
          merged.user_profiles?.full_name ||
          merged.user_profiles?.username ||
          merged.user_id,
      });
    } catch (e: any) {
      aethexToast.error({
        title: "Save failed",
        description: String(e?.message || e),
      });
    }
  };

  const filteredMentors = useMemo(() => {
    const q = mentorQ.trim().toLowerCase();
    if (!q) return mentors;
    return mentors.filter((m) => {
      const up = m.user_profiles || {};
      const haystack = [
        up.full_name,
        up.username,
        m.bio,
        (m.expertise || []).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [mentors, mentorQ]);

  return (
    <div className="space-y-6">
      <Card className="bg-card/60 border-border/40 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-aethex-300" />
            <CardTitle>Mentors directory</CardTitle>
          </div>
          <CardDescription>
            Search, filter, and update mentor availability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[240px]">
              <Input
                placeholder="Search mentors"
                value={mentorQ}
                onChange={(e) => setMentorQ(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="availableOnly"
                checked={availableOnly}
                onCheckedChange={setAvailableOnly}
              />
              <Label htmlFor="availableOnly" className="text-sm">
                Available only
              </Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadMentors}
              disabled={loadingMentors}
            >
              {loadingMentors ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input
              className="max-w-xs"
              placeholder="Add expertise tag"
              value={expertiseInput}
              onChange={(e) => setExpertiseInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = expertiseInput.trim();
                  if (value && !expertiseFilter.includes(value)) {
                    setExpertiseFilter([...expertiseFilter, value]);
                  }
                  setExpertiseInput("");
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const value = expertiseInput.trim();
                if (value && !expertiseFilter.includes(value)) {
                  setExpertiseFilter([...expertiseFilter, value]);
                }
                setExpertiseInput("");
              }}
            >
              <Tag className="mr-2 h-4 w-4" /> Add tag
            </Button>
            {expertiseFilter.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpertiseFilter([])}
              >
                Clear tags
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {expertiseFilter.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="rounded border border-border/40">
            {loadingMentors ? (
              <div className="p-4 text-sm text-muted-foreground">
                Loading mentors…
              </div>
            ) : filteredMentors.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No mentors found.
              </div>
            ) : (
              <ScrollArea className="max-h-[560px]">
                <div className="divide-y divide-border/40">
                  {filteredMentors.map((m) => {
                    const draft = draftsRef.current[m.user_id] || {};
                    const merged = getDraftedMentor(m);
                    const up = merged.user_profiles || {};
                    return (
                      <div key={m.user_id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-[240px]">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-aethex-300" />
                              <div className="font-medium text-foreground">
                                {up.full_name || up.username || m.user_id}
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs capitalize",
                                  merged.available
                                    ? "border-green-500/50 text-green-300"
                                    : "border-yellow-500/50 text-yellow-300",
                                )}
                              >
                                {merged.available ? "available" : "unavailable"}
                              </Badge>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {up.username ? `@${up.username}` : null}
                            </div>
                          </div>

                          <div className="grid gap-2 md:grid-cols-3 flex-1 min-w-[320px]">
                            <div>
                              <Label
                                htmlFor={`rate-${m.user_id}`}
                                className="text-xs"
                              >
                                Hourly rate (USD)
                              </Label>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  id={`rate-${m.user_id}`}
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={
                                    typeof merged.hourly_rate === "number"
                                      ? merged.hourly_rate
                                      : (merged.hourly_rate ?? "")
                                  }
                                  onChange={(e) =>
                                    setDraft(m.user_id, {
                                      hourly_rate:
                                        e.target.value === ""
                                          ? null
                                          : Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">Availability</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Switch
                                  checked={!!merged.available}
                                  onCheckedChange={(v) =>
                                    setDraft(m.user_id, { available: v })
                                  }
                                />
                                <span className="text-xs text-muted-foreground">
                                  {merged.available
                                    ? "Accepting requests"
                                    : "Not accepting"}
                                </span>
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">
                                Expertise (comma separated)
                              </Label>
                              <Input
                                value={(Array.isArray(merged.expertise)
                                  ? merged.expertise
                                  : []
                                ).join(", ")}
                                onChange={(e) =>
                                  setDraft(m.user_id, {
                                    expertise: e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean),
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2 md:grid-cols-[1fr_200px]">
                          <div>
                            <Label className="text-xs">Bio</Label>
                            <Textarea
                              rows={2}
                              value={merged.bio ?? ""}
                              onChange={(e) =>
                                setDraft(m.user_id, { bio: e.target.value })
                              }
                            />
                          </div>
                          <div className="flex items-end justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                draftsRef.current[m.user_id] = {};
                                setMentors((prev) => prev.slice());
                              }}
                            >
                              Reset
                            </Button>
                            <Button size="sm" onClick={() => saveMentor(m)}>
                              <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/60 border-border/40 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-aethex-300" />
            <CardTitle>Mentorship requests</CardTitle>
          </div>
          <CardDescription>
            Review mentor/mentee activity and statuses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadRequests}
                disabled={loadingRequests}
              >
                {loadingRequests ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
              <Button size="sm" asChild>
                <a href="/community/mentorship">Open requests</a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href="/community/mentorship/apply">Mentor directory</a>
              </Button>
            </div>
          </div>

          <div className="rounded border border-border/40">
            {loadingRequests ? (
              <div className="p-4 text-sm text-muted-foreground">
                Loading requests…
              </div>
            ) : requests.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No requests found.
              </div>
            ) : (
              <ScrollArea className="max-h-[560px]">
                <div className="divide-y divide-border/40">
                  {requests.map((r) => (
                    <div key={r.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">
                            {(r.mentee?.full_name ||
                              r.mentee?.username ||
                              r.mentee_id) +
                              " → " +
                              (r.mentor?.full_name ||
                                r.mentor?.username ||
                                r.mentor_id)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {r.message || "No message"}
                          </div>
                          {r.created_at ? (
                            <div className="text-[11px] text-muted-foreground mt-1">
                              {new Date(r.created_at).toLocaleString()}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {r.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
