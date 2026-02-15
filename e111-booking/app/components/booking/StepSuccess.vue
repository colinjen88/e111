<script setup lang="ts">
const { bookingResult } = useBooking()
</script>

<template>
  <div class="text-center py-8 sm:py-12 px-4">
    <div class="success-icon mx-auto mb-6 sm:mb-8">
      <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 sm:h-12 sm:w-12 text-white animate-check-draw" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    
    <h2 class="text-2xl sm:text-3xl font-serif font-bold text-brand-dark mb-2 sm:mb-3">預約成功！</h2>
    <p class="text-gray-400 mb-8 sm:mb-10 text-sm">感謝您的預約，系統已發送確認通知。</p>

    <div class="bg-gradient-to-br from-brand-cream/60 to-white max-w-xs sm:max-w-sm mx-auto rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-brand-gold/15 mb-8 sm:mb-10 text-left space-y-2 sm:space-y-3">
      <div class="flex justify-between items-center border-b border-brand-gold/10 pb-2 sm:pb-3">
        <span class="text-gray-400 text-xs sm:text-sm">預約詳情</span>
        <span class="bg-emerald-50 text-emerald-600 text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 rounded-full font-bold tracking-wider border border-emerald-100">✓ 已確認</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-400">訂單編號</span>
        <span class="font-mono font-bold text-gray-900">#{{ bookingResult?.bookingId || '---' }}</span>
      </div>
       <div class="flex justify-between text-sm">
        <span class="text-gray-400">預約日期</span>
        <span class="font-bold text-gray-900">{{ bookingResult?.details?.date }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-400">預約時間</span>
        <span class="font-bold text-brand-red">{{ bookingResult?.details?.time }}</span>
      </div>
       <div class="flex justify-between text-sm">
        <span class="text-gray-400">服務項目</span>
        <span class="font-bold text-gray-900">{{ bookingResult?.details?.branch }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-400">指定技師</span>
        <span class="font-bold text-gray-900">{{ bookingResult?.details?.staff }}</span>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <NuxtLink :to="`/order?ref=${bookingResult?.bookingId || ''}`" class="inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 bg-white text-brand-dark border border-gray-200 rounded-xl sm:rounded-2xl font-bold hover:shadow-lg hover:border-brand-gold/30 transition-all duration-300 active:scale-95 text-sm sm:text-base">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
        查看訂單
      </NuxtLink>

      <NuxtLink to="/" class="inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-brand-red to-red-700 text-white rounded-xl sm:rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-red/25 transition-all duration-300 active:scale-95 text-sm sm:text-base">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        回到首頁
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.animate-check-draw {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: checkDraw 0.6s ease-out 0.3s forwards;
}
@keyframes checkDraw {
  to { stroke-dashoffset: 0; }
}
.success-icon {
  animation: successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes successPop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}
</style>
