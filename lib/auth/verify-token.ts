import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface TokenPayload {
  userId?: string
  adminId?: string
  email: string
  type: 'user' | 'admin'
  iat: number
  exp: number
}

export async function verifyUserToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    if (payload.type !== 'user') {
      return null
    }

    return payload as unknown as TokenPayload
  } catch (error) {
    return null
  }
}

export async function verifyAdminToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    if (payload.type !== 'admin') {
      return null
    }

    return payload as unknown as TokenPayload
  } catch (error) {
    return null
  }
}

export async function verifyAnyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as TokenPayload
  } catch (error) {
    return null
  }
}
