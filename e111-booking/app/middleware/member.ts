export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: memberAuth } = await useFetch('/api/auth/me')
  
  if (!memberAuth.value?.authenticated) {
    return navigateTo('/member/login')
  }
})
