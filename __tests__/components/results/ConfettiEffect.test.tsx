import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { ConfettiEffect } from '@/components/results/ConfettiEffect'

// Mock canvas-confetti
vi.mock('canvas-confetti', () => {
  const mockConfetti = vi.fn(() => null)
  mockConfetti.reset = vi.fn()
  return {
    default: mockConfetti,
  }
})

describe('ConfettiEffect', () => {
  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('renders without crashing', () => {
    const { container } = render(<ConfettiEffect />)
    expect(container).toBeInTheDocument()
  })

  it('does not render any visible elements', () => {
    const { container } = render(<ConfettiEffect />)
    expect(container.firstChild).toBeNull()
  })
})
