<script setup lang="ts">
const { bookingData, categories, loadingServices, errorServices, activeCategory, selectCategory, selectService, goBack } = useBooking()
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-serif font-bold text-brand-dark mb-1 sm:mb-2">選擇服務項目</h2>
        <p class="text-xs sm:text-sm text-gray-400">{{ bookingData.branch?.name }} · 為您推薦精選服務</p>
      </div>
      <button @click="goBack" class="text-xs sm:text-sm text-gray-400 hover:text-brand-red transition-colors flex items-center gap-1 group self-start sm:self-auto active:scale-95">
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        更換分館
      </button>
    </div>
    <div v-if="loadingServices" class="py-12 sm:py-16 flex flex-col items-center gap-4">
      <UiLoadingSpinner size="md" text="載入中..." />
    </div>
    <div v-else-if="errorServices" class="py-10 sm:py-12 text-center text-red-500 px-4">
      <div class="text-3xl sm:text-4xl mb-3 animate-bounce">⚠️</div>
      <p class="text-sm sm:text-base">載入失敗</p>
      <button @click="refreshServices" class="mt-4 px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm hover:bg-brand-red/20 transition-colors">
        重新載入
      </button>
    </div>
    <div v-else>
      <!-- Category tabs -->
      <div class="flex overflow-x-auto gap-2 sm:gap-3 mb-6 sm:mb-8 pb-2 no-scrollbar">
        <button v-for="cat in categories" :key="cat.id" @click="selectCategory(cat)" 
          class="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full whitespace-nowrap text-xs sm:text-sm font-bold transition-all duration-300 border"
          :class="activeCategory?.id === cat.id 
            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/25 border-brand-red scale-105' 
            : 'bg-white text-gray-500 hover:text-brand-red hover:border-brand-red/30 border-gray-100 hover:shadow-md'">
          {{ cat.name }}
        </button>
      </div>
      <!-- Service list -->
      <div v-if="activeCategory" class="space-y-3 sm:space-y-4">
        <p v-if="activeCategory.services.length === 0" class="text-center text-gray-400 py-10 sm:py-12 text-sm">此分類目前沒有服務項目</p>
        <button v-for="(service, idx) in activeCategory.services" :key="service.id" @click="selectService(service)" 
          class="w-full flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-brand-cream/40 to-transparent border border-gray-100/80 rounded-xl sm:rounded-2xl hover:border-brand-red/30 hover:shadow-lg hover:shadow-brand-red/5 transition-all duration-300 group text-left active:scale-[0.98]"
          :style="{ animationDelay: `${idx * 80}ms` }">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-800 text-base sm:text-lg group-hover:text-brand-red transition-colors truncate">{{ service.name }}</h3>
            <p class="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-1">{{ service.description || '暫無描述' }}</p>
            <div class="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
              <span class="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" /></svg>
                {{ service.durationMinutes }} 分鐘
              </span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1.5 sm:gap-2 ml-3 sm:ml-4 flex-shrink-0">
            <span class="text-lg sm:text-xl font-bold text-brand-red font-serif">NT$ {{ service.basePrice }}</span>
            <span class="text-[10px] sm:text-xs text-brand-red font-bold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1">
              選擇
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
