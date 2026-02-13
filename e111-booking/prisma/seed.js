import { PrismaClient } from '@prisma/client'

// Try to load dotenv, but don't fail if it's missing (e.g. in production where vars are injected)
try {
    await import('dotenv/config')
} catch (e) {
    // console.log('dotenv not found, assuming variables are set in environment')
}

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    try {
        // 1. Create Branches
        const branchesData = [
            { name: '台南會館', code: 'TNN01', address: '台南市北區公園路123號', phone: '06-1234567', isActive: true },
            { name: '中華會館', code: 'TNN02', address: '台南市永康區中華路456號', phone: '06-7654321', isActive: true }
        ]

        for (const b of branchesData) {
            // Branch has @unique on code, so upsert works beautifully
            await prisma.branch.upsert({
                where: { code: b.code },
                update: {},
                create: b
            })
        }

        // Fetch branches to get IDs
        const branches = await prisma.branch.findMany({ where: { code: { in: ['TNN01', 'TNN02'] } } })
        const branchMap = {}
        branches.forEach(b => {
            if (b.code) branchMap[b.code] = b
        })

        // 2. Create Service Categories
        const categoriesData = [
            { name: '全身按摩', sortOrder: 1 },
            { name: '腳底按摩', sortOrder: 2 }
        ]

        const categories = []
        for (const c of categoriesData) {
            let cat = await prisma.serviceCategory.findFirst({ where: { name: c.name } })
            if (!cat) {
                cat = await prisma.serviceCategory.create({ data: c })
            }
            categories.push(cat)
        }

        const categoryBody = categories.find(c => c.name === '全身按摩')
        const categoryFoot = categories.find(c => c.name === '腳底按摩')

        // 3. Create Services
        if (categoryBody && categoryFoot) {
            const servicesData = [
                { categoryId: categoryBody.id, name: '全身經絡指壓 (60分)', durationMinutes: 60, basePrice: 1000, isActive: true },
                { categoryId: categoryFoot.id, name: '漢方足底按摩 (60分)', durationMinutes: 60, basePrice: 800, isActive: true }
            ]

            for (const s of servicesData) {
                const exists = await prisma.service.findFirst({
                    where: { name: s.name, categoryId: s.categoryId }
                })
                if (!exists) {
                    await prisma.service.create({ data: s })
                }
            }
        }

        // 4. Create Staff
        if (branchMap['TNN01']) {
            const staffData = {
                branchId: branchMap['TNN01'].id,
                name: '王小美',
                code: '36',
                level: 'Senior',
                isActive: true
            }

            const staffExists = await prisma.staff.findFirst({
                where: { name: staffData.name, branchId: staffData.branchId }
            })

            if (!staffExists) {
                await prisma.staff.create({ data: staffData })
            }
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
