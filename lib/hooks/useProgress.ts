'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SessionProgress, TestSubmission } from '@/lib/supabase/types';

interface ProgressData {
  preTestCompleted: boolean;
  postTestCompleted: boolean;
  preTestScore: number | null;
  postTestScore: number | null;
  sessions: SessionProgress[];
  completedSessions: number[];
  overallPercentage: number;
}

interface ProgressState {
  data: ProgressData;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for tracking user learning progress
 * @param userId - User ID to fetch progress for
 * @returns Object with progress data, loading state, error, and refresh function
 */
export function useProgress(userId?: string) {
  const [state, setState] = useState<ProgressState>({
    data: {
      preTestCompleted: false,
      postTestCompleted: false,
      preTestScore: null,
      postTestScore: null,
      sessions: [],
      completedSessions: [],
      overallPercentage: 0
    },
    loading: true,
    error: null
  });

  const supabase = createClient();

  const fetchProgress = async (uid: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Fetch test submissions
      const { data: testData, error: testError } = await supabase
        .from('test_submissions')
        .select('*')
        .eq('user_id', uid);

      if (testError) {
        throw new Error(testError.message);
      }

      const preTest = testData?.find((t: TestSubmission) => t.test_type === 'pre');
      const postTest = testData?.find((t: TestSubmission) => t.test_type === 'post');

      // Fetch session progress
      const { data: sessionData, error: sessionError } = await supabase
        .from('session_progress')
        .select('*')
        .eq('user_id', uid)
        .order('day', { ascending: true });

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      const completedSessions = sessionData
        ?.filter((s: SessionProgress) => s.completed)
        .map((s: SessionProgress) => s.day) || [];

      // Calculate overall percentage
      // Pre-test: 10%, Each session: 15% (5 sessions = 75%), Post-test: 15%
      let percentage = 0;
      if (preTest) percentage += 10;
      percentage += completedSessions.length * 15;
      if (postTest) percentage += 15;

      setState({
        data: {
          preTestCompleted: !!preTest,
          postTestCompleted: !!postTest,
          preTestScore: (preTest as TestSubmission | undefined)?.score ?? null,
          postTestScore: (postTest as TestSubmission | undefined)?.score ?? null,
          sessions: sessionData || [],
          completedSessions,
          overallPercentage: percentage
        },
        loading: false,
        error: null
      });
    } catch (err) {
      setState({
        data: {
          preTestCompleted: false,
          postTestCompleted: false,
          preTestScore: null,
          postTestScore: null,
          sessions: [],
          completedSessions: [],
          overallPercentage: 0
        },
        loading: false,
        error: err instanceof Error ? err.message : 'Gagal memuat progress'
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProgress(userId);
    } else {
      setState({
        data: {
          preTestCompleted: false,
          postTestCompleted: false,
          preTestScore: null,
          postTestScore: null,
          sessions: [],
          completedSessions: [],
          overallPercentage: 0
        },
        loading: false,
        error: null
      });
    }
  }, [userId]);

  const refresh = () => {
    if (userId) {
      fetchProgress(userId);
    }
  };

  return {
    ...state.data,
    loading: state.loading,
    error: state.error,
    refresh
  };
}
