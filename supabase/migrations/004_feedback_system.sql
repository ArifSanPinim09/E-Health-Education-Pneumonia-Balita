-- Create feedback table
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Rating (1-5 stars)
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  content_quality INTEGER CHECK (content_quality >= 1 AND content_quality <= 5),
  ease_of_use INTEGER CHECK (ease_of_use >= 1 AND ease_of_use <= 5),
  chatbot_helpful INTEGER CHECK (chatbot_helpful >= 1 AND chatbot_helpful <= 5),
  
  -- Feedback text
  positive_feedback TEXT,
  improvement_feedback TEXT,
  
  -- Metadata (auto-captured from progress)
  pre_test_score INTEGER,
  post_test_score INTEGER,
  improvement_percentage DECIMAL(5,2),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One feedback per user
  UNIQUE(user_id)
);

-- Create index for performance
CREATE INDEX idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX idx_user_feedback_rating ON user_feedback(overall_rating);
CREATE INDEX idx_user_feedback_created_at ON user_feedback(created_at);

-- Enable Row Level Security
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_feedback
CREATE POLICY "Users can view own feedback"
  ON user_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON user_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback"
  ON user_feedback FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_feedback_updated_at
  BEFORE UPDATE ON user_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_feedback TO authenticated;
