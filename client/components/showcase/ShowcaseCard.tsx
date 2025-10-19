import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ShowcaseProject } from "@/data/showcase";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const [a, b] = [parts[0] || "", parts[1] || ""];
  return (a[0] || "").concat(b[0] || "").toUpperCase() || "A";
}

export default function ShowcaseCard({ p }: { p: ShowcaseProject }) {
  return (
    <Card className="bg-card/60 border-border/40 backdrop-blur overflow-hidden group">
      {p.image && (
        <div className="relative h-44 w-full">
          <img
            src={p.image}
            alt={p.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {p.orgUnit && (
              <Badge className="bg-gradient-to-r from-aethex-500 to-neon-blue">
                {p.orgUnit}
              </Badge>
            )}
            {p.timeframe && (
              <span className="text-xs text-muted-foreground">
                {p.timeframe}
              </span>
            )}
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">{p.title}</CardTitle>
        <CardDescription>{p.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 pb-5">
        {p.tags && p.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
        )}

        {p.contributors && p.contributors.length > 0 && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center -space-x-2">
              {p.contributors.slice(0, 5).map((c) => (
                <Avatar key={c.name} className="h-8 w-8 ring-2 ring-background">
                  <AvatarImage src={c.avatar} alt={c.name} />
                  <AvatarFallback>{initials(c.name)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              {p.role || "AeThex"}
            </div>
          </div>
        )}

        {p.links && p.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {p.links.map((l) => (
              <Button key={l.href} asChild size="sm" variant="outline">
                <a href={l.href} target="_blank" rel="noreferrer noopener">
                  {l.label}
                </a>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
