import { H3Event } from 'h3'
import { logger } from './logger'

/**
 * Wrap an API handler with consistent error handling.
 * - Re-throws Nuxt/h3 errors as-is (they already have statusCode)
 * - Catches unexpected errors and returns a generic 500 (never leaks internals)
 */
export function apiHandler(
    handler: (event: H3Event) => Promise<any>
) {
    return defineEventHandler(async (event: H3Event) => {
        try {
            return await handler(event)
        } catch (error: any) {
            // Re-throw if it's already a Nuxt/h3 error with statusCode
            if (error.statusCode) {
                throw error
            }

            // Log the real error server-side
            logger.error('Unhandled API Error', error, {
                url: event.node.req.url,
                method: event.node.req.method,
            })

            // Return generic error to client (never expose internal details)
            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
            })
        }
    })
}
