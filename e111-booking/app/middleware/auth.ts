export default defineNuxtRouteMiddleware(async (to, from) => {
  // If trying to access admin pages (excluding login)
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    try {
      const { authenticated } = await $fetch('/api/admin/me')
      if (!authenticated) {
        return navigateTo('/admin/login')
      }
    } catch {
      return navigateTo('/admin/login')
    }
  }

  // If already logged in and visiting login page
  if (to.path === '/admin/login') {
    try {
      const { authenticated } = await $fetch('/api/admin/me')
      if (authenticated) {
        return navigateTo('/admin')
      }
    } catch {
      // Not authenticated, allow access to login page
    }
  }
})
