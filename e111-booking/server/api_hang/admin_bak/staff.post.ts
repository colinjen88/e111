export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, code, branchId, level, bio } = body
  
  if (!name || !branchId) {
    throw createError({ statusCode: 400, message: 'Name and Branch ID are required' })
  }
  
  try {
    const newStaff = await prisma.staff.create({
      data: {
        name,
        code: code || null,
        branchId: parseInt(branchId),
        level: level || 'Senior',
        bio: bio || null,
        isActive: true
      }
    })
    return newStaff
  } catch (error) {
    console.error('Create Staff Error:', error)
    throw createError({ statusCode: 500, message: 'Failed to create staff' })
  }
})
