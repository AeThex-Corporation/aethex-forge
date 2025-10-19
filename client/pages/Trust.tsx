import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Gavel, Building2, FileText, Activity, Megaphone, CheckCircle2 } from "lucide-react";

export default function Trust() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto max-w-6xl px-4 space-y-10">
          <div className="space-y-4 text-center">
            <Badge variant="outline" className="mx-auto">Transparency</Badge>
            <h1 className="text-4xl font-bold text-gradient-purple">Company & Governance</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Clear, verifiable information about AeThex: leadership, legal entity, jurisdiction, policies, and status.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Organization</CardTitle>
                <CardDescription>Basic corporate details and contact</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div><span className="font-medium text-foreground">Legal name:</span> AeThex Corporation</div>
                <div><span className="font-medium text-foreground">Jurisdiction:</span> United States (Arizona)</div>
                <div><span className="font-medium text-foreground">Headquarters:</span> Queen Creek, Arizona</div>
                <div><span className="font-medium text-foreground">Email:</span> <a href="mailto:info@aethex.biz" className="text-aethex-400">info@aethex.biz</a></div>
                <div><span className="font-medium text-foreground">Phone:</span> (346) 556-7100</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Leadership & Governance</CardTitle>
                <CardDescription>Accountability and oversight</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Executive leadership details are being published in phased updates alongside board/advisor disclosures.</li>
                  <li>Operational policies and escalation paths are documented in the Transparency hub.</li>
                  <li>Verified channels: website, docs, and official social accounts noted below.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Gavel className="h-5 w-5" /> Policies & Legal</CardTitle>
              <CardDescription>Public policies and legal references</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[{title:"Privacy Policy", href:"/privacy"},{title:"Terms of Service", href:"/terms"},{title:"Status & Uptime", href:"/status"},{title:"Changelog", href:"/changelog"},{title:"Roadmap", href:"/roadmap"},{title:"Investors", href:"/investors"}].map((l)=> (
                <Link key={l.title} to={l.href} className="rounded-lg border border-border/50 p-3 text-sm hover:border-aethex-400/50 transition">
                  {l.title}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5" /> Brand Disambiguation</CardTitle>
              <CardDescription>Preventing name confusion</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                AeThex Corporation is an independent organization and is not affiliated with other entities that may use similar names. When in doubt, verify links against <span className="text-foreground font-medium">aethex.biz</span> or <span className="text-foreground font-medium">aethex.dev</span>.
              </p>
              <p>
                Official channels:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Website: <a href="https://aethex.biz" className="text-aethex-400" target="_blank" rel="noreferrer">aethex.biz</a></li>
                <li>Docs & Apps: <a href="https://aethex.dev" className="text-aethex-400" target="_blank" rel="noreferrer">aethex.dev</a></li>
                <li>Email: <a href="mailto:info@aethex.biz" className="text-aethex-400">info@aethex.biz</a></li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link to="/about">About</Link></Button>
            <Button asChild variant="outline"><Link to="/investors">Investors</Link></Button>
            <Button asChild variant="outline"><Link to="/docs">Docs</Link></Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
