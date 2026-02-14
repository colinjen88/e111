export default defineEventHandler((event) => {
  deleteCookie(event, 'member_phone')
  return { success: true }
})
