import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { staffId, startDate, endDate, type, reason } = body

  if (!staffId || !startDate || !endDate || !type) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  try {
    const leave = await prisma.staffLeave.create({
      data: {
        staffId: parseInt(staffId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        reason: reason || null,
        status: 'Approved' // Admin created leaves are approved by default
      }
    })
    return leave
  } catch (error) {
    console.error('Create Leave Error:', error)
    throw createError({ statusCode: 500, message: 'Failed to create leave record' })
  }
})
