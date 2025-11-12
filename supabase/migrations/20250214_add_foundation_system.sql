-- Foundation: Non-profit Education & Community Platform
-- Includes: Courses, Curriculum, Progress Tracking, Achievements, Mentorship

create extension if not exists "pgcrypto";

-- ============================================================================
-- COURSES & CURRICULUM
-- ============================================================================

create table if not exists public.foundation_courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category text not null, -- 'getting-started', 'intermediate', 'advanced', 'specialization'
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  instructor_id uuid not null references public.user_profiles(id) on delete cascade,
  cover_image_url text,
  estimated_hours int, -- estimated time to complete
  is_published boolean not null default false,
  order_index int, -- for curriculum ordering
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_courses_published_idx on public.foundation_courses (is_published);
create index if not exists foundation_courses_category_idx on public.foundation_courses (category);
create index if not exists foundation_courses_slug_idx on public.foundation_courses (slug);

-- Course Modules (chapters/sections)
create table if not exists public.foundation_course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.foundation_courses(id) on delete cascade,
  title text not null,
  description text,
  content text, -- markdown or HTML
  video_url text, -- optional embedded video
  order_index int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_course_modules_course_idx on public.foundation_course_modules (course_id);

-- Course Lessons (within modules)
create table if not exists public.foundation_course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.foundation_course_modules(id) on delete cascade,
  course_id uuid not null references public.foundation_courses(id) on delete cascade,
  title text not null,
  content text not null, -- markdown
  video_url text,
  reading_time_minutes int,
  order_index int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_course_lessons_module_idx on public.foundation_course_lessons (module_id);

-- User Enrollments & Progress
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

-- Lesson Completion Tracking
create table if not exists public.foundation_lesson_progress (
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  lesson_id uuid not null references public.foundation_course_lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ============================================================================
-- ACHIEVEMENTS & BADGES
-- ============================================================================

create table if not exists public.foundation_achievements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon_url text,
  badge_color text, -- hex color for badge
  requirement_type text not null check (requirement_type in ('course_completion', 'milestone', 'contribution', 'mentorship')),
  requirement_data jsonb, -- e.g., {"course_id": "...", "count": 1}
  tier int default 1, -- 1 (bronze), 2 (silver), 3 (gold), 4 (platinum)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_achievements_requirement_idx on public.foundation_achievements (requirement_type);

-- User Achievements (earned badges)
create table if not exists public.foundation_user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  achievement_id uuid not null references public.foundation_achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(user_id, achievement_id)
);

create index if not exists foundation_user_achievements_user_idx on public.foundation_user_achievements (user_id);
create index if not exists foundation_user_achievements_earned_idx on public.foundation_user_achievements (earned_at);

-- ============================================================================
-- MENTORSHIP
-- ============================================================================

-- Mentor Profiles (extends user_profiles)
create table if not exists public.foundation_mentors (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  bio text,
  expertise text[] not null default '{}', -- e.g., ['Web3', 'Game Dev', 'AI/ML']
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

-- Mentorship Requests & Sessions
create table if not exists public.foundation_mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.user_profiles(id) on delete cascade,
  mentee_id uuid not null references public.user_profiles(id) on delete cascade,
  message text,
  expertise_area text, -- which area they want help with
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(mentor_id, mentee_id) where status = 'pending'
);

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
  notes text, -- notes from the session
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_mentorship_sessions_mentor_idx on public.foundation_mentorship_sessions (mentor_id);
create index if not exists foundation_mentorship_sessions_mentee_idx on public.foundation_mentorship_sessions (mentee_id);
create index if not exists foundation_mentorship_sessions_scheduled_idx on public.foundation_mentorship_sessions (scheduled_at);

-- ============================================================================
-- CONTRIBUTIONS & COMMUNITY
-- ============================================================================

create table if not exists public.foundation_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  contribution_type text not null, -- 'course_creation', 'lesson_review', 'mentorship', 'community_support'
  resource_id uuid, -- e.g., course_id, lesson_id
  points int not null default 0, -- contribution points toward achievements
  created_at timestamptz not null default now()
);

create index if not exists foundation_contributions_user_idx on public.foundation_contributions (user_id);
create index if not exists foundation_contributions_type_idx on public.foundation_contributions (contribution_type);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

alter table public.foundation_courses enable row level security;
alter table public.foundation_course_modules enable row level security;
alter table public.foundation_course_lessons enable row level security;
alter table public.foundation_enrollments enable row level security;
alter table public.foundation_lesson_progress enable row level security;
alter table public.foundation_achievements enable row level security;
alter table public.foundation_user_achievements enable row level security;
alter table public.foundation_mentors enable row level security;
alter table public.foundation_mentorship_requests enable row level security;
alter table public.foundation_mentorship_sessions enable row level security;
alter table public.foundation_contributions enable row level security;

-- Courses: Published courses readable by all, all ops by instructor/admin
create policy "Published courses readable by all" on public.foundation_courses
  for select using (is_published = true or auth.uid() = instructor_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

create policy "Instructors manage own courses" on public.foundation_courses
  for all using (auth.uid() = instructor_id) with check (auth.uid() = instructor_id);

-- Course modules: same as courses (published visible, instructor/admin manage)
create policy "Published modules readable by all" on public.foundation_course_modules
  for select using (
    is_published = true or
    exists(select 1 from public.foundation_courses where id = course_id and instructor_id = auth.uid()) or
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

create policy "Instructors manage course modules" on public.foundation_course_modules
  for all using (exists(select 1 from public.foundation_courses where id = course_id and instructor_id = auth.uid()));

-- Lessons: same pattern
create policy "Published lessons readable by all" on public.foundation_course_lessons
  for select using (
    is_published = true or
    exists(select 1 from public.foundation_courses where id = course_id and instructor_id = auth.uid()) or
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

create policy "Instructors manage course lessons" on public.foundation_course_lessons
  for all using (exists(select 1 from public.foundation_courses where id = course_id and instructor_id = auth.uid()));

-- Enrollments: users see own, instructors see their course enrollments
create policy "Users see own enrollments" on public.foundation_enrollments
  for select using (auth.uid() = user_id or
    exists(select 1 from public.foundation_courses where id = course_id and instructor_id = auth.uid()));

create policy "Users manage own enrollments" on public.foundation_enrollments
  for insert with check (auth.uid() = user_id);

create policy "Users update own enrollments" on public.foundation_enrollments
  for update using (auth.uid() = user_id);

-- Lesson progress: users see own
create policy "Users see own lesson progress" on public.foundation_lesson_progress
  for select using (auth.uid() = user_id);

create policy "Users update own lesson progress" on public.foundation_lesson_progress
  for insert with check (auth.uid() = user_id);

create policy "Users update own lesson completion" on public.foundation_lesson_progress
  for update using (auth.uid() = user_id);

-- Achievements: all readable, admin/system manages
create policy "Achievements readable by all" on public.foundation_achievements
  for select using (true);

-- User achievements: users see own, admin manages
create policy "Users see own achievements" on public.foundation_user_achievements
  for select using (auth.uid() = user_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

-- Mentors: approved mentors visible, mentors manage own
create policy "Approved mentors visible to all" on public.foundation_mentors
  for select using (approval_status = 'approved' or auth.uid() = user_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

create policy "Users manage own mentor profile" on public.foundation_mentors
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Mentorship requests: involved parties can see
create policy "Mentorship requests visible to involved" on public.foundation_mentorship_requests
  for select using (auth.uid() = mentor_id or auth.uid() = mentee_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

create policy "Mentees request mentorship" on public.foundation_mentorship_requests
  for insert with check (auth.uid() = mentee_id);

create policy "Mentors respond to requests" on public.foundation_mentorship_requests
  for update using (auth.uid() = mentor_id);

-- Mentorship sessions: involved parties can see/manage
create policy "Sessions visible to involved" on public.foundation_mentorship_sessions
  for select using (auth.uid() = mentor_id or auth.uid() = mentee_id);

create policy "Mentorship sessions insert" on public.foundation_mentorship_sessions
  for insert with check (auth.uid() = mentor_id or auth.uid() = mentee_id);

create policy "Mentorship sessions update" on public.foundation_mentorship_sessions
  for update using (auth.uid() = mentor_id or auth.uid() = mentee_id);

-- Contributions: users see own, admin sees all
create policy "Contributions visible to user and admin" on public.foundation_contributions
  for select using (auth.uid() = user_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

create policy "System logs contributions" on public.foundation_contributions
  for insert with check (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger foundation_courses_set_updated_at before update on public.foundation_courses for each row execute function public.set_updated_at();
create trigger foundation_course_modules_set_updated_at before update on public.foundation_course_modules for each row execute function public.set_updated_at();
create trigger foundation_course_lessons_set_updated_at before update on public.foundation_course_lessons for each row execute function public.set_updated_at();
create trigger foundation_enrollments_set_updated_at before update on public.foundation_enrollments for each row execute function public.set_updated_at();
create trigger foundation_mentors_set_updated_at before update on public.foundation_mentors for each row execute function public.set_updated_at();
create trigger foundation_mentorship_requests_set_updated_at before update on public.foundation_mentorship_requests for each row execute function public.set_updated_at();
create trigger foundation_mentorship_sessions_set_updated_at before update on public.foundation_mentorship_sessions for each row execute function public.set_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table public.foundation_courses is 'Foundation curriculum courses - free, public, educational';
comment on table public.foundation_course_modules is 'Course modules/chapters';
comment on table public.foundation_course_lessons is 'Individual lessons within modules';
comment on table public.foundation_enrollments is 'User course enrollments and progress tracking';
comment on table public.foundation_lesson_progress is 'Granular lesson completion tracking';
comment on table public.foundation_achievements is 'Achievement/badge definitions for community members';
comment on table public.foundation_user_achievements is 'User-earned achievements (many-to-many)';
comment on table public.foundation_mentors is 'Mentor profiles with approval status and expertise';
comment on table public.foundation_mentorship_requests is 'Mentorship requests from mentees to mentors';
comment on table public.foundation_mentorship_sessions is 'Scheduled mentorship sessions between mentor and mentee';
comment on table public.foundation_contributions is 'Community contributions (course creation, mentorship, etc) for gamification';
