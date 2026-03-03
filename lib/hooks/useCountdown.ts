'use client';

import { useEffect, useState } from 'react';
import { checkSessionUnlock } from '@/lib/utils/session-unlock';

interface CountdownState {
  unlocked: boolean;
  remainingMs: number;
  remainingHours: number;
  remainingMinutes: number;
  formattedTime: string;
}

/**
 * Custom hook for countdown timer logic
 * @param unlockedAt - ISO timestamp when the session unlocks
 * @returns Object with countdown state
 */
export function useCountdown(unlockedAt: string | null) {
  const [state, setState] = useState<CountdownState>({
    unlocked: true,
    remainingMs: 0,
    remainingHours: 0,
    remainingMinutes: 0,
    formattedTime: 'Tersedia sekarang'
  });

  useEffect(() => {
    if (!unlockedAt) {
      setState({
        unlocked: true,
        remainingMs: 0,
        remainingHours: 0,
        remainingMinutes: 0,
        formattedTime: 'Tersedia sekarang'
      });
      return;
    }

    const updateCountdown = () => {
      const result = checkSessionUnlock(unlockedAt);
      
      let formattedTime = 'Tersedia sekarang';
      if (!result.unlocked) {
        if (result.remainingHours > 0 && result.remainingMinutes > 0) {
          formattedTime = `${result.remainingHours} jam ${result.remainingMinutes} menit`;
        } else if (result.remainingHours > 0) {
          formattedTime = `${result.remainingHours} jam`;
        } else if (result.remainingMinutes > 0) {
          formattedTime = `${result.remainingMinutes} menit`;
        } else {
          formattedTime = 'Kurang dari 1 menit';
        }
      }

      setState({
        ...result,
        formattedTime
      });
    };

    // Initial update
    updateCountdown();

    // Update every minute
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [unlockedAt]);

  return state;
}
