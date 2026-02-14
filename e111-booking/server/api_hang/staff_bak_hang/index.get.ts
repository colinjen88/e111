export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const branchId = query.branchId ? parseInt(query.branchId as string) : undefined

  if (!branchId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Branch ID is required'
    })
  }
  
  try {
    const staffMembers = await prisma.staff.findMany({
      where: { 
        branchId: branchId,
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        code: true,
        level: true,
        photoUrl: true,
        bio: true,
        isActive: true
      },
      orderBy: {
        code: 'asc' // Sort by staff code or name
      }
    })
    return staffMembers
  } catch (error) {
    console.error('Error fetching staff:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
