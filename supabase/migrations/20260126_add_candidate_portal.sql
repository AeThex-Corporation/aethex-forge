-- Candidate Profiles Table
-- Extended profile data for job applicants

CREATE TABLE IF NOT EXISTS candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  resume_url TEXT,
  portfolio_urls JSONB DEFAULT '[]',
  work_history JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  skills TEXT[] DEFAULT '{}',
  availability TEXT CHECK (availability IN ('immediate', '2_weeks', '1_month', '3_months', 'not_looking')),
  desired_rate DECIMAL(10,2),
  rate_type TEXT CHECK (rate_type IN ('hourly', 'monthly', 'yearly')),
  location TEXT,
  remote_preference TEXT CHECK (remote_preference IN ('remote_only', 'hybrid', 'on_site', 'flexible')),
  bio TEXT,
  headline TEXT,
  profile_completeness INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_candidate_profiles_user_id ON candidate_profiles(user_id);
CREATE INDEX idx_candidate_profiles_skills ON candidate_profiles USING GIN(skills);
CREATE INDEX idx_candidate_profiles_availability ON candidate_profiles(availability);

-- Enable RLS
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;

-- Candidates can view and update their own profile
CREATE POLICY "Candidates can view own profile"
  ON candidate_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Candidates can update own profile"
  ON candidate_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Candidates can insert own profile"
  ON candidate_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public profiles can be viewed by anyone
CREATE POLICY "Public profiles are viewable"
  ON candidate_profiles
  FOR SELECT
  USING (is_public = TRUE);

-- Candidate Interviews Table
-- Tracks scheduled interviews between candidates and employers

CREATE TABLE IF NOT EXISTS candidate_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID,
  candidate_id UUID REFERENCES auth.users(id),
  employer_id UUID REFERENCES auth.users(id),
  opportunity_id UUID,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  meeting_link TEXT,
  meeting_type TEXT DEFAULT 'video' CHECK (meeting_type IN ('video', 'phone', 'in_person')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show')),
  notes TEXT,
  interviewer_notes TEXT,
  candidate_feedback TEXT,
  interviewer_feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_candidate_interviews_candidate_id ON candidate_interviews(candidate_id);
CREATE INDEX idx_candidate_interviews_employer_id ON candidate_interviews(employer_id);
CREATE INDEX idx_candidate_interviews_status ON candidate_interviews(status);
CREATE INDEX idx_candidate_interviews_scheduled_at ON candidate_interviews(scheduled_at);

-- Enable RLS
ALTER TABLE candidate_interviews ENABLE ROW LEVEL SECURITY;

-- Candidates can view their own interviews
CREATE POLICY "Candidates can view own interviews"
  ON candidate_interviews
  FOR SELECT
  USING (auth.uid() = candidate_id);

-- Employers can view interviews they're part of
CREATE POLICY "Employers can view their interviews"
  ON candidate_interviews
  FOR SELECT
  USING (auth.uid() = employer_id);

-- Candidates can update their feedback
CREATE POLICY "Candidates can update own interview feedback"
  ON candidate_interviews
  FOR UPDATE
  USING (auth.uid() = candidate_id);

-- Employers can manage interviews
CREATE POLICY "Employers can manage interviews"
  ON candidate_interviews
  FOR ALL
  USING (auth.uid() = employer_id);

-- Candidate Offers Table
-- Tracks job offers made to candidates

CREATE TABLE IF NOT EXISTS candidate_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID,
  candidate_id UUID REFERENCES auth.users(id),
  employer_id UUID REFERENCES auth.users(id),
  opportunity_id UUID,
  position_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  salary_amount DECIMAL(12,2),
  salary_type TEXT CHECK (salary_type IN ('hourly', 'monthly', 'yearly', 'project')),
  start_date DATE,
  offer_expiry DATE,
  benefits JSONB DEFAULT '[]',
  offer_letter_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'withdrawn')),
  candidate_response_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_candidate_offers_candidate_id ON candidate_offers(candidate_id);
CREATE INDEX idx_candidate_offers_status ON candidate_offers(status);

-- Enable RLS
ALTER TABLE candidate_offers ENABLE ROW LEVEL SECURITY;

-- Candidates can view their offers
CREATE POLICY "Candidates can view own offers"
  ON candidate_offers
  FOR SELECT
  USING (auth.uid() = candidate_id);

-- Candidates can respond to offers
CREATE POLICY "Candidates can respond to offers"
  ON candidate_offers
  FOR UPDATE
  USING (auth.uid() = candidate_id);

-- Employers can manage offers they created
CREATE POLICY "Employers can manage their offers"
  ON candidate_offers
  FOR ALL
  USING (auth.uid() = employer_id);

-- Function to calculate profile completeness
CREATE OR REPLACE FUNCTION calculate_candidate_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
  completeness INTEGER := 0;
BEGIN
  -- Each section adds points
  IF NEW.headline IS NOT NULL AND NEW.headline != '' THEN completeness := completeness + 10; END IF;
  IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN completeness := completeness + 10; END IF;
  IF NEW.resume_url IS NOT NULL AND NEW.resume_url != '' THEN completeness := completeness + 20; END IF;
  IF NEW.skills IS NOT NULL AND array_length(NEW.skills, 1) > 0 THEN completeness := completeness + 15; END IF;
  IF NEW.work_history IS NOT NULL AND jsonb_array_length(NEW.work_history) > 0 THEN completeness := completeness + 15; END IF;
  IF NEW.education IS NOT NULL AND jsonb_array_length(NEW.education) > 0 THEN completeness := completeness + 10; END IF;
  IF NEW.portfolio_urls IS NOT NULL AND jsonb_array_length(NEW.portfolio_urls) > 0 THEN completeness := completeness + 10; END IF;
  IF NEW.availability IS NOT NULL THEN completeness := completeness + 5; END IF;
  IF NEW.location IS NOT NULL AND NEW.location != '' THEN completeness := completeness + 5; END IF;

  NEW.profile_completeness := completeness;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate profile completeness
CREATE TRIGGER calculate_profile_completeness_trigger
  BEFORE INSERT OR UPDATE ON candidate_profiles
  FOR EACH ROW
  EXECUTE FUNCTION calculate_candidate_profile_completeness();

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_candidate_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER candidate_interviews_updated_at
  BEFORE UPDATE ON candidate_interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_candidate_tables_updated_at();

CREATE TRIGGER candidate_offers_updated_at
  BEFORE UPDATE ON candidate_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_candidate_tables_updated_at();
