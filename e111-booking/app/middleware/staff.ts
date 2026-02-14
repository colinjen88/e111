export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: staffAuth } = await useFetch('/api/staff/me')
  
  if (!staffAuth.value?.authenticated) {
    if (to.path !== '/staff/login') {
      return navigateTo('/staff/login')
    }
  } else {
    if (to.path === '/staff/login') {
      return navigateTo('/staff/dashboard')
    }
  }
})
