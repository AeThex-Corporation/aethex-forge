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

async function fetchFromGhost(limit: number = 50): Promise<any[]> {
  const ghostUrl = process.env.GHOST_API_URL || process.env.VITE_GHOST_API_URL;
  const ghostKey =
    process.env.GHOST_CONTENT_API_KEY || process.env.VITE_GHOST_CONTENT_API_KEY;

  if (!ghostUrl || !ghostKey) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      key: ghostKey,
      limit: String(limit),
      include: "authors,tags",
      fields:
        "id,title,slug,excerpt,html,feature_image,published_at,reading_time,authors,tags",
    });

    const url = `${ghostUrl}/ghost/api/content/posts/?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Ghost API error: ${response.statusText}`);
      return [];
    }

    const data = (await response.json()) as GhostApiResponse;
    return (
      data.posts?.map((post) => ({
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
      })) || []
    );
  } catch (error) {
    console.error("Failed to fetch from Ghost:", error);
    return [];
  }
}

async function fetchFromSupabase(limit: number = 50): Promise<any[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,slug,title,excerpt,author,date,read_time,category,image,likes,comments,published_at,body_html",
      )
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase query error:", error);
      return [];
    }

    return (
      data?.map((post) => ({
        ...post,
        source: "supabase",
      })) || []
    );
  } catch (error) {
    console.error("Failed to fetch from Supabase:", error);
    return [];
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const limit = Math.min(parseInt((req.query.limit as string) || "50"), 100);

    // Try Ghost first, then Supabase
    let posts = await fetchFromGhost(limit);

    if (!posts.length) {
      posts = await fetchFromSupabase(limit);
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Blog API error:", error);
    return res.status(500).json({ error: "Failed to fetch blog posts" });
  }
}
