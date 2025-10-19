import Layout from "@/components/Layout";
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
import { Link } from "react-router-dom";
import {
  Shield,
  Gavel,
  Building2,
  FileText,
  Activity,
  Megaphone,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function Trust() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto max-w-6xl px-4 space-y-10">
          <div className="space-y-4 text-center">
            <Badge variant="outline" className="mx-auto">
              Transparency
            </Badge>
            <h1 className="text-4xl font-bold text-gradient-purple">
              Company & Governance
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Clear, verifiable information about AeThex: leadership, legal
              entity, jurisdiction, policies, and status.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" /> Organization
                </CardTitle>
                <CardDescription>
                  Basic corporate details and contact
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>
                  <span className="font-medium text-foreground">
                    Legal name:
                  </span>{" "}
                  AeThex Corporation
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Jurisdiction:
                  </span>{" "}
                  United States (Arizona)
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Headquarters:
                  </span>{" "}
                  Queen Creek, Arizona
                </div>
                <div>
                  <span className="font-medium text-foreground">Email:</span>{" "}
                  <a href="mailto:info@aethex.biz" className="text-aethex-400">
                    info@aethex.biz
                  </a>
                </div>
                <div>
                  <span className="font-medium text-foreground">Phone:</span>{" "}
                  (346) 556-7100
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Leadership & Governance
                </CardTitle>
                <CardDescription>Accountability and oversight</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Phased disclosures cadence: Phase 1 (executive roster +
                    roles), Phase 2 (board/advisor bios and affiliations), Phase
                    3 (jurisdictional filings & compliance references).
                  </li>
                  <li>
                    Operational policies and escalation paths are documented in
                    the Transparency hub.
                  </li>
                  <li>
                    Verified channels: website, docs, and official social
                    accounts noted below.
                  </li>
                </ul>
                <div className="text-xs text-muted-foreground/80">
                  Last updated: {new Date().toISOString().slice(0, 10)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Executive Leadership
              </CardTitle>
              <CardDescription>
                Current executive team and public profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              {[
                {
                  name: "Anderson Gladney",
                  title: "Founder & CEO",
                  href: "https://www.linkedin.com/in/andersongladney/",
                },
                {
                  name: "Dylan Gladney",
                  title: "Founder & COO",
                  href: "https://www.linkedin.com/in/dylangladney/",
                },
                {
                  name: "Trevor Davis",
                  title: "Co-Founder & CFO",
                  href: "https://www.linkedin.com/in/trevor-davis-892642324/",
                },
                {
                  name: "Braden Eiser",
                  title: "Co-Founder & CTO",
                  href: "https://www.linkedin.com/in/bradeneiser/",
                },
              ].map((p) => {
                const unavatar = `https://unavatar.io/${encodeURIComponent(p.href)}`;
                const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D8ABC&color=fff&size=256`;
                const initials = p.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();
                return (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-border/50 p-3 hover:border-aethex-400/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={unavatar}
                          alt={p.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              fallback;
                          }}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-foreground">
                          {p.name}
                        </div>
                        <div className="text-xs">{p.title}</div>
                        <div className="text-xs text-aethex-400 mt-1">
                          LinkedIn ↗
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" /> Policies & Legal
              </CardTitle>
              <CardDescription>
                Public policies and legal references
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: "Privacy Policy", href: "/privacy" },
                { title: "Terms of Service", href: "/terms" },
                { title: "Status & Uptime", href: "/status" },
                { title: "Changelog", href: "/changelog" },
                { title: "Roadmap", href: "/roadmap" },
                { title: "Investors", href: "/investors" },
              ].map((l) => (
                <Link
                  key={l.title}
                  to={l.href}
                  className="rounded-lg border border-border/50 p-3 text-sm hover:border-aethex-400/50 transition"
                >
                  {l.title}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" /> Brand Disambiguation
              </CardTitle>
              <CardDescription>Preventing name confusion</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                AeThex Corporation is an independent organization and is not
                affiliated with other entities that may use similar names. When
                in doubt, verify links against{" "}
                <span className="text-foreground font-medium">aethex.biz</span>{" "}
                or{" "}
                <span className="text-foreground font-medium">aethex.dev</span>.
              </p>
              <p>Official channels:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Website:{" "}
                  <a
                    href="https://aethex.biz"
                    className="text-aethex-400"
                    target="_blank"
                    rel="noreferrer"
                  >
                    aethex.biz
                  </a>
                </li>
                <li>
                  Docs & Apps:{" "}
                  <a
                    href="https://aethex.dev"
                    className="text-aethex-400"
                    target="_blank"
                    rel="noreferrer"
                  >
                    aethex.dev
                  </a>
                </li>
                <li>
                  Email:{" "}
                  <a href="mailto:info@aethex.biz" className="text-aethex-400">
                    info@aethex.biz
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/about">About</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/investors">Investors</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/docs">Docs</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
