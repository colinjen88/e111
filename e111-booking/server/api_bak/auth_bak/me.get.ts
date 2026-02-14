import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const phone = getCookie(event, 'member_phone')

  if (!phone) {
    return { authenticated: false }
  }

  const user = await prisma.customer.findUnique({
    where: { phone },
    select: {
      id: true,
      phone: true,
      name: true,
      email: true,
      points: true,
      memberLevel: true
    }
  })

  if (!user) {
    return { authenticated: false }
  }

  return { 
    authenticated: true, 
    user 
  }
})
