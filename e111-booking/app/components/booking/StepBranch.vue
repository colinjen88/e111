<script setup lang="ts">
const { branches, loadingBranches, errorBranches, selectBranch } = useBooking()
</script>

<template>
  <div>
    <div class="mb-6 sm:mb-8">
      <h2 class="text-xl sm:text-2xl font-serif font-bold text-brand-dark mb-2">選擇服務據點</h2>
      <p class="text-sm text-gray-400">請選擇距離您最近的分館</p>
    </div>
    <div v-if="loadingBranches" class="py-12 sm:py-16 flex flex-col items-center gap-4">
      <UiLoadingSpinner size="md" text="載入中..." />
    </div>
    <div v-else-if="errorBranches" class="py-10 sm:py-12 text-center text-red-500 px-4">
      <div class="text-3xl sm:text-4xl mb-3 animate-bounce">⚠️</div>
      <p class="text-sm sm:text-base">載入失敗，請重新整理頁面</p>
      <button @click="refreshBranches" class="mt-4 px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm hover:bg-brand-red/20 transition-colors">
        重新載入
      </button>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      <button v-for="(branch, idx) in branches" :key="branch.id" @click="selectBranch(branch)" 
        class="group relative p-4 sm:p-6 bg-gradient-to-br from-brand-cream/80 to-white border-2 border-transparent rounded-xl sm:rounded-2xl hover:border-brand-red/40 transition-all duration-300 text-left hover:shadow-xl hover:shadow-brand-red/5 active:scale-[0.97]"
        :style="{ animationDelay: `${idx * 100}ms` }">
        <!-- Hover glow -->
        <div class="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand-red/5 to-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div class="relative">
          <div class="flex justify-between items-start mb-2 sm:mb-3">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red/20 transition-colors duration-300">
                <span class="text-base sm:text-lg">🏠</span>
              </div>
              <span class="font-bold text-base sm:text-lg text-gray-900 group-hover:text-brand-red transition-colors duration-300">{{ branch.name }}</span>
            </div>
            <span v-if="branch.isActive" class="px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-50 text-emerald-600 text-[10px] sm:text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              營業中
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-5 pl-10 sm:pl-[52px] line-clamp-2">{{ branch.address }}</p>
          <div class="flex items-center text-brand-red text-xs sm:text-sm font-bold pl-10 sm:pl-[52px] opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
            選擇此分館
            <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
