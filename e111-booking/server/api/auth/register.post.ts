// Auto-imported prisma
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { phone, password, name, email } = body

  if (!phone || !password) {
    throw createError({ statusCode: 400, message: '手機號碼與密碼為必填' })
  }

  // Check if user exists
  const existingUser = await prisma.customer.findUnique({
    where: { phone }
  })

  if (existingUser && existingUser.password) {
    throw createError({ statusCode: 409, message: '此手機號碼已註冊' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  if (existingUser) {
    // If user existed (from previous bookings) but no password, update it
    const user = await prisma.customer.update({
      where: { phone },
      data: {
        password: hashedPassword,
        name: name || existingUser.name,
        email: email || existingUser.email
      }
    })
    return { success: true, message: '會員註冊成功' }
  }

  // Create new user
  await prisma.customer.create({
    data: {
      phone,
      password: hashedPassword,
      name,
      email
    }
  })

  return { success: true, message: '會員註冊成功' }
})
