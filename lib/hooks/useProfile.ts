'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { MotherProfile, ChildProfile } from '@/lib/supabase/types';

interface ProfileData {
  mother: MotherProfile | null;
  child: ChildProfile | null;
}

interface ProfileState {
  data: ProfileData;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching user profile data
 * @param userId - User ID to fetch profile for
 * @returns Object with profile data, loading state, error, and refresh function
 */
export function useProfile(userId?: string) {
  const [state, setState] = useState<ProfileState>({
    data: { mother: null, child: null },
    loading: true,
    error: null
  });

  const supabase = createClient();

  const fetchProfile = async (uid: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Fetch mother profile
      const { data: motherData, error: motherError } = await supabase
        .from('mother_profiles')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (motherError && motherError.code !== 'PGRST116') {
        throw new Error(motherError.message);
      }

      // Fetch child profile
      const { data: childData, error: childError } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (childError && childError.code !== 'PGRST116') {
        throw new Error(childError.message);
      }

      setState({
        data: {
          mother: motherData || null,
          child: childData || null
        },
        loading: false,
        error: null
      });
    } catch (err) {
      setState({
        data: { mother: null, child: null },
        loading: false,
        error: err instanceof Error ? err.message : 'Gagal memuat profil'
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      setState({
        data: { mother: null, child: null },
        loading: false,
        error: null
      });
    }
  }, [userId]);

  const refresh = () => {
    if (userId) {
      fetchProfile(userId);
    }
  };

  return {
    mother: state.data.mother,
    child: state.data.child,
    loading: state.loading,
    error: state.error,
    hasProfile: !!(state.data.mother && state.data.child),
    refresh
  };
}
