
import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  // Simple Auth Check
  const token = getCookie(event, 'auth_token')
  if (token !== 'admin-session-token') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        bookingDate: 'desc', // Newest first
      },
      include: {
        branch: true,
        customer: true,
        staff: true,
        items: {
            include: {
                service: true
            }
        }
      },
      take: 50 // Limit to 50 for now
    })

    return bookings
  } catch (error) {
    console.error('Admin Fetch Error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch bookings' })
  } finally {
    await prisma.$disconnect()
  }
})
