import { prisma } from '../../utils/prisma'

  
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        lineUrl: true,
        isActive: true
      }
    })
    return branches
  } catch (error) {
    console.error('Error fetching branches:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
