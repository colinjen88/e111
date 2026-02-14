import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Authentication check is handled by middleware, but we can verify session here if needed
  
  try {
    const staff = await prisma.staff.findMany({
      include: {
        branch: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        { branchId: 'asc' },
        { code: 'asc' }
      ]
    })
    
    return staff
  } catch (error) {
    console.error('Admin Staff Fetch Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch staff list'
    })
  }
})
