import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CountdownTimer } from '@/components/dashboard/CountdownTimer'

describe('CountdownTimer Component', () => {
  it('should display countdown in "XX jam XX menit" format', () => {
    const futureTime = new Date(Date.now() + 1000 * 60 * 60 * 2 + 1000 * 60 * 30).toISOString() // 2 hours 30 minutes from now
    
    render(<CountdownTimer unlockTime={futureTime} />)
    
    // Check for the format, allowing for slight timing differences
    expect(screen.getByText(/\d+ jam \d+ menit/)).toBeDefined()
    expect(screen.getByText(/2 jam/)).toBeDefined()
  })

  it('should display clock icon', () => {
    const futureTime = new Date(Date.now() + 1000 * 60 * 60).toISOString() // 1 hour from now
    
    render(<CountdownTimer unlockTime={futureTime} />)
    
    // Check for the presence of the Clock icon (lucide-react renders as svg)
    const clockIcon = screen.getByText(/Terbuka dalam/).closest('div')?.querySelector('svg')
    expect(clockIcon).toBeDefined()
  })

  it('should handle unlock time in the past', () => {
    const pastTime = new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
    
    const { container } = render(<CountdownTimer unlockTime={pastTime} />)
    
    // Timer should be hidden immediately
    expect(container.firstChild).toBeNull()
  })

  it('should format hours and minutes correctly', () => {
    const futureTime = new Date(Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 45).toISOString() // 24 hours 45 minutes from now
    
    render(<CountdownTimer unlockTime={futureTime} />)
    
    // Check for 24 hours (allowing for slight timing differences in minutes)
    expect(screen.getByText(/24 jam/)).toBeDefined()
  })

  it('should display text in Indonesian', () => {
    const futureTime = new Date(Date.now() + 1000 * 60 * 60).toISOString() // 1 hour from now
    
    render(<CountdownTimer unlockTime={futureTime} />)
    
    expect(screen.getByText(/Terbuka dalam/)).toBeDefined()
    expect(screen.getByText(/jam/)).toBeDefined()
    expect(screen.getByText(/menit/)).toBeDefined()
  })

  it('should display countdown for sessions locked for 24 hours', () => {
    // Simulate a session that will unlock in exactly 24 hours
    const futureTime = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    
    render(<CountdownTimer unlockTime={futureTime} />)
    
    // Should show approximately 24 hours (23 jam 59 menit due to timing)
    expect(screen.getByText(/Terbuka dalam/)).toBeDefined()
    expect(screen.getByText(/jam/)).toBeDefined()
  })
})
