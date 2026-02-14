// Auto-imported prisma

export default defineEventHandler(async (event) => {
  const staffId = getCookie(event, 'staff_id')
  if (!staffId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  // Get upcoming requests, sorted by time
  const bookings = await prisma.booking.findMany({
    where: { 
      staffId: parseInt(staffId),
      startTime: {
        gte: new Date() // Future only? or maybe past 7 days? Let's show today+
      }
    },
    include: {
      customer: true,
      items: { include: { service: true } }
    },
    orderBy: { startTime: 'asc' }
  })
  
  return bookings
})
