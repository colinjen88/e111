

import { prisma } from '../../utils/prisma'

  
  try {
    // 取得所有啟用的分類，並包含其下的啟用服務
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            durationMinutes: true,
            basePrice: true,
            description: true
          }
        }
      }
    })
    return categories
  } catch (error) {
    console.error('Error fetching services:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
