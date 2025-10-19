import { useEffect } from "react";

export type SEOProps = {
  pageTitle: string;
  description?: string;
  image?: string | null;
  canonical?: string | null;
  noIndex?: boolean;
};

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.querySelector(selector) as HTMLElement | null;
  if (!el) {
    const tag = selector.startsWith("meta[")
      ? "meta"
      : selector.startsWith("link[")
        ? "link"
        : "meta";
    el = document.createElement(tag);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => (el as any).setAttribute(k, v));
}

export default function SEO({
  pageTitle,
  description,
  image,
  canonical,
  noIndex,
}: SEOProps) {
  useEffect(() => {
    const title = `AeThex | ${pageTitle}`;
    document.title = title;

    if (canonical) {
      upsertMeta('link[rel="canonical"]', {
        rel: "canonical",
        href: canonical,
      });
      upsertMeta('meta[property="og:url"]', {
        property: "og:url",
        content: canonical,
      });
    }

    if (description) {
      upsertMeta('meta[name="description"]', {
        name: "description",
        content: description,
      });
      upsertMeta('meta[property="og:description"]', {
        property: "og:description",
        content: description,
      });
      upsertMeta('meta[name="twitter:description"]', {
        name: "twitter:description",
        content: description,
      });
    }

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });

    if (image) {
      upsertMeta('meta[property="og:image"]', {
        property: "og:image",
        content: image,
      });
      upsertMeta('meta[name="twitter:image"]', {
        name: "twitter:image",
        content: image,
      });
    }

    if (noIndex) {
      upsertMeta('meta[name="robots"]', {
        name: "robots",
        content: "noindex, nofollow",
      });
      upsertMeta('meta[name="googlebot"]', {
        name: "googlebot",
        content: "noindex, nofollow",
      });
    }
  }, [pageTitle, description, image, canonical, noIndex]);

  return null;
}
