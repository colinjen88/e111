import { prisma } from '../../utils/prisma'
import { z } from 'zod'

const updateStatusSchema = z.object({
    bookingId: z.number().int().positive(),
    status: z.enum(['Pending', 'Confirmed', 'Cancelled', 'Completed'])
})

export default defineEventHandler(async (event) => {
    // Admin Auth Check
    requireAdmin(event)

    try {
        const body = await readBody(event)
        const { bookingId, status } = updateStatusSchema.parse(body)

        // Verify booking exists
        const existing = await prisma.booking.findUnique({
            where: { id: bookingId }
        })

        if (!existing) {
            throw createError({ statusCode: 404, statusMessage: 'Booking not found' })
        }

        // Validate status transitions
        const validTransitions: Record<string, string[]> = {
            'Pending': ['Confirmed', 'Cancelled'],
            'Confirmed': ['Completed', 'Cancelled'],
            'Cancelled': [],        // Terminal state
            'Completed': [],        // Terminal state
        }

        const allowed = validTransitions[existing.status] || []
        if (!allowed.includes(status)) {
            throw createError({
                statusCode: 400,
                statusMessage: `Cannot change status from "${existing.status}" to "${status}"`
            })
        }

        // Update
        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: { status },
            include: {
                customer: true,
                staff: true,
                branch: true,
                items: { include: { service: true } }
            }
        })

        return {
            success: true,
            booking: updated
        }

    } catch (error: any) {
        if (error.statusCode) throw error
        console.error('Status Update Error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to update booking status' })
    }
})
