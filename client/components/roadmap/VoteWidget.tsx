import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VoteWidget({
  options,
}: {
  options: { id: string; label: string }[];
}) {
  const key = "aethex_roadmap_votes_v1";
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setVotes(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(votes));
    } catch {}
  }, [votes]);

  const total = useMemo(
    () => Object.values(votes).reduce((a, b) => a + b, 0),
    [votes],
  );

  const vote = (id: string) => {
    setChoice(id);
    setVotes((m) => ({ ...m, [id]: (m[id] || 0) + 1 }));
  };

  const reset = () => {
    setChoice(null);
    setVotes({});
  };

  return (
    <Card className="bg-card/60 border-border/40 backdrop-blur">
      <CardHeader>
        <CardTitle>What should we ship next?</CardTitle>
        <CardDescription>
          Local voting preview. Public voting will sync later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 md:grid-cols-2">
          {options.map((o) => {
            const pct = total
              ? Math.round(((votes[o.id] || 0) / total) * 100)
              : 0;
            return (
              <div
                key={o.id}
                className="flex items-center justify-between rounded border border-border/40 p-3"
              >
                <div>
                  <div className="text-sm font-medium">{o.label}</div>
                  <div className="mt-1 h-1.5 w-40 rounded bg-border/50 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-aethex-500 to-neon-blue"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{pct}%</Badge>
                  <Button
                    size="sm"
                    variant={choice === o.id ? "outline" : "default"}
                    onClick={() => vote(o.id)}
                  >
                    {choice === o.id ? "Voted" : "Vote"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Reset votes
          </Button>
          <div className="text-xs text-muted-foreground">
            Votes are stored locally on your device.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
