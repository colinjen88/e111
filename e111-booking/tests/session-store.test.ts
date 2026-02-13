import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { addSession, validateSession, removeSession } from '../server/utils/session-store'

describe('Session Store', () => {
    const testToken = 'test-session-token-abc123'

    beforeEach(() => {
        // Clean state: remove any leftover tokens
        removeSession(testToken)
    })

    it('should add and validate a session', () => {
        addSession(testToken)
        expect(validateSession(testToken)).toBe(true)
    })

    it('should reject an unknown token', () => {
        expect(validateSession('unknown-token')).toBe(false)
    })

    it('should remove a session on logout', () => {
        addSession(testToken)
        expect(validateSession(testToken)).toBe(true)

        removeSession(testToken)
        expect(validateSession(testToken)).toBe(false)
    })

    it('should reject an expired session', () => {
        // Manually add a session that's already expired
        addSession(testToken)

        // Fast-forward time past the TTL (8 hours)
        const realDateNow = Date.now
        Date.now = () => realDateNow() + 9 * 60 * 60 * 1000 // 9 hours later

        expect(validateSession(testToken)).toBe(false)

        // Restore
        Date.now = realDateNow
    })

    it('should handle multiple sessions independently', () => {
        const token1 = 'session-1'
        const token2 = 'session-2'

        addSession(token1)
        addSession(token2)

        expect(validateSession(token1)).toBe(true)
        expect(validateSession(token2)).toBe(true)

        removeSession(token1)
        expect(validateSession(token1)).toBe(false)
        expect(validateSession(token2)).toBe(true)

        // Cleanup
        removeSession(token2)
    })
})
