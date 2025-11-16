import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase.js";

interface DemoUser {
  email: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  location: string;
  experienceLevel: "beginner" | "intermediate" | "advanced" | "expert";
}

interface DemoPost {
  id: string;
  authorEmail: string;
  title: string;
  content: {
    text: string;
    mediaUrl: string | null;
    mediaType: "video" | "image" | "none";
  };
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  hoursAgo: number;
}

const DEMO_USERS: DemoUser[] = [
  {
    email: "updates@aethex.dev",
    fullName: "AeThex Updates",
    username: "aethex",
    avatarUrl:
      "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=png&width=256",
    bio: "Official AeThex OS updates, roadmap signals, and community spotlights.",
    location: "AeThex HQ",
    experienceLevel: "expert",
  },
  {
    email: "labs@aethex.dev",
    fullName: "AeThex Labs",
    username: "aethexlabs",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    bio: "Experimental builds, prototypes, and R&D drops from the Labs team.",
    location: "Global",
    experienceLevel: "advanced",
  },
  {
    email: "mrpiglr+demo@aethex.dev",
    fullName: "Mr Piglr",
    username: "mrpiglr",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    bio: "Testing the admin pipeline and validating AeThex OS features.",
    location: "AeThex Command Center",
    experienceLevel: "expert",
  },
];

const DEMO_POSTS: DemoPost[] = [
  {
    id: "f4dd3f65-462c-4b54-8d75-1830d5c6a001",
    authorEmail: "labs@aethex.dev",
    title: "Lab Drop: Procedural City Showcase",
    content: {
      text: "Fresh from the render farm — a procedural city loop rendered directly in AeThex Forge. Toggle sound for spatial audio cues!",
      mediaUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      mediaType: "video",
    },
    category: "video",
    tags: ["labs", "procedural", "video"],
    likes: 128,
    comments: 26,
    hoursAgo: 3,
  },
  {
    id: "f4dd3f65-462c-4b54-8d75-1830d5c6a002",
    authorEmail: "updates@aethex.dev",
    title: "AeThex OS 0.9.4 release thread",
    content: {
      text: "Release 0.9.4 is live with the refreshed dashboard, passport syncing, and the new admin panel. Patch notes compiled in the docs portal!",
      mediaUrl:
        "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F74274d2890c845a2ade125b075444ef2?format=webp&width=1600",
      mediaType: "image",
    },
    category: "image",
    tags: ["release", "aethex", "dashboard"],
    likes: 94,
    comments: 14,
    hoursAgo: 6,
  },
  {
    id: "f4dd3f65-462c-4b54-8d75-1830d5c6a003",
    authorEmail: "mrpiglr+demo@aethex.dev",
    title: "Admin panel QA checklist",
    content: {
      text: "Running through the QA list for the admin suite. Permissions, member modals, and achievement tooling all check out. Logs look clean!",
      mediaUrl: null,
      mediaType: "none",
    },
    category: "text",
    tags: ["qa", "admin", "update"],
    likes: 37,
    comments: 5,
    hoursAgo: 9,
  },
  {
    id: "f4dd3f65-462c-4b54-8d75-1830d5c6a004",
    authorEmail: "updates@aethex.dev",
    title: "Community shout-out",
    content: {
      text: "Huge shout-out to the AeThex community members posting their prototypes today. The energy in the feed is 🔥",
      mediaUrl:
        "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Ffef86bb69cf147a1a8614048d2d70502?format=webp&width=1600",
      mediaType: "image",
    },
    category: "image",
    tags: ["community", "highlight"],
    likes: 76,
    comments: 9,
    hoursAgo: 12,
  },
];

const FOLLOW_PAIRS: Array<{ followerEmail: string; followingEmail: string }> = [
  {
    followerEmail: "mrpiglr+demo@aethex.dev",
    followingEmail: "updates@aethex.dev",
  },
  {
    followerEmail: "mrpiglr+demo@aethex.dev",
    followingEmail: "labs@aethex.dev",
  },
  { followerEmail: "labs@aethex.dev", followingEmail: "updates@aethex.dev" },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const admin = getAdminClient();
    const userMap = new Map<string, string>();
    const seededUsers: any[] = [];

    for (const demoUser of DEMO_USERS) {
      let authUser: any;

      try {
        const { data: allUsers, error: searchError } =
          await admin.auth.admin.listUsers();
        if (searchError) throw searchError;

        authUser = allUsers.users?.find((u: any) => u.email === demoUser.email);
      } catch {
        authUser = null;
      }
      if (!authUser) {
        const tempPassword = `Demo${Math.random().toString(36).slice(2, 10)}!9`;
        const { data: createdUser, error: createError } =
          await admin.auth.admin.createUser({
            email: demoUser.email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: { full_name: demoUser.fullName },
          });
        if (createError) throw createError;
        authUser = createdUser.user ?? undefined;
      }

      if (!authUser) continue;

      userMap.set(demoUser.email, authUser.id);

      const { data: existingProfile, error: profileLookupError } = await admin
        .from("user_profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();
      if (profileLookupError && profileLookupError.code !== "PGRST116") {
        throw profileLookupError;
      }

      if (!existingProfile) {
        const profilePayload = {
          id: authUser.id,
          full_name: demoUser.fullName,
          username: demoUser.username,
          avatar_url: demoUser.avatarUrl,
          bio: demoUser.bio,
          location: demoUser.location,
          user_type: "community_member" as const,
          experience_level: demoUser.experienceLevel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const { data: insertedProfile, error: insertProfileError } = await admin
          .from("user_profiles")
          .insert(profilePayload)
          .select()
          .single();
        if (insertProfileError) throw insertProfileError;
        seededUsers.push(insertedProfile);
      } else {
        seededUsers.push(existingProfile);
      }
    }

    const seededPosts: any[] = [];
    const now = Date.now();

    for (const post of DEMO_POSTS) {
      const authorId = userMap.get(post.authorEmail);
      if (!authorId) continue;

      const { data: existingPost, error: postLookupError } = await admin
        .from("community_posts")
        .select(
          `
          *,
          user_profiles (
            username,
            full_name,
            avatar_url
          )
        `,
        )
        .eq("id", post.id)
        .maybeSingle();
      if (postLookupError && postLookupError.code !== "PGRST116") {
        throw postLookupError;
      }

      if (existingPost) {
        seededPosts.push(existingPost);
        continue;
      }

      const createdAt = new Date(
        now - post.hoursAgo * 3600 * 1000,
      ).toISOString();
      const { data: insertedPost, error: insertPostError } = await admin
        .from("community_posts")
        .insert({
          id: post.id,
          author_id: authorId,
          title: post.title,
          content: JSON.stringify(post.content),
          category: post.category,
          tags: post.tags,
          likes_count: post.likes,
          comments_count: post.comments,
          is_published: true,
          created_at: createdAt,
          updated_at: createdAt,
        })
        .select(
          `
          *,
          user_profiles (
            username,
            full_name,
            avatar_url
          )
        `,
        )
        .single();
      if (insertPostError) throw insertPostError;
      seededPosts.push(insertedPost);
    }

    const followRows = FOLLOW_PAIRS.flatMap(
      ({ followerEmail, followingEmail }) => {
        const followerId = userMap.get(followerEmail);
        const followingId = userMap.get(followingEmail);
        if (!followerId || !followingId) return [];
        return [
          {
            follower_id: followerId,
            following_id: followingId,
            created_at: new Date().toISOString(),
          },
        ];
      },
    );

    if (followRows.length) {
      const { error: followError } = await admin
        .from("user_follows")
        .upsert(followRows, {
          onConflict: "follower_id,following_id",
        } as any);
      if (followError) throw followError;
    }

    const sanitizedUsers = Array.from(
      new Map(
        seededUsers
          .filter(Boolean)
          .map((profile: any) => [profile.id, profile]),
      ).values(),
    );
    const sanitizedPosts = Array.from(
      new Map(
        seededPosts.filter(Boolean).map((post: any) => [post.id, post]),
      ).values(),
    );

    return res.status(200).json({
      ok: true,
      usersSeeded: sanitizedUsers.length,
      postsSeeded: sanitizedPosts.length,
      posts: sanitizedPosts,
    });
  } catch (error: any) {
    console.error("Demo feed seeding failed", error);
    return res.status(500).json({
      error: error?.message || "Unable to seed demo feed",
    });
  }
}
