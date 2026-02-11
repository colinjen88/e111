import { z } from 'zod'

export const bookingSchema = z.object({
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

export const loginSchema = z.object({
  password: z.string().min(1)
})
