import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  try {
     // 1. Create Branches
    const branches = await Promise.all([
      prisma.branch.create({
        data: {
          name: '台南會館',
          code: 'TNN01',
          address: '台南市北區公園路123號',
          phone: '06-1234567',
          isActive: true
        }
      }),
      prisma.branch.create({
        data: {
          name: '中華會館',
          code: 'TNN02',
          address: '台南市永康區中華路456號',
          phone: '06-7654321',
          isActive: true
        }
      })
    ])

    // 2. Create Service Categories
    const categoryBody = await prisma.serviceCategory.create({
      data: { name: '全身按摩', sortOrder: 1 }
    })
    const categoryFoot = await prisma.serviceCategory.create({
      data: { name: '腳底按摩', sortOrder: 2 }
    })

    // 3. Create Services
    await prisma.service.createMany({
      data: [
        {
          categoryId: categoryBody.id,
          name: '全身經絡指壓 (60分)',
          durationMinutes: 60,
          basePrice: 1000,
          isActive: true
        },
        {
          categoryId: categoryFoot.id,
          name: '漢方足底按摩 (60分)',
          durationMinutes: 60,
          basePrice: 800,
          isActive: true
        }
      ]
    })

    // 4. Create Staff
    await prisma.staff.create({
      data: {
        branchId: branches[0].id,
        name: '王小美',
        code: '36',
        level: 'Senior',
        isActive: true
      }
    })

    console.log('Seeding finished.')
  } catch (e) {
    console.error('Seeding error:', e)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
