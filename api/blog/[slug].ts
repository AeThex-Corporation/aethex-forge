import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || "";

const supabase =
  supabaseUrl && supabaseServiceRole
    ? createClient(supabaseUrl, supabaseServiceRole)
    : null;

interface GhostPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  html?: string;
  feature_image?: string;
  authors?: Array<{ name: string }>;
  published_at: string;
  reading_time?: number;
  tags?: Array<{ name: string }>;
}

interface GhostApiResponse {
  posts: GhostPost[];
  meta?: {
    pagination: {
      page: number;
      limit: number;
      pages: number;
      total: number;
    };
  };
}

async function fetchFromGhost(slug: string): Promise<any | null> {
  const ghostUrl = process.env.GHOST_API_URL || process.env.VITE_GHOST_API_URL;
  const ghostKey =
    process.env.GHOST_CONTENT_API_KEY || process.env.VITE_GHOST_CONTENT_API_KEY;

  if (!ghostUrl || !ghostKey) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      key: ghostKey,
      include: "authors,tags",
      fields:
        "id,title,slug,excerpt,html,feature_image,published_at,reading_time,authors,tags",
    });

    const url = `${ghostUrl}/ghost/api/content/posts/slug/${encodeURIComponent(slug)}/?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GhostApiResponse;
    const post = data.posts && data.posts.length > 0 ? data.posts[0] : null;

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      body_html: post.html || "",
      author:
        post.authors && post.authors.length > 0
          ? post.authors[0].name
          : "AeThex Team",
      published_at: post.published_at,
      read_time: post.reading_time || null,
      category:
        post.tags && post.tags.length > 0 ? post.tags[0].name : "General",
      image: post.feature_image || null,
      source: "ghost",
    };
  } catch (error) {
    console.error("Failed to fetch from Ghost:", error);
    return null;
  }
}

async function fetchFromSupabase(slug: string): Promise<any | null> {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,slug,title,excerpt,author,date,read_time,category,image,published_at,body_html",
      )
      .eq("slug", slug)
      .single();

    if (error) {
      return null;
    }

    return {
      ...data,
      source: "supabase",
    };
  } catch (error) {
    console.error("Failed to fetch from Supabase:", error);
    return null;
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const slug = req.params.slug || req.query.slug;

    if (!slug) {
      return res.status(400).json({ error: "Slug parameter is required" });
    }

    // Try Ghost first, then Supabase
    let post = await fetchFromGhost(slug);

    if (!post) {
      post = await fetchFromSupabase(slug);
    }

    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Blog post API error:", error);
    return res.status(500).json({ error: "Failed to fetch blog post" });
  }
}
