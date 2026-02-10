<script setup lang="ts">
// Booking Flow Logic
const step = ref(1)
const bookingData = reactive({
  branch: null as any,
  service: null as any,
  staff: null as any, // null means "No Preference"
  date: new Date().toISOString().split('T')[0], // Default today
  time: null as string | null,
  customer: {
    name: '',
    phone: '',
    email: '',
    note: ''
  }
})

// Step 1: Fetch Branches
const { data: branches, pending: loadingBranches, error: errorBranches } = useLazyFetch('/api/branches')

// Step 2: Fetch Services
const { data: categories, pending: loadingServices, error: errorServices } = useLazyFetch('/api/services')
const activeCategory = ref(null as any)

// Watch categories
watch(categories, (cats) => {
  if (cats && cats.length > 0) activeCategory.value = cats[0]
})

// Step 3: Fetch Staff
const { data: staffList, pending: loadingStaff, refresh: refreshStaff, error: errorStaff } = useLazyFetch('/api/staff', {
  immediate: false,
  query: computed(() => ({ branchId: bookingData.branch?.id }))
})

// Step 4: Fetch Availability
const { data: availability, pending: loadingSlots, refresh: refreshSlots, error: errorSlots } = useLazyFetch('/api/availability', {
  immediate: false,
  query: computed(() => ({
    date: bookingData.date,
    branchId: bookingData.branch?.id,
    staffId: bookingData.staff?.id,
    duration: bookingData.service?.durationMinutes
  }))
})

// Submission State
const submitting = ref(false)
const submitError = ref('')
const bookingResult = ref(null as any)

// Selection Handlers
const selectBranch = (branch: any) => {
  bookingData.branch = branch
  step.value = 2
}

const selectCategory = (category: any) => {
  activeCategory.value = category
}

const selectService = (service: any) => {
  bookingData.service = service
  step.value = 3
  refreshStaff()
}

const selectStaff = (staff: any) => {
  bookingData.staff = staff
  step.value = 4
  refreshSlots()
}

const selectNoPreference = () => {
  bookingData.staff = null
  step.value = 4
  refreshSlots()
}

const selectDate = (dateStr: string) => {
  bookingData.date = dateStr
  bookingData.time = null // Reset time when date changes
  refreshSlots()
}

const selectTime = (time: string, isAvailable: boolean) => {
  if (!isAvailable) return
  bookingData.time = time
  step.value = 5 // Go to confirmation
}

const goBack = () => {
  if (step.value > 1 && step.value < 6) {
    step.value--
  }
}

// Booking Submission
const submitBooking = async () => {
  // Simple Validation
  if (!bookingData.customer.name || !bookingData.customer.phone) {
    alert('請填寫姓名與電話')
    return
  }

  submitting.value = true
  submitError.value = ''

  try {
    const { data, error } = await useFetch('/api/bookings', {
      method: 'POST',
      body: {
        branchId: bookingData.branch?.id,
        serviceId: bookingData.service?.id,
        staffId: bookingData.staff?.id, // Can be null
        date: bookingData.date,
        time: bookingData.time,
        user: {
            name: bookingData.customer.name,
            phone: bookingData.customer.phone,
            email: bookingData.customer.email,
            note: bookingData.customer.note
        }
      }
    })

    if (error.value) {
        // Safe error access
        const errMsg = error.value.data?.statusMessage || error.value.message || 'Booking Failed'
        throw new Error(errMsg)
    }

    bookingResult.value = data.value
    step.value = 6 // Success Step

  } catch (err: any) {
    submitError.value = err.message || '預約失敗，請稍後再試'
    console.error(err)
  } finally {
    submitting.value = false
  }
}

// Helper: Get next 7 days for date picker
const next7Days = computed(() => {
  const days = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: i === 0 ? '今日' : i === 1 ? '明日' : d.toLocaleDateString('zh-TW', { weekday: 'short' }),
      dayNum: d.getDate()
    })
  }
  return days
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-3xl">
      <!-- (Header & Progress Bar) -->
      <div class="mb-8 flex items-center justify-between">
        <NuxtLink to="/" class="text-gray-500 hover:text-gray-900 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          回首頁
        </NuxtLink>
        <h1 class="text-xl font-bold text-gray-800">線上預約</h1>
        <div class="w-16"></div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-4 mb-8" v-if="step < 6">
        <div class="flex justify-between items-center relative">
          <div class="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 -z-10"></div>
          <div class="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-red-500 transition-all duration-300 -z-10" 
            :style="{ width: `${((step - 1) / 4) * 100}%` }"></div>
          <div v-for="i in 5" :key="i" 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300"
            :class="step >= i ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'">
            {{ i }}
          </div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-500 font-medium px-1">
          <span>分館</span>
          <span>服務</span>
          <span>技師</span>
          <span>時間</span>
          <span>確認</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 min-h-[400px]">
        
        <!-- Step 1: Branch -->
        <div v-if="step === 1" class="animate-fade-in">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">選擇服務據點</h2>
          <div v-if="loadingBranches" class="py-12 flex justify-center"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div></div>
          <div v-else-if="errorBranches" class="py-12 text-center text-red-500">載入失敗</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button v-for="branch in branches" :key="branch.id" @click="selectBranch(branch)" class="group relative p-5 border-2 border-transparent bg-gray-50 rounded-xl hover:bg-white hover:border-red-500 transition-all duration-200 text-left hover:shadow-md active:scale-95">
              <div class="flex justify-between items-start mb-2">
                <span class="font-bold text-lg text-gray-900">{{ branch.name }}</span>
                <span v-if="branch.isActive" class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">營業中</span>
              </div>
              <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ branch.address }}</p>
              <div class="flex items-center text-red-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">選擇此分館 →</div>
            </button>
          </div>
        </div>

        <!-- Step 2: Service -->
        <div v-if="step === 2" class="animate-fade-in">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">選擇服務項目</h2>
            <button @click="goBack" class="text-sm text-gray-500 hover:text-gray-900">更換分館</button>
          </div>
          <div v-if="loadingServices" class="py-12 flex justify-center"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div></div>
          <div v-else-if="errorServices" class="py-12 text-center text-red-500">載入失敗</div>
          <div v-else>
            <div class="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar border-b border-gray-100">
              <button v-for="cat in categories" :key="cat.id" @click="selectCategory(cat)" class="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors" :class="activeCategory?.id === cat.id ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">{{ cat.name }}</button>
            </div>
            <div v-if="activeCategory" class="space-y-4 animate-fade-in">
              <p v-if="activeCategory.services.length === 0" class="text-center text-gray-500 py-8">此分類目前沒有服務項目</p>
              <button v-for="service in activeCategory.services" :key="service.id" @click="selectService(service)" class="w-full flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all group text-left">
                <div>
                  <h3 class="font-bold text-gray-800 text-lg group-hover:text-red-700">{{ service.name }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ service.description || '暫無描述' }}</p>
                  <div class="flex items-center gap-3 mt-2 text-xs font-medium text-gray-400">
                    <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" /></svg> {{ service.durationMinutes }} 分鐘</span>
                  </div>
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-lg font-bold text-red-600">NT$ {{ service.basePrice }}</span>
                  <span class="text-xs text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">選擇 →</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Staff -->
        <div v-if="step === 3" class="animate-fade-in">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">選擇服務技師</h2>
            <button @click="goBack" class="text-sm text-gray-500 hover:text-gray-900">更換服務</button>
          </div>
          <div v-if="loadingStaff" class="py-12 flex justify-center"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div></div>
          <div v-else-if="errorStaff" class="py-12 text-center text-red-500">載入失敗</div>
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button @click="selectNoPreference" class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all text-gray-500 hover:text-red-700 min-h-[180px]">
              <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-2xl font-bold text-gray-400">?</div>
              <span class="font-bold text-lg">不指定技師</span><span class="text-xs mt-1">系統自動安排</span>
            </button>
            <button v-for="member in staffList" :key="member.id" @click="selectStaff(member)" class="relative flex flex-col items-center p-4 border border-gray-100 rounded-xl hover:border-red-500 hover:shadow-lg transition-all bg-white group min-h-[180px]">
              <div class="w-20 h-20 rounded-full bg-gray-200 mb-3 overflow-hidden shadow-sm border-2 border-white group-hover:border-red-500 transition-colors">
                <img v-if="member.photoUrl" :src="member.photoUrl" class="w-full h-full object-cover">
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">{{ member.name.charAt(0) }}</div>
              </div>
              <div class="text-center">
                <h3 class="font-bold text-gray-900 text-lg">{{ member.name }}</h3>
                <div class="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full mt-1 mb-2">{{ member.level }}</div>
                <p class="text-xs text-brand-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4 left-0 right-0">選擇此技師</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 4: DateTime -->
        <div v-if="step === 4" class="animate-fade-in">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">選擇預約日期</h2>
            <button @click="goBack" class="text-sm text-gray-500 hover:text-gray-900">更換技師</button>
          </div>

          <!-- Horizontal Date Picker -->
          <div class="flex overflow-x-auto pb-4 gap-2 no-scrollbar mb-8">
            <button v-for="day in next7Days" :key="day.dateStr"
              @click="selectDate(day.dateStr)"
              class="flex flex-col items-center justify-center min-w-[70px] h-[80px] rounded-xl border-2 transition-all p-2"
              :class="bookingData.date === day.dateStr ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'">
              <span class="text-xs font-medium mb-1">{{ day.dayName }}</span>
              <span class="text-2xl font-bold">{{ day.dayNum }}</span>
            </button>
          </div>

          <!-- Time Slots -->
          <div v-if="loadingSlots" class="py-12 flex justify-center">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
          </div>
          
          <div v-else-if="errorSlots" class="py-12 text-center text-red-500">
            無法載入時段，請稍後再試
          </div>

          <div v-else>
            <h3 class="text-lg font-bold text-gray-800 mb-4">{{ bookingData.date }} 可預約時段</h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              <button v-for="block in availability?.blocks || []" :key="block.time"
                @click="selectTime(block.time, block.available)"
                :disabled="!block.available"
                class="py-3 rounded-lg text-sm font-medium transition-all border"
                :class="block.available ? 'border-gray-200 bg-white hover:border-red-500 hover:text-red-500 hover:bg-red-50 text-gray-700 shadow-sm' : 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed'">
                {{ block.time }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 5: Customer Info & Confirmation -->
        <div v-if="step === 5">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">填寫資料與確認</h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Summary -->
            <div class="order-2 md:order-1">
              <h3 class="text-lg font-bold text-gray-700 mb-4">預約資訊</h3>
              <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-3 sticky top-6">
                <div class="flex justify-between">
                  <span class="text-gray-500">分館</span>
                  <span class="font-bold text-gray-900">{{ bookingData.branch?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">服務</span>
                  <span class="font-bold text-gray-900">{{ bookingData.service?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">技師</span>
                  <span class="font-bold text-gray-900">{{ bookingData.staff?.name || '不指定' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">時間</span>
                  <span class="font-bold text-red-600">{{ bookingData.date }} {{ bookingData.time }}</span>
                </div>
                <div class="flex justify-between border-t border-gray-200 pt-3 mt-3">
                  <span class="text-gray-500">預估費用</span>
                  <span class="font-bold text-xl text-gray-900">NT$ {{ bookingData.service?.basePrice }}</span>
                </div>
              </div>
            </div>

            <!-- Form -->
            <div class="order-1 md:order-2">
               <h3 class="text-lg font-bold text-gray-700 mb-4">聯絡人資料</h3>
               <form @submit.prevent="submitBooking" class="space-y-4">
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">姓名 <span class="text-red-500">*</span></label>
                   <input v-model="bookingData.customer.name" type="text" required class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="請輸入姓名">
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">手機號碼 <span class="text-red-500">*</span></label>
                   <input v-model="bookingData.customer.phone" type="tel" required class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="請輸入手機號碼">
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-gray-400 text-xs">(選填)</span></label>
                   <input v-model="bookingData.customer.email" type="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="接收預約確認信">
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">備註需求</label>
                   <textarea v-model="bookingData.customer.note" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" rows="3" placeholder="如有特殊需求請在此說明 (如: 力道加強, 患部避開...)"></textarea>
                 </div>

                 <!-- Error Message -->
                 <div v-if="submitError" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                   </svg>
                   <span>{{ submitError }}</span>
                 </div>

                 <div class="flex gap-4 pt-4">
                    <button type="button" @click="goBack" class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors">
                      返回
                    </button>
                    <button type="submit" :disabled="submitting" class="flex-[2] py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                      <div v-if="submitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{{ submitting ? '預約處理中...' : '確認預約' }}</span>
                    </button>
                 </div>
               </form>
            </div>
          </div>
        </div>

        <!-- Step 6: Success -->
        <div v-if="step === 6" class="animate-scale-in text-center py-12">
          <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-800 mb-2">預約成功！</h2>
          <p class="text-gray-500 mb-8">感謝您的預約，系統已發送確認信至您的信箱。</p>

          <div class="bg-gray-50 max-w-sm mx-auto rounded-xl p-6 border border-gray-200 mb-8 text-left space-y-3 shadow-sm">
            <div class="flex justify-between items-center border-b border-gray-200 pb-3">
              <span class="text-gray-500 text-sm">預約詳情</span>
              <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">已確認</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">訂單編號</span>
              <span class="font-mono font-bold text-gray-900">#{{ bookingResult?.bookingId || '---' }}</span>
            </div>
             <div class="flex justify-between">
              <span class="text-gray-500">預約日期</span>
              <span class="font-bold text-gray-900">{{ bookingResult?.details?.date }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">預約時間</span>
              <span class="font-bold text-red-600">{{ bookingResult?.details?.time }}</span>
            </div>
             <div class="flex justify-between">
              <span class="text-gray-500">服務項目</span>
              <span class="font-bold text-gray-900">{{ bookingResult?.details?.branch }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">指定技師</span>
              <span class="font-bold text-gray-900">{{ bookingResult?.details?.staff }}</span>
            </div>
          </div>

          <div class="space-x-4">
             <NuxtLink to="/" class="inline-block px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
              回到首頁
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- Debug Info (Optional, can remove later) -->
      <!-- <div class="mt-8 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-500">...</div> -->

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-scale-in {
  animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* Hide scrollbar */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
