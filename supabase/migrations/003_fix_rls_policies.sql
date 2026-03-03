-- Migration: Fix RLS policies to allow service role access
-- This ensures admin operations can bypass RLS properly

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own mother profile" ON mother_profiles;
DROP POLICY IF EXISTS "Users can insert own child profile" ON child_profiles;

-- Recreate policies with service role bypass
CREATE POLICY "Users can insert own mother profile"
  ON mother_profiles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    auth.jwt()->>'role' = 'service_role'
  );

CREATE POLICY "Users can insert own child profile"
  ON child_profiles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    auth.jwt()->>'role' = 'service_role'
  );

-- Add service role policies for updates (for future use)
CREATE POLICY "Service role can update mother profiles"
  ON mother_profiles FOR UPDATE
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can update child profiles"
  ON child_profiles FOR UPDATE
  USING (auth.jwt()->>'role' = 'service_role');

-- Add service role policies for deletes (for future use)
CREATE POLICY "Service role can delete mother profiles"
  ON mother_profiles FOR DELETE
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can delete child profiles"
  ON child_profiles FOR DELETE
  USING (auth.jwt()->>'role' = 'service_role');
