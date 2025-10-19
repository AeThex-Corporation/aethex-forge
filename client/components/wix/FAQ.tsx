import { Card, CardContent } from "@/components/ui/card";
import type { FaqItem } from "@/data/wix/faqs";

export default function FAQList({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <Card key={i} className="border-border/40 bg-card/60 backdrop-blur">
          <CardContent className="p-5">
            <div className="font-medium">{f.q}</div>
            <div className="text-sm text-muted-foreground mt-1">{f.a}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
