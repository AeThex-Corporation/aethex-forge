export type WixService = {
  id: string;
  name: string;
  summary: string;
  highlights: string[];
};

export const wixServices: WixService[] = [
  {
    id: "studio-sites",
    name: "Wix Studio Sites",
    summary:
      "High-performance marketing sites and landing pages built with Wix Studio’s responsive canvas, custom interactions, and production-ready SEO.",
    highlights: [
      "Responsive layout engine with granular breakpoints",
      "Animations and micro-interactions",
      "SEO foundations (meta, structured data, sitemap)",
      "Edge hosting and global CDN",
    ],
  },
  {
    id: "ecommerce",
    name: "Wix eCommerce",
    summary:
      "Fully managed commerce experiences: catalog, carts, payments, tax & shipping, subscriptions, and analytics with custom design.",
    highlights: [
      "Catalog, variants, inventory, subscriptions",
      "Checkout and payment providers",
      "Tax, shipping, and regional settings",
      "Post-purchase flows and analytics",
    ],
  },
  {
    id: "bookings",
    name: "Wix Bookings & Events",
    summary:
      "Scheduling, paid appointments, and events with email/SMS reminders and calendar sync across teams.",
    highlights: [
      "Calendars, team schedules, buffers, blackout dates",
      "Stripe/PayPal payments and coupons",
      "Google/Apple calendar sync",
      "Email/SMS notifications",
    ],
  },
  {
    id: "cms",
    name: "Wix CMS & Automations",
    summary:
      "Content collections, dynamic pages, and automations. Build once, scale content and localization without code changes.",
    highlights: [
      "Collections and dynamic page routing",
      "Roles & workflows for editors",
      "Webhooks and Zapier integrations",
      "Multi-language, redirects, and staging",
    ],
  },
];

export default wixServices;
