import { describe, test, expect } from 'vitest'
import { bookingSchema } from '../server/utils/schemas'

describe('Booking Schema Validation', () => {
  test('valid booking data should pass', () => {
    const validData = {
      branchId: 1,
      serviceId: 1,
      staffId: 1,
      date: '2026-05-20',
      time: '14:00',
      user: {
        name: 'Test Users',
        phone: '0912345678',
        email: 'test@example.com',
        note: 'Test note'
      }
    }
    const result = bookingSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  test('invalid phone number should fail', () => {
    const invalidData = {
      branchId: 1,
      serviceId: 1,
      date: '2026-05-20',
      time: '14:00',
      user: {
        name: 'Test User',
        phone: '123', // Too short
        email: 'test@example.com'
      }
    }
    const result = bookingSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  test('missing required fields should fail', () => {
    const invalidData = {
      // Missing branchId
      serviceId: 1,
      date: '2026-05-20',
      time: '14:00',
      user: {
        name: 'Test User',
        phone: '0912345678'
      }
    }
    const result = bookingSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
