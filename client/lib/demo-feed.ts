export function ensureDemoSeed() {
  try {
    const seeded = localStorage.getItem("demo_seed_v1");
    if (seeded) return;

    const profiles = [
      {
        id: "demo_aethex",
        username: "AeThex",
        full_name: "AeThex",
        email: "aethex@demo.local",
        avatar_url:
          "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=png&width=256",
        bio: "Official AeThex account — updates, releases, and announcements.",
        managed_by: "mrpiglr@gmail.com",
      },
      {
        id: "demo_testsubject",
        username: "TestSubject",
        full_name: "Test Subject",
        email: "testsubject@demo.local",
        avatar_url: "https://i.pravatar.cc/150?img=1",
        bio: "Trying features, sharing experiments, and stress-testing the feed.",
        managed_by: "mrpiglr@gmail.com",
      },
    ];

    const posts = [
      {
        id: "demo_post_1",
        author_id: "demo_aethex",
        title: "Welcome to AeThex",
        content: JSON.stringify({
          text: "We just shipped the new AeThex feed. Share updates, images, and videos!",
          mediaUrl:
            "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=png&width=1200",
          mediaType: "image",
        }),
        category: "image",
        tags: ["announcement", "aethex"],
        likes_count: 23,
        comments_count: 4,
        is_published: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        user_profiles: profiles[0],
      },
      {
        id: "demo_post_2",
        author_id: "demo_testsubject",
        title: "Quick update",
        content: JSON.stringify({
          text: "Posting a test video clip — looks smooth!",
          mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          mediaType: "video",
        }),
        category: "video",
        tags: ["test", "video"],
        likes_count: 5,
        comments_count: 1,
        is_published: true,
        created_at: new Date(Date.now() - 43200000).toISOString(),
        updated_at: new Date(Date.now() - 43200000).toISOString(),
        user_profiles: profiles[1],
      },
      {
        id: "demo_post_3",
        author_id: "demo_testsubject",
        title: "Text-only thoughts",
        content: JSON.stringify({
          text: "Text-only updates work too. Loving the vibe here.",
          mediaUrl: null,
          mediaType: "none",
        }),
        category: "text",
        tags: ["update"],
        likes_count: 2,
        comments_count: 0,
        is_published: true,
        created_at: new Date(Date.now() - 21600000).toISOString(),
        updated_at: new Date(Date.now() - 21600000).toISOString(),
        user_profiles: profiles[1],
      },
    ];

    localStorage.setItem("demo_profiles", JSON.stringify(profiles));
    localStorage.setItem("demo_posts", JSON.stringify(posts));
    localStorage.setItem("demo_seed_v1", "true");
  } catch {}
}

export function getDemoProfiles() {
  try {
    return JSON.parse(localStorage.getItem("demo_profiles") || "[]");
  } catch {
    return [];
  }
}

export function getDemoPosts() {
  try {
    return JSON.parse(localStorage.getItem("demo_posts") || "[]");
  } catch {
    return [];
  }
}
