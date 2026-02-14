<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const config = ref({
  lineNotifyToken: '',
  lineChannelAccessToken: '',
  lineAdminUserId: '',
  resendApiKey: '',
  emailFrom: '',
  // Dynamic Settings
  emailEnabled: false,
  maintenanceMode: false
})

const isSaving = ref(false)

// Load Settings
const { data: settings } = await useFetch('/api/settings/config')
if (settings.value?.data) {
    config.value.emailEnabled = settings.value.data.emailEnabled
    config.value.maintenanceMode = settings.value.data.maintenanceMode
    // Other fields are ENV based, so we don't load them from this dynamic config
}

const saveSettings = async () => {
  isSaving.value = true
  try {
      await $fetch('/api/settings/config', {
          method: 'POST',
          body: {
              emailEnabled: config.value.emailEnabled,
              maintenanceMode: config.value.maintenanceMode
          }
      })
      alert('系統設定已更新！')
  } catch (e) {
      alert('更新失敗，請稍後再試。')
  } finally {
      isSaving.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-20">
    <div class="flex items-end justify-between">
       <div>
          <h1 class="text-3xl font-bold text-gray-900 font-serif tracking-tight text-brand-dark">系統設定</h1>
          <p class="text-gray-500 mt-2">管理通知整合、營業時間與系統參數</p>
       </div>
       <button disabled class="bg-gray-200 text-gray-400 px-8 py-3 rounded-2xl font-bold text-sm shadow-none cursor-not-allowed flex items-center gap-2">
          儲存所有變更
       </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">


      <!-- Messaging API (Advanced) -->
      <div class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4 mb-8">
           <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
           </div>
           <div>
              <h3 class="text-xl font-bold text-gray-900">LINE Messaging API</h3>
              <p class="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em]">已啟用：官方帳號互動服務</p>
           </div>
        </div>
        
        <div class="space-y-5">
           <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Channel Access Token</label>
              <div class="relative">
                <input type="password" value="************************" readonly class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-400 cursor-not-allowed text-sm">
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                    ENV Configured
                </div>
              </div>
           </div>
           <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Admin User ID</label>
              <div class="relative">
                <input type="password" value="************************" readonly class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-400 cursor-not-allowed text-sm">
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                    ENV Configured
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Email Service (Resend) - DISABLED -->
      <div class="bg-gray-50 rounded-[2.5rem] shadow-none border border-gray-100 p-8 opacity-60 grayscale cursor-not-allowed pointer-events-none select-none relative">
        <div class="absolute inset-0 z-10" title="功能尚未啟用"></div>
        <div class="flex items-center gap-4 mb-8">
           <div class="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
           </div>
           <div>
              <h3 class="text-xl font-bold text-gray-500">Email 通知</h3>
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] bg-gray-200 inline-block px-2 py-1 rounded">即將推出</p>
           </div>
        </div>
        
        <div class="space-y-5">
           <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Resend API Key</label>
              <input disabled type="password" placeholder="re_123456789..." class="w-full bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none text-sm placeholder:text-gray-300 cursor-not-allowed">
           </div>
           <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">寄件者信箱 (From Email)</label>
              <input disabled type="text" placeholder="no-reply@yourdomain.com" class="w-full bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none text-sm placeholder:text-gray-300 cursor-not-allowed">
           </div>
        </div>
      </div>
      
      <!-- System Maintenance - DISABLED -->
      <div class="bg-gray-800 rounded-[2.5rem] p-8 shadow-inner relative overflow-hidden opacity-60 grayscale cursor-not-allowed pointer-events-none select-none">
         <div class="absolute inset-0 z-10" title="功能尚未啟用"></div>
         <div class="relative z-10 text-gray-500 flex flex-col h-full">
            <h3 class="text-lg font-bold mb-2">系統維護</h3>
            <p class="text-xs text-gray-600 mb-8 leading-relaxed">開啟後，所有前台預約功能將暫停使用，並顯示自定義維護訊息。</p>
            
            <div class="mt-auto flex items-center justify-between">
               <span class="text-sm font-bold tracking-widest uppercase text-gray-600">維護模式</span>
               <button disabled class="w-14 h-7 bg-gray-700 rounded-full p-1 relative cursor-not-allowed">
                  <div class="w-5 h-5 bg-gray-500 rounded-full shadow-lg transform translate-x-0"></div>
               </button>
            </div>
         </div>
      </div>
    </div>

    <!-- Booking Limits & Business Logic -->
    <div class="bg-gray-50 rounded-[2.5rem] shadow-none border border-gray-100 p-8 opacity-60 grayscale cursor-not-allowed pointer-events-none select-none relative">
       <div class="absolute inset-0 z-10" title="功能尚未啟用"></div>
       <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400">
             <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
             <h3 class="text-xl font-bold text-gray-500">營業參數設定</h3>
             <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] bg-gray-200 inline-block px-2 py-1 rounded">即將推出</p>
          </div>
       </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-center justify-between p-6 bg-gray-100 rounded-2xl border border-gray-200">
             <div>
                <span class="block text-sm font-bold text-gray-500">開放預約天數</span>
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">限制客戶可預見的日期範圍</span>
             </div>
             <select disabled class="bg-gray-200 border border-gray-300 rounded-xl px-4 py-2 font-bold text-sm shadow-none outline-none text-gray-400 cursor-not-allowed">
                <option>14 天</option>
             </select>
          </div>
          
          <div class="flex items-center justify-between p-6 bg-gray-100 rounded-2xl border border-gray-200">
             <div>
                <span class="block text-sm font-bold text-gray-500">最小預約提前量</span>
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">防止店端反應不及</span>
             </div>
             <select disabled class="bg-gray-200 border border-gray-300 rounded-xl px-4 py-2 font-bold text-sm shadow-none outline-none text-gray-400 cursor-not-allowed">
                <option>1 小時前</option>
             </select>
          </div>
       </div>
    </div>

    <!-- System Info Footer -->
    <div class="flex flex-col sm:flex-row justify-between items-center px-10 pt-10 border-t border-gray-100 gap-6">
       <div class="flex items-center gap-10">
          <div class="flex flex-col">
             <span class="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Platform Version</span>
             <span class="text-xs font-mono font-bold text-gray-500">v1.6.8 (LTS)</span>
          </div>
          <div class="flex flex-col">
             <span class="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Engine Mode</span>
             <span class="text-xs font-mono font-bold text-brand-gold">Nuxt Hybrid (SSR Off)</span>
          </div>
       </div>
       <div class="text-right">
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">© 2026 High-Freq Systems</p>
          <p class="text-[9px] text-gray-300 font-medium">All Rights Reserved. Verified Secure Deployment.</p>
       </div>
    </div>
  </div>
</template>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}
</style>
