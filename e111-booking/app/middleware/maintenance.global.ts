
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Always allow admin/staff routes
  if (to.path.startsWith('/admin') || to.path.startsWith('/staff')) {
    return
  }

  try {
    // We should use $fetch to bypass potential useFetch caching issues in middleware context sometimes,
    // though useFetch is reactive. Let's stick to useFetch but be careful.
    // Actually, for a global middleware running on every route, we want to be efficient.
    // Let's call the API.
    const response = await $fetch('/api/settings/config') as any
    const isMaintenance = response?.data?.maintenanceMode

    // If Maintenance is ON
    if (isMaintenance) {
        if (to.path !== '/maintenance') {
            return navigateTo('/maintenance')
        }
    } 
    // If Maintenance is OFF
    else {
        // If user is trying to access maintenance page while system is up, redirect home
        if (to.path === '/maintenance') {
            return navigateTo('/')
        }
    }
  } catch (e) {
    console.error('Maintenance check failed:', e)
  }
})
