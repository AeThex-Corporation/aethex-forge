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
  const chain = () => ({
    select: () => chain(),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ error: null }),
    eq: () => chain(),
    order: () => chain(),
    limit: () => chain(),
    single: () => ({ data: null, error: null }),
  });

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
      from: () => chain(),
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

    const hydratedProfile = (await mockAuth.getUserProfile(
      user.id as any,
    )) as AethexUserProfile;
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
