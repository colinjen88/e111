import { defineEventHandler, getRequestHeader, createError } from 'h3'
import { logger } from '../utils/logger'

const rateLimitMap = new Map<string, { count: number, resetTime: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute
const CLEANUP_THRESHOLD = 1000 // Cleanup when map exceeds this size
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000 // Periodic cleanup every 5 minutes

// Periodic cleanup to prevent memory leak
let lastCleanup = Date.now()

function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetTime) {
      rateLimitMap.delete(key)
    }
  }
  lastCleanup = now
}

export default defineEventHandler((event) => {
  // Simple IP-based rate limiting
  const ip = getRequestHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress || 'unknown'

  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
  } else {
    if (record.count >= MAX_REQUESTS) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`)
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests'
      })
    }
    record.count++
  }

  // Cleanup: either when map is too large or periodically
  if (rateLimitMap.size > CLEANUP_THRESHOLD || (now - lastCleanup) > CLEANUP_INTERVAL_MS) {
    cleanupExpiredEntries()
  }
})
