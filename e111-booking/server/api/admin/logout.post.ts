/**
 * POST /api/admin/logout
 * Clear admin session.
 */
import { removeSession } from '../../utils/session-store'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'admin_session')

    if (token) {
        removeSession(token)
    }

    // Clear the cookie
    setCookie(event, 'admin_session', '', {
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    })

    return { success: true }
})
