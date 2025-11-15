import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateUUID } from "@/lib/utils";
import type { AethexUserProfile } from "@/lib/aethex-database-adapter";
import { ArrowDown, ArrowUp, Plus, Save, Trash2, Users } from "lucide-react";

interface SpotlightEntry {
  id: string;
  type: "developer" | "group";
  label: string;
  url?: string;
  realms?: (
    | "game_developer"
    | "client"
    | "community_member"
    | "customer"
    | "staff"
  )[];
}

const STORAGE_KEY = "aethex_spotlights";

function loadSpotlights(): SpotlightEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSpotlights(entries: SpotlightEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function AdminSpotlightManager({
  profiles,
}: {
  profiles: AethexUserProfile[];
}) {
  const [entries, setEntries] = useState<SpotlightEntry[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupUrl, setNewGroupUrl] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");

  useEffect(() => {
    setEntries(loadSpotlights());
  }, []);

  const devOptions = useMemo(
    () =>
      profiles.map((p) => ({
        id: p.id,
        label: p.full_name || p.username || p.email || "Unknown",
      })),
    [profiles],
  );

  const addDeveloper = () => {
    if (!selectedProfileId) return;
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (!profile) return;
    const label =
      profile.full_name ||
      profile.username ||
      profile.email ||
      selectedProfileId;
    setEntries((prev) => [
      ...prev,
      { id: selectedProfileId, type: "developer", label },
    ]);
    setSelectedProfileId("");
  };

  const addGroup = () => {
    if (!newGroupName.trim()) return;
    setEntries((prev) => [
      ...prev,
      {
        id: generateUUID(),
        type: "group",
        label: newGroupName.trim(),
        url: newGroupUrl.trim() || undefined,
      },
    ]);
    setNewGroupName("");
    setNewGroupUrl("");
  };

  const move = (index: number, dir: -1 | 1) => {
    setEntries((prev) => {
      const next = prev.slice();
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[j];
      next[j] = tmp;
      return next;
    });
  };

  const remove = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const saveAll = () => saveSpotlights(entries);

  return (
    <Card className="bg-card/60 border-border/40 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-aethex-300" />
          <CardTitle>Community spotlight</CardTitle>
        </div>
        <CardDescription>
          Feature developers and groups on the Community page. Persists locally
          for now.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">Add developer</div>
            <div className="flex gap-2">
              <Select
                value={selectedProfileId}
                onValueChange={setSelectedProfileId}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a profile" />
                </SelectTrigger>
                <SelectContent>
                  {devOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addDeveloper}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Add group</div>
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Input
                placeholder="Link (optional)"
                value={newGroupUrl}
                onChange={(e) => setNewGroupUrl(e.target.value)}
              />
            </div>
            <Button onClick={addGroup} className="mt-1">
              <Plus className="h-4 w-4 mr-2" />
              Add group
            </Button>
          </div>
        </div>

        <div className="rounded border border-border/40 bg-background/40">
          <div className="flex items-center justify-between p-3">
            <div className="text-sm font-medium">Spotlight queue</div>
            <Button size="sm" variant="outline" onClick={saveAll}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
          <ScrollArea className="max-h-64">
            <ul className="grid gap-2 p-3">
              {entries.map((e, i) => (
                <li
                  key={`${e.type}-${e.id}-${i}`}
                  className="flex items-center justify-between gap-2 rounded border border-border/30 bg-background/40 p-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {e.type}
                    </Badge>
                    <span className="text-sm text-foreground">{e.label}</span>
                    {e.url ? (
                      <a
                        className="text-xs text-aethex-300 underline"
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        open
                      </a>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => move(i, -1)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => move(i, +1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => remove(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
              {!entries.length && (
                <li className="text-sm text-muted-foreground px-3 pb-3">
                  No spotlight entries yet.
                </li>
              )}
            </ul>
          </ScrollArea>
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: After saving, visit /community#featured-developers or
          /community#featured-studios. A backend table can replace local
          persistence later.
        </p>
      </CardContent>
    </Card>
  );
}
