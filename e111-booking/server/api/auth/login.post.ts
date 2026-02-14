// Auto-imported prisma
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { phone, password } = body

  if (!phone || !password) {
    throw createError({ statusCode: 400, message: '手機號碼與密碼為必填' })
  }

  const user = await prisma.customer.findUnique({
    where: { phone }
  })

  if (!user || !user.password) {
    throw createError({ statusCode: 401, message: '手機號碼或密碼錯誤' })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw createError({ statusCode: 401, message: '手機號碼或密碼錯誤' })
  }

  // Set session cookie (Phone number as basic identifier)
  setCookie(event, 'member_phone', user.phone, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  return { 
    success: true, 
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      points: user.points,
      memberLevel: user.memberLevel
    }
  }
})
