export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const staffId = parseInt(query.staffId as string)
  
  if (!staffId) throw createError({ statusCode: 400, message: 'Staff ID required' })
  
  const schedules = await prisma.staffSchedule.findMany({
    where: { staffId }
  })
  
  return schedules
})
