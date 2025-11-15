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

const GHOST_API_URL = import.meta.env.VITE_GHOST_API_URL || "";
const GHOST_CONTENT_API_KEY = import.meta.env.VITE_GHOST_CONTENT_API_KEY || "";

export async function fetchGhostPosts(
  limit: number = 50,
  page: number = 1,
): Promise<GhostPost[]> {
  if (!GHOST_API_URL || !GHOST_CONTENT_API_KEY) {
    console.warn("Ghost API credentials not configured");
    return [];
  }

  try {
    const params = new URLSearchParams({
      key: GHOST_CONTENT_API_KEY,
      limit: String(limit),
      page: String(page),
      include: "authors,tags",
      fields:
        "id,title,slug,excerpt,html,feature_image,published_at,reading_time,authors,tags",
    });

    const url = `${GHOST_API_URL}/ghost/api/content/posts/?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Ghost API error: ${response.statusText}`);
      return [];
    }

    const data: GhostApiResponse = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error("Failed to fetch Ghost posts:", error);
    return [];
  }
}

export async function fetchGhostPostBySlug(
  slug: string,
): Promise<GhostPost | null> {
  if (!GHOST_API_URL || !GHOST_CONTENT_API_KEY) {
    console.warn("Ghost API credentials not configured");
    return null;
  }

  try {
    const params = new URLSearchParams({
      key: GHOST_CONTENT_API_KEY,
      include: "authors,tags",
      fields:
        "id,title,slug,excerpt,html,feature_image,published_at,reading_time,authors,tags",
    });

    const url = `${GHOST_API_URL}/ghost/api/content/posts/slug/${encodeURIComponent(slug)}/?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Ghost API error: ${response.statusText}`);
      return null;
    }

    const data: GhostApiResponse = await response.json();
    return data.posts && data.posts.length > 0 ? data.posts[0] : null;
  } catch (error) {
    console.error("Failed to fetch Ghost post:", error);
    return null;
  }
}

export function transformGhostPost(post: GhostPost) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    body: post.html || "",
    author:
      post.authors && post.authors.length > 0
        ? post.authors[0].name
        : "AeThex Team",
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    readTime: post.reading_time || null,
    category: post.tags && post.tags.length > 0 ? post.tags[0].name : "General",
    image: post.feature_image || null,
    trending: false,
    likes: null,
    comments: null,
  };
}
