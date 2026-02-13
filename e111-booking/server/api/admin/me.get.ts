/**
 * GET /api/admin/me
 * Check if the current user has a valid admin session.
 * Used by client-side middleware to verify auth status.
 */
export default defineEventHandler(async (event) => {
    try {
        requireAdmin(event)
        return { authenticated: true }
    } catch {
        return { authenticated: false }
    }
})
