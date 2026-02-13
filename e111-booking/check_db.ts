import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const branchCount = await prisma.branch.count()
    console.log(`Branch count: ${branchCount}`)
    const branches = await prisma.branch.findMany()
    console.log(`Branches: ${JSON.stringify(branches, null, 2)}`)

    const serviceCount = await prisma.service.count()
    console.log(`Service count: ${serviceCount}`)
  } catch (e) {
    console.error('Error connecting to DB:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
