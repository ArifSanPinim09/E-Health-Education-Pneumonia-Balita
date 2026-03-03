'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to detect user's reduced motion preference
 * @returns Boolean indicating if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') {
      return;
    }

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create listener for changes
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', listener);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation duration based on reduced motion preference
 * @param normalDuration - Normal animation duration in seconds
 * @param reducedDuration - Reduced animation duration in seconds (default: 0)
 * @returns Animation duration based on user preference
 */
export function useAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedDuration : normalDuration;
}
