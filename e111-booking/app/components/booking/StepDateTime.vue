<script setup lang="ts">
const { bookingData, availability, loadingSlots, errorSlots, next7Days, selectDate, selectTime, goBack } = useBooking()
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-serif font-bold text-brand-dark mb-1 sm:mb-2">選擇預約時間</h2>
        <p class="text-xs sm:text-sm text-gray-400">{{ bookingData.staff?.name || '不指定技師' }} · 選擇方便的時段</p>
      </div>
      <button @click="goBack" class="px-3 py-1.5 text-xs sm:text-sm text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-brand-red hover:border-brand-red/30 transition-all flex items-center gap-1.5 group shadow-sm self-start sm:self-auto active:scale-95">
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform text-gray-400 group-hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        更換技師
      </button>
    </div>

    <!-- Horizontal Date Picker -->
    <div class="flex overflow-x-auto pb-4 gap-2 sm:gap-3 no-scrollbar mb-6 sm:mb-8">
      <button v-for="day in next7Days" :key="day.dateStr"
        @click="selectDate(day.dateStr)"
        class="flex flex-col items-center justify-center min-w-[64px] sm:min-w-[76px] h-[76px] sm:h-[90px] rounded-xl sm:rounded-2xl border-2 transition-all duration-300 p-2 shrink-0"
        :class="bookingData.date === day.dateStr 
          ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/30 scale-105' 
          : 'border-gray-100 bg-white text-gray-500 hover:border-brand-red/30 hover:shadow-md'">
        <span class="text-[9px] sm:text-[10px] font-bold mb-1 tracking-wider uppercase"
          :class="bookingData.date === day.dateStr ? 'text-white/80' : 'text-gray-400'">{{ day.dayName }}</span>
        <span class="text-xl sm:text-2xl font-bold">{{ day.dayNum }}</span>
      </button>
    </div>

    <!-- Time Slots -->
    <div v-if="loadingSlots" class="py-10 sm:py-12 flex flex-col items-center gap-4">
      <UiLoadingSpinner size="md" text="查詢時段中..." />
    </div>
    
    <div v-else-if="errorSlots" class="py-10 sm:py-12 text-center text-red-500 px-4">
      <div class="text-3xl sm:text-4xl mb-3 animate-bounce">⚠️</div>
      <p class="text-sm sm:text-base">無法載入時段，請稍後再試</p>
      <button @click="refreshSlots" class="mt-4 px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm hover:bg-brand-red/20 transition-colors">
        重新載入
      </button>
    </div>

    <div v-else>
      <h3 class="text-sm sm:text-base font-bold text-gray-600 mb-3 sm:mb-4 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
        可預約時段
      </h3>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        <button v-for="block in availability?.blocks || []" :key="block.time"
          @click="selectTime(block.time, block.available)"
          :disabled="!block.available"
          class="py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border-2"
          :class="block.available 
            ? 'border-gray-100 bg-white hover:border-brand-red hover:text-brand-red hover:bg-brand-red/5 text-gray-600 shadow-sm hover:shadow-md active:scale-95' 
            : 'bg-gray-50 text-gray-300 border-transparent cursor-not-allowed line-through'">
          {{ block.time }}
        </button>
      </div>
    </div>
  </div>
</template>
