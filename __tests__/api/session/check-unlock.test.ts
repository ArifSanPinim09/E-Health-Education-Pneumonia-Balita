import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/session/check-unlock/route'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn()
          }))
        }))
      }))
    }))
  }))
}))

vi.mock('jose', () => ({
  jwtVerify: vi.fn()
}))

describe('Session Check Unlock API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Authentication', () => {
    it('should reject request without token', async () => {
      const request = new NextRequest('http://localhost:3000/api/session/check-unlock?day=1')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Tidak terautentikasi')
    })

    it('should reject request with invalid token', async () => {
      const { jwtVerify } = await import('jose')
      vi.mocked(jwtVerify).mockRejectedValue(new Error('Invalid token'))

      const request = new NextRequest('http://localhost:3000/api/session/check-unlock?day=1', {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      })
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Token tidak valid')
    })
  })

  describe('Parameter Validation', () => {
    it('should reject request without day parameter', async () => {
      const { jwtVerify } = await import('jose')
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { userId: 'test-user-id', email: 'test@example.com', type: 'user' },
        protectedHeader: {}
      } as any)

      const request = new NextRequest('http://localhost:3000/api/session/check-unlock', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Parameter day diperlukan')
    })

    it('should reject invalid day parameter (less than 1)', async () => {
      const { jwtVerify } = await import('jose')
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { userId: 'test-user-id', email: 'test@example.com', type: 'user' },
        protectedHeader: {}
      } as any)

      const request = new NextRequest('http://localhost:3000/api/session/check-unlock?day=0', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Day harus antara 1 dan 5')
    })

    it('should reject invalid day parameter (greater than 5)', async () => {
      const { jwtVerify } = await import('jose')
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { userId: 'test-user-id', email: 'test@example.com', type: 'user' },
        protectedHeader: {}
      } as any)

      const request = new NextRequest('http://localhost:3000/api/session/check-unlock?day=6', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Day harus antara 1 dan 5')
    })
  })

  describe('Unlock Status Calculation', () => {
    it('should return unlocked status when unlock time has passed', async () => {
      const { jwtVerify } = await import('jose')
      const { createAdminClient } = await import('@/lib/supabase/admin')
      
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { userId: 'test-user-id', email: 'test@example.com', type: 'user' },
        protectedHeader: {}
      } as any)

      const pastTime = new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
      
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: {
                    id: 'session-id',
                    user_id: 'test-user-id',
                    day: 2,
                    completed: false,
                    completed_at: null,
                    unlocked_at: pastTime,
                    created_at: pastTime
                  },
                  error: null
                })
              }))
            }))
          }))
        }))
      }
      
      vi.mocked(createAdminClient).mockReturnValue(mockSupabase as any)

      const request = new NextRequest('http://localhost:3000/api/session/check-unlock?day=2', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.unlocked).toBe(true)
      expect(data.data.remaining_ms).toBe(0)
    })

    it('should return locked status with remaining time when unlock time is in future', async () => {
      const { jwtVerify } = await import('jose')
      const { createAdminClient } = await import('@/lib/supabase/admin')
      
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { userId: 'test-user-id', email: 'test@example.com', type: 'user' },
        protectedHeader: {}
      } as any)

      const futureTime = new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString() // 2 hours from now
      
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: {
                    id: 'session-id',
                    user_id: 'test-user-id',
                    day: 2,
                    completed: false,
                    completed_at: null,
                    unlocked_at: futureTime,
                    created_at: new Date().toISOString()
                  },
                  error: null
                })
              }))
            }))
          }))
        }))
      }
      
      vi.mocked(createAdminClient).mockReturnValue(mockSupabase as any)

      const request = new NextRequest('http://localhost:3000/api/session/check-unlock?day=2', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.unlocked).toBe(false)
      expect(data.data.remaining_ms).toBeGreaterThan(0)
    })

    it('should return 404 when session not found', async () => {
      const { jwtVerify } = await import('jose')
      const { createAdminClient } = await import('@/lib/supabase/admin')
      
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { userId: 'test-user-id', email: 'test@example.com', type: 'user' },
        protectedHeader: {}
      } as any)

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: null,
                  error: null
                })
              }))
            }))
          }))
        }))
      }
      
      vi.mocked(createAdminClient).mockReturnValue(mockSupabase as any)

      const request = new NextRequest('http://localhost:3000/api/session/check-unlock?day=2', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Sesi tidak ditemukan')
    })
  })
})
