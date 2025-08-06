// Demo storage service - simulates backend functionality using localStorage
import type { UserProfile, Project, Achievement } from './database.types';
import { aethexToast } from './aethex-toast';

const STORAGE_KEYS = {
  USER_PROFILE: 'aethex_demo_user_profile',
  PROJECTS: 'aethex_demo_projects',
  ACHIEVEMENTS: 'aethex_demo_achievements',
  NOTIFICATIONS: 'aethex_demo_notifications',
  INTERESTS: 'aethex_demo_interests',
};

// Demo user data
const DEMO_USER_PROFILE: Partial<UserProfile> = {
  id: 'demo-user-123',
  username: 'demo_developer',
  full_name: 'Demo Developer',
  user_type: 'game_developer',
  experience_level: 'intermediate',
  total_xp: 1250,
  level: 5,
  bio: 'Passionate game developer exploring the AeThex ecosystem',
  location: 'Digital Realm',
  github_url: 'https://github.com/demo-developer',
  twitter_url: 'https://twitter.com/demo_dev',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    user_id: 'demo-user-123',
    title: 'Quantum Quest',
    description: 'A sci-fi adventure game built with AeThex Engine',
    status: 'in_progress',
    technologies: ['AeThex Engine', 'TypeScript', 'WebGL'],
    github_url: 'https://github.com/demo/quantum-quest',
    demo_url: 'https://quantum-quest-demo.com',
    image_url: null,
    start_date: '2024-01-15',
    end_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    user_id: 'demo-user-123',
    title: 'Neon Runner',
    description: 'Fast-paced endless runner with cyberpunk aesthetics',
    status: 'completed',
    technologies: ['AeThex Engine', 'JavaScript', 'CSS3'],
    github_url: 'https://github.com/demo/neon-runner',
    demo_url: 'https://neon-runner-demo.com',
    image_url: null,
    start_date: '2023-08-01',
    end_date: '2023-12-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    user_id: 'demo-user-123',
    title: 'Pixel Physics',
    description: 'Educational physics simulation game',
    status: 'planning',
    technologies: ['AeThex Engine', 'React', 'Physics Engine'],
    github_url: null,
    demo_url: null,
    image_url: null,
    start_date: '2024-03-01',
    end_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEMO_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    name: 'Welcome to AeThex',
    description: 'Complete your profile setup',
    icon: '🎉',
    xp_reward: 100,
    badge_color: '#10B981',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ach-2',
    name: 'First Project',
    description: 'Create your first project',
    icon: '🚀',
    xp_reward: 150,
    badge_color: '#3B82F6',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ach-3',
    name: 'Community Contributor',
    description: 'Make your first community post',
    icon: '💬',
    xp_reward: 75,
    badge_color: '#8B5CF6',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ach-4',
    name: 'Experienced Developer',
    description: 'Complete 5 projects',
    icon: '👨‍💻',
    xp_reward: 300,
    badge_color: '#EF4444',
    created_at: new Date().toISOString(),
  },
];

export class DemoStorageService {
  // User Profile Management
  static getUserProfile(): UserProfile | null {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return stored ? JSON.parse(stored) : DEMO_USER_PROFILE;
  }

  static updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile() || DEMO_USER_PROFILE;
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    return updated as UserProfile;
  }

  // Projects Management
  static getUserProjects(): Project[] {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : DEMO_PROJECTS;
  }

  static createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
    const projects = this.getUserProjects();
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    projects.unshift(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProject;
  }

  static updateProject(projectId: string, updates: Partial<Project>): Project | null {
    const projects = this.getUserProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index === -1) return null;

    projects[index] = { ...projects[index], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return projects[index];
  }

  static deleteProject(projectId: string): boolean {
    const projects = this.getUserProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    return filtered.length < projects.length;
  }

  // Achievements Management
  static getAllAchievements(): Achievement[] {
    return DEMO_ACHIEVEMENTS;
  }

  static getUserAchievements(): Achievement[] {
    const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    const earnedIds = stored ? JSON.parse(stored) : ['ach-1', 'ach-2', 'ach-3'];
    return DEMO_ACHIEVEMENTS.filter(ach => earnedIds.includes(ach.id));
  }

  static awardAchievement(achievementId: string): void {
    const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    const earnedIds = stored ? JSON.parse(stored) : ['ach-1', 'ach-2', 'ach-3'];
    
    if (!earnedIds.includes(achievementId)) {
      earnedIds.push(achievementId);
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(earnedIds));
      
      const achievement = DEMO_ACHIEVEMENTS.find(a => a.id === achievementId);
      if (achievement) {
        aethexToast.aethex({
          title: 'Achievement Unlocked!',
          description: `${achievement.icon} ${achievement.name} - ${achievement.description}`,
          duration: 8000,
        });
      }
    }
  }

  // Interests Management
  static getUserInterests(): string[] {
    const stored = localStorage.getItem(STORAGE_KEYS.INTERESTS);
    return stored ? JSON.parse(stored) : ['Game Development', 'AI/ML', 'Web3', 'Mobile Apps'];
  }

  static updateUserInterests(interests: string[]): void {
    localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(interests));
  }

  // Demo data initialization
  static initializeDemoData(): void {
    // Only initialize if no data exists
    if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEMO_USER_PROFILE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEMO_PROJECTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(['ach-1', 'ach-2', 'ach-3']));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INTERESTS)) {
      localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(['Game Development', 'AI/ML', 'Web3', 'Mobile Apps']));
    }
  }

  // Clear all demo data
  static clearDemoData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
