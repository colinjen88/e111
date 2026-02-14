<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const { data: staff, pending, refresh } = await useFetch('/api/admin/staff')
const { data: branches } = await useFetch('/api/branches')

const levelMap = {
  'Master': { label: '大師', class: 'bg-purple-100 text-purple-700' },
  'Senior': { label: '資深', class: 'bg-blue-100 text-blue-700' },
  'Junior': { label: '一般', class: 'bg-gray-100 text-gray-700' }
}

const isUpdating = ref(false)
const showAddModal = ref(false)
const showScheduleModal = ref(false)
const selectedStaff = ref<any>(null)
const editingSchedule = ref<any[]>([])

const daysFull = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const daysShort = ['日', '一', '二', '三', '四', '五', '六']

const toggleStatus = async (staffMember: any) => {
  if (isUpdating.value) return
  isUpdating.value = true
  try {
    await $fetch('/api/admin/staff_status', {
      method: 'PUT',
      body: { id: staffMember.id, isActive: !staffMember.isActive }
    })
    await refresh()
  } catch (error) {
    alert('更新失敗')
  } finally {
    isUpdating.value = false
  }
}

const openSchedule = async (s: any) => {
  selectedStaff.value = s
  editingSchedule.value = []
  try {
    const existing = await $fetch<any[]>(`/api/admin/staff_schedule?staffId=${s.id}`)
    for (let i = 0; i < 7; i++) {
      const found = existing.find(ex => ex.dayOfWeek === i)
      editingSchedule.value.push({
        dayOfWeek: i,
        isActive: found ? found.isActive : true,
        startTime: found ? found.startTime : '10:00',
        endTime: found ? found.endTime : '22:00'
      })
    }
    showScheduleModal.value = true
  } catch (error) {
    alert('讀取班表失敗')
  }
}

const saveSchedule = async () => {
  try {
    await $fetch('/api/admin/staff_schedule', {
      method: 'PUT',
      body: {
        staffId: selectedStaff.value.id,
        schedules: editingSchedule.value
      }
    })
    showScheduleModal.value = false
  } catch (error) {
    alert('儲存失敗')
  }
}

const newStaff = ref({
  name: '',
  code: '',
  branchId: '',
  level: 'Senior',
  bio: ''
})

const addStaff = async () => {
  try {
    await $fetch('/api/admin/staff', {
      method: 'POST',
      body: { ...newStaff.value, branchId: parseInt(newStaff.value.branchId as string) }
    })
    showAddModal.value = false
    newStaff.value = { name: '', code: '', branchId: '', level: 'Senior', bio: '' }
    await refresh()
  } catch (error) {
    alert('新增失敗')
  }
}
</script>

<template>
  <div class="h-full flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 font-serif text-brand-dark">技師管理</h1>
        <p class="text-gray-500 text-sm mt-1">管理各分館技師資料、階級與每週固定班表</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-brand-red/20 hover:bg-red-800 transition-all flex items-center gap-2 active:scale-95"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v8m0 0v8m0-8h8m-8 0H4"></path></svg>
        新增技師
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden flex-1 flex flex-col">
      <div v-if="pending" class="flex-1 flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red"></div>
      </div>

      <div v-else-if="!staff?.length" class="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <svg class="w-10 h-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <p class="font-medium">尚未建立技師資料</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] border-b border-gray-100 font-bold">
              <th class="px-8 py-5">技師資訊</th>
              <th class="px-6 py-5 text-center">階級</th>
              <th class="px-6 py-5">所屬分館</th>
              <th class="px-6 py-5">服務狀態</th>
              <th class="px-8 py-5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="s in staff" :key="s.id" class="hover:bg-brand-cream/30 transition-colors group">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100 shadow-inner group-hover:scale-105 transition-transform">
                    <img v-if="s.photoUrl" :src="s.photoUrl" class="w-full h-full object-cover">
                    <span v-else class="text-sm font-bold">{{ s.name[0] }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-gray-900 flex items-center gap-2">
                       {{ s.name }}
                       <span class="text-[9px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded-full font-mono border border-gray-100">#{{ s.code }}</span>
                    </div>
                    <div class="text-[11px] text-gray-400 truncate max-w-[200px]">{{ s.bio || '專業按摩技師' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <span :class="levelMap[s.level]?.class" class="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                  {{ levelMap[s.level]?.label || s.level }}
                </span>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                   <span class="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                   <span class="text-sm text-gray-600 font-medium">{{ s.branch.name }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <button @click="toggleStatus(s)" class="flex items-center gap-2 group/status">
                  <span :class="s.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-300'" class="w-2 h-2 rounded-full transition-all"></span>
                  <span class="text-[13px] font-medium transition-colors" :class="s.isActive ? 'text-green-700' : 'text-gray-400 group-hover/status:text-gray-600'">{{ s.isActive ? '服務中' : '休息中' }}</span>
                </button>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button @click="openSchedule(s)" class="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-brand-gold border border-brand-gold/20 rounded-lg hover:bg-brand-gold hover:text-white transition-all shadow-sm" title="設定班表">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    班表
                  </button>
                  <button class="p-2 text-gray-400 hover:text-brand-red transition-colors rounded-xl hover:bg-brand-red/5" title="編輯基本資料">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <Teleport to="body">
       <!-- Add Staff Modal -->
       <Transition name="fade">
          <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm">
             <div class="bg-white rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl border border-white/20" @click.stop>
                <div class="flex items-center gap-4 mb-8">
                   <div class="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red text-2xl">👤</div>
                   <div>
                      <h2 class="text-2xl font-bold text-gray-900 font-serif">新增技師</h2>
                      <p class="text-xs text-gray-400 tracking-wider">輸入基本資訊以建立技師帳號</p>
                   </div>
                </div>
                <form @submit.prevent="addStaff" class="space-y-6">
                   <div class="space-y-4">
                      <div>
                         <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">姓名</label>
                         <input v-model="newStaff.name" type="text" required placeholder="請輸入姓名" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red outline-none transition-all placeholder:text-gray-300">
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                         <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">技師編號</label>
                            <input v-model="newStaff.code" type="text" placeholder="例: 88" required class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red outline-none transition-all placeholder:text-gray-300">
                         </div>
                         <div>
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">階級</label>
                            <select v-model="newStaff.level" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red outline-none transition-all cursor-pointer">
                               <option value="Junior">一般 (Junior)</option>
                               <option value="Senior">資深 (Senior)</option>
                               <option value="Master">大師 (Master)</option>
                            </select>
                         </div>
                      </div>
                      <div>
                         <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">所屬分館</label>
                         <select v-model="newStaff.branchId" required class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red outline-none transition-all cursor-pointer">
                            <option value="" disabled>請選擇分館</option>
                            <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
                         </select>
                      </div>
                      <div>
                         <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">簡介 (選填)</label>
                         <textarea v-model="newStaff.bio" rows="3" placeholder="描述技師專長..." class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red outline-none transition-all resize-none placeholder:text-gray-300"></textarea>
                      </div>
                   </div>
                   <div class="flex gap-4 pt-4 text-sm font-bold tracking-widest">
                      <button type="button" @click="showAddModal = false" class="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl hover:bg-gray-50 hover:text-gray-600 transition-all active:scale-95">取消</button>
                      <button type="submit" class="flex-1 px-6 py-4 bg-brand-red text-white rounded-2xl shadow-xl shadow-brand-red/20 hover:bg-red-800 transition-all active:scale-95">確認新增</button>
                   </div>
                </form>
             </div>
          </div>
       </Transition>

       <!-- Schedule Modal -->
       <Transition name="fade">
          <div v-if="showScheduleModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm">
             <div class="bg-white rounded-[3rem] p-8 sm:p-10 max-w-2xl w-full shadow-2xl border border-white/20 overflow-hidden" @click.stop>
                <div class="flex justify-between items-start mb-10">
                   <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold text-2xl">⏳</div>
                      <div>
                         <h2 class="text-2xl font-bold text-gray-900 font-serif">設定固定班表</h2>
                         <p class="text-[11px] text-gray-400 tracking-wider font-medium uppercase">{{ selectedStaff?.name }} - 每週固定服務時段</p>
                      </div>
                   </div>
                   <button @click="showScheduleModal = false" class="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                   </button>
                </div>
                
                <div class="space-y-4 max-h-[50vh] overflow-y-auto px-1 no-scrollbar mb-10">
                   <div v-for="(day, idx) in editingSchedule" :key="idx" 
                      class="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl border transition-all"
                      :class="day.isActive ? 'bg-brand-cream/20 border-brand-gold/20 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'"
                   >
                      <div class="flex items-center gap-4 w-full sm:w-32">
                         <button 
                            type="button"
                            @click="day.isActive = !day.isActive"
                            class="w-10 h-10 rounded-xl flex items-center justify-center transition-all font-bold text-sm"
                            :class="day.isActive ? 'bg-brand-gold text-white shadow-lg shadow-brand-gold/20' : 'bg-gray-200 text-gray-500'"
                         >
                            {{ daysShort[day.dayOfWeek] }}
                         </button>
                         <span class="text-sm font-bold sm:hidden">{{ daysFull[day.dayOfWeek] }}</span>
                      </div>
                      
                      <div class="flex-1 flex items-center gap-3 w-full" :class="{ 'pointer-events-none grayscale opacity-40': !day.isActive }">
                         <div class="flex-1 relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase">START</span>
                            <input v-model="day.startTime" type="time" class="w-full bg-white border border-gray-100 rounded-xl pl-16 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-gold/20 outline-none">
                         </div>
                         <div class="text-gray-300">→</div>
                         <div class="flex-1 relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase">END</span>
                            <input v-model="day.endTime" type="time" class="w-full bg-white border border-gray-100 rounded-xl pl-14 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-gold/20 outline-none">
                         </div>
                      </div>
                      
                      <div class="w-full sm:w-auto text-center">
                         <span v-if="!day.isActive" class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">休假</span>
                         <span v-else class="text-[10px] font-bold text-brand-gold uppercase tracking-widest">執勤</span>
                      </div>
                   </div>
                </div>
                
                <div class="flex gap-4 pt-4 border-t border-gray-50 text-sm font-bold tracking-widest">
                   <button @click="showScheduleModal = false" class="flex-1 px-8 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl hover:bg-gray-50 transition-all active:scale-95 uppercase">取消</button>
                   <button @click="saveSchedule" class="flex-1 px-8 py-4 bg-brand-dark text-white rounded-2xl shadow-xl shadow-gray-950/20 hover:bg-black transition-all active:scale-95 uppercase">儲存變更</button>
                </div>
             </div>
          </div>
       </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
