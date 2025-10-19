import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PricingTier } from "@/data/wix/pricing";

export default function PricingTable({ tiers }: { tiers: PricingTier[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map((t) => (
        <Card key={t.id} className="border-border/40 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle>{t.name}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">{t.price}</div>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {t.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <Button className="w-full" asChild>
              <a href="#start">{t.cta}</a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
