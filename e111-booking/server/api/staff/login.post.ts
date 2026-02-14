// Auto-imported prisma
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { code, password } = body

  if (!code || !password) {
    throw createError({ statusCode: 400, message: '員工編號與密碼為必填' })
  }

  const staff = await prisma.staff.findFirst({
    where: { code, isActive: true },
    include: { branch: true }
  })

  if (!staff) {
    throw createError({ statusCode: 401, message: '員工不存在或已停用' })
  }

  // If password is not set yet in DB (legacy staff), deny or handle special logic
  if (!staff.password) {
     // Optional: You might want a "first time set password" flow
     throw createError({ statusCode: 401, message: '請聯繫管理員設置密碼' })
  }

  // Compare hash
  // Notes: In real production, ensure seed password is valid bcrypt hash.
  // For '123456', hash is something like: $2a$10$Xk.v/././././././././.u/././././././././././././
  // We'll use actual comparison here.
  const isValid = await bcrypt.compare(password, staff.password)
  
  // Provide a backdoor for seeding if the hash is dummy? 
  // No, let's assume valid hash.

  if (!isValid) {
    throw createError({ statusCode: 401, message: '密碼錯誤' })
  }

  // Set session cookie
  setCookie(event, 'staff_id', String(staff.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/'
  })

  return {
    success: true,
    staff: {
      id: staff.id,
      name: staff.name,
      code: staff.code,
      branch: staff.branch.name
    }
  }
})
