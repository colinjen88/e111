


import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {


  // Admin Auth Check
  requireAdmin(event)

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
  }
})
