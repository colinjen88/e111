export default defineEventHandler(async (event) => {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  
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
  } finally {
    // In serverless/dev, disconnecting per request is safer to avoid connection limit issues, 
    // though for SQLite it matters less.
    await prisma.$disconnect()
  }
})
