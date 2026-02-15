<script setup lang="ts">
const form = ref({
  phone: '',
  password: '',
  confirmPassword: '',
  name: '',
  email: ''
})
const isLoading = ref(false)
const errorMsg = ref('')

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = '兩次輸入的密碼不一致'
    return
  }

  isLoading.value = true
  errorMsg.value = ''
  try {
    const res = await $fetch('/api/auth/register', {
      method: 'POST',
      body: form.value
    })
    if (res.success) {
      alert('註冊成功！請重新登入')
      navigateTo('/member/login')
    }
  } catch (e: any) {
    errorMsg.value = e.data?.message || '註冊失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-brand-cream flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1540555700478-4be289aefcf1?auto=format&fit=crop&q=80')] bg-cover bg-center relative">
    <div class="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"></div>
    
    <div class="max-w-md w-full relative z-10 animate-fade-in">
      <div class="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
        <div class="px-10 pt-12 pb-10 text-center">
          <h1 class="text-3xl font-bold font-serif text-brand-dark mb-2">加入會員</h1>
          <p class="text-gray-400 text-sm tracking-widest mb-10 uppercase font-bold">New Membership</p>
          
          <form @submit.prevent="handleRegister" class="space-y-4 text-left">
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-2 block">手機號碼 (必填)</label>
              <input v-model="form.phone" type="tel" required 
                class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-brand-gold/5 focus:border-brand-gold outline-none transition-all">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-2 block">姓名</label>
                <input v-model="form.name" type="text" 
                  class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-brand-gold/5 focus:border-brand-gold outline-none transition-all">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-2 block">電子信箱</label>
                <input v-model="form.email" type="email" 
                  class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-brand-gold/5 focus:border-brand-gold outline-none transition-all">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-2 block">密碼</label>
                <input v-model="form.password" type="password" required 
                  class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-brand-gold/5 focus:border-brand-gold outline-none transition-all">
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-2 block">確認密碼</label>
                <input v-model="form.confirmPassword" type="password" required 
                  class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-brand-gold/5 focus:border-brand-gold outline-none transition-all">
              </div>
            </div>

            <p v-if="errorMsg" class="text-brand-red text-xs font-bold px-2 py-2">⚠️ {{ errorMsg }}</p>

            <button :disabled="isLoading" 
              class="w-full bg-brand-dark text-white rounded-2xl py-4 font-bold shadow-xl shadow-gray-950/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 disabled:opacity-50">
              <span v-if="isLoading">處理中...</span>
              <span v-else>確認註冊</span>
            </button>
          </form>

          <div class="mt-8 pt-8 border-t border-gray-50 text-center">
            <p class="text-gray-400 text-sm">
              已有帳號？ 
              <NuxtLink to="/member/login" class="text-brand-gold font-bold hover:underline">返回登入</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
