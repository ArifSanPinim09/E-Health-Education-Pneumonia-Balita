import { describe, it, expect } from 'vitest'
import { calculateScore, validateAnswers, calculatePercentage } from '@/lib/utils/score-calculator'

describe('Score Calculator - calculateScore', () => {
  it('should return 23 when all answers are correct', () => {
    const userAnswers = Array(23).fill(true)
    const correctAnswers = Array(23).fill(true)
    
    const score = calculateScore(userAnswers, correctAnswers)
    
    expect(score).toBe(23)
  })

  it('should return 0 when all answers are wrong', () => {
    const userAnswers = Array(23).fill(true)
    const correctAnswers = Array(23).fill(false)
    
    const score = calculateScore(userAnswers, correctAnswers)
    
    expect(score).toBe(0)
  })

  it('should calculate partial score correctly', () => {
    const userAnswers = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true]
    const correctAnswers = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
    
    const score = calculateScore(userAnswers, correctAnswers)
    
    expect(score).toBe(12) // 12 correct answers
  })

  it('should handle mixed true/false answers correctly', () => {
    const userAnswers = [true, false, true, false, true]
    const correctAnswers = [true, false, false, true, true]
    
    const score = calculateScore(userAnswers, correctAnswers)
    
    expect(score).toBe(3) // Positions 0, 1, and 4 are correct
  })

  it('should throw error when answer arrays have different lengths', () => {
    const userAnswers = Array(20).fill(true)
    const correctAnswers = Array(23).fill(true)
    
    expect(() => calculateScore(userAnswers, correctAnswers)).toThrow(
      'Answer arrays must have the same length'
    )
  })

  it('should handle empty arrays', () => {
    const userAnswers: boolean[] = []
    const correctAnswers: boolean[] = []
    
    const score = calculateScore(userAnswers, correctAnswers)
    
    expect(score).toBe(0)
  })
})

describe('Score Calculator - validateAnswers', () => {
  it('should validate correct answers array', () => {
    const answers = Array(23).fill(true)
    
    const result = validateAnswers(answers)
    
    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should reject non-array input', () => {
    const answers = 'not-an-array'
    
    const result = validateAnswers(answers)
    
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Format jawaban tidak valid')
  })

  it('should reject array with wrong length', () => {
    const answers = Array(20).fill(true)
    
    const result = validateAnswers(answers)
    
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Jumlah jawaban harus 23 pertanyaan')
  })

  it('should reject array with non-boolean values', () => {
    const answers = Array(23).fill(null).map((_, i) => i < 20 ? true : 'invalid')
    
    const result = validateAnswers(answers)
    
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Semua jawaban harus berupa true atau false')
  })

  it('should reject array with null values', () => {
    const answers = Array(23).fill(null)
    
    const result = validateAnswers(answers)
    
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Semua jawaban harus berupa true atau false')
  })

  it('should reject array with undefined values', () => {
    const answers = Array(23).fill(undefined)
    
    const result = validateAnswers(answers)
    
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Semua jawaban harus berupa true atau false')
  })

  it('should validate mixed true/false answers', () => {
    const answers = Array(23).fill(null).map((_, i) => i % 2 === 0)
    
    const result = validateAnswers(answers)
    
    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })
})

describe('Score Calculator - calculatePercentage', () => {
  it('should calculate 100% for perfect score', () => {
    const percentage = calculatePercentage(23, 23)
    
    expect(percentage).toBe(100)
  })

  it('should calculate 0% for zero score', () => {
    const percentage = calculatePercentage(0, 23)
    
    expect(percentage).toBe(0)
  })

  it('should calculate 50% for half score', () => {
    const percentage = calculatePercentage(12, 23)
    
    expect(percentage).toBe(52) // Rounded from 52.17%
  })

  it('should round to nearest integer', () => {
    const percentage = calculatePercentage(15, 23)
    
    expect(percentage).toBe(65) // Rounded from 65.22%
  })

  it('should handle zero total gracefully', () => {
    const percentage = calculatePercentage(0, 0)
    
    expect(percentage).toBe(0)
  })

  it('should calculate percentage for different totals', () => {
    expect(calculatePercentage(10, 20)).toBe(50)
    expect(calculatePercentage(7, 10)).toBe(70)
    expect(calculatePercentage(3, 5)).toBe(60)
  })
})
