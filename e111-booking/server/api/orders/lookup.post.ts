
import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  try {
    const body = await readBody(event)

    const refId = parseInt(body.ref)
    
    if (isNaN(refId) || !body.phone) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID and phone number are required.'
      })
    }

    // Find booking by ID and phone
    const booking = await prisma.booking.findFirst({
      where: {
        id: refId,
        customer: {
          phone: body.phone
        }
      },
      include: {
          customer: true,
          branch: true,
          staff: true,
          items: {
            include: {
              service: true,
              staff: true
            }
          }
      }
    })

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Booking not found or phone number does not match.'
      })
    }

    // Mask customer phone for privacy
    // Only show last 3 digits? Or replace middle. 0912345678 -> 0912***678
    const maskedPhone = booking.customer.phone.replace(/(\d{4})\d{3}(\d{3})/, '$1***$2')
    
    // Format response explicitly to avoid exposing sensitive PII unknowingly
    return {
      success: true,
      data: {
        id: booking.id,
        status: booking.status,
        date: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalPrice: booking.totalPrice,
        branchName: booking.branch.name,
        staffName: booking.staff?.name || 'Any Staff',
        customerName: booking.customer.name,
        customerPhone: maskedPhone,
        items: booking.items.map(item => ({
            serviceName: item.service.name,
            price: item.price,
            staffName: item.staff?.name
        }))
      }
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message })
  } finally {
    await prisma.$disconnect()
  }
})
