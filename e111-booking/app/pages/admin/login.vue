<script setup lang="ts">
definePageMeta({
  layout: false
})

const password = ref('')
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
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-fade-in">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800 tracking-wider">御手國醫 <span class="text-red-600">Admin</span></h1>
        <p class="text-sm text-gray-400 mt-2">請輸入管理員密碼以登入</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">管理密碼</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
            placeholder="請輸入密碼..."
            required
            autofocus
          >
          <p class="text-xs text-gray-400 mt-1.5">臨時測試密碼：<code class="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">admin</code></p>
        </div>
        
        <div v-if="error" class="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {{ error }}
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          <div v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          {{ loading ? '驗證中...' : '登入系統' }}
        </button>
      </form>
      
      <div class="mt-8 text-center">
        <NuxtLink to="/" class="text-gray-400 text-xs hover:text-gray-600 transition-colors">
          ← 回到預約網站
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
</style>
