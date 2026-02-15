<script setup lang="ts">
const { bookingData, staffList, loadingStaff, errorStaff, selectStaff, selectNoPreference, goBack } = useBooking()
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-serif font-bold text-brand-dark mb-1 sm:mb-2">選擇服務技師</h2>
        <p class="text-xs sm:text-sm text-gray-400">{{ bookingData.service?.name }} · 挑選您喜愛的技師</p>
      </div>
      <button @click="goBack" class="px-3 py-1.5 text-xs sm:text-sm text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-brand-red hover:border-brand-red/30 transition-all flex items-center gap-1.5 group shadow-sm self-start sm:self-auto active:scale-95">
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform text-gray-400 group-hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        更換服務
      </button>
    </div>
    <div v-if="loadingStaff" class="py-12 sm:py-16 flex flex-col items-center gap-4">
      <UiLoadingSpinner size="md" text="載入中..." />
    </div>
    <div v-else-if="errorStaff" class="py-10 sm:py-12 text-center text-red-500 px-4">
      <div class="text-3xl sm:text-4xl mb-3 animate-bounce">⚠️</div>
      <p class="text-sm sm:text-base">載入失敗</p>
      <button @click="refreshStaff" class="mt-4 px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm hover:bg-brand-red/20 transition-colors">
        重新載入
      </button>
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
      <!-- No Preference -->
      <button @click="selectNoPreference" 
        class="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-brand-gold/30 rounded-xl sm:rounded-2xl hover:border-brand-red/50 hover:bg-brand-red/5 transition-all duration-300 text-gray-400 hover:text-brand-red min-h-[160px] sm:min-h-[200px] group active:scale-95">
        <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-brand-gold/10 to-brand-red/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-500">
          <span class="text-xl sm:text-2xl">🎲</span>
        </div>
        <span class="font-bold text-sm sm:text-base">不指定技師</span>
        <span class="text-[10px] sm:text-xs mt-1 opacity-60">由系統安排</span>
      </button>
      <!-- Staff Cards -->
      <button v-for="(member, idx) in staffList" :key="member.id" @click="selectStaff(member)" 
        class="relative flex flex-col items-center p-3 sm:p-5 bg-gradient-to-b from-white to-brand-cream/30 border border-gray-100 rounded-xl sm:rounded-2xl hover:border-brand-red/30 hover:shadow-xl hover:shadow-brand-red/5 transition-all duration-300 group min-h-[160px] sm:min-h-[200px] active:scale-95"
        :style="{ animationDelay: `${idx * 100}ms` }">
        <div class="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-brand-cream to-gray-100 mb-3 sm:mb-4 overflow-hidden shadow-md border-2 border-white group-hover:border-brand-red/30 group-hover:shadow-brand-red/10 transition-all duration-400">
          <img v-if="member.photoUrl" :src="member.photoUrl" :alt="member.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
          <div v-else class="w-full h-full flex items-center justify-center text-brand-red/60 text-lg sm:text-2xl font-serif font-bold bg-brand-red/5">{{ member.name.charAt(0) }}</div>
        </div>
        <div class="text-center">
          <h3 class="font-bold text-gray-900 text-sm sm:text-base group-hover:text-brand-red transition-colors truncate max-w-full px-1">{{ member.name }}</h3>
          <span class="inline-block px-2 sm:px-3 py-0.5 bg-brand-gold/10 text-brand-gold text-[9px] sm:text-[10px] font-bold rounded-full mt-1.5 sm:mt-2 tracking-wider uppercase">{{ member.level }}</span>
        </div>
        <div class="absolute bottom-3 sm:bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span class="text-[10px] sm:text-xs text-brand-red font-bold">選擇</span>
        </div>
      </button>
    </div>
  </div>
</template>
