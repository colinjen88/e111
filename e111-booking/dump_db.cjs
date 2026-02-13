
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const branches = await prisma.branch.findMany()
    console.log('Branches:', branches)

    const services = await prisma.service.findMany()
    console.log('Services:', services)

    const staffs = await prisma.staff.findMany({ take: 2 })
    console.log('Staffs:', staffs)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
