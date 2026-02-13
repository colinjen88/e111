<script setup lang="ts">
const { bookingData, submitting, submitError, submitBooking, goBack } = useBooking()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-serif font-bold text-brand-dark mb-2">確認並送出</h2>
        <p class="text-sm text-gray-400">確認預約內容，並填寫聯絡資料</p>
      </div>
    </div>
    
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Summary -->
      <div class="order-2 md:order-1">
        <h3 class="text-sm font-bold text-gray-400 mb-4 tracking-wider uppercase flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
          預約摘要
        </h3>
        <div class="bg-gradient-to-br from-brand-cream/60 to-white p-6 rounded-2xl border border-brand-gold/15 space-y-4 sticky top-6">
          <div class="flex justify-between items-center">
            <span class="text-gray-400 text-sm">分館</span>
            <span class="font-bold text-gray-900">{{ bookingData.branch?.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400 text-sm">服務</span>
            <span class="font-bold text-gray-900">{{ bookingData.service?.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400 text-sm">技師</span>
            <span class="font-bold text-gray-900">{{ bookingData.staff?.name || '不指定' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400 text-sm">時間</span>
            <span class="font-bold text-brand-red">{{ bookingData.date }} {{ bookingData.time }}</span>
          </div>
          <div class="border-t border-brand-gold/15 pt-4 mt-4 flex justify-between items-center">
            <span class="text-gray-400 text-sm">預估費用</span>
            <span class="font-bold text-2xl text-brand-dark font-serif">NT$ {{ bookingData.service?.basePrice }}</span>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="order-1 md:order-2">
         <h3 class="text-sm font-bold text-gray-400 mb-4 tracking-wider uppercase flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          聯絡資料
         </h3>
         <form @submit.prevent="submitBooking" class="space-y-5">
           <div class="form-group">
             <label class="block text-sm font-bold text-gray-600 mb-2">姓名 <span class="text-brand-red">*</span></label>
             <input v-model="bookingData.customer.name" type="text" required class="form-input" placeholder="請輸入姓名">
           </div>
           <div class="form-group">
             <label class="block text-sm font-bold text-gray-600 mb-2">手機號碼 <span class="text-brand-red">*</span></label>
             <input v-model="bookingData.customer.phone" type="tel" required class="form-input" placeholder="請輸入手機號碼">
           </div>
           <div class="form-group">
             <label class="block text-sm font-bold text-gray-600 mb-2">Email <span class="text-gray-300 text-xs font-normal">(選填)</span></label>
             <input v-model="bookingData.customer.email" type="email" class="form-input" placeholder="接收預約確認信">
           </div>
           <div class="form-group">
             <label class="block text-sm font-bold text-gray-600 mb-2">備註需求</label>
             <textarea v-model="bookingData.customer.note" class="form-input resize-none" rows="3" placeholder="如有特殊需求請在此說明"></textarea>
           </div>

           <!-- Error Message -->
           <div v-if="submitError" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3 border border-red-100">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
             </svg>
             <span>{{ submitError }}</span>
           </div>

           <div class="flex gap-4 pt-2">
              <button type="button" @click="goBack" class="flex-1 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 active:scale-95">
                返回
              </button>
              <button type="submit" :disabled="submitting" class="flex-[2] py-3.5 bg-gradient-to-r from-brand-red to-red-700 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-brand-red/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.97]">
                <div v-if="submitting" class="loading-spinner-sm"></div>
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
