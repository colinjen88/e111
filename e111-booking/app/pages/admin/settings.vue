<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const lineToken = ref('')
const emailService = ref('sendgrid')
const testEmail = ref('')
const loading = ref(false)
const saved = ref(false)

const saveSettings = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    saved.value = true
    setTimeout(() => saved.value = false, 2000)
  }, 800)
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">系統設定</h3>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div class="p-6 border-b border-gray-100">
        <h4 class="text-lg font-bold text-gray-800 mb-1">通知設定 (Integrations)</h4>
        <p class="text-sm text-gray-500">設定 LINE Notify 與 Email 通知服務</p>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- LINE Notify -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">LINE Notify Token</label>
          <div class="flex gap-2">
            <input v-model="lineToken" type="password" class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" placeholder="輸入 LINE Notify Token">
            <button class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">測試</button>
          </div>
          <p class="text-xs text-gray-400 mt-1">預約成功時將發送通知至此 Token 對應的群組。</p>
        </div>

        <!-- Email Service -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email 服務商</label>
          <select v-model="emailService" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
            <option value="sendgrid">SendGrid</option>
            <option value="resend">Resend</option>
            <option value="smtp">Custom SMTP</option>
          </select>
        </div>

      </div>
      
      <div class="bg-gray-50 p-4 flex justify-end">
        <button @click="saveSettings" class="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2">
           <svg v-if="saved" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
           {{ saved ? '已儲存' : '儲存設定' }}
        </button>
      </div>
    </div>

    <!-- Other Settings -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h4 class="text-lg font-bold text-gray-800 mb-1">營業設定</h4>
      </div>
      <div class="p-6 space-y-4">
         <div class="flex items-center justify-between">
            <div>
              <span class="block text-sm font-medium text-gray-700">開放預約天數</span>
              <span class="text-xs text-gray-400">設定客戶可預約未來幾天內的時段</span>
            </div>
            <select class="px-3 py-1 rounded border border-gray-300 text-sm">
              <option>7 天</option>
              <option>14 天</option>
              <option>30 天</option>
            </select>
         </div>
         <div class="flex items-center justify-between">
            <div>
              <span class="block text-sm font-medium text-gray-700">網站維護模式</span>
              <span class="text-xs text-gray-400">啟用後前台將顯示維護中</span>
            </div>
            <button class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 bg-gray-200" role="switch" aria-checked="false">
              <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0"></span>
            </button>
         </div>
      </div>
    </div>

  </div>
</template>
