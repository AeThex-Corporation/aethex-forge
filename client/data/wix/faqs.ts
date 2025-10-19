export type FaqItem = { q: string; a: string };

export const faqs: FaqItem[] = [
  {
    q: "Why Wix Studio?",
    a: "It ships a pro-grade responsive canvas, modern performance defaults, and a CMS that lets non-devs update content safely.",
  },
  {
    q: "Can we migrate from WordPress or Webflow?",
    a: "Yes. We audit IA/SEO, map redirects, migrate content to collections, and rebuild the front-end with Studio.",
  },
  {
    q: "Who owns the site?",
    a: "You do. We transfer the site to your Wix account and provide admin/editor roles as needed.",
  },
  {
    q: "What about custom code?",
    a: "When needed, we extend with Velo, webhooks, or headless APIs — while keeping most content editable in the CMS.",
  },
  {
    q: "Do you offer support?",
    a: "Yes — training, docs, and optional retainers for continuous improvements and experiments.",
  },
];

export default faqs;
