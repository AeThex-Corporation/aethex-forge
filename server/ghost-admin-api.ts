import * as crypto from "crypto";

const GHOST_ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY || "";
const GHOST_API_URL = process.env.VITE_GHOST_API_URL || "";

interface GhostPostInput {
  title: string;
  excerpt?: string;
  html: string;
  slug?: string;
  feature_image?: string;
  published_at?: string;
  status?: "published" | "draft" | "scheduled";
  tags?: Array<{ name: string }>;
  meta_description?: string;
  meta_title?: string;
}

interface GhostPostResponse {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    html: string;
    excerpt: string;
    status: string;
    published_at: string;
    created_at: string;
    updated_at: string;
  }>;
}

function generateGhostJWT(): string {
  if (!GHOST_ADMIN_API_KEY) {
    throw new Error("GHOST_ADMIN_API_KEY not configured");
  }

  // Ghost Admin API key format: {id}:{secret}
  const [keyId, keySecret] = GHOST_ADMIN_API_KEY.split(":");

  if (!keyId || !keySecret) {
    throw new Error("Invalid GHOST_ADMIN_API_KEY format");
  }

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 600; // 10 minutes expiry

  const header = {
    alg: "HS256",
    typ: "JWT",
    kid: keyId,
  };

  const payload = {
    iss: keyId,
    iat,
    exp,
    aud: "/admin/",
  };

  const headerEncoded = Buffer.from(JSON.stringify(header)).toString(
    "base64url",
  );
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );

  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  const signature = crypto
    .createHmac("sha256", keySecret)
    .update(signatureInput)
    .digest("base64url");

  return `${signatureInput}.${signature}`;
}

export async function publishPostToGhost(
  post: GhostPostInput,
): Promise<{ id: string; url: string }> {
  if (!GHOST_API_URL) {
    throw new Error("GHOST_API_URL not configured");
  }

  try {
    const token = generateGhostJWT();

    // Generate slug from title if not provided
    const slug =
      post.slug ||
      post.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    const postData = {
      posts: [
        {
          title: post.title,
          excerpt: post.excerpt || "",
          html: post.html,
          slug,
          feature_image: post.feature_image || null,
          published_at: post.published_at || new Date().toISOString(),
          status: post.status || "published",
          tags: post.tags || [],
          meta_description: post.meta_description || post.excerpt || "",
          meta_title: post.meta_title || post.title,
        },
      ],
    };

    const response = await fetch(`${GHOST_API_URL}/ghost/api/admin/posts/`, {
      method: "POST",
      headers: {
        Authorization: `Ghost ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Ghost API error:", error);
      throw new Error(`Ghost API error: ${response.statusText}`);
    }

    const data = (await response.json()) as GhostPostResponse;
    const createdPost = data.posts[0];

    return {
      id: createdPost.id,
      url: `${GHOST_API_URL}/${createdPost.slug}/`,
    };
  } catch (error) {
    console.error("Failed to publish to Ghost:", error);
    throw error;
  }
}

export async function updatePostInGhost(
  postId: string,
  post: Partial<GhostPostInput>,
): Promise<{ id: string; url: string }> {
  if (!GHOST_API_URL) {
    throw new Error("GHOST_API_URL not configured");
  }

  try {
    const token = generateGhostJWT();

    const postData = {
      posts: [
        {
          ...(post.title && { title: post.title }),
          ...(post.excerpt !== undefined && { excerpt: post.excerpt }),
          ...(post.html && { html: post.html }),
          ...(post.feature_image !== undefined && {
            feature_image: post.feature_image,
          }),
          ...(post.published_at && { published_at: post.published_at }),
          ...(post.status && { status: post.status }),
          ...(post.tags && { tags: post.tags }),
          ...(post.meta_description && {
            meta_description: post.meta_description,
          }),
          ...(post.meta_title && { meta_title: post.meta_title }),
        },
      ],
    };

    const response = await fetch(
      `${GHOST_API_URL}/ghost/api/admin/posts/${postId}/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Ghost ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Ghost API error:", error);
      throw new Error(`Ghost API error: ${response.statusText}`);
    }

    const data = (await response.json()) as GhostPostResponse;
    const updatedPost = data.posts[0];

    return {
      id: updatedPost.id,
      url: `${GHOST_API_URL}/${updatedPost.slug}/`,
    };
  } catch (error) {
    console.error("Failed to update Ghost post:", error);
    throw error;
  }
}
