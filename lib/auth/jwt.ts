import { SignJWT, jwtVerify } from 'jose'

// Centralized JWT secret to ensure consistency
export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface TokenPayload {
  userId: string
  email: string
  type: 'user' | 'admin'
  role?: 'admin'
  iat?: number
  exp?: number
}

export async function createUserToken(userId: string, email: string): Promise<string> {
  const token = await new SignJWT({ userId, email, type: 'user' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET)

  return token
}

export async function createAdminToken(adminId: string, email: string): Promise<string> {
  const token = await new SignJWT({ userId: adminId, email, type: 'admin', role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload }> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { valid: true, payload: payload as unknown as TokenPayload }
  } catch (error) {
    console.error('Token verification failed:', error)
    return { valid: false }
  }
}
