import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Re-create schemas inline for isolated testing (no Nuxt auto-imports needed)
const bookingSchema = z.object({
  branchId: z.number().int().positive().or(z.string().regex(/^\d+$/).transform(Number)),
  serviceId: z.number().int().positive().or(z.string().regex(/^\d+$/).transform(Number)),
  staffId: z.number().int().positive().or(z.string().regex(/^\d+$/).transform(Number)).optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  user: z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(8, 'Phone number is too short'),
    email: z.string().email().optional().or(z.literal('')),
    note: z.string().optional()
  })
})

const loginSchema = z.object({
  password: z.string().min(1)
})

describe('Booking Schema Validation', () => {
  const validBooking = {
    branchId: 1,
    serviceId: 2,
    staffId: 3,
    date: '2026-02-15',
    time: '14:00',
    user: {
      name: '張三',
      phone: '0912345678',
      email: 'test@example.com',
      note: '無特殊需求'
    }
  }

  it('should accept a valid booking', () => {
    const result = bookingSchema.safeParse(validBooking)
    expect(result.success).toBe(true)
  })

  it('should accept staffId as null (no preference)', () => {
    const result = bookingSchema.safeParse({ ...validBooking, staffId: null })
    expect(result.success).toBe(true)
  })

  it('should accept staffId as undefined (omitted)', () => {
    const { staffId, ...noStaff } = validBooking
    const result = bookingSchema.safeParse(noStaff)
    expect(result.success).toBe(true)
  })

  it('should accept string IDs and transform to numbers', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      branchId: '1',
      serviceId: '2'
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.branchId).toBe(1)
      expect(result.data.serviceId).toBe(2)
    }
  })

  it('should reject invalid date format', () => {
    const result = bookingSchema.safeParse({ ...validBooking, date: '02/15/2026' })
    expect(result.success).toBe(false)
  })

  it('should reject invalid time format', () => {
    const result = bookingSchema.safeParse({ ...validBooking, time: '2pm' })
    expect(result.success).toBe(false)
  })

  it('should reject empty name', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      user: { ...validBooking.user, name: '' }
    })
    expect(result.success).toBe(false)
  })

  it('should reject short phone number', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      user: { ...validBooking.user, phone: '123' }
    })
    expect(result.success).toBe(false)
  })

  it('should accept empty email', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      user: { ...validBooking.user, email: '' }
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      user: { ...validBooking.user, email: 'not-an-email' }
    })
    expect(result.success).toBe(false)
  })
})

describe('Login Schema Validation', () => {
  it('should accept a valid password', () => {
    expect(loginSchema.safeParse({ password: 'admin123' }).success).toBe(true)
  })

  it('should reject empty password', () => {
    expect(loginSchema.safeParse({ password: '' }).success).toBe(false)
  })

  it('should reject missing password', () => {
    expect(loginSchema.safeParse({}).success).toBe(false)
  })
})
