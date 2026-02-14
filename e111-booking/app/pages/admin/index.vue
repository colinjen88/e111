<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const { data: bookings, pending: bookingsPending, refresh: refreshBookings } = await useFetch('/api/admin/bookings')
const { data: stats, pending: statsPending, refresh: refreshStats } = await useFetch('/api/admin/stats')

const refresh = async () => {
  await Promise.all([refreshBookings(), refreshStats()])
}

const statusClasses = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Completed': 'bg-blue-100 text-blue-800'
}

const formatMoney = (val: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
}

// Chart Helpers
const maxRevenue = computed(() => {
    if (!stats.value?.chartData) return 100
    const max = Math.max(...stats.value.chartData.map(d => d.revenue))
    return max === 0 ? 100 : max
})
</script>

<template>
  <div class="h-full flex flex-col gap-6">
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <!-- Today -->
        <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
           <div class="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">今日營收</div>
           <div class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats ? formatMoney(stats.stats.today.revenue) : '...' }}</div>
           <div class="text-xs sm:text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              {{ stats ? stats.stats.today.count : 0 }} 筆訂單
           </div>
        </div>

       <!-- Month -->
        <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
           <div class="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">本月營收 (近30日)</div>
           <div class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats ? formatMoney(stats.stats.month.revenue) : '...' }}</div>
           <div class="text-xs sm:text-sm text-gray-400 mt-2">
              共 {{ stats ? stats.stats.month.count : 0 }} 筆訂單
           </div>
        </div>

       <!-- Action -->
       <div class="bg-gradient-to-br from-brand-red to-red-900 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
          <div class="relative z-10">
             <div class="text-white/80 text-sm font-medium mb-1">系統狀態</div>
             <div class="text-2xl font-bold">正常運作中</div>
          </div>
          <button @click="refresh" class="relative z-10 mt-4 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors w-fit">
             重新整理數據
          </button>
          <div class="absolute right-0 bottom-0 opacity-10 transform translate-y-1/2 translate-x-1/4">
             <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg>
          </div>
       </div>
    </div>

    <!-- Chart Section -->
    <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 class="text-lg font-bold text-gray-800 mb-6">近 30 日營收趨勢</h3>
        <div class="h-48 flex items-end gap-1 md:gap-2 overflow-x-auto no-scrollbar pb-2">
            <div 
               v-for="(day, idx) in stats?.chartData || []" 
               :key="idx" 
               class="min-w-[12px] flex-1 flex flex-col items-center group relative"
            >
               <!-- Tooltip -->
               <div class="absolute bottom-full mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {{ day.fullDate }}: {{ formatMoney(day.revenue) }} ({{ day.count }}單)
               </div>
               
               <!-- Bar -->
               <div 
                  class="w-full bg-brand-gold/30 hover:bg-brand-gold/60 rounded-t transition-all duration-300 relative overflow-hidden"
                  :style="{ height: `${(day.revenue / maxRevenue) * 100}%`, minHeight: day.revenue > 0 ? '4px': '0' }"
               >
                 <div v-if="day.revenue > 0" class="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold"></div>
               </div>
               
               <!-- Label (Every 5 days) -->
               <div v-if="idx % 5 === 0 || idx === stats?.chartData?.length - 1" class="text-[10px] text-gray-400 mt-2">
                 {{ day.date }}
               </div>
            </div>
        </div>
    </div>

    <!-- Recent Bookings -->
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col">
      <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
         <h3 class="font-bold text-gray-800">最新預約</h3>
         <NuxtLink to="/admin/bookings" class="text-sm text-brand-red hover:underline font-medium">查看全部 →</NuxtLink>
      </div>
      
      <div v-if="bookingsPending" class="h-48 flex items-center justify-center text-gray-400">
        <UiLoadingSpinner size="md" text="載入中..." />
      </div>
      
      <div v-else-if="!bookings?.length" class="p-8 text-center text-gray-400 text-sm">
         尚無預約資料
      </div>

      <template v-else>
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th class="px-5 py-3 font-semibold">ID</th>
                <th class="px-5 py-3 font-semibold">預約時間</th>
                <th class="px-5 py-3 font-semibold">客戶</th>
                <th class="px-5 py-3 font-semibold">服務/技師</th>
                <th class="px-5 py-3 font-semibold">金額</th>
                <th class="px-5 py-3 font-semibold">狀態</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="booking in bookings?.slice(0, 5)" :key="booking.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-3.5 text-sm font-mono text-gray-400">#{{ booking.id }}</td>
                <td class="px-5 py-3.5">
                  <div class="text-sm font-bold text-gray-800">{{ booking.bookingDate.split('T')[0] }}</div>
                  <div class="text-xs text-gray-500 font-mono">{{ booking.startTime.split('T')[1]?.substr(0,5) }}</div>
                </td>
                <td class="px-5 py-3.5">
                  <div class="text-sm font-medium text-gray-900">{{ booking.customer.name }}</div>
                  <div class="text-xs text-gray-400">{{ booking.customer.phone }}</div>
                </td>
                <td class="px-5 py-3.5">
                    <div class="text-sm text-gray-700">{{ booking.items[0]?.service.name }}</div>
                    <div class="text-xs text-gray-500">{{ booking.staff?.name || '無指定' }}</div>
                </td>
                <td class="px-5 py-3.5 font-bold text-gray-700 font-mono text-sm">
                    ${{ Math.floor(booking.totalPrice) }}
                </td>
                <td class="px-5 py-3.5">
                  <span :class="statusClasses[booking.status] || 'bg-gray-100 text-gray-800'" class="px-2 py-1 rounded-full text-xs font-bold">
                    {{ booking.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card List -->
        <div class="md:hidden divide-y divide-gray-100">
          <div v-for="booking in bookings?.slice(0, 5)" :key="booking.id" class="p-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono text-gray-400">#{{ booking.id }}</span>
              <span :class="statusClasses[booking.status] || 'bg-gray-100 text-gray-800'" class="px-2 py-0.5 rounded-full text-[10px] font-bold">
                {{ booking.status }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-bold text-gray-900">{{ booking.customer.name }}</div>
                <div class="text-xs text-gray-400">{{ booking.customer.phone }}</div>
              </div>
              <div class="text-base font-bold text-brand-red font-mono">${{ Math.floor(booking.totalPrice) }}</div>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span>📅 {{ booking.bookingDate.split('T')[0] }} {{ booking.startTime.split('T')[1]?.substr(0,5) }}</span>
              <span>{{ booking.items[0]?.service.name }}</span>
              <span>{{ booking.staff?.name || '無指定' }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
