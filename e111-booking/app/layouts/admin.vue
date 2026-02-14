<script setup lang="ts">
const router = useRouter()
const isSidebarOpen = ref(false)

const logout = async () => {
  try {
    await $fetch('/api/admin/logout', { method: 'POST' })
  } catch {
    // Even if API fails, redirect to login
  }
  router.push('/admin/login')
}

// Close sidebar on route change (mobile)
watch(router.currentRoute, () => {
  isSidebarOpen.value = false
})
</script>

<template>
  <div class="h-screen flex bg-gray-50 font-sans overflow-hidden">
    
    <!-- Mobile Overlay -->
    <div 
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/50 z-20 lg:hidden"
        @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
        class="fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col border-r border-gray-800/50 transition-transform duration-300 transform lg:transform-none overflow-hidden"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="h-16 flex items-center border-b border-gray-800/50 px-4">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <img src="/logo.png" alt="御手國醫" class="h-7 max-w-[140px] w-auto object-contain flex-shrink-0">
          <span class="text-[10px] font-serif tracking-[0.1em] text-gray-500 border-l border-gray-800 pl-2 uppercase py-0.5 truncate shrink-0">Admin</span>
        </div>
        <!-- Close Button (Mobile) -->
        <button @click="isSidebarOpen = false" class="lg:hidden text-gray-400 hover:text-white flex-shrink-0 ml-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <NuxtLink to="/admin" 
          class="nav-link" 
          active-class="nav-link-active">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          預約總覽
        </NuxtLink>
        <NuxtLink to="/admin/bookings" 
          class="nav-link" 
          active-class="nav-link-active">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          查詢訂單
        </NuxtLink>
        <NuxtLink to="/admin/calendar" 
          class="nav-link" 
          active-class="nav-link-active">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          行事曆
        </NuxtLink>
        <NuxtLink to="/admin/staff" 
          class="nav-link" 
          active-class="nav-link-active">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          技師管理
        </NuxtLink>
        <NuxtLink to="/admin/leaves" 
          class="nav-link" 
          active-class="nav-link-active">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          休假管理
        </NuxtLink>
        <NuxtLink to="/admin/settings" 
          class="nav-link" 
          active-class="nav-link-active">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          系統設定
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-800/50">
        <button 
          @click="logout"
          class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 group"
        >
          <svg class="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          登出
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col w-full overflow-hidden">
      <!-- Top Header -->
      <header class="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 flex-shrink-0">
        <div class="flex items-center gap-4">
            <!-- Mobile Menu Button -->
            <button @click="isSidebarOpen = true" class="lg:hidden text-gray-500 hover:text-brand-red">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h2 class="text-sm sm:text-base font-bold text-gray-700 tracking-wider">
              {{ $route.meta.title || ($route.path === '/admin' ? '管理儀表板' : $route.path === '/admin/bookings' ? '訂單查詢' : $route.path === '/admin/calendar' ? '行事曆' : '管理系統') }}
            </h2>
        </div>
        <div class="flex items-center gap-5">
          <button class="relative group">
            <span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-white animate-pulse"></span>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-red to-red-800 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-brand-red/20">A</div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50">
        <slot />
      </div>
    </main>

  </div>
</template>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 
    hover:bg-white/5 hover:text-white transition-all duration-300 text-sm font-medium;
}

.nav-link-active {
  @apply bg-brand-red/90 text-white shadow-lg shadow-brand-red/20 !important;
}
</style>
