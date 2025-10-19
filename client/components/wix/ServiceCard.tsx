import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ServiceCard({
  name,
  summary,
  highlights,
}: {
  name: string;
  summary: string;
  highlights: string[];
}) {
  return (
    <Card className="h-full border-border/40 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
