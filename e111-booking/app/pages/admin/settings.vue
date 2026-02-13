<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">系統設定</h3>

    <!-- Notification Settings -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-lg font-bold text-gray-800 mb-1">通知設定 (Integrations)</h4>
            <p class="text-sm text-gray-500">設定 LINE Messaging API 與 Email 通知服務</p>
          </div>
          <span class="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-200">
            🚧 Coming Soon
          </span>
        </div>
      </div>
      
      <div class="p-6 space-y-6 opacity-50 pointer-events-none select-none">
        <!-- LINE Messaging API -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">LINE Channel Access Token</label>
          <input type="password" disabled class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50" placeholder="輸入 Channel Access Token (Long-lived)">
        </div>

         <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Admin User ID (Target ID)</label>
          <div class="flex gap-2">
            <input type="text" disabled class="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50" placeholder="輸入接收通知的 User ID / Group ID">
            <button disabled class="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg">測試</button>
          </div>
          <p class="text-xs text-gray-400 mt-1">請輸入 LINE Developers Console > Basic Settings 中的 "Your User ID"。</p>
        </div>

        <div class="border-t border-gray-100 my-4"></div>

        <!-- Email Service -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email 服務商</label>
          <select disabled class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50">
            <option value="sendgrid">SendGrid</option>
            <option value="resend">Resend</option>
            <option value="smtp">Custom SMTP</option>
          </select>
        </div>
      </div>

      <div class="bg-amber-50/50 px-6 py-4 border-t border-amber-100/50">
        <p class="text-sm text-amber-700 flex items-center gap-2">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          通知設定目前需透過環境變數 (.env) 進行配置。未來版本將支援透過此頁面直接設定。
        </p>
      </div>
    </div>

    <!-- Business Settings -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-bold text-gray-800 mb-1">營業設定</h4>
          <span class="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-200">
            🚧 Coming Soon
          </span>
        </div>
      </div>
      <div class="p-6 space-y-4 opacity-50 pointer-events-none select-none">
         <div class="flex items-center justify-between">
            <div>
              <span class="block text-sm font-medium text-gray-700">開放預約天數</span>
              <span class="text-xs text-gray-400">設定客戶可預約未來幾天內的時段</span>
            </div>
            <select disabled class="px-3 py-1 rounded border border-gray-300 text-sm bg-gray-50">
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
            <div class="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent bg-gray-200" role="switch" aria-checked="false">
              <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 translate-x-0"></span>
            </div>
         </div>
      </div>
    </div>

    <!-- System Info -->
    <div class="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
      <h4 class="text-sm font-bold text-gray-500 mb-3 tracking-wider uppercase">系統資訊</h4>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-400">版本</span>
          <span class="font-mono text-gray-600">v1.0.0-dev</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">框架</span>
          <span class="font-mono text-gray-600">Nuxt 3 + Prisma</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">資料庫</span>
          <span class="font-mono text-gray-600">PostgreSQL</span>
        </div>
      </div>
    </div>
  </div>
</template>
