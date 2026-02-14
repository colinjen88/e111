import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  try {
     // 1. Create Branches (Upsert)
    const tnn01 = await prisma.branch.upsert({
      where: { code: 'TNN01' },
      update: {},
      create: {
          name: '台南會館',
          code: 'TNN01',
          address: '台南市北區公園路123號',
          phone: '06-1234567',
          isActive: true
      }
    })

    const tnn02 = await prisma.branch.upsert({
      where: { code: 'TNN02' },
      update: {},
      create: {
          name: '中華會館',
          code: 'TNN02',
          address: '台南市永康區中華路456號',
          phone: '06-7654321',
          isActive: true
      }
    })
    
    const branches = [tnn01, tnn02]
    
    // 2. Create Service Categories (Check existing)
    let categoryBody = await prisma.serviceCategory.findFirst({ where: { name: '全身按摩' } })
    if (!categoryBody) {
      categoryBody = await prisma.serviceCategory.create({
        data: { name: '全身按摩', sortOrder: 1 }
      })
    }
    
    let categoryFoot = await prisma.serviceCategory.findFirst({ where: { name: '腳底按摩' } })
    if (!categoryFoot) {
      categoryFoot = await prisma.serviceCategory.create({
        data: { name: '腳底按摩', sortOrder: 2 }
      })
    }

    // 3. Create Services (Check existing)
    const s1Name = '全身經絡指壓 (60分)'
    let s1 = await prisma.service.findFirst({ where: { name: s1Name } })
    if (!s1) {
        await prisma.service.create({
            data: {
              categoryId: categoryBody.id,
              // Using non-null assertion or ensuring categoryBody.id is valid
              name: s1Name,
              durationMinutes: 60,
              basePrice: 1000,
              isActive: true
            }
        })
    }

    const s2Name = '漢方足底按摩 (60分)'
    let s2 = await prisma.service.findFirst({ where: { name: s2Name } })
    if (!s2) {
        await prisma.service.create({
            data: {
              categoryId: categoryFoot.id,
              name: s2Name,
              durationMinutes: 60,
              basePrice: 800,
              isActive: true
            }
        })
    }

    // 4. Create Staff (Check by code)
    // Valid bcrypt hash for 'E111@Test2026'
    const passwordHash = '$2b$10$aIZpi/mgYcN5lswcromkv.OvzToDktw0mbdvd9CPbzej7B2sB/y9q'

    let staffMei = await prisma.staff.findFirst({ where: { code: '36' } })
    if (!staffMei) {
        staffMei = await prisma.staff.create({
          data: {
            branchId: branches[0].id,
            name: '王小美',
            code: '36',
            password: passwordHash, 
            level: 'Senior',
            isActive: true
          }
        })
    } else {
        // Ensure password is set to our known hash
        await prisma.staff.update({
            where: { id: staffMei.id },
            data: { password: passwordHash }
        })
    }

    // 5. Create Default Schedules for Staff
    // Clear old schedules to prevent clashes or duplicates if logic changed
    await prisma.staffSchedule.deleteMany({ where: { staffId: staffMei.id } })
    
    const daysArr = [0, 1, 2, 3, 4, 5, 6]
    await prisma.staffSchedule.createMany({
      data: daysArr.map(d => ({
        staffId: staffMei.id,
        dayOfWeek: d,
        startTime: '10:00',
        endTime: '22:00',
        isActive: true
      }))
    })

    // 6. Create Test Member (NEW)
    const testPhone = '0912345678'
    const member = await prisma.customer.upsert({
        where: { phone: testPhone },
        update: {
            password: passwordHash, 
            name: '測試會員' // Ensure name is set
        },
        create: {
            phone: testPhone,
            password: passwordHash,
            name: '測試會員',
            email: 'test@example.com',
            memberLevel: 'Gold',
            points: 500,
            preferredBranchId: branches[0].id
        }
    })

    // 7. Create Seed Booking for Order Lookup (NEW)
    // Check if this member has any booking
    const existingBooking = await prisma.booking.findFirst({
        where: { customerId: member.id }
    })

    if (!existingBooking) {
        // Create a confirmed booking for tomorrow 14:00
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(14, 0, 0, 0)
        
        const end = new Date(tomorrow)
        end.setHours(15, 0, 0, 0)

        const booking = await prisma.booking.create({
            data: {
                branchId: branches[0].id,
                customerId: member.id,
                staffId: staffMei.id,
                bookingDate: tomorrow,
                startTime: tomorrow,
                endTime: end,
                totalPrice: 1000,
                status: 'Confirmed',
                items: {
                    create: {
                        serviceId: s1.id,
                        price: 1000,
                        staffId: staffMei.id
                    }
                }
            }
        })
        console.log(`Created Seed Booking ID: ${booking.id}`)
    } else {
        console.log(`Seed Booking already exists. ID: ${existingBooking.id}`)
    }

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
