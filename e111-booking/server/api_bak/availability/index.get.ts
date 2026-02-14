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

    const startOfDay = new Date(`${dateStr}T00:00:00`)
    const endOfDay = new Date(`${dateStr}T23:59:59`)

    // 3. Fetch all active staff for the branch with their schedules and leaves
    const staffMembers = await prisma.staff.findMany({
      where: { 
        branchId, 
        isActive: true,
        ...(staffId ? { id: staffId } : {})
      },
      include: {
        schedules: {
          where: { 
            dayOfWeek: new Date(dateStr).getDay(),
            isActive: true 
          }
        },
        leaves: {
          where: {
            startDate: { lte: endOfDay },
            endDate: { gte: startOfDay },
            status: 'Approved'
          }
        }
      }
    })

    // 3b. Fetch existing bookings for that day
    const bookings = await prisma.booking.findMany({
      where: {
        branchId,
        startTime: { gte: startOfDay, lte: endOfDay },
        status: { not: 'Cancelled' }
      }
    })

    // 4. Calculate availability for each slot
    const blocks = allSlots.map((slotTime) => {
      const slotStart = new Date(`${dateStr}T${slotTime}:00`)
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000)

      // Find staff who are working during this slot
      const availableStaff = staffMembers.filter(s => {
        // A. Is on leave?
        const onLeave = s.leaves.some(l => {
          // Normalize leave end date to the end of that day (23:59:59)
          const leaveEnd = new Date(l.endDate)
          leaveEnd.setHours(23, 59, 59, 999)
          
          return (l.startDate <= slotStart && leaveEnd >= slotEnd)
        })
        if (onLeave) return false

        // B. Is working today? (Check schedule)
        const schedule = s.schedules[0]
        if (!schedule) return false // No schedule = not working

        // Parse schedule times (HH:mm)
        const [schStartH, schStartM] = schedule.startTime.split(':').map(Number)
        const [schEndH, schEndM] = schedule.endTime.split(':').map(Number)
        
        const workStart = new Date(slotStart)
        workStart.setHours(schStartH, schStartM, 0, 0)
        
        const workEnd = new Date(slotStart)
        workEnd.setHours(schEndH, schEndM, 0, 0)

        const isWorking = slotStart >= workStart && slotEnd <= workEnd
        if (!isWorking) return false

        // C. Has a booking conflict?
        const hasConflict = bookings.some(b => {
          return b.staffId === s.id && (b.startTime < slotEnd && b.endTime > slotStart)
        })
        
        return !hasConflict
      })

      return {
        time: slotTime,
        available: availableStaff.length > 0
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
