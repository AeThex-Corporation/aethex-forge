import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { aethexToast } from "@/lib/aethex-toast";
import { Link } from "react-router-dom";
import {
  BadgeDollarSign,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Award,
  BarChart3,
  Clock,
  DollarSign,
  Handshake,
  Layers,
  LineChart,
  Rocket,
  Sparkles,
  Stars,
  Users,
} from "lucide-react";

type ServiceBundle = {
  id: string;
  name: string;
  description: string;
  startingAt: string;
  typicalScope: string;
  timeline: string;
  includes: string[];
};

type EngagementModel = {
  name: string;
  summary: string;
  bestFor: string;
  pricing: string;
  highlights: string[];
};

type CommissionTier = {
  name: string;
  split: string;
  threshold: string;
  notes: string;
};

type AddOn = {
  title: string;
  description: string;
  rate: string;
  icon: React.ElementType;
};

const serviceBundles: ServiceBundle[] = [
  {
    id: "game-development",
    name: "Game Development",
    description:
      "Full-cycle production for Roblox, mobile, desktop, and console experiences. Ideal for creators scaling prototypes into live products.",
    startingAt: "Starting at $2,500",
    typicalScope: "Custom builds, ports, live ops systems",
    timeline: "2-12 months depending on scope",
    includes: [
      "Dedicated producer + cross-disciplinary pod",
      "Weekly playable builds with QA reports",
      "Monetization + analytics integration",
      "Launch, certification, and post-launch support",
    ],
  },
  {
    id: "development-consulting",
    name: "Development Consulting",
    description:
      "Strategy, architecture, and delivery acceleration for product teams modernizing stacks or scaling platforms.",
    startingAt: "Starting at $6,000",
    typicalScope: "Audits, modernization, DevOps, team enablement",
    timeline: "1-12 weeks for engagements, retainers available",
    includes: [
      "Detailed technical audit and roadmap",
      "Implementation pairing with in-house teams",
      "Security, compliance, and performance baselines",
      "Executive-ready reporting and success metrics",
    ],
  },
  {
    id: "mentorship",
    name: "Mentorship & Education",
    description:
      "Personalized mentorship programs, boot camps, and corporate training to upskill teams and individuals.",
    startingAt: "Starting at $150/month",
    typicalScope: "1:1 mentorship, group cohorts, enterprise training",
    timeline: "4-24 weeks depending on track",
    includes: [
      "Custom learning plans and project briefs",
      "Weekly live sessions with senior practitioners",
      "Portfolio and interview preparation",
      "Progress analytics shared with sponsors",
    ],
  },
];

const engagementModels: EngagementModel[] = [
  {
    name: "Project-Based",
    summary:
      "Fixed-scope delivery with milestone billing. Transparent budgets and predictable outcomes for well-defined initiatives.",
    bestFor: "Game launches, feature builds, audits, modernization projects",
    pricing: "Quotes from $5,000 based on scope",
    highlights: [
      "Detailed proposal with scope, timeline, and deliverables",
      "Milestone-based invoices aligned to value delivered",
      "Dedicated producer as single point of contact",
    ],
  },
  {
    name: "Retainer & Pod",
    summary:
      "Reserved capacity from a cross-functional AeThex pod. Ideal for studios needing consistent momentum and rapid iteration.",
    bestFor: "Live ops, product roadmap execution, embedded leadership",
    pricing: "Pods available from $4,500/month",
    highlights: [
      "Guaranteed hours and sprint cadence",
      "Mix-and-match roles (engineering, design, PM)",
      "Velocity reporting and prioritization workshops",
    ],
  },
  {
    name: "Revenue Share / Commission",
    summary:
      "Performance-aligned partnerships where AeThex participates directly in upside across launches, cosmetics, or creator tooling.",
    bestFor:
      "Creators with engaged audiences, experiential brands, emerging studios",
    pricing: "Flexible splits after recouped production costs",
    highlights: [
      "Shared analytics dashboards and growth experiments",
      "Ongoing live ops + marketing alignment meetings",
      "Option to blend with modest retainers for guaranteed throughput",
    ],
  },
];

const commissionTiers: CommissionTier[] = [
  {
    name: "Indie Accelerator",
    split: "70% creator / 30% AeThex after cost recovery",
    threshold: "Projects under $50K or first-time launches",
    notes:
      "AeThex fronts production sprints and tooling. Marketing boosts via community partners included.",
  },
  {
    name: "Studio Partnership",
    split: "80% partner / 20% AeThex on net revenue",
    threshold: "Established teams with existing distribution",
    notes:
      "Joint roadmap planning, LiveOps experimentation, and marketplace merchandising support.",
  },
  {
    name: "Enterprise Commission",
    split: "Custom 10-25% performance fee",
    threshold:
      "High-profile activations, seasonal events, or branded experiences",
    notes:
      "Co-marketing, compliance, and rapid scale pods with 24/7 operations.",
  },
];

const addOns: AddOn[] = [
  {
    title: "Creative Direction",
    description:
      "Narrative design, concept art, branding systems, and pitch decks ready for investors or communities.",
    rate: "$2,000+ per engagement",
    icon: Sparkles,
  },
  {
    title: "Growth & Monetization",
    description:
      "Economy balancing, pricing experiments, retention funnels, and live events strategy.",
    rate: "$1,200/mo or revenue share",
    icon: LineChart,
  },
  {
    title: "Support & Operations",
    description:
      "Player support, moderation, telemetry tuning, and automated health checks across platforms.",
    rate: "$95/hr or bundle",
    icon: Users,
  },
  {
    title: "QA & Certification",
    description:
      "Platform certification, device matrix testing, and regression pipelines for continuous delivery.",
    rate: "$1,500 per release window",
    icon: CalendarCheck,
  },
];

const process = [
  {
    step: "01",
    title: "Discovery & Alignment",
    description:
      "Schedule an intro call, share goals, and walk through references. We map success criteria and define the engagement model.",
  },
  {
    step: "02",
    title: "Proposal & Approval",
    description:
      "Receive a detailed proposal with investment breakdown, milestones, resourcing model, and optional add-ons.",
  },
  {
    step: "03",
    title: "Launch Sprint",
    description:
      "Kick off with a stakeholder workshop. We lock delivery cadence, communication stack, and analytics instrumentation.",
  },
  {
    step: "04",
    title: "Scale & Optimize",
    description:
      "Track KPIs together, review demos, and iterate. Additional pods or commission tiers can be activated as momentum grows.",
  },
];

const faqs = [
  {
    question: "How do you price mixed-scope engagements?",
    answer:
      "We blend fixed-fee milestones for known deliverables with retainers or revenue share for live operations and experimental features. The model is always transparent and documented before kickoff.",
  },
  {
    question: "What information helps you quote faster?",
    answer:
      "Links to existing builds, tech stack details, target platforms, deadlines, and growth goals. Even bullet-point dreams are welcome—our team is great at filling in blanks.",
  },
  {
    question: "Can we start small before scaling up?",
    answer:
      "Absolutely. Many partners engage us for a quick assessment or prototype sprint before expanding into retainers or revenue share models.",
  },
  {
    question: "Do you work with external creators or agencies?",
    answer:
      "Yes. We routinely collaborate with independent artists, streamers, and agencies. Our commission tiers were designed to align incentives across blended teams.",
  },
];

export default function Engage() {
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("Engagement center ready");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading engagement center..."
        showProgress
        duration={900}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
          <div className="absolute inset-0 opacity-15">
            {[...Array(35)].map((_, idx) => (
              <div
                key={idx}
                className="absolute text-aethex-400/80 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  fontSize: `${8 + Math.random() * 8}px`,
                }}
              >
                {"💼🎮📈🛠️".charAt(Math.floor(Math.random() * 4))}
              </div>
            ))}
          </div>

          <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
              <Badge
                variant="outline"
                className="border-aethex-400/50 text-aethex-300 backdrop-blur-sm"
              >
                <Handshake className="mr-2 h-3 w-3" />
                Engagement Playbook
              </Badge>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-gradient-purple">
                  Choose how you collaborate with AeThex
                </span>
              </h1>

              <p className="text-lg text-muted-foreground sm:text-xl">
                Compare investment models, commission structures, and add-ons in
                a single hub. Every action to engage AeThex now routes here so
                you can align stakeholders quickly.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
                >
                  <Link to="#bundles" className="flex items-center gap-2">
                    <BadgeDollarSign className="h-5 w-5" />
                    Explore Engagement Bundles
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-aethex-400/60 text-aethex-100 hover:bg-aethex-500/10 text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
                >
                  <Link to="/contact" className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Book a Scoping Call
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  24-hour proposal turnaround
                </span>
                <span className="flex items-center gap-1">
                  <Stars className="h-3 w-3" />
                  Transparent milestones
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Embedded expert pods
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Service Bundles */}
        <section id="bundles" className="bg-background/30 py-16 sm:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gradient mb-4 sm:text-4xl">
                Core Engagement Bundles
              </h2>
              <p className="text-lg text-muted-foreground">
                These bundles power every CTA across Game Development,
                Consulting, and Mentorship. Pick the bundle, customize with
                add-ons, and launch fast.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceBundles.map((bundle, index) => (
                <Card
                  key={bundle.id}
                  id={bundle.id}
                  className="relative overflow-hidden border-border/50 hover:border-aethex-400/50 transition-all duration-500 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-aethex-400/30 bg-background/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aethex-200">
                      <Layers className="h-3 w-3" /> {bundle.typicalScope}
                    </div>
                    <CardTitle className="text-2xl">{bundle.name}</CardTitle>
                    <CardDescription>{bundle.description}</CardDescription>
                    <div className="text-left text-sm text-muted-foreground">
                      <span className="font-semibold text-aethex-300">
                        {bundle.startingAt}
                      </span>
                      <div>{bundle.timeline}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {bundle.includes.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-aethex-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                    <Button
                      asChild
                      variant="outline"
                      className="mt-4 w-full border-aethex-400/40 text-aethex-100 hover:border-aethex-400 hover:bg-aethex-500/10"
                    >
                      <Link
                        to={`/contact?subject=${encodeURIComponent(bundle.name + " Inquiry")}`}
                      >
                        Request {bundle.name} Proposal
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Engagement Models */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gradient mb-4 sm:text-4xl">
                Engagement Models
              </h2>
              <p className="text-lg text-muted-foreground">
                Mix and match fixed project work, retainers, or
                performance-based commissions. Every option includes transparent
                reporting.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {engagementModels.map((model) => (
                <Card
                  key={model.name}
                  className="border-border/50 bg-card/40 hover:border-aethex-400/50 transition-all duration-500 hover:-translate-y-1"
                >
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-2xl">{model.name}</CardTitle>
                    <CardDescription>{model.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-border/50 bg-background/40 p-4 text-sm text-muted-foreground">
                      <div className="font-semibold text-aethex-300">
                        Best for
                      </div>
                      <div>{model.bestFor}</div>
                    </div>
                    <div className="text-sm font-semibold text-aethex-300">
                      {model.pricing}
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {model.highlights.map((highlight) => (
                        <div key={highlight} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-aethex-400" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Commission Tiers */}
        <section className="bg-background/30 py-16 sm:py-20">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gradient mb-4 sm:text-4xl">
                Commission & Revenue Share Tiers
              </h2>
              <p className="text-lg text-muted-foreground">
                When upside matters more than invoices, these tiers align our
                success with yours. All tiers include weekly revenue snapshots
                and experiment planning calls.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {commissionTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className="border-border/50 bg-card/40 hover:border-aethex-400/50 transition-all duration-500"
                >
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription className="text-sm font-semibold text-aethex-300">
                      {tier.split}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-aethex-400" />
                      <span>{tier.threshold}</span>
                    </div>
                    <p>{tier.notes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gradient mb-4 sm:text-4xl">
                Popular Add-ons
              </h2>
              <p className="text-lg text-muted-foreground">
                Bolt these on to any bundle or engagement model for extra lift.
                Investments shown are typical—final quotes depend on scope.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-2">
              {addOns.map((addon) => {
                const Icon = addon.icon;
                return (
                  <Card
                    key={addon.title}
                    className="border-border/50 bg-card/40 hover:border-aethex-400/50 transition-all duration-500"
                  >
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle>{addon.title}</CardTitle>
                        <CardDescription>{addon.description}</CardDescription>
                      </div>
                      <Icon className="h-8 w-8 text-aethex-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="inline-flex items-center gap-2 rounded-full border border-aethex-400/40 bg-background/30 px-4 py-1 text-sm font-semibold text-aethex-200">
                        <DollarSign className="h-4 w-4" /> {addon.rate}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-background/30 py-16 sm:py-20">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gradient mb-4 sm:text-4xl">
                How Engagements Flow
              </h2>
              <p className="text-lg text-muted-foreground">
                Every engagement—regardless of investment—follows a transparent
                flow so you always know what happens next.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-2">
              {process.map((stage) => (
                <Card
                  key={stage.step}
                  className="border-border/50 bg-card/40 hover:border-aethex-400/50 transition-all duration-500"
                >
                  <CardHeader className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Step {stage.step}
                    </div>
                    <CardTitle>{stage.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {stage.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs + CTA */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid gap-12 md:grid-cols-[3fr,2fr]">
              <div>
                <h2 className="text-3xl font-bold text-gradient mb-6 sm:text-4xl">
                  Frequently Asked
                </h2>
                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="rounded-xl border border-border/40 bg-card/40 p-6"
                    >
                      <h3 className="text-lg font-semibold text-foreground">
                        {faq.question}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="border-aethex-400/50 bg-gradient-to-br from-aethex-950/80 via-aethex-900/60 to-neon-blue/10 backdrop-blur">
                <CardHeader className="space-y-4 text-center">
                  <CardTitle className="text-2xl text-gradient">
                    Ready to start?
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Share your goals and we'll craft a tailored engagement plan
                    within one business day.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 text-base sm:text-lg py-4 sm:py-5"
                  >
                    <Link
                      to="/contact"
                      className="flex items-center justify-center gap-2"
                    >
                      <Briefcase className="h-5 w-5" />
                      Request Proposal
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-aethex-400/60 text-aethex-100 hover:bg-aethex-500/10 text-base sm:text-lg py-4 sm:py-5"
                  >
                    <a href="mailto:hello@aethex.biz?subject=AeThex Engagement Inquiry">
                      hello@aethex.biz
                    </a>
                  </Button>
                  <div className="rounded-lg border border-border/40 bg-background/40 p-4 text-left text-xs text-muted-foreground">
                    <p>
                      Need NDAs or procurement documents? Mention it in your
                      message and our operations team will respond with the
                      required paperwork.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
