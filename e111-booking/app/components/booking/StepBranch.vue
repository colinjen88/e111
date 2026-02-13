<script setup lang="ts">
const { branches, loadingBranches, errorBranches, selectBranch } = useBooking()
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-serif font-bold text-brand-dark mb-2">選擇服務據點</h2>
      <p class="text-sm text-gray-400">請選擇距離您最近的分館</p>
    </div>
    <div v-if="loadingBranches" class="py-16 flex flex-col items-center gap-4">
      <div class="loading-spinner"></div>
      <span class="text-sm text-gray-400 animate-pulse">載入中...</span>
    </div>
    <div v-else-if="errorBranches" class="py-12 text-center text-red-500">
      <div class="text-4xl mb-3">⚠️</div>
      載入失敗，請重新整理頁面
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <button v-for="(branch, idx) in branches" :key="branch.id" @click="selectBranch(branch)" 
        class="group relative p-6 bg-gradient-to-br from-brand-cream/80 to-white border-2 border-transparent rounded-2xl hover:border-brand-red/40 transition-all duration-400 text-left hover:shadow-xl hover:shadow-brand-red/5 active:scale-[0.97]"
        :style="{ animationDelay: `${idx * 100}ms` }">
        <!-- Hover glow -->
        <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-red/5 to-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div class="relative">
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red/20 transition-colors">
                <span class="text-lg">🏠</span>
              </div>
              <span class="font-bold text-lg text-gray-900 group-hover:text-brand-red transition-colors">{{ branch.name }}</span>
            </div>
            <span v-if="branch.isActive" class="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">● 營業中</span>
          </div>
          <p class="text-sm text-gray-500 mb-5 pl-[52px] line-clamp-2">{{ branch.address }}</p>
          <div class="flex items-center text-brand-red text-sm font-bold pl-[52px] opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
            選擇此分館
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
