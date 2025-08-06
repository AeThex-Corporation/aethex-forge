# Supabase Setup Guide for AeThex

This guide will help you set up Supabase for your AeThex application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New project"
4. Choose your organization
5. Fill in your project details:
   - Name: `aethex-app`
   - Database Password: (generate a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your project URL and anon key
3. Create a `.env` file in your project root:

```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Run Database Migrations

Execute the following SQL in your Supabase SQL Editor (Database > SQL Editor):

```sql
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
('First Project', 'Create your first project', '���', 150, '#3B82F6'),
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
```

## 4. Configure Authentication Settings

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL: `http://localhost:5173` (for development)
3. Add additional redirect URLs if needed for production
4. Configure email templates in Authentication > Templates (optional)

## 5. Features Enabled

Once set up, your AeThex app will have:

### 🔐 Authentication

- Email/password sign up and sign in
- User session management
- Profile creation and updates

### 🗄️ Database Features

- User profiles with extended information
- Project portfolio management
- Achievement system with XP and levels
- Community posts and comments
- Real-time notifications

### 🎮 Gamification

- User levels and XP tracking
- Achievement system
- Progress tracking

### 💬 Community

- User-generated content
- Real-time updates
- Comment system

### 📊 Dashboard

- Personalized user dashboard
- Project tracking
- Achievement display
- Statistics and progress

## 6. Testing Your Setup

1. Restart your development server
2. Navigate to `/login` and create a new account
3. Complete the onboarding process
4. Check your dashboard for personalized content

## 7. Production Deployment

For production:

1. Update your site URL in Supabase Authentication settings
2. Add your production domain to redirect URLs
3. Update your environment variables in your hosting platform
4. Consider upgrading your Supabase plan for higher usage limits

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [AeThex Support](/support)

Your AeThex application is now powered by Supabase! 🚀
