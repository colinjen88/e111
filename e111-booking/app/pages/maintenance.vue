<script setup lang="ts">
definePageMeta({
    layout: false
})
</script>

<template>
  <div class="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center text-center p-8 z-[9999]">
     <div class="mb-8 relative">
        <div class="absolute -inset-4 bg-brand-gold/20 rounded-full blur-xl animate-pulse"></div>
        <div class="w-24 h-24 rounded-3xl bg-brand-dark border-2 border-brand-gold flex items-center justify-center relative z-10">
            <svg class="w-12 h-12 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </div>
     </div>
     
     <h1 class="text-3xl md:text-5xl font-bold font-serif text-white mb-4 tracking-wide">系統維護中</h1>
     <p class="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed mb-12">
        為了提供更好的服務體驗，我們正在進行系統升級。預計於今日稍晚恢復服務，感謝您的耐心等候。
     </p>
     
     <div class="flex flex-col sm:flex-row gap-4">
        <a href="https://line.me/ti/p/@e111" class="px-8 py-3 bg-[#06C755] text-white rounded-xl font-bold hover:bg-[#05b64d] transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 10.3c0-4.6-4.9-8.3-10.9-8.3S2.2 5.7 2.2 10.3c0 4.1 3.9 7.5 9.1 8.2l-1.2 3.1c-.1.3 0 .6.3.7.1 0 .2.1.3.1.2 0 .4-.1.5-.3l3.6-4.6h.4c6 0 10.9-3.7 10.9-8.3z"/></svg>
            聯繫 LINE 客服
        </a>
        <NuxtLink to="/admin/settings" class="px-8 py-3 bg-white/10 text-white/50 rounded-xl font-bold hover:bg-white/20 transition-colors text-sm flex items-center justify-center">
            我是管理員
        </NuxtLink>
     </div>
     
     <div class="absolute bottom-8 left-0 w-full text-center">
        <p class="text-xs text-white/20 font-mono">SYSTEM_MAINTENANCE_MODE_ACTIVE</p>
     </div>
  </div>
</template>
