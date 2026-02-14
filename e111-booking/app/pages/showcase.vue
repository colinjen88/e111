<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: '系統展示 - E111 預約系統',
  meta: [
    { name: 'description', content: 'Explore the features of the E111 Booking System.' }
  ]
})

const showcases = ref([
  {
    title: '預約首頁',
    desc: '客戶預約入口與服務介紹',
    link: '/',
    icon: '🏠'
  },
  {
    title: '會員中心',
    desc: '客戶登入與註冊入口',
    link: '/member/login',
    icon: '👤'
  },
  {
    title: '訂單查詢',
    desc: '輸入預約編號查詢進度',
    link: '/order',
    icon: '🔍'
  },
  {
    title: '技師登入',
    desc: '技師專屬任務管理後台',
    link: '/staff/login',
    icon: '🪪'
  },
  {
    title: '管理後台',
    desc: '店長營運、排班與數據分析',
    link: '/admin',
    icon: '⚙️'
  },
  {
    title: 'LinkTree',
    desc: '行動版快速入口頁',
    link: '/tree',
    icon: '🌳'
  },
  {
    title: '啟動頁 (HUB)',
    desc: '本地開發指揮中心',
    link: '/startup',
    icon: '🚀'
  }
])

</script>

<template>
  <div class="min-h-screen bg-gray-50 py-20 px-4 font-sans text-gray-900">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold font-serif text-brand-dark mb-4 drop-shadow-sm">系統功能總覽</h1>
        <p class="text-gray-500 max-w-2xl mx-auto text-lg">
          E111 Booking System 完整生態系地圖。<br>
          涵蓋前台預約、會員服務、技師協作與後台管理。
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <NuxtLink v-for="(item, idx) in showcases" :key="idx" :to="item.link" 
          class="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
          
          <div class="absolute top-0 right-0 w-24 h-24 bg-brand-cream/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
          
          <div class="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-3xl mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
            {{ item.icon }}
          </div>
          
          <h3 class="text-xl font-bold text-brand-dark mb-2 relative z-10">{{ item.title }}</h3>
          <p class="text-sm text-gray-400 font-light relative z-10">{{ item.desc }}</p>
          
          <div class="mt-6 w-full pt-6 border-t border-gray-50 group-hover:border-brand-gold/20 transition-colors relative z-10">
            <span class="text-xs font-bold text-gray-400 group-hover:text-brand-red transition-colors uppercase tracking-widest flex items-center justify-center gap-1">
              進入頁面
              <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </span>
          </div>
        </NuxtLink>
      </div>
      
      <div class="mt-20 text-center text-gray-400 text-sm font-light">
        &copy; 2026 E111 System Build v1.7.0
      </div>
    </div>
  </div>
</template>
