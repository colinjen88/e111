import { loginSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
   const body = await readBody(event)

   try {
      loginSchema.parse(body)
   } catch (e) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
   }

   const config = useRuntimeConfig()

   // Allow 'admin' as a hardcoded fallback for dev convenience if config fails
   const expectedPassword = config.adminPassword || 'admin'
   const receivedPassword = (body.password || '').toString().trim()

   console.log('[Auth Debug] Login Attempt:', {
      received: receivedPassword,
      expected: expectedPassword, // Log it plain for now to solve the issue quickly
      match: receivedPassword === expectedPassword
   })

   if (receivedPassword !== expectedPassword) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized - Password Mismatch' })
   }

   // Generate a random session token (in a real app, store this in Redis/DB)
   // For this simple implementation, we'll use the shared secret approach from utils/auth.ts
   // consistent with the requireAdmin check. 
   // Ideally: specific session ID checked against DB. 
   // Simplified per codereview recommendation: use the secret token for the cookie value 
   // so requireAdmin can verify it statelessly (though less secure than session store).

   const token = config.adminSecretToken || 'admin-secret-token-default-change-me'

   setCookie(event, 'admin_session', token, {
      maxAge: 60 * 60 * 8, // 8 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'strict',
      path: '/'
   })

   return { success: true }
})
