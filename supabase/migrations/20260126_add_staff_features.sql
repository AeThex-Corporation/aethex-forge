-- Staff Feature Tables
-- Comprehensive schema for staff management features

-- Staff Announcements
CREATE TABLE IF NOT EXISTS staff_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'policy', 'event', 'urgent', 'celebration')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_pinned BOOLEAN DEFAULT FALSE,
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_announcements_published ON staff_announcements(published_at DESC);
CREATE INDEX idx_staff_announcements_category ON staff_announcements(category);

-- Staff Expense Reports
CREATE TABLE IF NOT EXISTS staff_expense_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  category TEXT NOT NULL CHECK (category IN ('travel', 'equipment', 'software', 'meals', 'office', 'training', 'other')),
  receipt_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'reimbursed')),
  submitted_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  reimbursed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_expenses_user ON staff_expense_reports(user_id);
CREATE INDEX idx_staff_expenses_status ON staff_expense_reports(status);

-- Staff Learning/Courses
CREATE TABLE IF NOT EXISTS staff_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  category TEXT NOT NULL,
  duration_weeks INTEGER DEFAULT 1,
  lessons_count INTEGER DEFAULT 1,
  thumbnail_url TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES staff_courses(id) ON DELETE CASCADE,
  progress_percent INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_staff_course_progress_user ON staff_course_progress(user_id);

-- Staff Performance Reviews
CREATE TABLE IF NOT EXISTS staff_performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id),
  review_period TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'completed')),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  goals_rating INTEGER CHECK (goals_rating >= 1 AND goals_rating <= 5),
  collaboration_rating INTEGER CHECK (collaboration_rating >= 1 AND collaboration_rating <= 5),
  technical_rating INTEGER CHECK (technical_rating >= 1 AND technical_rating <= 5),
  strengths TEXT,
  improvements TEXT,
  goals_next_period TEXT,
  employee_comments TEXT,
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_reviews_employee ON staff_performance_reviews(employee_id);
CREATE INDEX idx_staff_reviews_status ON staff_performance_reviews(status);

-- Staff Knowledge Base
CREATE TABLE IF NOT EXISTS staff_knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id),
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_kb_category ON staff_knowledge_articles(category);
CREATE INDEX idx_staff_kb_tags ON staff_knowledge_articles USING GIN(tags);

-- Staff Projects
CREATE TABLE IF NOT EXISTS staff_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  lead_id UUID REFERENCES auth.users(id),
  start_date DATE,
  target_date DATE,
  progress_percent INTEGER DEFAULT 0,
  team_members UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES staff_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_projects_status ON staff_projects(status);
CREATE INDEX idx_staff_tasks_project ON staff_project_tasks(project_id);

-- Staff Internal Marketplace (perks, swag, requests)
CREATE TABLE IF NOT EXISTS staff_marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('swag', 'equipment', 'perk', 'service')),
  points_cost INTEGER DEFAULT 0,
  stock_count INTEGER,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES staff_marketplace_items(id),
  quantity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff Handbook Sections
CREATE TABLE IF NOT EXISTS staff_handbook_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  last_updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_handbook_category ON staff_handbook_sections(category);

-- Enable RLS on all tables
ALTER TABLE staff_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_expense_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_handbook_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies (staff can view all, edit own where applicable)
CREATE POLICY "Staff can view announcements" ON staff_announcements FOR SELECT USING (true);
CREATE POLICY "Staff can view own expenses" ON staff_expense_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can insert own expenses" ON staff_expense_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff can update own expenses" ON staff_expense_reports FOR UPDATE USING (auth.uid() = user_id AND status IN ('draft', 'pending'));
CREATE POLICY "Staff can view courses" ON staff_courses FOR SELECT USING (true);
CREATE POLICY "Staff can view own course progress" ON staff_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can update own course progress" ON staff_course_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Staff can view own reviews" ON staff_performance_reviews FOR SELECT USING (auth.uid() = employee_id OR auth.uid() = reviewer_id);
CREATE POLICY "Staff can view knowledge base" ON staff_knowledge_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Staff can view projects" ON staff_projects FOR SELECT USING (auth.uid() = ANY(team_members) OR auth.uid() = lead_id);
CREATE POLICY "Staff can view project tasks" ON staff_project_tasks FOR SELECT USING (true);
CREATE POLICY "Staff can view marketplace items" ON staff_marketplace_items FOR SELECT USING (is_available = true);
CREATE POLICY "Staff can view own orders" ON staff_marketplace_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can create orders" ON staff_marketplace_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff can view own points" ON staff_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can view handbook" ON staff_handbook_sections FOR SELECT USING (true);

-- Seed some initial data for courses
INSERT INTO staff_courses (title, description, instructor, category, duration_weeks, lessons_count, is_required) VALUES
('Advanced TypeScript Patterns', 'Master TypeScript with advanced patterns and best practices', 'Sarah Chen', 'Development', 4, 12, false),
('Leadership Fundamentals', 'Core leadership skills for team leads and managers', 'Marcus Johnson', 'Leadership', 6, 15, false),
('AWS Solutions Architect', 'Prepare for AWS certification with hands-on labs', 'David Lee', 'Infrastructure', 8, 20, false),
('Product Management Essentials', 'Learn the fundamentals of product management', 'Elena Rodriguez', 'Product', 5, 14, false),
('Security Best Practices', 'Essential security knowledge for all developers', 'Alex Kim', 'Security', 3, 10, true),
('Effective Communication', 'Improve your professional communication skills', 'Patricia Martinez', 'Skills', 2, 8, false);

-- Seed handbook sections
INSERT INTO staff_handbook_sections (title, content, category, order_index) VALUES
('Welcome to AeThex', 'Welcome to the team! This handbook contains everything you need to know about working at AeThex.', 'Getting Started', 1),
('Our Mission & Values', 'AeThex is dedicated to empowering game developers through innovative tools and community support.', 'Getting Started', 2),
('Code of Conduct', 'We maintain a professional, inclusive, and respectful workplace. All team members are expected to treat others with dignity.', 'Policies', 1),
('Time Off & Leave', 'Full-time employees receive unlimited PTO with manager approval. Please provide reasonable notice for planned time off.', 'Policies', 2),
('Remote Work Policy', 'AeThex is a remote-first company. You are free to work from anywhere as long as you maintain communication with your team.', 'Policies', 3),
('Communication Guidelines', 'We use Discord for real-time communication and Linear for project management. Check messages during your working hours.', 'Operations', 1),
('Development Workflow', 'All code changes go through pull request review. Follow our coding standards documented in the repository.', 'Operations', 2),
('Benefits Overview', 'Full-time employees receive health insurance, 401k matching, equipment stipend, and professional development budget.', 'Benefits', 1);

-- Seed marketplace items
INSERT INTO staff_marketplace_items (name, description, category, points_cost, stock_count, is_available) VALUES
('AeThex Hoodie', 'Comfortable hoodie with embroidered AeThex logo', 'swag', 500, 50, true),
('Mechanical Keyboard', 'High-quality mechanical keyboard for developers', 'equipment', 1500, 10, true),
('Extra Monitor', '27" 4K monitor for your home office', 'equipment', 3000, 5, true),
('Coffee Subscription', 'Monthly premium coffee delivery', 'perk', 200, null, true),
('Learning Budget Boost', 'Extra $500 for courses and conferences', 'perk', 1000, null, true),
('AeThex Sticker Pack', 'Set of 10 vinyl stickers', 'swag', 100, 100, true);
