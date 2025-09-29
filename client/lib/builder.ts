const API_ROOT = "https://cdn.builder.io/api/v3";

export type BuilderResult<T = any> = {
  results: Array<{
    id: string;
    name?: string;
    data?: T & { slug?: string; image?: string; category?: string; author?: string; date?: string; excerpt?: string; readTime?: string };
    url?: string;
    published?: string;
  }>;
};

export function getBuilderApiKey() {
  return import.meta.env.VITE_BUILDER_API_KEY;
}

export async function fetchBuilderList<T = any>(model: string, opts: { limit?: number; query?: Record<string, any>; fields?: string } = {}) {
  const apiKey = getBuilderApiKey();
  if (!apiKey) throw new Error("Missing VITE_BUILDER_API_KEY");
  const params = new URLSearchParams({ apiKey });
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.fields) params.set("fields", opts.fields);
  if (opts.query) params.set("query", JSON.stringify(opts.query));
  const res = await fetch(`${API_ROOT}/content/${encodeURIComponent(model)}?${params.toString()}`);
  if (!res.ok) throw new Error(`Builder fetch failed: ${res.status}`);
  return (await res.json()) as BuilderResult<T>;
}

export async function fetchBuilderOne<T = any>(model: string, slug: string) {
  const apiKey = getBuilderApiKey();
  if (!apiKey) throw new Error("Missing VITE_BUILDER_API_KEY");
  const params = new URLSearchParams({ apiKey, limit: "1", query: JSON.stringify({ "data.slug": slug }) });
  const res = await fetch(`${API_ROOT}/content/${encodeURIComponent(model)}?${params.toString()}`);
  if (!res.ok) throw new Error(`Builder fetch failed: ${res.status}`);
  const json = (await res.json()) as BuilderResult<T>;
  return json.results?.[0] || null;
}
