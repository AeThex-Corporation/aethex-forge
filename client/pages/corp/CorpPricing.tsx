import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PRICING_TIERS = [
  {
    name: "Consulting Starter",
    description: "For initial assessments",
    price: "$5,000",
    period: "/month",
    features: [
      "40 hours consulting",
      "Quarterly reviews",
      "Email support",
      "Strategy documentation",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Enterprise",
    description: "Full-service solutions",
    price: "$15,000",
    period: "/month",
    features: [
      "Unlimited consulting hours",
      "Dedicated account manager",
      "Custom implementations",
      "Monthly strategy sessions",
      "Priority support 24/7",
    ],
    cta: "Schedule Demo",
    highlighted: true,
  },
  {
    name: "Strategic Partnership",
    description: "Long-term transformation",
    price: "Custom",
    features: [
      "Everything in Enterprise",
      "Executive briefings",
      "Custom development",
      "Board-level reports",
      "Dedicated team allocation",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function CorpPricing() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/corp")}
                variant="ghost"
                className="text-blue-300 hover:bg-blue-500/10 mb-8"
              >
                ← Back to Corp
              </Button>

              <h1 className="text-4xl font-black tracking-tight text-blue-300 sm:text-5xl mb-4">
                AeThex Corp Services Pricing
              </h1>
              <p className="text-lg text-blue-100/80 max-w-2xl">
                Enterprise consulting tailored to your business needs
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
                        ? "bg-blue-950/40 border-blue-400 ring-2 ring-blue-400/50"
                        : "bg-blue-950/20 border-blue-400/30 hover:border-blue-400/60"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-blue-300">{tier.name}</CardTitle>
                      <p className="text-sm text-blue-200/70 mt-2">{tier.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="text-3xl font-bold text-blue-300">
                          {tier.price}
                        </div>
                        {tier.period && (
                          <p className="text-sm text-blue-200/70">{tier.period}</p>
                        )}
                      </div>

                      <ul className="space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <span className="text-blue-200/80">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={
                          tier.highlighted
                            ? "w-full bg-blue-400 text-black hover:bg-blue-300"
                            : "w-full border-blue-400/60 text-blue-300 hover:bg-blue-500/10"
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
