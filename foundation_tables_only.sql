-- PART 1: Create Foundation Tables ONLY

-- Foundation Courses
create table if not exists public.foundation_courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category text not null,
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  instructor_id uuid not null references public.user_profiles(id) on delete cascade,
  cover_image_url text,
  estimated_hours int,
  is_published boolean not null default false,
  order_index int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_courses_slug_idx on public.foundation_courses (slug);
create index if not exists foundation_courses_instructor_idx on public.foundation_courses (instructor_id);
create index if not exists foundation_courses_category_idx on public.foundation_courses (category);
create index if not exists foundation_courses_published_idx on public.foundation_courses (is_published);

-- Course Modules
create table if not exists public.foundation_course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.foundation_courses(id) on delete cascade,
  title text not null,
  description text,
  content text,
  video_url text,
  order_index int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_course_modules_course_idx on public.foundation_course_modules (course_id);

-- Course Lessons
create table if not exists public.foundation_course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.foundation_course_modules(id) on delete cascade,
  course_id uuid not null references public.foundation_courses(id) on delete cascade,
  title text not null,
  content text not null,
  video_url text,
  reading_time_minutes int,
  order_index int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_course_lessons_module_idx on public.foundation_course_lessons (module_id);

-- User Enrollments
create table if not exists public.foundation_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  course_id uuid not null references public.foundation_courses(id) on delete cascade,
  progress_percent int not null default 0,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'paused')),
  completed_at timestamptz,
  enrolled_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create index if not exists foundation_enrollments_user_idx on public.foundation_enrollments (user_id);
create index if not exists foundation_enrollments_course_idx on public.foundation_enrollments (course_id);
create index if not exists foundation_enrollments_status_idx on public.foundation_enrollments (status);

-- Lesson Progress
create table if not exists public.foundation_lesson_progress (
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  lesson_id uuid not null references public.foundation_course_lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- Achievements
create table if not exists public.foundation_achievements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon_url text,
  badge_color text,
  requirement_type text not null check (requirement_type in ('course_completion', 'milestone', 'contribution', 'mentorship')),
  requirement_data jsonb,
  tier int default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_achievements_slug_idx on public.foundation_achievements (slug);
create index if not exists foundation_achievements_requirement_idx on public.foundation_achievements (requirement_type);

-- User Achievements
create table if not exists public.foundation_user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  achievement_id uuid not null references public.foundation_achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(user_id, achievement_id)
);

create index if not exists foundation_user_achievements_user_idx on public.foundation_user_achievements (user_id);
create index if not exists foundation_user_achievements_earned_idx on public.foundation_user_achievements (earned_at);

-- Mentors
create table if not exists public.foundation_mentors (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  bio text,
  expertise text[] not null default '{}',
  available boolean not null default false,
  max_mentees int default 3,
  current_mentees int not null default 0,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  approved_by uuid references public.user_profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_mentors_available_idx on public.foundation_mentors (available);
create index if not exists foundation_mentors_approval_idx on public.foundation_mentors (approval_status);
create index if not exists foundation_mentors_expertise_gin on public.foundation_mentors using gin (expertise);

-- Mentorship Requests
create table if not exists public.foundation_mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.user_profiles(id) on delete cascade,
  mentee_id uuid not null references public.user_profiles(id) on delete cascade,
  message text,
  expertise_area text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists foundation_mentorship_requests_pending_unique 
  on public.foundation_mentorship_requests (mentor_id, mentee_id) 
  where status = 'pending';

create index if not exists foundation_mentorship_requests_mentor_idx on public.foundation_mentorship_requests (mentor_id);
create index if not exists foundation_mentorship_requests_mentee_idx on public.foundation_mentorship_requests (mentee_id);
create index if not exists foundation_mentorship_requests_status_idx on public.foundation_mentorship_requests (status);

-- Mentorship Sessions
create table if not exists public.foundation_mentorship_sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.user_profiles(id) on delete cascade,
  mentee_id uuid not null references public.user_profiles(id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60,
  topic text,
  notes text,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_mentorship_sessions_mentor_idx on public.foundation_mentorship_sessions (mentor_id);
create index if not exists foundation_mentorship_sessions_mentee_idx on public.foundation_mentorship_sessions (mentee_id);
create index if not exists foundation_mentorship_sessions_scheduled_idx on public.foundation_mentorship_sessions (scheduled_at);

-- Contributions
create table if not exists public.foundation_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  contribution_type text not null,
  resource_id uuid,
  points int not null default 0,
  created_at timestamptz not null default now()
);

-- Add user_id column if the table exists with contributor_id instead
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'foundation_contributions' 
        AND column_name = 'user_id'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'foundation_contributions'
    ) THEN
        ALTER TABLE public.foundation_contributions ADD COLUMN user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE;
        -- Copy data from contributor_id to user_id if contributor_id exists
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'foundation_contributions' 
            AND column_name = 'contributor_id'
        ) THEN
            UPDATE public.foundation_contributions SET user_id = contributor_id WHERE user_id IS NULL;
        END IF;
    END IF;
    
    -- Add contribution_type column if table has type instead
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'foundation_contributions' 
        AND column_name = 'contribution_type'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'foundation_contributions'
    ) THEN
        ALTER TABLE public.foundation_contributions ADD COLUMN contribution_type text;
        -- Copy data from type to contribution_type if type exists
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'foundation_contributions' 
            AND column_name = 'type'
        ) THEN
            UPDATE public.foundation_contributions SET contribution_type = type WHERE contribution_type IS NULL;
        END IF;
    END IF;
    
    -- Add resource_id and points columns if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'foundation_contributions' 
        AND column_name = 'resource_id'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'foundation_contributions'
    ) THEN
        ALTER TABLE public.foundation_contributions ADD COLUMN resource_id uuid;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'foundation_contributions' 
        AND column_name = 'points'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'foundation_contributions'
    ) THEN
        ALTER TABLE public.foundation_contributions ADD COLUMN points int NOT NULL DEFAULT 0;
    END IF;
END $$;

create index if not exists foundation_contributions_user_idx on public.foundation_contributions (user_id);
create index if not exists foundation_contributions_type_idx on public.foundation_contributions (contribution_type);
