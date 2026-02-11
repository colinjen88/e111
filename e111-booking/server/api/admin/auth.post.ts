import { loginSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
     loginSchema.parse(body)
  } catch (e) {
     throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }
  
  const config = useRuntimeConfig()
  
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
  if (body.password !== ADMIN_PASSWORD) {
     throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Generate a random session token (in a real app, store this in Redis/DB)
  // For this simple implementation, we'll use the shared secret approach from utils/auth.ts
  // consistent with the requireAdmin check. 
  // Ideally: specific session ID checked against DB. 
  // Simplified per codereview recommendation: use the secret token for the cookie value 
  // so requireAdmin can verify it statelessly (though less secure than session store).
  
  const token = process.env.ADMIN_SECRET_TOKEN || 'admin-secret-token-default-change-me'

  setCookie(event, 'admin_session', token, {
    maxAge: 60 * 60 * 8, // 8 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'strict',
    path: '/'
  })

  return { success: true }
})
