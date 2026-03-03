import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/test/submit-post/route'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/auth/verify-token', () => ({
  verifyUserToken: vi.fn(),
}))

describe('Post-Test API - Score Calculation and Pre-Test Comparison', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should calculate post-test score and return pre-test score for comparison', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    const { verifyUserToken } = await import('@/lib/auth/verify-token')

    // Mock authentication
    vi.mocked(verifyUserToken).mockResolvedValue({ 
      userId: 'test-user-id',
      email: 'test@example.com',
      type: 'user' as const,
      iat: Date.now(),
      exp: Date.now() + 3600000
    })

    // Mock correct answers (all true for simplicity)
    const correctAnswers = Array(23).fill(true).map((_, i) => ({
      correct_answer: true,
      order_number: i + 1,
    }))

    let callCount = 0
    const mockSupabase = {
      from: vi.fn((table: string) => {
        callCount++
        // First call: check existing post-test submission
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }
        }
        // Second call: fetch quiz questions
        if (callCount === 2) {
          return {
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            returns: vi.fn().mockResolvedValue({ data: correctAnswers, error: null }),
          }
        }
        // Third call: fetch pre-test score
        if (callCount === 3) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ 
              data: { score: 15 }, 
              error: null 
            }),
          }
        }
        // Fourth call: insert post-test submission
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        }
      }),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    // Create request with all correct answers
    const userAnswers = Array(23).fill(true)
    const request = new NextRequest('http://localhost:3000/api/test/submit-post', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: userAnswers }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.score).toBe(23) // Post-test score
    expect(data.pre_score).toBe(15) // Pre-test score
  })

  it('should calculate score correctly when some answers are wrong', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    const { verifyUserToken } = await import('@/lib/auth/verify-token')

    vi.mocked(verifyUserToken).mockResolvedValue({ 
      userId: 'test-user-id',
      email: 'test@example.com',
      type: 'user' as const,
      iat: Date.now(),
      exp: Date.now() + 3600000
    })

    // Mock correct answers (alternating true/false)
    const correctAnswers = Array(23).fill(null).map((_, i) => ({
      correct_answer: i % 2 === 0,
      order_number: i + 1,
    }))

    let callCount = 0
    const mockSupabase = {
      from: vi.fn((table: string) => {
        callCount++
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }
        }
        if (callCount === 2) {
          return {
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            returns: vi.fn().mockResolvedValue({ data: correctAnswers, error: null }),
          }
        }
        if (callCount === 3) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ 
              data: { score: 10 }, 
              error: null 
            }),
          }
        }
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        }
      }),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    // User answers all true (will get 12 correct out of 23)
    const userAnswers = Array(23).fill(true)
    const request = new NextRequest('http://localhost:3000/api/test/submit-post', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: userAnswers }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.score).toBe(12) // 12 even-indexed questions are correct
    expect(data.pre_score).toBe(10)
  })
})

describe('Post-Test API - Answer Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should reject request without authorization header', async () => {
    const request = new NextRequest('http://localhost:3000/api/test/submit-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: Array(23).fill(true) }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Token autentikasi tidak ditemukan')
  })

  it('should reject request with invalid token', async () => {
    const { verifyUserToken } = await import('@/lib/auth/verify-token')
    vi.mocked(verifyUserToken).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/test/submit-post', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: Array(23).fill(true) }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Token tidak valid atau kadaluarsa')
  })

  it('should reject answers that are not an array', async () => {
    const { verifyUserToken } = await import('@/lib/auth/verify-token')
    vi.mocked(verifyUserToken).mockResolvedValue({ 
      userId: 'test-user-id',
      email: 'test@example.com',
      type: 'user' as const,
      iat: Date.now(),
      exp: Date.now() + 3600000
    })

    const request = new NextRequest('http://localhost:3000/api/test/submit-post', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: 'not-an-array' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Format jawaban tidak valid')
  })

  it('should reject answers with incorrect length', async () => {
    const { verifyUserToken } = await import('@/lib/auth/verify-token')
    vi.mocked(verifyUserToken).mockResolvedValue({ 
      userId: 'test-user-id',
      email: 'test@example.com',
      type: 'user' as const,
      iat: Date.now(),
      exp: Date.now() + 3600000
    })

    const request = new NextRequest('http://localhost:3000/api/test/submit-post', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: Array(20).fill(true) }), // Only 20 answers
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Jumlah jawaban harus 23 pertanyaan')
  })

  it('should reject answers with non-boolean values', async () => {
    const { verifyUserToken } = await import('@/lib/auth/verify-token')
    vi.mocked(verifyUserToken).mockResolvedValue({ 
      userId: 'test-user-id',
      email: 'test@example.com',
      type: 'user' as const,
      iat: Date.now(),
      exp: Date.now() + 3600000
    })

    const invalidAnswers = Array(23).fill(null).map((_, i) => i < 20 ? true : 'invalid')

    const request = new NextRequest('http://localhost:3000/api/test/submit-post', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: invalidAnswers }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Semua jawaban harus berupa true atau false')
  })

  it('should reject duplicate post-test submission', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    const { verifyUserToken } = await import('@/lib/auth/verify-token')

    vi.mocked(verifyUserToken).mockResolvedValue({ 
      userId: 'test-user-id',
      email: 'test@example.com',
      type: 'user' as const,
      iat: Date.now(),
      exp: Date.now() + 3600000
    })

    // Mock existing submission
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: { id: 'existing-submission-id' }, 
        error: null 
      }),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const request = new NextRequest('http://localhost:3000/api/test/submit-post', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: Array(23).fill(true) }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Post-test sudah pernah dikerjakan')
  })

  it('should reject post-test if pre-test not completed', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    const { verifyUserToken } = await import('@/lib/auth/verify-token')

    vi.mocked(verifyUserToken).mockResolvedValue({ 
      userId: 'test-user-id',
      email: 'test@example.com',
      type: 'user' as const,
      iat: Date.now(),
      exp: Date.now() + 3600000
    })

    const correctAnswers = Array(23).fill(true).map((_, i) => ({
      correct_answer: true,
      order_number: i + 1,
    }))

    let callCount = 0
    const mockSupabase = {
      from: vi.fn((table: string) => {
        callCount++
        // First call: check existing post-test submission
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }
        }
        // Second call: fetch quiz questions
        if (callCount === 2) {
          return {
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            returns: vi.fn().mockResolvedValue({ data: correctAnswers, error: null }),
          }
        }
        // Third call: fetch pre-test score (not found)
        if (callCount === 3) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ 
              data: null, 
              error: { message: 'Not found' }
            }),
          }
        }
        return mockSupabase
      }),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const request = new NextRequest('http://localhost:3000/api/test/submit-post', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: Array(23).fill(true) }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Pre-test belum dikerjakan')
  })
})
