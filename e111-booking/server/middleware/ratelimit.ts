import { defineEventHandler, getRequestHeader, createError } from 'h3'

const rateLimitMap = new Map<string, { count: number, resetTime: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute

export default defineEventHandler((event) => {
  // Simple IP-based rate limiting
  const ip = getRequestHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress || 'unknown'
  
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
  } else {
    if (record.count >= MAX_REQUESTS) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests'
      })
    }
    record.count++
  }
  
  // Cleanup old entries periodically (could be optimized)
  if (rateLimitMap.size > 10000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }
})
