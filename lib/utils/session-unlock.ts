/**
 * Check if a session is unlocked based on the unlock time
 * @param unlockedAt - ISO timestamp when the session was unlocked
 * @returns Object with unlocked status and remaining time
 */
export function checkSessionUnlock(unlockedAt: string): {
  unlocked: boolean;
  remainingMs: number;
  remainingHours: number;
  remainingMinutes: number;
} {
  const unlockTime = new Date(unlockedAt).getTime();
  const currentTime = Date.now();
  const remainingMs = unlockTime - currentTime;
  
  if (remainingMs <= 0) {
    return {
      unlocked: true,
      remainingMs: 0,
      remainingHours: 0,
      remainingMinutes: 0
    };
  }
  
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    unlocked: false,
    remainingMs,
    remainingHours,
    remainingMinutes
  };
}

/**
 * Calculate the unlock time for the next session (24 hours from completion)
 * @param completedAt - ISO timestamp when the session was completed
 * @returns ISO timestamp for when the next session unlocks
 */
export function calculateNextUnlockTime(completedAt: Date | string): string {
  const completedTime = typeof completedAt === 'string' ? new Date(completedAt) : completedAt;
  const unlockTime = new Date(completedTime.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
  return unlockTime.toISOString();
}

/**
 * Format remaining time as Indonesian text (e.g., "5 jam 30 menit")
 * @param remainingMs - Remaining time in milliseconds
 * @returns Formatted time string in Indonesian
 */
export function formatRemainingTime(remainingMs: number): string {
  if (remainingMs <= 0) {
    return 'Tersedia sekarang';
  }
  
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0 && minutes > 0) {
    return `${hours} jam ${minutes} menit`;
  } else if (hours > 0) {
    return `${hours} jam`;
  } else if (minutes > 0) {
    return `${minutes} menit`;
  } else {
    return 'Kurang dari 1 menit';
  }
}

/**
 * Check if all sessions are completed
 * @param completedSessions - Array of completed session day numbers
 * @param totalSessions - Total number of sessions (default: 5)
 * @returns Boolean indicating if all sessions are completed
 */
export function areAllSessionsCompleted(
  completedSessions: number[],
  totalSessions: number = 5
): boolean {
  return completedSessions.length === totalSessions;
}

/**
 * Get the next available session day
 * @param completedSessions - Array of completed session day numbers
 * @param totalSessions - Total number of sessions (default: 5)
 * @returns Next session day number or null if all completed
 */
export function getNextSessionDay(
  completedSessions: number[],
  totalSessions: number = 5
): number | null {
  for (let day = 1; day <= totalSessions; day++) {
    if (!completedSessions.includes(day)) {
      return day;
    }
  }
  return null;
}
