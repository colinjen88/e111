export default defineEventHandler((event) => {
  deleteCookie(event, 'staff_id')
  return { success: true }
})
