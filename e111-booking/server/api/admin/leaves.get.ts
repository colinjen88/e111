import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const leaves = await prisma.staffLeave.findMany({
      include: {
        staff: {
          select: {
            name: true,
            code: true,
            branch: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })
    return leaves
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Failed to fetch leaves' })
  }
})
