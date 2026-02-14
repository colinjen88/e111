<script setup lang="ts">
definePageMeta({
  layout: false
})

const password = ref('E111@Admin2026')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  console.log('Login button clicked!') // Debug
  loading.value = true
  error.value = ''
  
  try {
    console.log('Sending request to /api/admin/auth...') // Debug
    const result = await $fetch('/api/admin/auth', {
      method: 'POST',
      body: { password: password.value },
      // Allow user to see detailed error if fetch fails immediately (e.g. invalid json)
      onResponseError({ response }) {
          console.error('API Error Response:', response._data)
      }
    })
    console.log('Login success!', result) // Debug
    
    // Redirect to admin dashboard
    await router.push('/admin')
    
  } catch (err: any) {
    if (err.statusCode === 401) {
      error.value = '密碼錯誤，請重試'
    } else {
      error.value = '系統連線故障 (' + (err.statusCode || 'Unknown') + ')'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-dark via-gray-900 to-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-red/[0.03] rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-brand-gold/[0.05] rounded-full blur-3xl"></div>
    </div>
    
    <div class="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-fade-in relative z-10 border border-white/20">
      <div class="text-center mb-6 sm:mb-8">
        <div class="mb-4 flex justify-center">
          <img src="/logo.png" alt="御手國醫" class="h-12 sm:h-14 w-auto opacity-90">
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 tracking-wider font-serif">
          御手國醫 <span class="text-brand-red">Admin</span>
          <span class="text-xs text-red-500 font-bold ml-2 border border-red-200 bg-red-50 px-1 py-0.5 rounded align-middle">測試模式</span>
        </h1>
        <p class="text-xs sm:text-sm text-gray-400 mt-2">請輸入管理員密碼以登入</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-5 sm:space-y-6">
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">管理密碼</label>
          <div class="relative">
            <input 
              v-model="password" 
              type="password" 
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-all outline-none text-sm sm:text-base"
              :class="{ 'border-red-300 bg-red-50': error }"
              placeholder="請輸入密碼..."
              required
              autofocus
            >
            <div v-if="error" class="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-bounce">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        </div>
        
        <div v-if="error" class="text-red-500 text-xs sm:text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2 animate-shake">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>{{ error }}</span>
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-2.5 sm:py-3 bg-brand-red text-white rounded-lg sm:rounded-xl font-bold hover:bg-red-800 transition-all shadow-lg shadow-brand-red/25 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98]"
        >
          <UiLoadingSpinner v-if="loading" size="sm" brand />
          <span>{{ loading ? '驗證中...' : '登入系統' }}</span>
        </button>
      </form>
      
      <div class="mt-6 sm:mt-8 text-center">
        <NuxtLink to="/" class="text-gray-400 text-xs sm:text-sm hover:text-brand-gold transition-colors flex items-center justify-center gap-1 group">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          回到預約網站
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
