import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PRICING_TIERS = [
  {
    name: "Studio Starter",
    description: "For small teams just starting out",
    price: "$99",
    period: "/month",
    features: [
      "Monthly shipping cycles",
      "Up to 5 team members",
      "Core tools and templates",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Studio Pro",
    description: "For growing game studios",
    price: "$299",
    period: "/month",
    features: [
      "Everything in Starter",
      "Unlimited team members",
      "Advanced tools suite",
      "Priority support",
      "Custom integrations",
      "Performance monitoring",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Studio Enterprise",
    description: "For large-scale operations",
    price: "Custom",
    features: [
      "Everything in Pro",
      "Dedicated support team",
      "Custom development",
      "On-premise options",
      "SLA guarantees",
      "White-label solutions",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function GameForgePricing() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/game-development")}
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
              >
                ← Back to GameForge
              </Button>

              <h1 className="text-4xl font-black tracking-tight text-green-300 sm:text-5xl mb-4">
                GameForge Pricing
              </h1>
              <p className="text-lg text-green-100/80 max-w-2xl">
                Flexible plans for studios of all sizes
              </p>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {PRICING_TIERS.map((tier) => (
                  <Card
                    key={tier.name}
                    className={`border transition-all ${
                      tier.highlighted
                        ? "bg-green-950/40 border-green-400 ring-2 ring-green-400/50"
                        : "bg-green-950/20 border-green-400/30 hover:border-green-400/60"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-green-300">{tier.name}</CardTitle>
                      <p className="text-sm text-green-200/70 mt-2">{tier.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="text-3xl font-bold text-green-300">
                          {tier.price}
                        </div>
                        {tier.period && (
                          <p className="text-sm text-green-200/70">{tier.period}</p>
                        )}
                      </div>

                      <ul className="space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-green-200/80">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={
                          tier.highlighted
                            ? "w-full bg-green-400 text-black hover:bg-green-300"
                            : "w-full border-green-400/60 text-green-300 hover:bg-green-500/10"
                        }
                        variant={tier.highlighted ? "default" : "outline"}
                      >
                        {tier.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
