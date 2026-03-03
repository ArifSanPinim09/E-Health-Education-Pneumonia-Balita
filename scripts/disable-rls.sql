-- Script untuk disable RLS pada tables yang bermasalah
-- Jalankan di Supabase SQL Editor

-- Disable RLS untuk test_submissions
ALTER TABLE test_submissions DISABLE ROW LEVEL SECURITY;

-- Disable RLS untuk session_progress
ALTER TABLE session_progress DISABLE ROW LEVEL SECURITY;

-- Verifikasi status RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('test_submissions', 'session_progress');
