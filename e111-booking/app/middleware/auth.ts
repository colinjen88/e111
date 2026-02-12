export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server for now to avoid hydration mismatch if cookie reading differs
  // But Nuxt 3 useCookie works on both.
  
  const token = useCookie('admin_session')
  
  // If trying to access admin pages (excluding login)
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    // Check if the cookie exists
    if (!token.value) {
      return navigateTo('/admin/login')
    }
  }

  // If already logged in and visiting login page
  if (to.path === '/admin/login' && token.value) {
    return navigateTo('/admin')
  }
})
