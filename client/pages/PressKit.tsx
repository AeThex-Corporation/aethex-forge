import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, ExternalLink } from "lucide-react";

export default function PressKit() {
  const logos = [
    {
      label: "AeThex Logo (Primary)",
      description: "Main wordmark for light/dark backgrounds",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=png&width=512",
      preview: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=webp&width=200",
    },
    {
      label: "AeThex Logo (High Res)",
      description: "1200px wide for print and large displays",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=png&width=1200",
      preview: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=webp&width=200",
    },
  ];

  const armLogos = [
    {
      label: "Staff",
      color: "#7c3aed",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc0414efd7af54ef4b821a05d469150d0?format=png&width=512",
      preview: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc0414efd7af54ef4b821a05d469150d0?format=webp&width=80",
    },
    {
      label: "Labs",
      color: "#FBBF24",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fd93f7113d34347469e74421c3a3412e5?format=png&width=512",
      preview: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fd93f7113d34347469e74421c3a3412e5?format=webp&width=80",
    },
    {
      label: "GameForge",
      color: "#22C55E",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=png&width=512",
      preview: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=80",
    },
    {
      label: "Corp",
      color: "#3B82F6",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3772073d5b4b49e688ed02480f4cae43?format=png&width=512",
      preview: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3772073d5b4b49e688ed02480f4cae43?format=webp&width=80",
    },
    {
      label: "Foundation",
      color: "#EF4444",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=png&width=512",
      preview: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=80",
    },
    {
      label: "Dev-Link",
      color: "#06B6D4",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=png&width=512",
      preview: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=80",
    },
    {
      label: "Nexus",
      color: "#A855F7",
      href: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F6df123b87a144b1fb99894d94198d97b?format=png&width=512",
      preview: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F6df123b87a144b1fb99894d94198d97b?format=webp&width=80",
    },
  ];

  const primaryColors = [
    { name: "AeThex Purple", hex: "#7C3AED", hsl: "250 100% 60%", usage: "Primary brand color" },
    { name: "Neon Blue", hex: "#60A5FA", hsl: "210 100% 70%", usage: "Accent highlights" },
    { name: "Neon Purple", hex: "#C084FC", hsl: "280 100% 70%", usage: "Gradient accents" },
  ];

  const armColors = [
    { name: "Staff Purple", hex: "#7C3AED", usage: "Staff arm" },
    { name: "Labs Yellow", hex: "#FBBF24", usage: "Labs arm" },
    { name: "GameForge Green", hex: "#22C55E", usage: "GameForge arm" },
    { name: "Corp Blue", hex: "#3B82F6", usage: "Corp arm" },
    { name: "Foundation Red", hex: "#EF4444", usage: "Foundation arm" },
    { name: "Dev-Link Cyan", hex: "#06B6D4", usage: "Dev-Link arm" },
    { name: "Nexus Purple", hex: "#A855F7", usage: "Nexus arm" },
  ];

  const backgrounds = [
    { name: "Deep Space", hex: "#030712", usage: "Primary background" },
    { name: "Card Dark", hex: "#0B0B12", usage: "Card backgrounds" },
    { name: "Border", hex: "#1E293B", usage: "Borders & dividers" },
    { name: "Muted Text", hex: "#94A3B8", usage: "Secondary text" },
  ];

  const typography = [
    { name: "Inter", usage: "UI / Body / Headlines", weight: "400-700", style: "Clean, modern sans-serif" },
    { name: "JetBrains Mono", usage: "Code / Numeric / Technical", weight: "400-600", style: "Monospace for code" },
  ];

  const companyInfo = {
    name: "AeThex",
    tagline: "Build the Future",
    description: "AeThex is an advanced development platform and community for builders. We provide tools, mentorship, and resources for creators to bring their ideas to life through Labs, GameForge, Corp, Foundation, and Dev-Link.",
    founded: "2024",
    website: "https://aethex.dev",
    domains: [
      { domain: "aethex.dev", purpose: "Main platform" },
      { domain: "aethex.foundation", purpose: "Identity & passports" },
      { domain: "*.aethex.me", purpose: "Creator passports" },
      { domain: "*.aethex.space", purpose: "Project passports" },
    ],
  };

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto max-w-6xl px-4 space-y-10">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-aethex-500/50 text-aethex-300">Press Kit</Badge>
            <h1 className="text-4xl font-bold text-gradient-purple">
              AeThex Brand Assets
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Official logos, colors, typography, and usage guidelines for press and media.
            </p>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>About AeThex</CardTitle>
              <CardDescription>Company overview for press use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{companyInfo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{companyInfo.description}</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Tagline:</span> {companyInfo.tagline}</p>
                    <p><span className="text-muted-foreground">Founded:</span> {companyInfo.founded}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Official Domains</h4>
                  <div className="space-y-2">
                    {companyInfo.domains.map((d) => (
                      <div key={d.domain} className="flex items-center gap-2 text-sm">
                        <span className="text-aethex-400 font-mono">{d.domain}</span>
                        <span className="text-muted-foreground">- {d.purpose}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Primary Logo</CardTitle>
              <CardDescription>Official AeThex wordmark</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {logos.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-border/50 p-4 hover:border-aethex-400/50 transition group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                        <img src={l.preview} alt={l.label} className="w-12 h-12 object-contain" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium group-hover:text-aethex-400 transition">{l.label}</div>
                        <div className="text-sm text-muted-foreground">{l.description}</div>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground group-hover:text-aethex-400 transition" />
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Arm Logos</CardTitle>
              <CardDescription>Individual logos for each AeThex arm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {armLogos.map((arm) => (
                  <a
                    key={arm.label}
                    href={arm.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-border/50 p-4 hover:border-aethex-400/50 transition text-center group"
                  >
                    <div 
                      className="w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: `${arm.color}20` }}
                    >
                      <img src={arm.preview} alt={arm.label} className="w-10 h-10 object-contain" />
                    </div>
                    <div className="text-sm font-medium" style={{ color: arm.color }}>{arm.label}</div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Primary Colors</CardTitle>
              <CardDescription>Core brand palette</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {primaryColors.map((c) => (
                  <div
                    key={c.hex}
                    className="rounded-lg border border-border/50 p-4 space-y-3"
                  >
                    <div
                      className="h-16 w-full rounded-lg"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-muted-foreground">{c.usage}</div>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span className="font-mono bg-slate-800 px-2 py-1 rounded">{c.hex}</span>
                      <span className="font-mono bg-slate-800 px-2 py-1 rounded">{c.hsl}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Arm Colors</CardTitle>
              <CardDescription>Color palette for each arm division</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {armColors.map((c) => (
                  <div
                    key={c.hex}
                    className="rounded-lg border border-border/50 p-3 space-y-2"
                  >
                    <div
                      className="h-10 w-full rounded"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="text-sm">{c.name}</div>
                    <div className="text-xs font-mono text-muted-foreground">{c.hex}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Background Colors</CardTitle>
              <CardDescription>Dark theme palette</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {backgrounds.map((c) => (
                  <div
                    key={c.hex}
                    className="rounded-lg border border-border/50 p-3 space-y-2"
                  >
                    <div
                      className="h-10 w-full rounded border border-border/30"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="text-sm">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.usage}</div>
                    <div className="text-xs font-mono text-muted-foreground">{c.hex}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Recommended font families</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {typography.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-lg border border-border/50 p-4"
                  >
                    <div className="font-semibold text-lg" style={{ fontFamily: t.name === "JetBrains Mono" ? "monospace" : "inherit" }}>
                      {t.name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{t.style}</div>
                    <div className="mt-3 space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Usage:</span> {t.usage}</p>
                      <p><span className="text-muted-foreground">Weights:</span> {t.weight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Usage Guidelines</CardTitle>
              <CardDescription>Do's and Don'ts for brand usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-400 mb-3">Do's</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Use official logos without modification or distortion</li>
                    <li>Maintain clear space around marks (minimum 20% of logo height)</li>
                    <li>Use on dark backgrounds for optimal visibility</li>
                    <li>Link to <a href="https://aethex.dev" className="text-aethex-400 hover:underline" target="_blank" rel="noreferrer">aethex.dev</a> for official context</li>
                    <li>Use arm-specific colors when referencing individual divisions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-400 mb-3">Don'ts</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Do not stretch, rotate, or alter the logo proportions</li>
                    <li>Do not use on busy or conflicting backgrounds</li>
                    <li>Do not imply partnership or endorsement without written approval</li>
                    <li>Do not use outdated logos or assets</li>
                    <li>Do not recreate the logo with different fonts or colors</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Press Contact</CardTitle>
              <CardDescription>For media inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="outline" className="border-aethex-500/50 hover:bg-aethex-500/10">
                  <a href="mailto:press@aethex.dev">
                    Contact Press Team
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="ghost">
                  <a href="https://aethex.dev" target="_blank" rel="noreferrer">
                    Visit aethex.dev
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
