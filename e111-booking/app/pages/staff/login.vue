<script setup lang="ts">
const code = ref('36')
const password = ref('E111@Test2026')
const errorMsg = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
   isLoading.value = true
   errorMsg.value = ''
   try {
     const res = await $fetch('/api/staff/login', {
       method: 'POST',
       body: { code: code.value, password: password.value }
     })
     if (res.success) {
       navigateTo('/staff/dashboard')
     }
   } catch (e: any) {
     errorMsg.value = e.data?.message || '登入失敗，請確認編號與密碼'
   } finally {
     isLoading.value = false
   }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="max-w-sm w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🪪</div>
        <h1 class="text-2xl font-bold text-gray-900">
          技師後台登入
          <span class="text-xs text-red-500 font-bold ml-2 border border-red-200 bg-red-50 px-1 py-0.5 rounded align-middle">測試模式</span>
        </h1>
        <p class="text-sm text-gray-400 mt-1">Staff Access Only</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">員工編號</label>
          <input v-model="code" type="text" placeholder="例如: 36" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all font-mono">
        </div>

        <div>
           <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">密碼</label>
           <input v-model="password" type="password" placeholder="••••••" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all">
        </div>

        <p v-if="errorMsg" class="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg flex items-center gap-2">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           {{ errorMsg }}
        </p>

        <button :disabled="isLoading" class="w-full bg-brand-dark text-white py-3.5 rounded-xl font-bold shadow-lg shadow-gray-900/20 hover:bg-black active:scale-95 transition-all disabled:opacity-50 mt-4">
           <span v-if="isLoading">驗證中...</span>
           <span v-else>登入系統</span>
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-gray-50 text-center">
         <NuxtLink to="/" class="text-xs text-gray-400 hover:text-gray-600">回首頁</NuxtLink>
      </div>
    </div>
  </div>
</template>
