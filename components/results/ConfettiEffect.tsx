'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function ConfettiEffect() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      return // Skip animation if user prefers reduced motion
    }

    const duration = 3000 // 3 seconds
    const end = Date.now() + duration

    // Brand colors
    const colors = ['#2563EB', '#10B981', '#F59E0B']

    const frame = () => {
      // Left side confetti
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        ticks: 200,
        gravity: 1,
        decay: 0.94,
        startVelocity: 30,
      })

      // Right side confetti
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        ticks: 200,
        gravity: 1,
        decay: 0.94,
        startVelocity: 30,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    // Start confetti animation
    frame()

    // Cleanup function
    return () => {
      confetti.reset()
    }
  }, [])

  return null // This component doesn't render anything
}
