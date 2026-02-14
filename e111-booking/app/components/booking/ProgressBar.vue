<script setup lang="ts">
const { step, stepLabels, stepIcons } = useBooking()
</script>

<template>
  <div class="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-5 mb-6 sm:mb-8 border border-brand-gold/10" v-if="step < 6">
    <div class="flex justify-between items-center relative">
      <!-- Track -->
      <div class="absolute left-[10%] right-[10%] top-1/2 transform -translate-y-1/2 h-[2px] bg-gray-100 -z-10"></div>
      <!-- Fill -->
      <div class="absolute left-[10%] top-1/2 transform -translate-y-1/2 h-[2px] bg-gradient-to-r from-brand-red to-brand-gold transition-all duration-700 ease-out -z-10" 
        :style="{ width: `${((step - 1) / 4) * 80}%` }"></div>
      <!-- Dots -->
      <div v-for="i in 5" :key="i" class="flex flex-col items-center gap-1 sm:gap-2 z-10">
        <div 
          class="w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500 ease-out border-2"
          :class="[
            step > i ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/30 scale-100' : '',
            step === i ? 'bg-white border-brand-red text-brand-red shadow-lg shadow-brand-red/20 scale-110 ring-2 sm:ring-4 ring-brand-red/10' : '',
            step < i ? 'bg-gray-50 border-gray-200 text-gray-300' : ''
          ]">
          <span v-if="step > i" class="animate-check-in">✓</span>
          <span v-else>{{ stepIcons[i-1] }}</span>
        </div>
        <span class="text-[8px] sm:text-[10px] font-bold tracking-wider uppercase transition-colors duration-300 hidden xs:block"
          :class="step >= i ? 'text-brand-red' : 'text-gray-300'">
          {{ stepLabels[i-1] }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-check-in {
  animation: checkIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes checkIn {
  from { transform: scale(0) rotate(-45deg); opacity: 0; }
  to { transform: scale(1) rotate(0); opacity: 1; }
}
</style>
