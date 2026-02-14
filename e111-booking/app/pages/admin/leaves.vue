<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const { data: leaves, pending, refresh } = await useFetch('/api/admin/leaves')
const { data: staffList } = await useFetch('/api/admin/staff')

const typeMap = {
  'Vacation': { label: '特休', class: 'bg-green-100 text-green-700' },
  'Sick': { label: '病假', class: 'bg-red-100 text-red-700' },
  'Personal': { label: '事假', class: 'bg-blue-100 text-blue-700' },
  'Training': { label: '公假/訓練', class: 'bg-purple-100 text-purple-700' }
}

const statusMap = {
  'Approved': { label: '已核准', class: 'text-green-600' },
  'Pending': { label: '待審核', class: 'text-amber-600' },
  'Rejected': { label: '已拒絕', class: 'text-gray-400' }
}

const showAddModal = ref(false)
const isSubmitting = ref(false)

const newLeave = ref({
  staffId: '',
  startDate: '',
  endDate: '',
  type: 'Vacation',
  reason: ''
})

const submitLeave = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    await $fetch('/api/admin/leaves', {
      method: 'POST',
      body: newLeave.value
    })
    showAddModal.value = false
    newLeave.value = { staffId: '', startDate: '', endDate: '', type: 'Vacation', reason: '' }
    await refresh()
  } catch (error) {
    alert('提交失敗')
  } finally {
    isSubmitting.value = false
  }
}

const deleteLeave = async (id: number) => {
  if (!confirm('確定要刪除此請假紀錄嗎？')) return
  try {
    await $fetch('/api/admin/leaves', {
      method: 'PATCH',
      body: { id, action: 'delete' }
    })
    await refresh()
  } catch (error) {
    alert('刪除失敗')
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<template>
  <div class="h-full flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 font-serif text-brand-dark">休假管理</h1>
        <p class="text-gray-500 text-sm mt-1">登記技師休假，系統將自動排除預約時段</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-brand-red/20 hover:bg-red-800 transition-all flex items-center gap-2 active:scale-95"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        登記休假
      </button>
    </div>

    <!-- Leaves List -->
    <div class="bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden flex-1 flex flex-col">
      <div v-if="pending" class="flex-1 flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red"></div>
      </div>

      <div v-else-if="!leaves?.length" class="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-3xl">🗓️</div>
        <p class="font-medium">尚無休假紀錄</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] border-b border-gray-100 font-bold">
              <th class="px-8 py-5">技師</th>
              <th class="px-6 py-5">休假期間</th>
              <th class="px-6 py-5">種類</th>
              <th class="px-6 py-5">理由</th>
              <th class="px-6 py-5">狀態</th>
              <th class="px-8 py-5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="l in leaves" :key="l.id" class="hover:bg-brand-cream/30 transition-colors group">
              <td class="px-8 py-5">
                <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-200">
                      {{ l.staff.name[0] }}
                   </div>
                   <div>
                      <div class="text-sm font-bold text-gray-900">{{ l.staff.name }}</div>
                      <div class="text-[10px] text-gray-400 font-mono">#{{ l.staff.code }} · {{ l.staff.branch.name }}</div>
                   </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="text-sm font-medium text-gray-700">
                   {{ formatDate(l.startDate) }} 
                   <span class="mx-1 text-gray-300">→</span>
                   {{ formatDate(l.endDate) }}
                </div>
              </td>
              <td class="px-6 py-5">
                <span :class="typeMap[l.type]?.class" class="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider">
                   {{ typeMap[l.type]?.label || l.type }}
                </span>
              </td>
              <td class="px-6 py-5">
                <div class="text-xs text-gray-500 italic max-w-xs truncate">{{ l.reason || '-' }}</div>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                   <span :class="l.status === 'Approved' ? 'bg-green-500' : 'bg-amber-500'" class="w-1.5 h-1.5 rounded-full"></span>
                   <span class="text-xs font-bold" :class="statusMap[l.status]?.class">{{ statusMap[l.status]?.label }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-right">
                 <button @click="deleteLeave(l.id)" class="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-xl opacity-0 group-hover:opacity-100">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                 </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Leave Modal -->
    <Transition name="fade">
       <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm">
          <div class="bg-white rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl border border-white/20" @click.stop>
             <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red text-2xl">🌴</div>
                <div>
                   <h2 class="text-2xl font-bold text-gray-900 font-serif">登記休假</h2>
                   <p class="text-xs text-gray-400 tracking-wider">選取技師與日期，系統將暫停開放預約</p>
                </div>
             </div>
             <form @submit.prevent="submitLeave" class="space-y-6">
                <div class="space-y-4">
                   <div>
                      <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">選擇技師</label>
                      <select v-model="newLeave.staffId" required class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red outline-none transition-all cursor-pointer">
                         <option value="" disabled>請選擇技師</option>
                         <option v-for="s in staffList" :key="s.id" :value="s.id">{{ s.name }} ({{ s.branch.name }} #{{ s.code }})</option>
                      </select>
                   </div>
                   <div class="grid grid-cols-2 gap-4">
                      <div>
                         <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">開始日期</label>
                         <input v-model="newLeave.startDate" type="date" required class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red outline-none transition-all">
                      </div>
                      <div>
                         <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">結束日期</label>
                         <input v-model="newLeave.endDate" type="date" required class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red outline-none transition-all">
                      </div>
                   </div>
                   <div>
                      <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">休假種類</label>
                      <select v-model="newLeave.type" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red outline-none transition-all cursor-pointer">
                         <option value="Vacation">特休 (Vacation)</option>
                         <option value="Sick">病假 (Sick)</option>
                         <option value="Personal">事假 (Personal)</option>
                         <option value="Training">公假/訓練 (Training)</option>
                      </select>
                   </div>
                   <div>
                      <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">備註/原因</label>
                      <textarea v-model="newLeave.reason" rows="2" placeholder="詳細資訊..." class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red outline-none transition-all resize-none"></textarea>
                   </div>
                </div>
                <div class="flex gap-4 pt-4 text-sm font-bold tracking-widest">
                   <button type="button" @click="showAddModal = false" class="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl hover:bg-gray-50 hover:text-gray-600 transition-all active:scale-95">取消</button>
                   <button type="submit" :disabled="isSubmitting" class="flex-1 px-6 py-4 bg-brand-red text-white rounded-2xl shadow-xl shadow-brand-red/20 hover:bg-red-800 transition-all disabled:opacity-50 active:scale-95">確認送出</button>
                </div>
             </form>
          </div>
       </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
