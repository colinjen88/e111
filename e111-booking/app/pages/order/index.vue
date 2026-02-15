<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const orderId = ref(route.query.ref as string || '4')
const isFocused = ref(false)
const hasError = ref(false)

const submit = () => {
    if (!orderId.value) {
        hasError.value = true
        setTimeout(() => hasError.value = false, 500)
        return
    }
    router.push(`/order/${orderId.value}`)
}

const handleInput = () => {
    hasError.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-cream/50 font-sans tracking-wide flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-red/[0.03] rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-brand-gold/[0.05] rounded-full blur-3xl"></div>
    </div>
    
    <div class="w-full max-w-md relative z-10">
      <!-- Card -->
      <div class="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-brand-gold/10">
        <!-- Header -->
        <div class="text-center mb-6 sm:mb-8">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-red/10 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <h1 class="text-xl sm:text-2xl font-serif font-bold text-brand-dark">
            訂單查詢
            <span class="text-xs text-red-500 font-bold ml-2 border border-red-200 bg-red-50 px-1 py-0.5 rounded align-middle">測試模式</span>
          </h1>
          <p class="text-xs sm:text-sm text-gray-400 mt-2">查看您的預約詳情與狀態</p>
        </div>
        
        <form @submit.prevent="submit" class="space-y-5 sm:space-y-6">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">訂單編號</label>
            <div class="relative">
              <input 
                v-model="orderId" 
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                @focus="isFocused = true"
                @blur="isFocused = false"
                @input="handleInput"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl outline-none transition-all text-sm sm:text-base"
                :class="[
                  isFocused ? 'border-brand-gold ring-2 ring-brand-gold/20' : 'border-gray-200',
                  hasError ? 'border-red-300 bg-red-50 animate-shake' : ''
                ]"
                placeholder="請輸入預約時的訂單編號"
                required
              >
              <div v-if="orderId" class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <p class="text-[10px] sm:text-xs text-gray-400 mt-2 flex items-start gap-1.5">
              <svg class="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>訂單編號可在預約成功頁面或確認簡訊中找到。</span>
            </p>
          </div>

          <button 
            type="submit" 
            class="w-full py-2.5 sm:py-3 bg-brand-red text-white font-bold rounded-lg sm:rounded-xl shadow-md hover:bg-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
            :disabled="!orderId"
          >
            <span>下一步</span>
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </form>

        <div class="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100 text-center">
          <NuxtLink to="/" class="text-gray-400 text-xs sm:text-sm hover:text-brand-gold transition-colors flex items-center justify-center gap-1.5 group">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            返回首頁
          </NuxtLink>
        </div>
      </div>
      
      <!-- Help text -->
      <p class="text-center text-[10px] sm:text-xs text-gray-400 mt-4 sm:mt-6">
        需要協助？請聯繫客服 06-XXXXXXX
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}

/* Remove number input spinner */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
