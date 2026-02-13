import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const dateStr = query.date as string
  const branchId = query.branchId ? parseInt(query.branchId as string) : undefined
  const staffId = query.staffId ? parseInt(query.staffId as string) : undefined
  const durationMinutes = query.duration ? parseInt(query.duration as string) : 60

  if (!dateStr || !branchId) {
    throw createError({ statusCode: 400, statusMessage: 'Date and Branch ID required' })
  }

  try {
    // 1. Define Operating Hours
    const openTime = '10:00'
    const closeTime = '22:00'
    const slotInterval = 30 // minutes

    // 2. Generate all potential slots for the day
    const allSlots: string[] = []
    let current = new Date(`${dateStr}T${openTime}:00`)
    const end = new Date(`${dateStr}T${closeTime}:00`)
    const lastStart = new Date(end.getTime() - durationMinutes * 60000)

    while (current <= lastStart) {
      const timeStr = current.toTimeString().slice(0, 5) // "HH:MM"
      allSlots.push(timeStr)
      current = new Date(current.getTime() + slotInterval * 60000)
    }

    // 3. Fetch existing bookings for that day
    const startOfDay = new Date(`${dateStr}T00:00:00`)
    const endOfDay = new Date(`${dateStr}T23:59:59`)

    const whereClause: any = {
      branchId: branchId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: {
        not: 'Cancelled'
      }
    }

    if (staffId) {
      whereClause.staffId = staffId
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      select: {
        startTime: true,
        endTime: true,
        staffId: true
      }
    })

    const totalStaff = await prisma.staff.count({
      where: { branchId, isActive: true }
    })

    // 4. Calculate availability for each slot
    const blocks = allSlots.map((slotTime) => {
      const slotStart = new Date(`${dateStr}T${slotTime}:00`)
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000)

      let isAvailable = true

      if (staffId) {
        // Case A: Specific Staff Selected
        const conflict = bookings.find(b => {
          return (b.startTime < slotEnd && b.endTime > slotStart)
        })
        if (conflict) isAvailable = false

      } else {
        // Case B: No Preference (Any Staff)
        const busyStaffIds = new Set()
        bookings.forEach(b => {
          if (b.startTime < slotEnd && b.endTime > slotStart) {
            if (b.staffId) busyStaffIds.add(b.staffId)
          }
        })

        if (busyStaffIds.size >= totalStaff) {
          isAvailable = false
        }
      }

      return {
        time: slotTime,
        available: isAvailable
      }
    })

    return {
      date: dateStr,
      blocks
    }

  } catch (error) {
    console.error('Availability Error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Check Availability Failed' })
  }
})
