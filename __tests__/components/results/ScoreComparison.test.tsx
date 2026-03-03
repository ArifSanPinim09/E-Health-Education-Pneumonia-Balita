import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScoreComparison } from '@/components/results/ScoreComparison'

describe('ScoreComparison', () => {
  it('renders pre-test and post-test scores', () => {
    render(<ScoreComparison preScore={15} postScore={20} />)
    
    // Scores appear multiple times (main display and progress bars)
    expect(screen.getAllByText('15').length).toBeGreaterThan(0)
    expect(screen.getAllByText('20').length).toBeGreaterThan(0)
  })

  it('calculates improvement correctly', () => {
    render(<ScoreComparison preScore={15} postScore={20} />)
    
    // Improvement is 5 points
    expect(screen.getByText('+5')).toBeInTheDocument()
  })

  it('displays positive improvement message', () => {
    render(<ScoreComparison preScore={15} postScore={20} />)
    
    expect(screen.getByText(/Anda meningkat 5 poin/i)).toBeInTheDocument()
    expect(screen.getByText(/Luar biasa! Pengetahuan Anda meningkat!/i)).toBeInTheDocument()
  })

  it('displays no change message when scores are equal', () => {
    render(<ScoreComparison preScore={18} postScore={18} />)
    
    expect(screen.getByText(/Skor Anda tetap sama/i)).toBeInTheDocument()
  })

  it('displays decrease message when post-test score is lower', () => {
    render(<ScoreComparison preScore={20} postScore={15} />)
    
    expect(screen.getByText(/Skor Anda menurun 5 poin/i)).toBeInTheDocument()
  })

  it('calculates percentages correctly', () => {
    render(<ScoreComparison preScore={15} postScore={20} />)
    
    // 15/23 = 65.2%, 20/23 = 87.0%
    expect(screen.getByText('65.2%')).toBeInTheDocument()
    expect(screen.getByText('87.0%')).toBeInTheDocument()
  })

  it('displays improvement percentage', () => {
    render(<ScoreComparison preScore={15} postScore={20} />)
    
    // Improvement: (5/23) * 100 = 21.7%
    expect(screen.getByText('+21.7%')).toBeInTheDocument()
  })
})
