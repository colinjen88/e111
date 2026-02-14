<script setup lang="ts">
const phone = ref('0912345678')
const password = ref('E111@Test2026')
const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { phone: phone.value, password: password.value }
    })
    if (res.success) {
      navigateTo('/member/dashboard')
    }
  } catch (e: any) {
    errorMsg.value = e.data?.message || '登入失敗，請檢查帳號密碼'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-brand-cream flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1540555700478-4be289aefcf1?auto=format&fit=crop&q=80')] bg-cover bg-center relative">
    <div class="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"></div>
    
    <div class="max-w-md w-full relative z-10" v-motion-fade-visible>
      <div class="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
        <div class="px-10 pt-12 pb-10 text-center">
          <h1 class="text-3xl font-bold font-serif text-brand-dark mb-2">
            會員登入
            <span class="text-xs text-red-500 font-bold ml-2 border border-red-200 bg-red-50 px-1 py-0.5 rounded align-middle">測試模式</span>
          </h1>
          <p class="text-gray-400 text-sm tracking-widest mb-10 uppercase font-bold">Member Login</p>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-4">
              <div class="relative">
                <input v-model="phone" type="tel" placeholder="手機號碼" required 
                  class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-brand-gold/5 focus:border-brand-gold outline-none transition-all">
              </div>
              <div class="relative">
                <input v-model="password" type="password" placeholder="登入密碼" required 
                  class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-brand-gold/5 focus:border-brand-gold outline-none transition-all">
              </div>
            </div>

            <p v-if="errorMsg" class="text-brand-red text-xs font-bold text-left px-2">⚠️ {{ errorMsg }}</p>

            <button :disabled="isLoading" 
              class="w-full bg-brand-dark text-white rounded-2xl py-4 font-bold shadow-xl shadow-gray-950/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
              <span v-if="isLoading">處理中...</span>
              <span v-else>立即登入</span>
            </button>
          </form>

          <div class="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-4">
            <p class="text-gray-400 text-sm">
              尚未加入會員？ 
              <NuxtLink to="/member/register" class="text-brand-gold font-bold hover:underline">立即註冊</NuxtLink>
            </p>
            <NuxtLink to="/" class="text-xs text-gray-300 hover:text-gray-500 transition-colors">← 回到預約首頁</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
