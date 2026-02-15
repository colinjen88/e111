<script setup lang="ts">
const { step, direction, bookingData, goToStep } = useBooking()

useHead({
  title: '線上預約 | 御手國醫養生會館',
  meta: [
    { name: 'description', content: '御手國醫線上預約系統 — 選擇分館、服務、技師與時段，輕鬆完成預約。' },
    { property: 'og:title', content: '線上預約 | 御手國醫養生會館' },
    { property: 'og:description', content: '選擇分館、服務、技師與時段，輕鬆完成按摩預約。' },
  ]
})

// Step meta info
const stepLabels = ['分館', '服務', '技師', '時間', '確認']
const stepIcons = ['🏠', '💆', '👤', '🕐', '✅']
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-cream/50 font-sans text-brand-dark">
    
    <!-- Decorative background elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-red/[0.03] rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-brand-gold/[0.05] rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 container mx-auto px-3 sm:px-4 max-w-3xl py-6 sm:py-8">
      
      <!-- Header -->
      <div class="mb-6 sm:mb-10 flex items-center justify-between bg-black/80 backdrop-blur-md px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg border border-white/10 relative z-20">
        <NuxtLink to="/" class="group flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-white transition-all duration-300 min-w-[48px] sm:min-w-[64px] active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs sm:text-sm font-medium hidden sm:inline">回首頁</span>
        </NuxtLink>
        <div class="flex flex-col items-center">
             <img src="/logo.png" alt="御手國醫" class="h-8 sm:h-10 mb-0.5 sm:mb-1 drop-shadow-md">
             <span class="text-[9px] sm:text-[10px] text-brand-gold tracking-[0.2em] sm:tracking-[0.3em] font-light uppercase opacity-80">Online Booking</span>
        </div>
        <div class="min-w-[48px] sm:min-w-[64px]"></div>
      </div>

      <!-- Progress Bar -->
      <BookingProgressBar />

      <!-- Step Content Card -->
      <div class="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 min-h-[350px] sm:min-h-[420px] border border-white/60 relative overflow-hidden">
        
        <!-- Decorative corner -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-gold/5 to-transparent rounded-bl-full pointer-events-none"></div>

        <!-- Booking Summary / Breadcrumbs -->
      <div v-if="step > 1 && step < 6" class="flex flex-wrap items-center gap-2 mb-4 px-2">
        <!-- Branch -->
        <div v-if="bookingData.branch" 
          @click="goToStep(1)"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-brand-gold/20 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-brand-red/10 hover:text-brand-red hover:border-brand-red/30 cursor-pointer transition-all shadow-sm">
          <span class="opacity-60">🏠</span>
          {{ bookingData.branch.name }}
          <span class="text-gray-400 text-[10px] ml-1">✕</span>
        </div>

        <!-- Service -->
        <div v-if="step > 2 && bookingData.service" 
          @click="goToStep(2)"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-brand-gold/20 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-brand-red/10 hover:text-brand-red hover:border-brand-red/30 cursor-pointer transition-all shadow-sm">
          <span class="opacity-60">💆</span>
          {{ bookingData.service.name }}
          <span class="text-gray-400 text-[10px] ml-1">✕</span>
        </div>

        <!-- Staff -->
        <div v-if="step > 3 && bookingData.staff" 
          @click="goToStep(3)"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-brand-gold/20 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-brand-red/10 hover:text-brand-red hover:border-brand-red/30 cursor-pointer transition-all shadow-sm">
          <span class="opacity-60">👤</span>
          {{ bookingData.staff.name }}
          <span class="text-gray-400 text-[10px] ml-1">✕</span>
        </div>
      </div>

      <Transition :name="direction === 'forward' ? 'slide-left' : 'slide-right'" mode="out-in">
          <BookingStepBranch   v-if="step === 1" key="step1" />
          <BookingStepService  v-else-if="step === 2" key="step2" />
          <BookingStepStaff    v-else-if="step === 3" key="step3" />
          <BookingStepDateTime v-else-if="step === 4" key="step4" />
          <BookingStepConfirm  v-else-if="step === 5" key="step5" />
          <BookingStepSuccess  v-else-if="step === 6" key="step6" />
        </Transition>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============ Transitions ============ */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ============ Shared Loading Spinners ============ */
:deep(.loading-spinner) {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 0, 0, 0.1);
  border-top-color: #8B0000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

:deep(.loading-spinner-sm) {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============ Scrollbar ============ */
:deep(.no-scrollbar::-webkit-scrollbar) {
    display: none;
}
:deep(.no-scrollbar) {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
