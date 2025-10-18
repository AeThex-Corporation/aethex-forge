import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Investors() {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [accredited, setAccredited] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email.trim()) {
      toast({ variant: "destructive", description: "Email is required" });
      return;
    }
    setSubmitting(true);
    try {
      const resp = await fetch("/api/investors/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, amount, accredited, message }),
      });
      if (!resp.ok) throw new Error("Failed to submit");
      toast({ title: "Thanks!", description: "We’ll follow up with next steps." });
      setName(""); setEmail(""); setAmount(""); setMessage(""); setAccredited(false);
    } catch (e: any) {
      toast({ variant: "destructive", description: e?.message || "Try again later" });
    } finally {
      setSubmitting(false);
    }
  };

  const activateClientRealm = async () => {
    try {
      await updateProfile({ user_type: "client" as any });
      toast({ title: "Realm set", description: "Client realm activated" });
    } catch (e: any) {
      toast({ variant: "destructive", description: e?.message || "Could not update realm" });
    }
  };

  const isClientRealm = (profile as any)?.user_type === "client";

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6 space-y-8">
        <div>
          <Badge variant="outline" className="mb-2">Investors</Badge>
          <h1 className="text-3xl font-bold">Partner with AeThex</h1>
          <p className="text-muted-foreground max-w-2xl">Learn about our vision, traction, and how to participate in future financings. This page is informational and not an offer to sell securities.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Investor interest</CardTitle>
              <CardDescription>Request our investor packet and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Indicative amount (optional)" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={accredited} onChange={(e) => setAccredited(e.target.checked)} /> I am an accredited investor (self-attested)</label>
              <Textarea placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={submit} disabled={submitting}>{submitting ? "Sending…" : "Request Info"}</Button>
                <Button variant="outline" asChild>
                  <a href="/docs" target="_self">View Docs</a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Disclaimer: This is not an offer to sell securities. Any offering will be made only through proper exempt offering documents via a compliant portal.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Realm for investors</CardTitle>
              <CardDescription>Investors map to the Client realm (strategic partners)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">The Client realm gives access to engagement dashboards, briefings, and investor updates. You can switch realms anytime from Realms.</p>
              {user ? (
                <Button onClick={activateClientRealm} disabled={isClientRealm}>
                  {isClientRealm ? "Client realm active" : "Activate Client realm"}
                </Button>
              ) : (
                <Button asChild>
                  <a href="/onboarding">Create account to activate</a>
                </Button>
              )}
              <Button variant="outline" asChild>
                <a href="/realms">Open Realms</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What is AeThex</CardTitle>
            <CardDescription>Mission, vision, and how we operate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Mission</h4>
                <p>Empower creators and companies to craft digital experiences faster through world‑class tooling, collaboration, and community.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Vision</h4>
                <p>An ecosystem where ideas move from concept to playable/productized reality with less friction—open, collaborative, and measurable.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">What we do</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Studios: design, engineering, and production services</li>
                  <li>Platform: community, mentorship, and workflows</li>
                  <li>Research: labs, prototypes, and technical content</li>
                </ul>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-1">How we execute</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Realm���based dashboards for client, community, and staff</li>
                  <li>Data‑driven delivery and open collaboration</li>
                  <li>Ethical, security‑first engineering practices</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Traction & roadmap</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Growing community and content footprint</li>
                  <li>Mentorship and collaboration features shipping</li>
                  <li>Commerce for merch/digital goods coming online</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to invest (legal paths)</CardTitle>
            <CardDescription>We work with compliant frameworks</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Seed/SAFE via Reg D 506(c) for accredited investors (KYC/AML and accreditation checks required).</li>
              <li>Community rounds via Reg CF on a registered funding portal (e.g., Wefunder/StartEngine) for non‑accredited participants.</li>
              <li>Larger public-ready rounds via Reg A+ with audited financials and qualified offering circular.</li>
            </ul>
            <p>Investment funds are not accepted on this site. Product purchases (merch or digital goods) are separate consumer transactions and do not constitute securities.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
