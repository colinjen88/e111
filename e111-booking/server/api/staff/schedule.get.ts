import { startOfWeek, endOfWeek, addDays, format, getDay } from 'date-fns'

export default defineEventHandler(async (event) => {
  // 1. Auth Check
  const staff = event.context.staff
  if (!staff) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // 2. Date Range (Current Week)
  // Default to today, or query param date
  const today = new Date()
  const start = startOfWeek(today, { weekStartsOn: 1 }) // Monday
  const end = endOfWeek(today, { weekStartsOn: 1 })

  // 3. Fetch Base Schedule (Fixed Shifts)
  const baseSchedules = await prisma.staffSchedule.findMany({
    where: {
      staffId: staff.id,
      isActive: true
    }
  })

  // 4. Fetch Bookings (Assignments)
  const bookings = await prisma.booking.findMany({
    where: {
      AND: [
        {
            OR: [
                { staffId: staff.id }, // Main staff
                { items: { some: { staffId: staff.id } } } // Item staff
            ]
        },
        { startTime: { gte: start } },
        { startTime: { lte: end } },
        { status: { not: 'Cancelled' } }
      ]
    },
    include: {
        items: true
    }
  })

  // 5. Build Response
  const result = []
  
  // Loop 7 days from start
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(start, i)
    const dayIndex = getDay(currentDate) // 0=Sun, 1=Mon...

    // Find base schedule
    const schedule = baseSchedules.find(s => s.dayOfWeek === dayIndex)
    
    // Find bookings for this day
    const dayBookings = bookings.filter(b => {
        const bDate = new Date(b.startTime)
        return bDate.getDate() === currentDate.getDate() && 
               bDate.getMonth() === currentDate.getMonth() &&
               bDate.getFullYear() === currentDate.getFullYear()
    })

    // Calculate Slots (Simple count for now, or duration based)
    // Let's count people served (bookings)
    const slots = dayBookings.length

    result.push({
        date: currentDate,
        dayIndex,
        type: schedule ? 'work' : 'off',
        time: schedule ? `${schedule.startTime} - ${schedule.endTime}` : '休假',
        slots: slots
    })
  }

  return {
    success: true,
    data: result,
    range: {
        start,
        end
    },
    meta: {
        totalHours: 42, // Hardcoded for simplified version or calc from schedule
        totalCustomers: result.reduce((acc, curr) => acc + curr.slots, 0)
    }
  }
})
