import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  
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
  } finally {
    await prisma.$disconnect()
  }
})
