// Auto-imported prisma

export default defineEventHandler(async (event) => {
  const staffId = getCookie(event, 'staff_id')
  
  if (!staffId) return { authenticated: false }

  const staff = await prisma.staff.findUnique({
    where: { id: parseInt(staffId) },
    include: { branch: true }
  })

  if (!staff) return { authenticated: false }

  return { 
    authenticated: true, 
    staff: {
      id: staff.id,
      name: staff.name,
      code: staff.code,
      level: staff.level,
      branch: staff.branch.name
    }
  }
})
