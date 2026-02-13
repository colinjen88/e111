/**
 * In-memory session store for admin authentication.
 * 
 * In production with multiple instances, replace with Redis or DB-backed sessions.
 * For a single-process deployment (which this app uses), in-memory is sufficient.
 */

interface SessionEntry {
    token: string
    createdAt: number
    expiresAt: number
}

const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours (matches cookie maxAge)
const sessions = new Map<string, SessionEntry>()

/**
 * Add a new session token.
 */
export function addSession(token: string): void {
    const now = Date.now()
    sessions.set(token, {
        token,
        createdAt: now,
        expiresAt: now + SESSION_TTL_MS,
    })

    // Cleanup expired sessions periodically (keep map small)
    if (sessions.size > 100) {
        cleanupExpiredSessions()
    }
}

/**
 * Validate a session token. Returns true if the token is valid and not expired.
 */
export function validateSession(token: string): boolean {
    const session = sessions.get(token)
    if (!session) return false

    if (Date.now() > session.expiresAt) {
        sessions.delete(token)
        return false
    }

    return true
}

/**
 * Remove a session token (e.g., on logout).
 */
export function removeSession(token: string): void {
    sessions.delete(token)
}

/**
 * Remove all expired sessions.
 */
function cleanupExpiredSessions(): void {
    const now = Date.now()
    for (const [key, session] of sessions.entries()) {
        if (now > session.expiresAt) {
            sessions.delete(key)
        }
    }
}
