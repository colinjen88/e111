<script setup lang="ts">
const route = useRoute()
const isMenuOpen = ref(false)

const staff = ref<any>(null)

onMounted(async () => {
  const res: any = await $fetch('/api/staff/me')
  staff.value = res.staff
})

const logout = async () => {
   await $fetch('/api/staff/logout', { method: 'POST' })
   navigateTo('/staff/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col md:flex-row">
     
     <!-- Mobile Top Bar -->
     <header class="md:hidden bg-white border-b border-gray-100 fixed top-0 w-full z-30">
        <div class="flex items-center justify-between px-6 py-4">
           <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red font-bold text-lg">
                 {{ staff?.code || 'ID' }}
              </div>
              <div>
                 <h1 class="text-sm font-bold">{{ staff?.name || '技師' }}</h1>
                 <p class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{{ staff?.branch || 'Branch' }}</p>
              </div>
           </div>
           
           <button @click="logout" class="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
           </button>
        </div>
     </header>

     <!-- Desktop Sidebar -->
     <aside class="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 shrink-0">
        <div class="p-8 border-b border-gray-100">
           <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red font-bold text-2xl">
                 {{ staff?.code || 'ID' }}
              </div>
              <div>
                 <h1 class="text-lg font-bold">{{ staff?.name || '技師' }}</h1>
                 <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">{{ staff?.branch || 'Branch' }}</p>
              </div>
           </div>
           
           <div class="space-y-1">
              <NuxtLink to="/staff/dashboard" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-500 font-medium transition-colors" active-class="bg-brand-red/5 text-brand-red font-bold">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                 任務看板
              </NuxtLink>
              <NuxtLink to="/staff/schedule" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-500 font-medium transition-colors" active-class="bg-brand-red/5 text-brand-red font-bold">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 我的班表
              </NuxtLink>
           </div>
        </div>

        <div class="mt-auto p-8 border-t border-gray-100">
           <button @click="logout" class="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors w-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              登出系統
           </button>
        </div>
     </aside>

     <!-- Main Content -->
     <main class="flex-1 w-full pt-24 pb-24 md:py-10 px-4 md:px-10 max-w-lg md:max-w-none mx-auto md:mx-0 overflow-y-auto min-h-screen">
        <slot />
     </main>

     <!-- Mobile Bottom Nav -->
     <nav class="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 pb-safe z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
        <div class="flex justify-around items-center px-6 py-3">
           <NuxtLink to="/staff/dashboard" class="flex flex-col items-center gap-1 group active:scale-90 transition-transform" active-class="text-brand-red">
              <svg class="w-6 h-6 text-gray-400 group-[.text-brand-red]:text-brand-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              <span class="text-[10px] font-bold text-gray-400 group-[.text-brand-red]:text-gray-900">任務</span>
           </NuxtLink>
           <NuxtLink to="/staff/schedule" class="flex flex-col items-center gap-1 group active:scale-90 transition-transform" active-class="text-brand-red">
              <svg class="w-6 h-6 text-gray-400 group-[.text-brand-red]:text-brand-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span class="text-[10px] font-bold text-gray-400 group-[.text-brand-red]:text-gray-900">班表</span>
           </NuxtLink>
        </div>
     </nav>
  </div>
</template>

<style>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
