-- Script untuk membuat RLS policies yang mengizinkan service role
-- Jalankan di Supabase SQL Editor

-- Drop existing policies jika ada (optional)
DROP POLICY IF EXISTS "Service role can insert test submissions" ON test_submissions;
DROP POLICY IF EXISTS "Service role can select test submissions" ON test_submissions;
DROP POLICY IF EXISTS "Service role can insert session progress" ON session_progress;
DROP POLICY IF EXISTS "Service role can select session progress" ON session_progress;
DROP POLICY IF EXISTS "Service role can update session progress" ON session_progress;

-- Enable RLS jika belum enabled
ALTER TABLE test_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_progress ENABLE ROW LEVEL SECURITY;

-- Policies untuk test_submissions
CREATE POLICY "Service role can insert test submissions"
ON test_submissions
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can select test submissions"
ON test_submissions
FOR SELECT
TO service_role
USING (true);

-- Policies untuk session_progress
CREATE POLICY "Service role can insert session progress"
ON session_progress
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can select session progress"
ON session_progress
FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role can update session progress"
ON session_progress
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Verifikasi policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('test_submissions', 'session_progress')
ORDER BY tablename, policyname;
