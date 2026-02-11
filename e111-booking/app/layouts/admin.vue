<template>
  <div class="h-screen flex bg-gray-100 font-sans">
    
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col">
      <div class="h-16 flex items-center justify-center border-b border-gray-800">
        <h1 class="text-xl font-bold tracking-wider">金指藝 <span class="text-red-500">Admin</span></h1>
      </div>
      
      <nav class="flex-1 px-4 py-6 space-y-2">
        <NuxtLink to="/admin" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-brand-red text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          預約總覽
        </NuxtLink>
        <NuxtLink to="/admin/calendar" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-brand-red text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          行事曆
        </NuxtLink>
        <NuxtLink to="/admin/settings" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-brand-red text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          系統設定
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <button class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          登出
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <!-- Top Header -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
        <h2 class="text-lg font-semibold text-gray-700">管理儀表板</h2>
        <div class="flex items-center gap-4">
          <div class="relative">
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </div>
          <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 shadow-inner">A</div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-auto p-6">
        <slot />
      </div>
    </main>

  </div>
</template>
