
import { H3Event, getCookie, createError } from 'h3'

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'admin-secret-token-default-change-me'

export function requireAdmin(event: H3Event) {
  const token = getCookie(event, 'admin_session')
  
  if (!token || token !== ADMIN_TOKEN) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Unauthorized' 
    })
  }
}
