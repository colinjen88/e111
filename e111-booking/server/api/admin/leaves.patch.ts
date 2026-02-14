import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, status, action } = body

  if (!id) throw createError({ statusCode: 400, message: 'ID required' })

  try {
    if (action === 'delete') {
      await prisma.staffLeave.delete({
        where: { id: parseInt(id) }
      })
      return { success: true }
    }

    const updated = await prisma.staffLeave.update({
      where: { id: parseInt(id) },
      data: { status }
    })
    return updated
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Update failed' })
  }
})
