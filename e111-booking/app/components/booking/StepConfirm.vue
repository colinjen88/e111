<script setup lang="ts">
const { bookingData, submitting, submitError, submitBooking, goBack } = useBooking()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6 sm:mb-8">
      <div>
        <h2 class="text-xl sm:text-2xl font-serif font-bold text-brand-dark mb-1 sm:mb-2">確認並送出</h2>
        <p class="text-xs sm:text-sm text-gray-400">確認預約內容，並填寫聯絡資料</p>
      </div>
    </div>
    
    <div class="grid lg:grid-cols-2 gap-6 sm:gap-8">
      <!-- Summary -->
      <div class="order-2 lg:order-1">
        <h3 class="text-xs sm:text-sm font-bold text-gray-400 mb-3 sm:mb-4 tracking-wider uppercase flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
          預約摘要
        </h3>
        <div class="bg-gradient-to-br from-brand-cream/60 to-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-brand-gold/15 space-y-3 sm:space-y-4 sticky top-4 sm:top-6">
          <div class="flex justify-between items-center">
            <span class="text-gray-400 text-xs sm:text-sm">分館</span>
            <span class="font-bold text-gray-900 text-sm sm:text-base">{{ bookingData.branch?.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400 text-xs sm:text-sm">服務</span>
            <span class="font-bold text-gray-900 text-sm sm:text-base">{{ bookingData.service?.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400 text-xs sm:text-sm">技師</span>
            <span class="font-bold text-gray-900 text-sm sm:text-base">{{ bookingData.staff?.name || '不指定' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400 text-xs sm:text-sm">時間</span>
            <span class="font-bold text-brand-red text-sm sm:text-base">{{ bookingData.date }} {{ bookingData.time }}</span>
          </div>
          <div class="border-t border-brand-gold/15 pt-3 sm:pt-4 mt-3 sm:mt-4 flex justify-between items-center">
            <span class="text-gray-400 text-xs sm:text-sm">預估費用</span>
            <span class="font-bold text-xl sm:text-2xl text-brand-dark font-serif">NT$ {{ bookingData.service?.basePrice }}</span>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="order-1 lg:order-2">
         <h3 class="text-xs sm:text-sm font-bold text-gray-400 mb-3 sm:mb-4 tracking-wider uppercase flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          聯絡資料
         </h3>
         <form @submit.prevent="submitBooking" class="space-y-4 sm:space-y-5">
           <div class="form-group">
             <label class="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">姓名 <span class="text-brand-red">*</span></label>
             <input v-model="bookingData.customer.name" type="text" required class="form-input" placeholder="請輸入姓名">
           </div>
           <div class="form-group">
             <label class="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">手機號碼 <span class="text-brand-red">*</span></label>
             <input v-model="bookingData.customer.phone" type="tel" required class="form-input" placeholder="請輸入手機號碼 (至少4碼)">
           </div>
           <div class="form-group">
             <label class="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Email <span class="text-gray-300 text-[10px] sm:text-xs font-normal">(選填)</span></label>
             <input v-model="bookingData.customer.email" type="email" class="form-input" placeholder="接收預約確認信">
           </div>
           <div class="form-group">
             <label class="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">備註需求</label>
             <textarea v-model="bookingData.customer.note" class="form-input resize-none" rows="3" placeholder="如有特殊需求請在此說明"></textarea>
           </div>

           <!-- Error Message -->
           <div v-if="submitError" class="bg-red-50 text-red-600 p-3 sm:p-4 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-start gap-2 sm:gap-3 border border-red-100">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
             </svg>
             <span>{{ submitError }}</span>
           </div>

           <div class="flex gap-3 sm:gap-4 pt-2">
              <button type="button" @click="goBack" class="flex-1 py-2.5 sm:py-3.5 bg-gray-100 text-gray-500 rounded-lg sm:rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 active:scale-95 text-sm sm:text-base">
                返回
              </button>
              <button type="submit" :disabled="submitting" class="flex-[2] py-2.5 sm:py-3.5 bg-gradient-to-r from-brand-red to-red-700 text-white rounded-lg sm:rounded-xl font-bold hover:shadow-xl hover:shadow-brand-red/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.97] text-sm sm:text-base">
                <UiLoadingSpinner v-if="submitting" size="sm" brand />
                <span>{{ submitting ? '預約處理中...' : '確認預約' }}</span>
              </button>
           </div>
         </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-input {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-brand-cream/30
    focus:ring-0 focus:border-brand-red/40 focus:bg-white
    outline-none transition-all duration-300 text-gray-800 placeholder-gray-300;
}
.form-input:hover {
  @apply border-gray-200;
}
</style>
