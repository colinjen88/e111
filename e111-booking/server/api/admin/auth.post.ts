
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  // Simple hardcoded password for now (TODO: Move to .env)
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

  if (body.password !== ADMIN_PASSWORD) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Incorrect password'
    })
  }

  // Set a simple cookie
  // In production, use a signed HTTP-only cookie or JWT
  setCookie(event, 'auth_token', 'admin-session-token', {
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: false, // Allow JS access for simple client-side checks for now
    path: '/'
  })

  return { success: true }
})
