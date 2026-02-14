// Auto-imported prisma

export default defineEventHandler(async (event) => {
  const phone = getCookie(event, 'member_phone')

  if (!phone) {
    throw createError({ statusCode: 401, message: '尚未登入' })
  }

  const user = await prisma.customer.findUnique({
    where: { phone }
  })

  if (!user) {
    throw createError({ statusCode: 401, message: '用戶不存在' })
  }

  const bookings = await prisma.booking.findMany({
    where: {
      customerId: user.id
    },
    include: {
      branch: true,
      staff: true,
      items: {
        include: {
          service: true
        }
      }
    },
    orderBy: {
      startTime: 'desc'
    }
  })

  return bookings
})
