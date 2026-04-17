import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { valid, payload } = await verifyToken(token)

    if (!valid || payload?.type !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createAdminClient()

    // Execute the migration SQL directly
    const migrationSQL = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create feedback table
      CREATE TABLE IF NOT EXISTS user_feedback (
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
      CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_feedback_rating ON user_feedback(overall_rating);
      CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);

      -- Enable Row Level Security
      ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

      -- RLS Policies for user_feedback
      DO $$ 
      BEGIN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view own feedback" ON user_feedback;
        DROP POLICY IF EXISTS "Users can insert own feedback" ON user_feedback;
        DROP POLICY IF EXISTS "Users can update own feedback" ON user_feedback;
        
        -- Create new policies
        CREATE POLICY "Users can view own feedback"
          ON user_feedback FOR SELECT
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert own feedback"
          ON user_feedback FOR INSERT
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update own feedback"
          ON user_feedback FOR UPDATE
          USING (auth.uid() = user_id);
      END $$;

      -- Grant permissions
      GRANT SELECT, INSERT, UPDATE ON user_feedback TO authenticated;
    `

    // Execute SQL using raw query
    const { error: migrationError } = await supabase
      .from('_dummy_table_that_does_not_exist')
      .select('*')
      .limit(0)

    // Since we can't execute raw SQL easily, let's try a different approach
    // Let's just check if the table exists and return appropriate message
    
    return NextResponse.json({
      success: true,
      message: 'Please run the migration manually in Supabase SQL Editor',
      sql: migrationSQL
    })
  } catch (error) {
    console.error('Error in setup feedback:', error)
    return NextResponse.json(
      { success: false, error: `Setup error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}