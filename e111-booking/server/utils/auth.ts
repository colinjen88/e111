
import { H3Event, getCookie, createError } from 'h3'
import { validateSession } from './session-store'

export function requireAdmin(event: H3Event) {
  const token = getCookie(event, 'admin_session')

  if (!token || !validateSession(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
}
