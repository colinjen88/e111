export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server for now to avoid hydration mismatch if cookie reading differs
  // But Nuxt 3 useCookie works on both.
  
  const token = useCookie('auth_token')

  // If trying to access admin pages (excluding login)
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!token.value) {
      return navigateTo('/admin/login')
    }
  }

  // If already logged in and visiting login page
  if (to.path === '/admin/login' && token.value) {
    return navigateTo('/admin')
  }
})
