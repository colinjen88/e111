<script setup lang="ts">
const apps = [
  {
    name: '客戶預約入口',
    path: '/',
    desc: '面向大眾的品牌官網與即時預約系統',
    icon: '🏢',
    color: 'from-red-500 to-rose-700',
    tags: ['Public', 'Brand']
  },
  {
    name: '會員服務中心',
    path: '/member/login',
    desc: '客戶個人帳戶、點數查詢與預約紀錄',
    icon: '👤',
    color: 'from-amber-400 to-orange-600',
    tags: ['Customer', 'Auth']
  },
  {
    name: '技師作業端',
    path: '/staff/login',
    desc: '內部技師專屬任務板與排班系統',
    icon: '🪪',
    color: 'from-blue-500 to-indigo-700',
    tags: ['Staff', 'Internal']
  },
  {
    name: '管理決策後台',
    path: '/admin',
    desc: '最高權限營運管理、報表與系統配置',
    icon: '⚙️',
    color: 'from-emerald-500 to-teal-700',
    tags: ['Admin', 'Safe']
  }
]

const envInfo = [
  { label: '環境', value: 'Local Development' },
  { label: '版本', value: 'v1.7.5-stable' },
  { label: '核心', value: 'Nuxt 3 + Prisma' },
  { label: '資料庫', value: 'PostgreSQL Running' }
]
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0c] text-white selection:bg-brand-gold/30 selection:text-brand-gold font-sans overflow-hidden relative">
    <!-- Animated Nebula Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-gold/5 rounded-full blur-[150px] animate-pulse" style="animation-delay: 2s"></div>
    </div>
    
    <!-- Grid Pattern Overlay -->
    <div class="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center justify-center min-h-screen">
      <!-- Header Area -->
      <div class="text-center mb-20 animate-fade-in">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-[10px] font-bold tracking-widest text-emerald-400/80 uppercase">Systems Online</span>
        </div>
        
        <h1 class="text-5xl lg:text-7xl font-serif font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
          御手國醫 <br class="lg:hidden"> <span class="text-brand-gold">本地啟動頁</span>
        </h1>
        <p class="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
           E111 全方位預約生態系整合入口。<br>
           此頁面僅限本地開發或系統展示使用，提供各端權限快速切換。
        </p>
      </div>

      <!-- Main Hub Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        <NuxtLink 
          v-for="(app, idx) in apps" 
          :key="idx" 
          :to="app.path"
          class="group bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/[0.06] hover:border-white/10 hover:shadow-2xl hover:shadow-black transition-all duration-500 flex flex-col h-full relative overflow-hidden backdrop-blur-3xl"
        >
          <!-- Gradient Glow -->
          <div :class="`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`"></div>
          
          <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/10 group-hover:border-brand-gold/30">
            {{ app.icon }}
          </div>
          
          <div class="flex-grow">
            <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
              {{ app.name }}
              <svg class="w-4 h-4 text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </h3>
            <p class="text-sm text-white/40 font-light leading-relaxed group-hover:text-white/60 transition-colors">
              {{ app.desc }}
            </p>
          </div>

          <div class="mt-8 flex gap-2">
            <span v-for="tag in app.tags" :key="tag" class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-white/30 uppercase tracking-widest">
              {{ tag }}
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Bottom Info Bar -->
      <div class="mt-20 w-full max-w-6xl pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <div class="flex gap-12">
          <div v-for="info in envInfo" :key="info.label" class="flex flex-col">
            <span class="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">{{ info.label }}</span>
            <span class="text-xs font-mono font-medium text-white/60">{{ info.value }}</span>
          </div>
        </div>

        <div class="text-right">
           <p class="text-[10px] text-white/20 font-bold tracking-[0.3em] uppercase mb-1">Generated by Google DeepMind Team</p>
           <p class="text-[9px] text-brand-gold/50 font-mono tracking-wider italic font-light select-none">Project Code: E111-RES-MOD-01</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;700&display=swap');

:deep(body) {
  font-family: 'Outfit', sans-serif;
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.05); }
}
</style>
