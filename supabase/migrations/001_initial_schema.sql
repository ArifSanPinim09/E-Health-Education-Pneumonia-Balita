-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Mother profiles table
CREATE TABLE mother_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 15 AND age <= 100),
  religion VARCHAR(100) NOT NULL,
  occupation VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Child profiles table
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  age_years INTEGER NOT NULL,
  age_months INTEGER NOT NULL,
  age_days INTEGER NOT NULL,
  assessment_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions table
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  correct_answer BOOLEAN NOT NULL,
  order_number INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test submissions table
CREATE TABLE test_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_type VARCHAR(10) NOT NULL CHECK (test_type IN ('pre', 'post')),
  answers JSONB NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 23),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, test_type)
);

-- Session progress table
CREATE TABLE session_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 5),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day)
);

-- Session content table
CREATE TABLE session_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day INTEGER NOT NULL UNIQUE CHECK (day >= 1 AND day <= 5),
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX idx_mother_profiles_user_id ON mother_profiles(user_id);
CREATE INDEX idx_child_profiles_user_id ON child_profiles(user_id);
CREATE INDEX idx_test_submissions_user_id ON test_submissions(user_id);
CREATE INDEX idx_test_submissions_test_type ON test_submissions(test_type);
CREATE INDEX idx_session_progress_user_id ON session_progress(user_id);
CREATE INDEX idx_session_progress_day ON session_progress(day);
CREATE INDEX idx_quiz_questions_order ON quiz_questions(order_number);

-- Enable Row Level Security (RLS)
ALTER TABLE mother_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mother_profiles
CREATE POLICY "Users can view own mother profile"
  ON mother_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mother profile"
  ON mother_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for child_profiles
CREATE POLICY "Users can view own child profile"
  ON child_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own child profile"
  ON child_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for test_submissions
CREATE POLICY "Users can view own test submissions"
  ON test_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test submissions"
  ON test_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for session_progress
CREATE POLICY "Users can view own session progress"
  ON session_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own session progress"
  ON session_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session progress"
  ON session_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public read access for quiz questions and session content
CREATE POLICY "Authenticated users can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view session content"
  ON session_content FOR SELECT
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for quiz_questions updated_at
CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for session_content updated_at
CREATE TRIGGER update_session_content_updated_at
  BEFORE UPDATE ON session_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
