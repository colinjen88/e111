

import { prisma } from '../../utils/prisma'
import { differenceInHours } from 'date-fns'
import { sendLinePushMessage } from '../../utils/notify'

export default defineEventHandler(async (event) => {


  try {
    const body = await readBody(event)

    const refId = parseInt(body.ref)

    if (isNaN(refId) || !body.phone) {
        throw createError({ statusCode: 400, statusMessage: 'Booking ID and phone are required.' })
    }

    // 1. Verify Request
    const booking = await prisma.booking.findFirst({
        where: { id: refId, customer: { phone: body.phone } },
        include: { customer: true }
    })

    if (!booking) {
        throw createError({ statusCode: 404, statusMessage: 'Booking not found.' })
    }

    // 2. Check Status
    if (['Cancelled', 'Completed', 'NoShow'].includes(booking.status)) {
        throw createError({ statusCode: 400, statusMessage: `Cannot cancel booking with status: ${booking.status}` })
    }

    // 3. Time Constraint (2 Hours before)
    const bookingTime = new Date(booking.startTime) // Ensure using the startTime from DB
    const now = new Date()
    // differenceInHours(bookingTime, now) returns postive number if bookingTime is future
    const hoursDiff = differenceInHours(bookingTime, now)

    if (hoursDiff < 2) {
        throw createError({ statusCode: 400, statusMessage: 'Cancellation only allowed 2+ hours before appointment.' })
    }

    // 4. Update Status
    const result = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'Cancelled' }
    })

    // 5. Notify
    try {
        await sendLinePushMessage(`[Order Cancelled by Customer] ID: ${booking.id}, Phone: ${booking.customer.phone}`)
    } catch (e) {
        console.error('Notification failed', e)
    }

    return {
        success: true,
        message: 'Booking cancelled successfully'
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message })
  } 
})
