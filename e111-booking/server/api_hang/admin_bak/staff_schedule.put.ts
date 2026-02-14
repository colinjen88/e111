export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { staffId, schedules } = body // schedules: Array<{ dayOfWeek, startTime, endTime, isActive }>
  
  if (!staffId) throw createError({ statusCode: 400, message: 'Staff ID required' })
  
  try {
    // Transaction to update all at once
    await prisma.$transaction(
      schedules.map((s: any) => 
        prisma.staffSchedule.upsert({
          where: {
            staffId_dayOfWeek: {
              staffId: parseInt(staffId),
              dayOfWeek: s.dayOfWeek
            }
          },
          update: {
            startTime: s.startTime,
            endTime: s.endTime,
            isActive: s.isActive
          },
          create: {
            staffId: parseInt(staffId),
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            isActive: s.isActive
          }
        })
      )
    )
    return { success: true }
  } catch (error) {
    console.error('Update Schedule Error:', error)
    throw createError({ statusCode: 500, message: 'Failed to update schedule' })
  }
})
