
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const booking = await prisma.booking.findFirst({
    orderBy: { createdAt: 'desc' }
  })
  console.log('Latest Booking ID:', booking?.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
