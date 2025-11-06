import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PRICING_TIERS = [
  {
    name: "Starter",
    description: "Perfect for indie developers",
    price: "Free",
    features: [
      "Access to documentation",
      "Community forums",
      "Monthly research updates",
      "Basic tools and templates",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For growing studios",
    price: "$49",
    period: "/month",
    features: [
      "Everything in Starter",
      "Advanced optimization guides",
      "Priority support",
      "Exclusive research previews",
      "API access",
      "Custom consulting hours",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large-scale operations",
    price: "Custom",
    features: [
      "Everything in Professional",
      "Dedicated support team",
      "Custom research projects",
      "On-site training",
      "API SLA guarantee",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function LabsPricing() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#fbbf24_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(251,191,36,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(251,191,36,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/labs")}
                variant="ghost"
                className="text-yellow-300 hover:bg-yellow-500/10 mb-8"
              >
                ← Back to Labs
              </Button>

              <h1 className="text-4xl font-black tracking-tight text-yellow-300 sm:text-5xl mb-4">
                Labs Pricing
              </h1>
              <p className="text-lg text-yellow-100/80 max-w-2xl">
                Invest in your development journey with flexible pricing plans
              </p>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PRICING_TIERS.map((tier) => (
                  <Card
                    key={tier.name}
                    className={`border transition-all ${
                      tier.highlighted
                        ? "bg-yellow-950/40 border-yellow-400 ring-2 ring-yellow-400/50"
                        : "bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-yellow-300">{tier.name}</CardTitle>
                      <p className="text-sm text-yellow-200/70 mt-2">{tier.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="text-3xl font-bold text-yellow-300">
                          {tier.price}
                        </div>
                        {tier.period && (
                          <p className="text-sm text-yellow-200/70">{tier.period}</p>
                        )}
                      </div>

                      <ul className="space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <span className="text-yellow-200/80">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={
                          tier.highlighted
                            ? "w-full bg-yellow-400 text-black hover:bg-yellow-300"
                            : "w-full border-yellow-400/60 text-yellow-300 hover:bg-yellow-500/10"
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

          {/* FAQ Section */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-4xl px-4">
              <h2 className="text-2xl font-bold text-yellow-300 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Can I change plans anytime?",
                    a: "Yes, upgrade or downgrade your plan at any time.",
                  },
                  {
                    q: "Do you offer discounts for annual billing?",
                    a: "Yes, save 20% with annual plans on Professional and Enterprise tiers.",
                  },
                  {
                    q: "Is there a free trial?",
                    a: "Professional tier includes a 14-day free trial. No credit card required.",
                  },
                ].map((item) => (
                  <div
                    key={item.q}
                    className="rounded-lg border border-yellow-400/30 bg-yellow-950/20 p-4"
                  >
                    <h3 className="font-semibold text-yellow-300 mb-2">{item.q}</h3>
                    <p className="text-yellow-200/70">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
