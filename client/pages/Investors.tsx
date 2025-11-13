import Layout from "@/components/Layout";

const API_BASE = import.meta.env.VITE_API_BASE || "";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  BarChart3,
  Layers,
  Shield,
  Handshake,
  Building2,
  Target,
  Rocket,
} from "lucide-react";

type ThesisPoint = { icon: JSX.Element; title: string; desc: string };

export default function Investors() {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [accredited, setAccredited] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isClientRealm = (profile as any)?.user_type === "client";

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const submit = async () => {
    if (!email.trim()) {
      toast({ variant: "destructive", description: "Email is required" });
      return;
    }
    setSubmitting(true);
    try {
      const resp = await fetch(`${API_BASE}/api/investors/interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, amount, accredited, message }),
      });
      if (!resp.ok) throw new Error("Failed to submit");
      toast({
        title: "Thanks!",
        description: "We’ll follow up with next steps.",
      });
      setName("");
      setEmail("");
      setAmount("");
      setMessage("");
      setAccredited(false);
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e?.message || "Try again later",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const activateClientRealm = async () => {
    try {
      await updateProfile({ user_type: "client" as any });
      toast({ title: "Realm set", description: "Consulting realm activated" });
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e?.message || "Could not update realm",
      });
    }
  };

  const thesis: ThesisPoint[] = [
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Three Engines",
      desc: "Studios (services), Platform (community), and Labs (R&D) compound value together.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Trust & Quality",
      desc: "Security-first engineering and measurable delivery keep churn low and NPS high.",
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Focused Markets",
      desc: "High-signal segments: games, real-time apps, and experience platforms.",
    },
  ];

  const kpis = [
    { kpi: "50+", label: "Projects shipped" },
    { kpi: "10x", label: "Perf improvements" },
    { kpi: "99.9%", label: "Uptime targets" },
    { kpi: "<30d", label: "MVP timelines" },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ef4444_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(239,68,68,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />

        <main className="relative z-10">
          {/* Hero */}
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Badge
                  variant="outline"
                  className="border-red-400/40 bg-red-500/10 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-red-300" />
                  Investor Relations
                </Badge>
                <h1 className="text-4xl font-black tracking-tight text-red-300 sm:text-5xl lg:text-6xl">
                  AeThex | Building With Conviction
                </h1>
                <p className="text-lg text-red-100/90 sm:text-xl">
                  We craft reliable, loved software and the platform that powers
                  creators. Explore our thesis, traction, and how to participate
                  in compliant offerings.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.35)] transition hover:bg-red-400"
                    onClick={() =>
                      formRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <Handshake className="mr-2 h-5 w-5" /> Request Investor Info
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-red-400/60 text-red-300 hover:bg-red-500/10"
                  >
                    <Link to="/about">
                      <Rocket className="mr-2 h-5 w-5" /> Read About AeThex
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Thesis */}
          <section className="border-y border-red-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="mb-12 flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-red-300 sm:text-4xl">
                    Investment Thesis
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm text-red-100/70 sm:text-base">
                    Software creation is shifting to collaborative, real-time
                    networks. AeThex aligns world-class services, platform, and
                    research to accelerate outcomes for builders and brands.
                  </p>
                </div>
                <Flame className="hidden h-10 w-10 text-red-400/70 sm:block" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {thesis.map((point) => (
                  <Card
                    key={point.title}
                    className="border border-red-400/20 bg-black/60 backdrop-blur"
                  >
                    <CardHeader className="space-y-2">
                      <CardTitle className="flex items-center gap-2 text-red-100">
                        {point.icon}
                        {point.title}
                      </CardTitle>
                      <CardDescription className="text-red-200/80">
                        {point.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* KPIs */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid gap-4 md:grid-cols-4">
                {kpis.map((m) => (
                  <Card
                    key={m.label}
                    className="border border-red-400/15 bg-black/70 text-center"
                  >
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-red-300">
                        {m.kpi}
                      </div>
                      <div className="mt-1 text-sm text-red-100/80">
                        {m.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Interest + Realm */}
          <section
            ref={formRef}
            className="border-y border-red-400/10 bg-black/85 py-16"
          >
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border border-red-400/20 bg-black/70">
                  <CardHeader>
                    <CardTitle className="text-red-100">
                      Investor interest
                    </CardTitle>
                    <CardDescription className="text-red-200/80">
                      Request our investor packet and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      placeholder="Indicative amount (optional)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <label className="flex items-center gap-2 text-sm text-red-100/80">
                      <input
                        type="checkbox"
                        checked={accredited}
                        onChange={(e) => setAccredited(e.target.checked)}
                      />{" "}
                      I am an accredited investor (self-attested)
                    </label>
                    <Textarea
                      placeholder="Message (optional)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={submit}
                        disabled={submitting}
                        className="bg-red-500 hover:bg-red-400"
                      >
                        {submitting ? "Sending…" : "Request Info"}
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        className="border-red-400/60 text-red-300 hover:bg-red-500/10"
                      >
                        <Link to="/docs">View Docs</Link>
                      </Button>
                    </div>
                    <p className="text-xs text-red-200/70">
                      This page is informational only and not an offer to sell
                      securities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-red-400/20 bg-black/70">
                  <CardHeader>
                    <CardTitle className="text-red-100">
                      Realm for investors
                    </CardTitle>
                    <CardDescription className="text-red-200/80">
                      Investors map to the Client realm (strategic partners)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-red-100/80">
                      Client realm provides engagement dashboards, briefings,
                      and investor updates. Switch realms anytime from Realms.
                    </p>
                    {user ? (
                      <Button
                        onClick={activateClientRealm}
                        disabled={isClientRealm}
                        className="bg-red-500 hover:bg-red-400"
                      >
                        {isClientRealm
                          ? "Consulting realm active"
                          : "Activate Consulting realm"}
                      </Button>
                    ) : (
                      <Button asChild className="bg-red-500 hover:bg-red-400">
                        <Link to="/onboarding">Create account to activate</Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      asChild
                      className="border-red-400/60 text-red-300 hover:bg-red-500/10"
                    >
                      <Link to="/realms">Open Realms</Link>
                    </Button>
                    <div className="rounded border border-red-400/20 bg-black/60 p-4">
                      <div className="mb-1 text-xs uppercase text-red-400/80">
                        Why AeThex
                      </div>
                      <ul className="list-disc pl-5 text-sm text-red-100/80 space-y-1">
                        <li>
                          End-to-end capabilities (services + platform + labs)
                        </li>
                        <li>Strong builder brand, ethical engineering</li>
                        <li>Clear roadmap to commerce (merch/digital goods)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Legal */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Card className="border border-red-400/15 bg-black/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-100">
                    <Building2 className="h-5 w-5" /> How to invest (legal
                    paths)
                  </CardTitle>
                  <CardDescription className="text-red-200/80">
                    We work with compliant frameworks
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-red-100/80 space-y-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Seed/SAFE via Reg D 506(c) for accredited investors
                      (KYC/AML and accreditation checks required).
                    </li>
                    <li>
                      Community rounds via Reg CF on a registered funding portal
                      (e.g., Wefunder/StartEngine) for non-accredited
                      participants.
                    </li>
                    <li>
                      Larger public-ready rounds via Reg A+ with audited
                      financials and a qualified offering circular.
                    </li>
                  </ul>
                  <p>
                    Investment funds are not accepted on this site. Product
                    purchases (merch or digital goods) are separate consumer
                    transactions and do not constitute securities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
