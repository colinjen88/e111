import { loginSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
   const body = await readBody(event)

   try {
      loginSchema.parse(body)
   } catch (e) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
   }

   const config = useRuntimeConfig()

   const expectedPassword = config.adminPassword
   if (!expectedPassword) {
      throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
   }

   const receivedPassword = (body.password || '').toString().trim()

   if (receivedPassword !== expectedPassword) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
   }

   // Generate a random session token for this login
   const { randomBytes } = await import('crypto')
   const sessionToken = randomBytes(32).toString('hex')

   // Store token server-side for validation
   const { addSession } = await import('../../utils/session-store')
   addSession(sessionToken)

   setCookie(event, 'admin_session', sessionToken, {
      maxAge: 60 * 60 * 8, // 8 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
   })

   return { success: true }
})
