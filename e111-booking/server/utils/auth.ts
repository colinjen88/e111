
import { H3Event, getCookie, createError } from 'h3'

export function requireAdmin(event: H3Event) {
  const token = getCookie(event, 'admin_session')
  const config = useRuntimeConfig()
  const ADMIN_TOKEN = config.adminSecretToken || 'admin-secret-token-default-change-me'
  
  if (!token || token !== ADMIN_TOKEN) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Unauthorized' 
    })
  }
}
