<script setup lang="ts">
useHead({
  title: '御手國醫 - 快速連結 (LinkTree)',
  meta: [
    { name: 'description', content: '御手國醫 E111 官方服務快速入口' }
  ]
})

const links = [
  {
    label: '立即預約按摩 service',
    url: '/booking',
    icon: '💆',
    featured: true
  },
  {
    label: '會員專區 / 點數查詢',
    url: '/member/login',
    icon: '👑',
    featured: false
  },
  {
    label: '技師專屬入口',
    url: '/staff/login',
    icon: '🔧',
    featured: false
  },
  {
    label: '官方網站',
    url: '/',
    icon: '🌐',
    featured: false
  },
  {
    label: '系統展示總覽',
    url: '/showcase',
    icon: '📂',
    featured: false
  }
]
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6 bg-[url('https://images.unsplash.com/photo-1620641788421-7f1c338e4200?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat bg-fixed relative">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

    <div class="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center gap-6 sm:gap-8">
       <!-- Profile -->
       <div class="flex flex-col items-center gap-3 sm:gap-4 text-center">
          <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-brand-gold to-brand-red hover:scale-105 transition-transform duration-500">
             <div class="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center border-2 border-black">
                <span class="text-2xl sm:text-3xl">👐</span>
             </div>
          </div>
          <div>
             <h1 class="text-lg sm:text-xl font-bold font-serif tracking-widest text-white mb-1">御手國醫養生會館</h1>
             <p class="text-[10px] sm:text-xs text-brand-gold tracking-[0.2em] uppercase font-light">Master Hand Massage</p>
          </div>
       </div>

       <!-- Links -->
       <div class="w-full space-y-3 sm:space-y-4">
          <NuxtLink 
             v-for="(link, idx) in links" 
             :key="idx" 
             :to="link.url"
             class="block w-full text-center py-3.5 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-300 relative overflow-hidden group active:scale-95 hover:-translate-y-0.5"
             :class="link.featured ? 'bg-brand-red border-brand-red text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] font-bold' : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-md'"
          >
             <div class="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <span class="text-lg sm:text-xl">{{ link.icon }}</span>
                <span class="text-sm sm:text-base">{{ link.label }}</span>
             </div>
             <!-- Shimmer effect for featured -->
             <div v-if="link.featured" class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          </NuxtLink>
       </div>

       <!-- Socials -->
       <div class="flex gap-4 sm:gap-6 mt-2 sm:mt-4">
          <a href="#" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#06C755] hover:scale-110 transition-all duration-300 text-white/60 hover:text-white">
             <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-6h2v.5c.5-.5 1.17-.75 1.83-.75 1.38 0 2.17 1.08 2.17 2.5V17z"/></svg>
          </a>
          <a href="#" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:scale-110 transition-all duration-300 text-white/60 hover:text-white">
             <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E4405F] hover:scale-110 transition-all duration-300 text-white/60 hover:text-white">
             <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
       </div>
       
       <div class="mt-6 sm:mt-8 text-[10px] text-white/30 font-light tracking-widest">
          © E111 BOOKING SYSTEM
       </div>
    </div>
  </div>
</template>
