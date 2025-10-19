export type PricingTier = {
  id: string;
  name: string;
  price: string; // display only (project-based)
  description: string;
  features: string[];
  cta: string;
};

export const pricing: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "From $2,500",
    description:
      "Single-page or small brochure site with strong SEO and fast turnaround.",
    features: [
      "1–3 pages",
      "Wix Studio setup and theme",
      "Core SEO and analytics",
      "Launch support",
    ],
    cta: "Start a project",
  },
  {
    id: "growth",
    name: "Growth",
    price: "From $7,500",
    description:
      "Multi-page site with CMS, blog, or bookings. Ideal for growing teams who need control.",
    features: [
      "5–10 pages",
      "CMS collections & dynamic pages",
      "Performance & accessibility pass",
      "Onboarding & training",
    ],
    cta: "Book a consult",
  },
  {
    id: "commerce",
    name: "Commerce",
    price: "From $15,000",
    description:
      "Full eCommerce stack with custom design, subscriptions, and automations.",
    features: [
      "Product catalog & variants",
      "Payment & fulfillment",
      "Subscriptions & memberships",
      "Advanced analytics & CRM",
    ],
    cta: "Talk to sales",
  },
];

export default pricing;
