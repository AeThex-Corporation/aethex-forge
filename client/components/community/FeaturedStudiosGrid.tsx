import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Studio {
  id?: string;
  name: string;
  tagline?: string | null;
  metrics?: string | null;
  specialties?: string[] | null;
  rank?: number | null;
}

export default function FeaturedStudiosGrid() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/featured-studios`);
        const data = res.ok ? await res.json() : [];
        setStudios(Array.isArray(data) ? data : []);
      } catch {
        setStudios([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <p className="text-sm text-muted-foreground text-center">
        Loading studios…
      </p>
    );
  if (!studios.length)
    return (
      <p className="text-sm text-muted-foreground text-center">
        No featured studios yet.
      </p>
    );

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {studios.map((s) => (
        <Card
          key={s.id || s.name}
          className="border-border/50 bg-background/80 backdrop-blur"
        >
          <CardHeader>
            <CardTitle className="text-lg">{s.name}</CardTitle>
            {s.tagline ? <CardDescription>{s.tagline}</CardDescription> : null}
          </CardHeader>
          <CardContent className="space-y-3">
            {s.metrics ? (
              <div className="rounded border border-border/40 bg-background/40 p-3 text-sm text-muted-foreground">
                {s.metrics}
              </div>
            ) : null}
            {Array.isArray(s.specialties) && s.specialties.length ? (
              <div className="flex flex-wrap gap-2">
                {s.specialties.map((sp) => (
                  <Badge key={sp} variant="outline" className="text-xs">
                    {sp}
                  </Badge>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
