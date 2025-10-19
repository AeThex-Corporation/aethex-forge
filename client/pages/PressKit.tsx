import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PressKit() {
  const logos = [
    {
      label: "Logo (PNG, 512)",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=png&width=512",
    },
    {
      label: "Logo (PNG, 1200)",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=png&width=1200",
    },
  ];

  const colors = [
    { name: "AeThex Blue", hex: "#0a0aff" },
    { name: "Neon Blue", hex: "#2BC0FF" },
    { name: "Aethex Accent", hex: "#50C7FF" },
    { name: "Card BG", hex: "#0B0B12" },
  ];

  const typography = [
    { name: "Inter", usage: "UI / Body" },
    { name: "JetBrains Mono", usage: "Code / Numeric" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto max-w-6xl px-4 space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline">Press Kit</Badge>
            <h1 className="text-4xl font-bold text-gradient-purple">
              AeThex Brand Assets
            </h1>
            <p className="text-muted-foreground">
              Download logos, view colors and typography, and read usage
              guidelines.
            </p>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Logos</CardTitle>
              <CardDescription>Official wordmark and icon</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              {logos.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-border/50 p-3 hover:border-aethex-400/50 transition"
                >
                  {l.label}
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>Primary palette</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {colors.map((c) => (
                <div
                  key={c.hex}
                  className="rounded-lg border border-border/50 p-3 space-y-2"
                >
                  <div
                    className="h-12 w-full rounded"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="text-sm text-muted-foreground">{c.name}</div>
                  <div className="text-xs">{c.hex}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Recommended families</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              {typography.map((t) => (
                <div
                  key={t.name}
                  className="rounded-lg border border-border/50 p-3"
                >
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.usage}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Usage Guidelines</CardTitle>
              <CardDescription>Do's and Don'ts</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Use official logos without modification or distortion.</li>
                <li>
                  Maintain clear space around marks; avoid busy backgrounds.
                </li>
                <li>
                  Do not imply partnership or endorsement without written
                  approval.
                </li>
                <li>
                  Link to{" "}
                  <a
                    href="https://aethex.biz"
                    className="text-aethex-400"
                    target="_blank"
                    rel="noreferrer"
                  >
                    aethex.biz
                  </a>{" "}
                  for official context.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
