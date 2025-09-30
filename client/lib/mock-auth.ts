// Mock authentication service for development when Supabase is not available
interface MockUser {
  id: string;
  email: string;
  created_at: string;
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

class MockAuthService {
  private currentUser: MockUser | null = null;
  private currentSession: MockSession | null = null;
  private profiles: Map<string, MockProfile> = new Map();

  constructor() {
    // Load from localStorage if available
    const savedUser = localStorage.getItem('mock_user');
    const savedProfile = localStorage.getItem('mock_profile');
    
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      if (this.currentUser) {
        this.currentSession = {
          user: this.currentUser,
          access_token: 'mock_token_' + Date.now()
        };
      }
    }
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      this.profiles.set(profile.id, profile);
    }
  }

  async signInWithPassword(email: string, password: string) {
    // Mock validation - accept any email/password for demo
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user: MockUser = {
      id: 'mock_user_' + email.replace(/[^a-z0-9]/gi, '_'),
      email,
      created_at: new Date().toISOString()
    };

    this.currentUser = user;
    this.currentSession = {
      user,
      access_token: 'mock_token_' + Date.now()
    };

    // Save to localStorage
    localStorage.setItem('mock_user', JSON.stringify(user));

    // Notify auth state change
    setTimeout(() => this.notifyAuthChange('SIGNED_IN'), 50);

    return {
      data: {
        user,
        session: this.currentSession
      },
      error: null
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
      access_token: 'mock_oauth_token_' + Date.now(),
    };

    // Save to localStorage
    localStorage.setItem('mock_user', JSON.stringify(user));

    // Notify auth state change after a short delay to simulate redirect
    setTimeout(() => this.notifyAuthChange('SIGNED_IN'), 50);

    return {
      data: { user, session: this.currentSession },
      error: null,
    };
  }

  async signOut() {
    this.currentUser = null;
    this.currentSession = null;
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_profile');

    // Notify auth state change
    setTimeout(() => this.notifyAuthChange('SIGNED_OUT'), 50);

    return { error: null };
  }

  async getUser() {
    return {
      data: { user: this.currentUser },
      error: null
    };
  }

  async getSession() {
    return {
      data: { session: this.currentSession },
      error: null
    };
  }

  // Mock database operations
  async getUserProfile(userId: string): Promise<MockProfile | null> {
    return this.profiles.get(userId) || null;
  }

  async updateProfile(userId: string, updates: Partial<MockProfile>): Promise<MockProfile> {
    let profile = this.profiles.get(userId);
    
    if (!profile) {
      // Create new profile
      profile = {
        id: userId,
        username: updates.username || this.currentUser?.email?.split('@')[0] || 'user',
        email: this.currentUser?.email || '',
        role: 'member',
        onboarded: true,
        level: 1,
        total_xp: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates
      };
    } else {
      // Update existing
      profile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString()
      };
    }

    this.profiles.set(userId, profile);
    localStorage.setItem('mock_profile', JSON.stringify(profile));
    
    return profile;
  }

  onAuthStateChange(callback: (event: string, session: MockSession | null) => void) {
    // Store callback for later use
    this.authCallback = callback;

    // Immediately call with current state
    setTimeout(() => {
      if (this.currentSession) {
        callback('SIGNED_IN', this.currentSession);
      } else {
        callback('SIGNED_OUT', null);
      }
    }, 100);

    // Return unsubscribe function
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.authCallback = null;
          }
        }
      }
    };
  }

  private authCallback: ((event: string, session: MockSession | null) => void) | null = null;

  private notifyAuthChange(event: string) {
    if (this.authCallback) {
      this.authCallback(event, this.currentSession);
    }
  }
}

export const mockAuth = new MockAuthService();
