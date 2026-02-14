export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, isActive } = body
  
  if (!id) throw createError({ statusCode: 400, message: 'Staff ID required' })
  
  try {
    const updated = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: { isActive }
    })
    return updated
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Update failed' })
  }
})
