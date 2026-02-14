<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const { data: bookings, pending, refresh } = await useFetch('/api/admin/bookings')

const searchQuery = ref('')
const statusFilter = ref('all')
const updating = ref<number | null>(null)

const statusClasses: Record<string, string> = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Completed': 'bg-blue-100 text-blue-800'
}

const statusLabels: Record<string, string> = {
  'Pending': '待確認',
  'Confirmed': '已確認',
  'Cancelled': '已取消',
  'Completed': '已完成'
}

// Which actions are available per status
const statusActions: Record<string, { label: string; to: string; color: string; icon: string }[]> = {
  'Pending': [
    { label: '確認', to: 'Confirmed', color: 'bg-green-500 hover:bg-green-600 text-white', icon: '✓' },
    { label: '取消', to: 'Cancelled', color: 'bg-red-100 hover:bg-red-200 text-red-700', icon: '✕' },
  ],
  'Confirmed': [
    { label: '完成', to: 'Completed', color: 'bg-blue-500 hover:bg-blue-600 text-white', icon: '✓' },
    { label: '取消', to: 'Cancelled', color: 'bg-red-100 hover:bg-red-200 text-red-700', icon: '✕' },
  ],
  'Cancelled': [],
  'Completed': [],
}

const updateStatus = async (bookingId: number, newStatus: string) => {
  if (updating.value) return

  const actionLabel = newStatus === 'Confirmed' ? '確認' : newStatus === 'Cancelled' ? '取消' : '完成'
  if (!confirm(`確定要「${actionLabel}」這筆訂單 #${bookingId} 嗎？`)) return

  updating.value = bookingId
  try {
    await $fetch('/api/admin/bookings', {
      method: 'PATCH',
      body: { bookingId, status: newStatus }
    })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || err?.statusMessage || '操作失敗')
  } finally {
    updating.value = null
  }
}

const filteredBookings = computed(() => {
  if (!bookings.value) return []
  let list = [...bookings.value]

  if (statusFilter.value !== 'all') {
    list = list.filter(b => b.status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(b =>
      b.customer?.name?.toLowerCase().includes(q) ||
      b.customer?.phone?.includes(q) ||
      String(b.id).includes(q)
    )
  }

  return list
})

const statusCount = (status: string) => {
  if (!bookings.value) return 0
  if (status === 'all') return bookings.value.length
  return bookings.value.filter(b => b.status === status).length
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  return dateStr.split('T')[0]
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return '—'
  return timeStr.split('T')[1]?.substring(0, 5) || timeStr
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <h3 class="text-lg sm:text-xl font-bold text-gray-800">訂單查詢</h3>
      <button @click="refresh" class="text-sm text-brand-red hover:underline font-medium flex items-center gap-1 self-start sm:self-auto">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        重新整理
      </button>
    </div>

    <!-- Search + Filters -->
    <div class="flex flex-col gap-3">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋姓名、手機、訂單編號..."
          class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/40 outline-none text-sm transition-all bg-white"
        >
      </div>
      <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          v-for="s in ['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled']"
          :key="s"
          @click="statusFilter = s"
          class="px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-all flex items-center gap-1"
          :class="statusFilter === s
            ? 'bg-brand-red text-white border-brand-red shadow-sm'
            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'"
        >
          {{ s === 'all' ? '全部' : statusLabels[s] || s }}
          <span class="opacity-70">({{ statusCount(s) }})</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="py-16 flex items-center justify-center text-gray-400">
      <UiLoadingSpinner size="md" text="載入中..." />
    </div>

    <!-- Empty -->
    <div v-else-if="filteredBookings.length === 0" class="py-16 text-center text-gray-400 text-sm">
      <div class="text-4xl mb-3">📋</div>
      {{ searchQuery || statusFilter !== 'all' ? '沒有符合條件的訂單' : '尚無預約資料' }}
    </div>

    <template v-else>
      <!-- Desktop Table -->
      <div class="hidden lg:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th class="px-4 py-3 font-semibold">ID</th>
              <th class="px-4 py-3 font-semibold">預約時間</th>
              <th class="px-4 py-3 font-semibold">客戶</th>
              <th class="px-4 py-3 font-semibold">服務/技師</th>
              <th class="px-4 py-3 font-semibold">金額</th>
              <th class="px-4 py-3 font-semibold">狀態</th>
              <th class="px-4 py-3 font-semibold text-center">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="booking in filteredBookings" :key="booking.id"
              class="hover:bg-gray-50/80 transition-colors"
              :class="{ 'bg-yellow-50/50': booking.status === 'Pending' }">
              <td class="px-4 py-3 text-sm font-mono text-gray-400">#{{ booking.id }}</td>
              <td class="px-4 py-3">
                <div class="text-sm font-bold text-gray-800">{{ formatDate(booking.bookingDate) }}</div>
                <div class="text-xs text-gray-500 font-mono">{{ formatTime(booking.startTime) }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm font-medium text-gray-900">{{ booking.customer?.name }}</div>
                <div class="text-xs text-gray-400">{{ booking.customer?.phone }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm text-gray-700">{{ booking.items?.[0]?.service?.name || '—' }}</div>
                <div class="text-xs text-gray-500">{{ booking.staff?.name || '無指定' }}</div>
              </td>
              <td class="px-4 py-3 font-bold text-gray-700 font-mono text-sm">
                ${{ Math.floor(booking.totalPrice) }}
              </td>
              <td class="px-4 py-3">
                <span :class="statusClasses[booking.status] || 'bg-gray-100 text-gray-800'" class="px-2.5 py-1 rounded-full text-xs font-bold">
                  {{ statusLabels[booking.status] || booking.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-1.5">
                  <template v-if="statusActions[booking.status]?.length">
                    <button
                      v-for="action in statusActions[booking.status]"
                      :key="action.to"
                      @click="updateStatus(booking.id, action.to)"
                      :disabled="updating === booking.id"
                      class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                      :class="action.color"
                    >
                      <span v-if="updating === booking.id" class="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin"></span>
                      <span v-else>{{ action.icon }}</span>
                      {{ action.label }}
                    </button>
                  </template>
                  <span v-else class="text-xs text-gray-300">—</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card List -->
      <div class="lg:hidden space-y-3">
        <div v-for="booking in filteredBookings" :key="booking.id"
          class="bg-white rounded-xl border shadow-sm overflow-hidden"
          :class="booking.status === 'Pending' ? 'border-yellow-200' : 'border-gray-100'">
          <div class="p-4 space-y-3">
            <!-- Top row: ID + Status -->
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono text-gray-400">#{{ booking.id }}</span>
              <span :class="statusClasses[booking.status] || 'bg-gray-100 text-gray-800'" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                {{ statusLabels[booking.status] || booking.status }}
              </span>
            </div>
            <!-- Customer + Price -->
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-bold text-gray-900">{{ booking.customer?.name }}</div>
                <div class="text-xs text-gray-400">{{ booking.customer?.phone }}</div>
              </div>
              <div class="text-base font-bold text-brand-red font-mono">${{ Math.floor(booking.totalPrice) }}</div>
            </div>
            <!-- Details -->
            <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {{ formatDate(booking.bookingDate) }} {{ formatTime(booking.startTime) }}
              </span>
              <span>{{ booking.items?.[0]?.service?.name || '—' }}</span>
              <span>{{ booking.staff?.name || '無指定' }}</span>
            </div>
          </div>
          <!-- Action Buttons -->
          <div v-if="statusActions[booking.status]?.length" class="flex border-t border-gray-100 divide-x divide-gray-100">
            <button
              v-for="action in statusActions[booking.status]"
              :key="action.to"
              @click="updateStatus(booking.id, action.to)"
              :disabled="updating === booking.id"
              class="flex-1 py-2.5 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1"
              :class="action.to === 'Cancelled'
                ? 'text-red-500 hover:bg-red-50'
                : action.to === 'Confirmed'
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-blue-600 hover:bg-blue-50'"
            >
              <span v-if="updating === booking.id" class="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin"></span>
              <span v-else>{{ action.icon }}</span>
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Count -->
      <div class="text-xs text-gray-400 text-right">
        顯示 {{ filteredBookings.length }} 筆{{ bookings ? ` / 共 ${bookings.length} 筆` : '' }}
      </div>
    </template>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
