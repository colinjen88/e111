<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const { data: bookings, pending, refresh } = await useFetch('/api/admin/bookings')

const statusClasses = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Completed': 'bg-blue-100 text-blue-800'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-TW', { 
    month: 'numeric', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  })
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Filters -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h3 class="text-xl font-bold text-gray-800">最新預約</h3>
        <span class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
          Total: {{ bookings?.length || 0 }}
        </span>
      </div>
      <div class="flex gap-2">
        <button @click="refresh" class="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="重新整理">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
        <button class="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          篩選
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-1">
      <div v-if="pending" class="h-64 flex items-center justify-center text-gray-400">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mr-3"></div>
        載入中...
      </div>
      
      <div v-else class="overflow-x-auto h-full">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th class="px-6 py-4 font-semibold">ID</th>
              <th class="px-6 py-4 font-semibold">預約時間</th>
              <th class="px-6 py-4 font-semibold">客戶</th>
              <th class="px-6 py-4 font-semibold">服務項目</th>
              <th class="px-6 py-4 font-semibold">技師</th>
              <th class="px-6 py-4 font-semibold">狀態</th>
              <th class="px-6 py-4 font-semibold">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-4 text-sm font-mono text-gray-400">#{{ booking.id }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-bold text-gray-800">{{ booking.bookingDate.split('T')[0] }}</div>
                <div class="text-xs text-gray-500 font-mono">{{ booking.startTime.split('T')[1].substr(0,5) }} - {{ booking.endTime.split('T')[1].substr(0,5) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ booking.customer.name }}</div>
                <div class="text-xs text-gray-400 font-mono mt-0.5">{{ booking.customer.phone }}</div>
              </td>
              <td class="px-6 py-4">
                 <div class="flex flex-col gap-1">
                   <span v-for="item in booking.items" :key="item.id" class="text-sm text-gray-700">
                     {{ item.service.name }}
                   </span>
                 </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                   <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold">
                     {{ booking.staff?.name?.charAt(0) || '?' }}
                   </div>
                   <span class="text-sm text-gray-600">{{ booking.staff?.name || '未分配' }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="statusClasses[booking.status] || 'bg-gray-100 text-gray-800'" class="px-2 py-1 rounded-full text-xs font-bold">
                  {{ booking.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button class="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
