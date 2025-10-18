export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_color: string | null;
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          xp_reward: number | null;
        };
        Insert: {
          badge_color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          xp_reward?: number | null;
        };
        Update: {
          badge_color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          xp_reward?: number | null;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          type: "contributor" | "career";
          full_name: string;
          email: string;
          location: string | null;
          role_interest: string | null;
          primary_skill: string | null;
          experience_level: string | null;
          availability: string | null;
          portfolio_url: string | null;
          resume_url: string | null;
          interests: string[] | null;
          message: string | null;
          status: string;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          type: "contributor" | "career";
          full_name: string;
          email: string;
          location?: string | null;
          role_interest?: string | null;
          primary_skill?: string | null;
          experience_level?: string | null;
          availability?: string | null;
          portfolio_url?: string | null;
          resume_url?: string | null;
          interests?: string[] | null;
          message?: string | null;
          status?: string;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          type?: "contributor" | "career";
          full_name?: string;
          email?: string;
          location?: string | null;
          role_interest?: string | null;
          primary_skill?: string | null;
          experience_level?: string | null;
          availability?: string | null;
          portfolio_url?: string | null;
          resume_url?: string | null;
          interests?: string[] | null;
          message?: string | null;
          status?: string;
          submitted_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          id: string;
          post_id: string;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string;
          id?: string;
          post_id: string;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "community_posts";
            referencedColumns: ["id"];
          },
        ];
      };
      community_posts: {
        Row: {
          author_id: string;
          category: string | null;
          comments_count: number | null;
          content: string;
          created_at: string;
          id: string;
          is_published: boolean | null;
          likes_count: number | null;
          tags: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          category?: string | null;
          comments_count?: number | null;
          content: string;
          created_at?: string;
          id?: string;
          is_published?: boolean | null;
          likes_count?: number | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          category?: string | null;
          comments_count?: number | null;
          content?: string;
          created_at?: string;
          id?: string;
          is_published?: boolean | null;
          likes_count?: number | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          message: string | null;
          read: boolean | null;
          title: string;
          type: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          message?: string | null;
          read?: boolean | null;
          title: string;
          type?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          message?: string | null;
          read?: boolean | null;
          title?: string;
          type?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string;
          demo_url: string | null;
          description: string | null;
          end_date: string | null;
          github_url: string | null;
          id: string;
          image_url: string | null;
          start_date: string | null;
          status: Database["public"]["Enums"]["project_status_enum"] | null;
          technologies: string[] | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          demo_url?: string | null;
          description?: string | null;
          end_date?: string | null;
          github_url?: string | null;
          id?: string;
          image_url?: string | null;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["project_status_enum"] | null;
          technologies?: string[] | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          demo_url?: string | null;
          description?: string | null;
          end_date?: string | null;
          github_url?: string | null;
          id?: string;
          image_url?: string | null;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["project_status_enum"] | null;
          technologies?: string[] | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_achievements: {
        Row: {
          achievement_id: string;
          earned_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          achievement_id: string;
          earned_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          achievement_id?: string;
          earned_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey";
            columns: ["achievement_id"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_interests: {
        Row: {
          created_at: string;
          id: string;
          interest: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          interest: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          interest?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_interests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_follows: {
        Row: {
          created_at: string;
          follower_id: string;
          following_id: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          follower_id: string;
          following_id: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          follower_id?: string;
          following_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_follows_following_id_fkey";
            columns: ["following_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          banner_url: string | null;
          bio: string | null;
          created_at: string;
          experience_level:
            | Database["public"]["Enums"]["experience_level_enum"]
            | null;
          full_name: string | null;
          github_url: string | null;
          id: string;
          level: number | null;
          linkedin_url: string | null;
          location: string | null;
          current_streak: number | null;
          longest_streak: number | null;
          last_streak_at: string | null;
          total_xp: number | null;
          twitter_url: string | null;
          updated_at: string;
          user_type: Database["public"]["Enums"]["user_type_enum"];
          username: string | null;
          website_url: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          created_at?: string;
          experience_level?:
            | Database["public"]["Enums"]["experience_level_enum"]
            | null;
          full_name?: string | null;
          github_url?: string | null;
          id: string;
          level?: number | null;
          linkedin_url?: string | null;
          location?: string | null;
          current_streak?: number | null;
          longest_streak?: number | null;
          last_streak_at?: string | null;
          total_xp?: number | null;
          twitter_url?: string | null;
          updated_at?: string;
          user_type: Database["public"]["Enums"]["user_type_enum"];
          username?: string | null;
          website_url?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          created_at?: string;
          experience_level?:
            | Database["public"]["Enums"]["experience_level_enum"]
            | null;
          full_name?: string | null;
          github_url?: string | null;
          id?: string;
          level?: number | null;
          linkedin_url?: string | null;
          location?: string | null;
          current_streak?: number | null;
          longest_streak?: number | null;
          last_streak_at?: string | null;
          total_xp?: number | null;
          twitter_url?: string | null;
          updated_at?: string;
          user_type?: Database["public"]["Enums"]["user_type_enum"];
          username?: string | null;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      experience_level_enum:
        | "beginner"
        | "intermediate"
        | "advanced"
        | "expert";
      project_status_enum: "planning" | "in_progress" | "completed" | "on_hold";
      user_type_enum:
        | "game_developer"
        | "client"
        | "community_member"
        | "customer"
        | "staff";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type CommunityPost =
  Database["public"]["Tables"]["community_posts"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export type UserType = Database["public"]["Enums"]["user_type_enum"];
export type ExperienceLevel =
  Database["public"]["Enums"]["experience_level_enum"];
export type ProjectStatus = Database["public"]["Enums"]["project_status_enum"];
