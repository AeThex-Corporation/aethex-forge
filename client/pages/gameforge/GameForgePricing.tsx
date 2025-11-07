import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, DollarSign, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PricingTier {
  id: number;
  name: string;
  price: string | number;
  period: string;
  description: string;
  cta: string;
  highlighted: boolean;
  features: {
    name: string;
    included: boolean;
  }[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 1,
    name: "Indie",
    price: "Free",
    period: "Forever",
    description: "Perfect for solo developers and small projects",
    cta: "Get Started",
    highlighted: false,
    features: [
      { name: "Up to 2 published games", included: true },
      { name: "Community support", included: true },
      { name: "Basic game templates", included: true },
      { name: "Monthly shipping", included: false },
      { name: "Revenue sharing", included: false },
      { name: "Priority support", included: false },
      { name: "Premium assets library", included: false },
      { name: "Dedicated manager", included: false },
    ],
  },
  {
    id: 2,
    name: "Studio",
    price: "$29",
    period: "/month",
    description: "For small studios scaling their operations",
    cta: "Start Free Trial",
    highlighted: true,
    features: [
      { name: "Up to 10 published games", included: true },
      { name: "Community support", included: true },
      { name: "Basic game templates", included: true },
      { name: "Monthly shipping", included: true },
      { name: "Revenue sharing (70/30)", included: true },
      { name: "Priority support", included: true },
      { name: "Premium assets library", included: true },
      { name: "Dedicated manager", included: false },
    ],
  },
  {
    id: 3,
    name: "Enterprise",
    price: "Custom",
    period: "Pricing",
    description: "For established studios with custom needs",
    cta: "Contact Sales",
    highlighted: false,
    features: [
      { name: "Unlimited published games", included: true },
      { name: "Community support", included: true },
      { name: "Basic game templates", included: true },
      { name: "Monthly shipping", included: true },
      { name: "Revenue sharing (custom)", included: true },
      { name: "Priority support", included: true },
      { name: "Premium assets library", included: true },
      { name: "Dedicated manager", included: true },
    ],
  },
];

export default function GameForgePricing() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="py-16 lg:py-20">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
                onClick={() => navigate("/gameforge")}
              >
                ← Back to GameForge
              </Button>

              <Badge className="border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] mb-4">
                <DollarSign className="h-4 w-4 mr-2" />
                Simple, Transparent Pricing
              </Badge>
              <h1 className="text-4xl font-black text-green-300 mb-4 lg:text-5xl">
                Choose Your Plan
              </h1>
              <p className="text-lg text-green-100/80 max-w-2xl">
                Get started free and scale as you grow. No hidden fees, no
                surprises.
              </p>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid lg:grid-cols-3 gap-8">
                {PRICING_TIERS.map((tier) => (
                  <Card
                    key={tier.id}
                    className={`relative border transition-all ${
                      tier.highlighted
                        ? "border-green-400/60 bg-green-950/30 shadow-lg shadow-green-500/20 scale-105"
                        : "border-green-400/30 bg-green-950/20 hover:border-green-400/60"
                    }`}
                  >
                    {tier.highlighted && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Badge className="bg-green-400 text-black">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl text-green-300">
                        {tier.name}
                      </CardTitle>
                      <p className="text-sm text-green-200/70 mt-2">
                        {tier.description}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Price */}
                      <div className="py-6 border-y border-green-400/10">
                        <div className="text-4xl font-black text-green-300">
                          {tier.price}
                        </div>
                        <p className="text-sm text-green-200/60 mt-1">
                          {tier.period}
                        </p>
                      </div>

                      {/* CTA */}
                      <Button
                        className={`w-full ${
                          tier.highlighted
                            ? "bg-green-400 text-black hover:bg-green-300"
                            : "border border-green-400/60 text-green-300 hover:bg-green-500/10"
                        }`}
                      >
                        {tier.cta}
                      </Button>

                      {/* Features */}
                      <div className="space-y-3">
                        {tier.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-sm"
                          >
                            {feature.included ? (
                              <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            ) : (
                              <X className="h-5 w-5 text-green-900 flex-shrink-0" />
                            )}
                            <span
                              className={
                                feature.included
                                  ? "text-green-100"
                                  : "text-green-200/40"
                              }
                            >
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 border-t border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-4xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-8 text-center">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {[
                  {
                    q: "Can I upgrade or downgrade anytime?",
                    a: "Yes, you can change your plan at any time. Changes take effect immediately.",
                  },
                  {
                    q: "Is there a setup or hidden fees?",
                    a: "No hidden fees. Only pay for the plan you choose. Setup is completely free.",
                  },
                  {
                    q: "What happens if I stop paying?",
                    a: "Your games remain available to play, but you won't be able to publish new updates until you re-subscribe.",
                  },
                  {
                    q: "Do you offer discounts for annual billing?",
                    a: "Yes! Save 20% when you pay annually. Contact our sales team for more details.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded border border-green-400/20 hover:border-green-400/40 transition-colors bg-green-950/10"
                  >
                    <h3 className="font-semibold text-green-300 mb-2">
                      {item.q}
                    </h3>
                    <p className="text-green-200/70 text-sm">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-16">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-green-300 mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-green-100/80 mb-8">
                Join thousands of developers building amazing games on
                GameForge.
              </p>
              <Button className="bg-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-green-300 px-8 py-6">
                <Zap className="mr-2 h-5 w-5" />
                Start Free Today
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
