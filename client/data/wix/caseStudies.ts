export type CaseStudy = {
  id: string;
  title: string;
  summary: string;
  metrics: { label: string; value: string }[];
  url?: string | null;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "launch-boost",
    title: "Go-to-Market Launch Boost",
    summary:
      "A focused one-page microsite for a product launch. Clear messaging, motion, and analytics instrumentation.",
    metrics: [
      { label: "Time to launch", value: "12 days" },
      { label: "CTR uplift", value: "+34%" },
      { label: "Bounce rate", value: "−18%" },
    ],
    url: null,
  },
  {
    id: "content-scale",
    title: "Content at Scale",
    summary:
      "Replatformed to Wix Studio CMS with dynamic pages. Editorial velocity up, dev burden down.",
    metrics: [
      { label: "Publish speed", value: "3× faster" },
      { label: "Editor adoption", value: "100%" },
      { label: "Core Web Vitals", value: "Pass" },
    ],
    url: null,
  },
  {
    id: "commerce-growth",
    title: "Commerce Growth",
    summary:
      "Shop build with subscriptions and automation. A/B tested PDPs and streamlined checkout.",
    metrics: [
      { label: "Revenue", value: "+48% YoY" },
      { label: "Checkout conv.", value: "+12%" },
      { label: "Cart abandonment", value: "−9%" },
    ],
    url: null,
  },
];

export default caseStudies;
