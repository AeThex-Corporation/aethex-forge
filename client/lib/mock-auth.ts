// Mock authentication service for development when Supabase is not available
interface MockUser {
  id: string;
  email: string;
  created_at: string;
  identities?: MockIdentity[];
}

interface MockSession {
  user: MockUser;
  access_token: string;
}

interface MockProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  onboarded: boolean;
  full_name?: string;
  bio?: string;
  level: number;
  total_xp: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface MockIdentity {
  identity_id: string;
  provider: string;
  created_at: string;
  last_sign_in_at: string;
}

class MockAuthService {
  private currentUser: MockUser | null = null;
  private currentSession: MockSession | null = null;
  private profiles: Map<string, MockProfile> = new Map();
  private providerMap: Record<string, MockIdentity[]> = {};
  private linkedProviders: MockIdentity[] = [];

  constructor() {
    // Load provider map first so that identities can be populated for saved sessions
    try {
      const rawProviders = localStorage.getItem("mock_linked_provider_map");
      if (rawProviders) {
        this.providerMap = JSON.parse(rawProviders);
      }
    } catch {
      this.providerMap = {};
    }

    // Load from localStorage if available
    try {
      const savedUser = localStorage.getItem("mock_user");
      const savedProfile = localStorage.getItem("mock_profile");

      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        if (this.currentUser) {
          this.currentSession = {
            user: this.currentUser,
            access_token: "mock_token_" + Date.now(),
          };
        }
      }

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        this.profiles.set(profile.id, profile);
      }
    } catch {
      // ignore corrupted local storage
    }

    if (this.currentUser) {
      this.loadLinkedProvidersForUser(this.currentUser.id);
    }
  }

  private loadLinkedProvidersForUser(userId: string) {
    this.linkedProviders = this.providerMap[userId]
      ? [...this.providerMap[userId]]
      : [];
    this.updateCurrentUserIdentities();
  }

  private saveProviderMap() {
    try {
      localStorage.setItem(
        "mock_linked_provider_map",
        JSON.stringify(this.providerMap),
      );
    } catch {
      // ignore
    }
  }

  private updateCurrentUserIdentities() {
    if (!this.currentUser) return;
    (this.currentUser as any).identities = this.linkedProviders.map(
      (identity) => ({
        identity_id: identity.identity_id,
        provider: identity.provider,
        created_at: identity.created_at,
        last_sign_in_at: identity.last_sign_in_at,
      }),
    );
    try {
      localStorage.setItem("mock_user", JSON.stringify(this.currentUser));
    } catch {
      // ignore storage errors
    }
  }

  private setLinkedProvidersForUser(userId: string, providers: MockIdentity[]) {
    this.providerMap[userId] = providers;
    this.linkedProviders = [...providers];
    this.saveProviderMap();
    this.updateCurrentUserIdentities();
  }

  private createIdentity(provider: string): MockIdentity {
    const timestamp = new Date().toISOString();
    return {
      identity_id: `mock-${provider}-${Date.now()}`,
      provider,
      created_at: timestamp,
      last_sign_in_at: timestamp,
    };
  }

  async signInWithPassword(email: string, password: string) {
    // Mock validation - accept any email/password for demo
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user: MockUser = {
      id: "mock_user_" + email.replace(/[^a-z0-9]/gi, "_"),
      email,
      created_at: new Date().toISOString(),
    };

    this.currentUser = user;
    this.currentSession = {
      user,
      access_token: "mock_token_" + Date.now(),
    };

    // Save to localStorage
    try {
      localStorage.setItem("mock_user", JSON.stringify(user));
    } catch {
      // ignore
    }

    // Load any previously linked providers for this user
    this.loadLinkedProvidersForUser(user.id);

    // Notify auth state change
    setTimeout(() => this.notifyAuthChange("SIGNED_IN"), 50);

    return {
      data: {
        user: this.currentUser,
        session: this.currentSession,
      },
      error: null,
    };
  }

  // Simulate OAuth sign-in flow for development
  async signInWithOAuth(provider: string) {
    const user: MockUser = {
      id: `mock_oauth_${provider}_${Date.now()}`,
      email: `${provider}_user_${Date.now()}@example.com`,
      created_at: new Date().toISOString(),
    };

    this.currentUser = user;
    this.currentSession = {
      user,
      access_token: "mock_oauth_token_" + Date.now(),
    };

    this.setLinkedProvidersForUser(user.id, [this.createIdentity(provider)]);

    try {
      localStorage.setItem("mock_user", JSON.stringify(this.currentUser));
    } catch {
      // ignore
    }

    // Notify auth state change after a short delay to simulate redirect
    setTimeout(() => this.notifyAuthChange("SIGNED_IN"), 50);

    return {
      data: { user: this.currentUser, session: this.currentSession },
      error: null,
    };
  }

  async signOut() {
    this.currentUser = null;
    this.currentSession = null;
    this.linkedProviders = [];
    try {
      localStorage.removeItem("mock_user");
      localStorage.removeItem("mock_profile");
    } catch {
      // ignore
    }

    // Notify auth state change
    setTimeout(() => this.notifyAuthChange("SIGNED_OUT"), 50);

    return { error: null };
  }

  async getUser() {
    return {
      data: { user: this.currentUser },
      error: null,
    };
  }

  async getSession() {
    return {
      data: { session: this.currentSession },
      error: null,
    };
  }

  // Mock database operations
  async getUserProfile(userId: string): Promise<MockProfile | null> {
    return this.profiles.get(userId) || null;
  }

  getAllProfiles(): MockProfile[] {
    return Array.from(this.profiles.values());
  }

  async updateProfile(
    userId: string,
    updates: Partial<MockProfile>,
  ): Promise<MockProfile> {
    let profile = this.profiles.get(userId);

    if (!profile) {
      // Create new profile
      profile = {
        id: userId,
        username:
          updates.username || this.currentUser?.email?.split("@")[0] || "user",
        email: this.currentUser?.email || "",
        role: "member",
        onboarded: true,
        level: 1,
        total_xp: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates,
      } as MockProfile;
    } else {
      // Update existing
      profile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      };
    }

    this.profiles.set(userId, profile);
    try {
      localStorage.setItem("mock_profile", JSON.stringify(profile));
    } catch {
      // ignore
    }

    return profile;
  }

  onAuthStateChange(
    callback: (event: string, session: MockSession | null) => void,
  ) {
    // Store callback for later use
    this.authCallback = callback;

    // Immediately call with current state
    setTimeout(() => {
      if (this.currentSession) {
        callback("SIGNED_IN", this.currentSession);
      } else {
        callback("SIGNED_OUT", null);
      }
    }, 100);

    // Return unsubscribe function
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.authCallback = null;
          },
        },
      },
    };
  }

  async linkIdentity(options: { provider: string }) {
    if (!this.currentUser) {
      throw new Error("No user logged in");
    }

    const provider = options.provider;
    if (!provider) {
      throw new Error("Provider is required");
    }

    if (this.linkedProviders.some((p) => p.provider === provider)) {
      return { data: { provider, alreadyLinked: true }, error: null };
    }

    const updated = [...this.linkedProviders, this.createIdentity(provider)];
    this.setLinkedProvidersForUser(this.currentUser.id, updated);
    return { data: { provider }, error: null };
  }

  async unlinkIdentity(options: { identity_id?: string; provider?: string }) {
    if (!this.currentUser) {
      throw new Error("No user logged in");
    }

    const { identity_id, provider } = options;
    let removedProvider: string | undefined = provider;

    const filtered = this.linkedProviders.filter((identity) => {
      const matches = identity_id
        ? identity.identity_id === identity_id
        : provider
          ? identity.provider === provider
          : false;
      if (matches) {
        removedProvider = identity.provider;
      }
      return !matches;
    });

    this.setLinkedProvidersForUser(this.currentUser.id, filtered);
    return { data: { provider: removedProvider }, error: null };
  }

  private authCallback:
    | ((event: string, session: MockSession | null) => void)
    | null = null;

  private notifyAuthChange(event: string) {
    if (this.authCallback) {
      this.authCallback(event, this.currentSession);
    }
  }
}

export const mockAuth = new MockAuthService();
