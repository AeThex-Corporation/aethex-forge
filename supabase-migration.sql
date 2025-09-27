-- AeThex Database Migration
-- Run this in your Supabase SQL Editor (Database > SQL Editor)

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_type_enum AS ENUM ('game_developer', 'client', 'community_member', 'customer');
CREATE TYPE experience_level_enum AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE project_status_enum AS ENUM ('planning', 'in_progress', 'completed', 'on_hold');

-- Create user_profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    user_type user_type_enum NOT NULL,
    experience_level experience_level_enum DEFAULT 'beginner',
    bio TEXT,
    location TEXT,
    website_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_interests table
CREATE TABLE user_interests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    interest TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status project_status_enum DEFAULT 'planning',
    technologies TEXT[],
    github_url TEXT,
    demo_url TEXT,
    image_url TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    xp_reward INTEGER DEFAULT 0,
    badge_color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create community_posts table
CREATE TABLE community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    tags TEXT[],
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, xp_reward, badge_color) VALUES
('Welcome to AeThex', 'Complete your profile setup', '🎉', 100, '#10B981'),
('First Project', 'Create your first project', '🚀', 150, '#3B82F6'),
('Community Contributor', 'Make your first community post', '💬', 75, '#8B5CF6'),
('Level Up', 'Reach level 5', '⭐', 200, '#F59E0B'),
('Experienced Developer', 'Complete 5 projects', '👨‍💻', 300, '#EF4444'),
('Community Leader', 'Get 100 likes on your posts', '👑', 500, '#F97316');

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_interests
CREATE POLICY "Users can view all interests" ON user_interests FOR SELECT USING (true);
CREATE POLICY "Users can manage own interests" ON user_interests FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for projects
CREATE POLICY "Users can view all projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view all achievements" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for community_posts
CREATE POLICY "Users can view published posts" ON community_posts FOR SELECT USING (is_published = true OR auth.uid() = author_id);
CREATE POLICY "Users can manage own posts" ON community_posts FOR ALL USING (auth.uid() = author_id);

-- RLS Policies for comments
CREATE POLICY "Users can view all comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can manage own comments" ON comments FOR ALL USING (auth.uid() = author_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create user_roles table for RBAC
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role)
);

-- Enable RLS and add policies for user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own roles
CREATE POLICY IF NOT EXISTS "Users can view own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can manage own roles" ON user_roles
  FOR ALL USING (auth.uid() = user_id);
