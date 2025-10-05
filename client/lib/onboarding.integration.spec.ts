import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";

const createStorage = () => {
  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => {
      store.clear();
    },
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  } as Storage;
  return storage;
};

vi.stubGlobal("localStorage", createStorage());
vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue({
    ok: false,
    status: 404,
    text: async () => "",
    json: async () => ({}),
  }),
);

const fetchMock = fetch as unknown as Mock;

vi.mock("@/lib/supabase", () => {
  const userProfiles = new Map<string, any>();
  const userAchievements: Array<{ user_id: string; achievement_id: string }> =
    [];

  const achievementsCatalog = [
    {
      id: "welcome-to-aethex",
      name: "Welcome to AeThex",
      description: "Complete your AeThex passport to unlock the community.",
      icon: "sparkles",
      xp_reward: 150,
      badge_color: "#7C3AED",
      created_at: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "aethex-explorer",
      name: "AeThex Explorer",
      description: "Link your favorite tools and showcase your craft.",
      icon: "compass",
      xp_reward: 200,
      badge_color: "#06B6D4",
      created_at: "2024-01-01T00:00:00.000Z",
    },
  ];

  const achievementsById = new Map(
    achievementsCatalog.map((item) => [item.id, item] as const),
  );
  const achievementsByName = new Map(
    achievementsCatalog.map((item) => [item.name, item] as const),
  );

  const profileDefaults = (id: string) => ({
    id,
    user_type: "game_developer",
    experience_level: "beginner",
    total_xp: 0,
    level: 1,
    loyalty_points: 0,
    current_streak: 1,
    longest_streak: 1,
    last_streak_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const userProfilesTable = {
    update(values: any) {
      return {
        eq(_column: string, id: string) {
          const existing = userProfiles.get(id) ?? profileDefaults(id);
          const updated = { ...existing, ...values };
          userProfiles.set(id, updated);
          return {
            select() {
              return {
                single() {
                  return { data: updated, error: null };
                },
              };
            },
          };
        },
      };
    },
    upsert(values: any) {
      const record = { ...profileDefaults(values.id), ...values };
      userProfiles.set(values.id, record);
      return {
        select() {
          return {
            single() {
              return { data: record, error: null };
            },
          };
        },
      };
    },
    insert(values: any) {
      const record = { ...profileDefaults(values.id), ...values };
      userProfiles.set(values.id, record);
      return {
        select() {
          return {
            single() {
              return { data: record, error: null };
            },
          };
        },
      };
    },
    select() {
      return {
        eq(_column: string, id: string) {
          const record = userProfiles.get(id);
          return {
            single() {
              if (!record) {
                return { data: null, error: { code: "PGRST116" } };
              }
              return { data: record, error: null };
            },
          };
        },
        order() {
          return {
            limit() {
              return {
                data: Array.from(userProfiles.values()),
                error: null,
              };
            },
          };
        },
      };
    },
  };

  const achievementsTable = {
    select(columns?: string) {
      const mapRecord = (record: any) => {
        if (!record) return record;
        if (!columns || columns.includes("*")) return record;
        const fieldNames = columns.split(",").map((item) => item.trim());
        const shaped: Record<string, any> = {};
        for (const field of fieldNames) {
          if (!field) continue;
          shaped[field] = record[field];
        }
        return shaped;
      };

      return {
        order() {
          return {
            data: achievementsCatalog.map(mapRecord),
            error: null,
          };
        },
        eq(column: string, value: string) {
          const found =
            column === "id"
              ? achievementsById.get(value)
              : column === "name"
                ? achievementsByName.get(value)
                : undefined;
          const mapped = mapRecord(found ?? null);
          return {
            maybeSingle() {
              return { data: mapped ?? null, error: null };
            },
            single() {
              return { data: mapped ?? null, error: null };
            },
          };
        },
        maybeSingle() {
          const first = achievementsCatalog[0] ?? null;
          return { data: mapRecord(first), error: null };
        },
      };
    },
  };

  const userAchievementsTable = {
    insert(payload: any) {
      const entries = Array.isArray(payload) ? payload : [payload];
      let error: any = null;
      for (const entry of entries) {
        const exists = userAchievements.some(
          (item) =>
            item.user_id === entry.user_id &&
            item.achievement_id === entry.achievement_id,
        );
        if (exists) {
          error = { code: "23505" };
          continue;
        }
        userAchievements.push({ ...entry });
      }
      return { error };
    },
    select() {
      return {
        eq(_column: string, userId: string) {
          return {
            data: userAchievements
              .map((entry) => ({
                ...entry,
                achievements: achievementsById.get(entry.achievement_id),
              }))
              .filter((entry) => entry.user_id === userId),
            error: null,
          };
        },
      };
    },
  };

  const tableMap: Record<string, any> = {
    user_profiles: userProfilesTable,
    achievements: achievementsTable,
    user_achievements: userAchievementsTable,
  };

  return {
    supabase: {
      auth: {
        signInWithPassword: vi.fn(),
        signInWithOAuth: vi.fn(),
        linkIdentity: vi.fn(),
        unlinkIdentity: vi.fn(),
        signOut: vi.fn(),
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }),
      },
      from(table: string) {
        return (
          tableMap[table] ?? {
            select: () => ({ data: [], error: null }),
          }
        );
      },
      channel: () => ({
        on: () => ({}),
        subscribe: () => ({ unsubscribe: () => {} }),
        unsubscribe: () => {},
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
    },
    isSupabaseConfigured: true,
  };
});

vi.mock("@/lib/aethex-toast", () => ({
  aethexToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    aethex: vi.fn(),
    system: vi.fn(),
  },
}));

import { mockAuth } from "@/lib/mock-auth";
import {
  aethexUserService,
  aethexAchievementService,
  checkProfileComplete,
  type AethexUserProfile,
} from "@/lib/aethex-database-adapter";

const wait = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

describe("onboarding passport flow", () => {
  beforeEach(async () => {
    localStorage.clear();
    await mockAuth.signOut();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "",
      json: async () => ({}),
    });
  });

  it("persists profile setup, links providers, and awards welcome badge", async () => {
    const email = `tester+${Date.now()}@example.com`;
    const password = "Secret123!";

    const authResult = await mockAuth.signInWithPassword(email, password);
    expect(authResult.error).toBeNull();
    await wait();

    const user = authResult.data.user;
    expect(user).toBeTruthy();

    await aethexUserService.updateProfile(user.id, {
      id: user.id,
      username: "tester",
      full_name: "Tester One",
      user_type: "game_developer" as AethexUserProfile["user_type"],
      experience_level: "intermediate" as AethexUserProfile["experience_level"],
      bio: "Building awesome experiences",
    });

    const hydratedProfile = (await aethexUserService.getProfileById(
      user.id,
    )) as AethexUserProfile;
    expect(hydratedProfile).toBeTruthy();
    expect(checkProfileComplete(hydratedProfile as any)).toBe(true);

    await mockAuth.linkIdentity({ provider: "github" });
    const refreshedUser = (await mockAuth.getUser()).data.user;
    expect(
      refreshedUser?.identities?.some((id: any) => id.provider === "github"),
    ).toBe(true);

    await aethexAchievementService.checkAndAwardOnboardingAchievement(user.id);
    const achievements = await aethexAchievementService.getUserAchievements(
      user.id,
    );
    const welcomeBadge = achievements.find(
      (item) => item.name === "Welcome to AeThex",
    );
    expect(welcomeBadge).toBeTruthy();
  });
});
