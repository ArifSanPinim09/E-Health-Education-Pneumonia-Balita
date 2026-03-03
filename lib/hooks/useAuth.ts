'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for managing authentication state
 * @returns Object with user, loading, error, and signOut function
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setState({ user: null, loading: false, error: error.message });
          return;
        }

        setState({ user: session?.user ?? null, loading: false, error: null });
      } catch (err) {
        setState({ 
          user: null, 
          loading: false, 
          error: err instanceof Error ? err.message : 'Terjadi kesalahan' 
        });
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState({ user: session?.user ?? null, loading: false, error: null });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      setState({ user: null, loading: false, error: null });
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal logout';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    signOut
  };
}
