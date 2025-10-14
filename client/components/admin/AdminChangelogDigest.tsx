import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Bug, Minus, Plus, Shield } from "lucide-react";

interface ChangelogChange {
  type: "added" | "improved" | "fixed" | "removed" | "security";
  description: string;
  impact: "high" | "medium" | "low";
}

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  changes: ChangelogChange[];
  author: string;
}

interface AdminChangelogDigestProps {
  entries: ChangelogEntry[];
  onViewChangelog: () => void;
}

const changeIcon: Record<ChangelogChange["type"], LucideIcon> = {
  added: Plus,
  improved: ArrowUpRight,
  fixed: Bug,
  removed: Minus,
  security: Shield,
};

const changeAccent: Record<ChangelogChange["type"], string> = {
  added: "text-emerald-300",
  improved: "text-sky-300",
  fixed: "text-amber-300",
  removed: "text-rose-300",
  security: "text-purple-300",
};

export default function AdminChangelogDigest({
  entries,
  onViewChangelog,
}: AdminChangelogDigestProps) {
  return (
    <Card className="bg-card/60 border-border/40 backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Latest changelog</CardTitle>
            <CardDescription>
              Recent platform improvements curated for the owner dashboard.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onViewChangelog}>
            Open changelog
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No changelog entries available. Publish a new release note to update
            this feed.
          </p>
        ) : (
          entries.map((entry) => {
            const recentChanges = entry.changes.slice(0, 3);
            return (
              <div
                key={entry.id}
                className="space-y-3 rounded border border-border/30 bg-background/40 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {entry.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Version {entry.version} • {entry.author}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border/40 text-[11px]"
                  >
                    {formatDistanceToNow(new Date(entry.date), {
                      addSuffix: true,
                    })}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {entry.description}
                </p>
                {recentChanges.length ? (
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {recentChanges.map((change, idx) => {
                      const ChangeIcon = changeIcon[change.type];
                      return (
                        <li
                          key={`${entry.id}-change-${idx}`}
                          className="flex items-start gap-2"
                        >
                          <ChangeIcon
                            className={`mt-0.5 h-4 w-4 ${changeAccent[change.type]}`}
                          />
                          <span className="leading-relaxed">
                            <span className="font-medium text-foreground/80">
                              {change.type.charAt(0).toUpperCase() +
                                change.type.slice(1)}
                              :
                            </span>{" "}
                            {change.description}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
