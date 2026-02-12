<script setup lang="ts">
// Booking Flow Logic
const step = ref(1)
const direction = ref<'forward' | 'back'>('forward')
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

// Navigation
const goToStep = (target: number) => {
  direction.value = target > step.value ? 'forward' : 'back'
  step.value = target
}

// Selection Handlers
const selectBranch = (branch: any) => {
  bookingData.branch = branch
  goToStep(2)
}

const selectCategory = (category: any) => {
  activeCategory.value = category
}

const selectService = (service: any) => {
  bookingData.service = service
  goToStep(3)
  refreshStaff()
}

const selectStaff = (staff: any) => {
  bookingData.staff = staff
  goToStep(4)
  refreshSlots()
}

const selectNoPreference = () => {
  bookingData.staff = null
  goToStep(4)
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
  goToStep(5) // Go to confirmation
}

const goBack = () => {
  if (step.value > 1 && step.value < 6) {
    goToStep(step.value - 1)
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
    const data = await $fetch('/api/bookings', {
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

    bookingResult.value = data
    goToStep(6) // Success Step

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

// Step meta info
const stepLabels = ['分館', '服務', '技師', '時間', '確認']
const stepIcons = ['🏠', '💆', '👤', '🕐', '✅']
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-cream/50 font-sans text-brand-dark">
    
    <!-- Decorative background elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-red/[0.03] rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-brand-gold/[0.05] rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 container mx-auto px-4 max-w-3xl py-8">
      
      <!-- Header -->
      <div class="mb-10 flex items-center justify-between bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/10 relative z-20">
        <NuxtLink to="/" class="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 min-w-[64px]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm font-medium hidden sm:inline">回首頁</span>
        </NuxtLink>
        <div class="flex flex-col items-center">
             <img src="/logo.png" alt="御手國醫" class="h-10 mb-1 drop-shadow-md">
             <span class="text-[10px] text-brand-gold tracking-[0.3em] font-light uppercase opacity-80">Online Booking</span>
        </div>
        <div class="min-w-[64px]"></div>
      </div>

      <!-- ========== Progress Bar ========== -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-5 mb-8 border border-brand-gold/10" v-if="step < 6">
        <div class="flex justify-between items-center relative">
          <!-- Track -->
          <div class="absolute left-[10%] right-[10%] top-1/2 transform -translate-y-1/2 h-[2px] bg-gray-100 -z-10"></div>
          <!-- Fill -->
          <div class="absolute left-[10%] top-1/2 transform -translate-y-1/2 h-[2px] bg-gradient-to-r from-brand-red to-brand-gold transition-all duration-700 ease-out -z-10" 
            :style="{ width: `${((step - 1) / 4) * 80}%` }"></div>
          <!-- Dots -->
          <div v-for="i in 5" :key="i" class="flex flex-col items-center gap-2 z-10">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ease-out border-2"
              :class="[
                step > i ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/30 scale-100' : '',
                step === i ? 'bg-white border-brand-red text-brand-red shadow-lg shadow-brand-red/20 scale-110 ring-4 ring-brand-red/10' : '',
                step < i ? 'bg-gray-50 border-gray-200 text-gray-300' : ''
              ]">
              <span v-if="step > i" class="animate-check-in">✓</span>
              <span v-else>{{ stepIcons[i-1] }}</span>
            </div>
            <span class="text-[10px] font-bold tracking-wider uppercase transition-colors duration-300"
              :class="step >= i ? 'text-brand-red' : 'text-gray-300'">
              {{ stepLabels[i-1] }}
            </span>
          </div>
        </div>
      </div>

      <!-- ========== Step Content Card ========== -->
      <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 min-h-[420px] border border-white/60 relative overflow-hidden">
        
        <!-- Decorative corner -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-gold/5 to-transparent rounded-bl-full pointer-events-none"></div>

        <!-- Step 1: Branch -->
        <Transition :name="direction === 'forward' ? 'slide-left' : 'slide-right'" mode="out-in">
        <div v-if="step === 1" key="step1">
          <div class="mb-8">
            <h2 class="text-2xl font-serif font-bold text-brand-dark mb-2">選擇服務據點</h2>
            <p class="text-sm text-gray-400">請選擇距離您最近的分館</p>
          </div>
          <div v-if="loadingBranches" class="py-16 flex flex-col items-center gap-4">
            <div class="loading-spinner"></div>
            <span class="text-sm text-gray-400 animate-pulse">載入中...</span>
          </div>
          <div v-else-if="errorBranches" class="py-12 text-center text-red-500">
            <div class="text-4xl mb-3">⚠️</div>
            載入失敗，請重新整理頁面
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <button v-for="(branch, idx) in branches" :key="branch.id" @click="selectBranch(branch)" 
              class="group relative p-6 bg-gradient-to-br from-brand-cream/80 to-white border-2 border-transparent rounded-2xl hover:border-brand-red/40 transition-all duration-400 text-left hover:shadow-xl hover:shadow-brand-red/5 active:scale-[0.97]"
              :style="{ animationDelay: `${idx * 100}ms` }">
              <!-- Hover glow -->
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-red/5 to-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div class="relative">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red/20 transition-colors">
                      <span class="text-lg">🏠</span>
                    </div>
                    <span class="font-bold text-lg text-gray-900 group-hover:text-brand-red transition-colors">{{ branch.name }}</span>
                  </div>
                  <span v-if="branch.isActive" class="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">● 營業中</span>
                </div>
                <p class="text-sm text-gray-500 mb-5 pl-[52px] line-clamp-2">{{ branch.address }}</p>
                <div class="flex items-center text-brand-red text-sm font-bold pl-[52px] opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                  選擇此分館
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 2: Service -->
        <div v-else-if="step === 2" key="step2">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-serif font-bold text-brand-dark mb-2">選擇服務項目</h2>
              <p class="text-sm text-gray-400">{{ bookingData.branch?.name }} · 為您推薦精選服務</p>
            </div>
            <button @click="goBack" class="text-sm text-gray-400 hover:text-brand-red transition-colors flex items-center gap-1 group">
              <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              更換分館
            </button>
          </div>
          <div v-if="loadingServices" class="py-16 flex flex-col items-center gap-4">
            <div class="loading-spinner"></div>
            <span class="text-sm text-gray-400 animate-pulse">載入中...</span>
          </div>
          <div v-else-if="errorServices" class="py-12 text-center text-red-500">載入失敗</div>
          <div v-else>
            <!-- Category tabs -->
            <div class="flex overflow-x-auto gap-2 mb-8 pb-2 no-scrollbar">
              <button v-for="cat in categories" :key="cat.id" @click="selectCategory(cat)" 
                class="px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 border"
                :class="activeCategory?.id === cat.id 
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/25 border-brand-red scale-105' 
                  : 'bg-white text-gray-500 hover:text-brand-red hover:border-brand-red/30 border-gray-100'">
                {{ cat.name }}
              </button>
            </div>
            <!-- Service list -->
            <div v-if="activeCategory" class="space-y-4">
              <p v-if="activeCategory.services.length === 0" class="text-center text-gray-400 py-12 text-sm">此分類目前沒有服務項目</p>
              <button v-for="(service, idx) in activeCategory.services" :key="service.id" @click="selectService(service)" 
                class="w-full flex items-center justify-between p-5 bg-gradient-to-r from-brand-cream/40 to-transparent border border-gray-100/80 rounded-2xl hover:border-brand-red/30 hover:shadow-lg hover:shadow-brand-red/5 transition-all duration-300 group text-left active:scale-[0.98]"
                :style="{ animationDelay: `${idx * 80}ms` }">
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800 text-lg group-hover:text-brand-red transition-colors">{{ service.name }}</h3>
                  <p class="text-sm text-gray-400 mt-1 line-clamp-1">{{ service.description || '暫無描述' }}</p>
                  <div class="flex items-center gap-3 mt-3">
                    <span class="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" /></svg>
                      {{ service.durationMinutes }} 分鐘
                    </span>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2 ml-4">
                  <span class="text-xl font-bold text-brand-red font-serif">NT$ {{ service.basePrice }}</span>
                  <span class="text-xs text-brand-red font-bold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1">
                    選擇
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Staff -->
        <div v-else-if="step === 3" key="step3">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-serif font-bold text-brand-dark mb-2">選擇服務技師</h2>
              <p class="text-sm text-gray-400">{{ bookingData.service?.name }} · 挑選您喜愛的技師</p>
            </div>
            <button @click="goBack" class="text-sm text-gray-400 hover:text-brand-red transition-colors flex items-center gap-1 group">
              <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              更換服務
            </button>
          </div>
          <div v-if="loadingStaff" class="py-16 flex flex-col items-center gap-4">
            <div class="loading-spinner"></div>
            <span class="text-sm text-gray-400 animate-pulse">載入中...</span>
          </div>
          <div v-else-if="errorStaff" class="py-12 text-center text-red-500">載入失敗</div>
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-5">
            <!-- No Preference -->
            <button @click="selectNoPreference" 
              class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-brand-gold/30 rounded-2xl hover:border-brand-red/50 hover:bg-brand-red/5 transition-all duration-300 text-gray-400 hover:text-brand-red min-h-[200px] group active:scale-95">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold/10 to-brand-red/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <span class="text-2xl">🎲</span>
              </div>
              <span class="font-bold text-base">不指定技師</span>
              <span class="text-xs mt-1 opacity-60">由系統安排</span>
            </button>
            <!-- Staff Cards -->
            <button v-for="(member, idx) in staffList" :key="member.id" @click="selectStaff(member)" 
              class="relative flex flex-col items-center p-5 bg-gradient-to-b from-white to-brand-cream/30 border border-gray-100 rounded-2xl hover:border-brand-red/30 hover:shadow-xl hover:shadow-brand-red/5 transition-all duration-400 group min-h-[200px] active:scale-95"
              :style="{ animationDelay: `${idx * 100}ms` }">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-brand-cream to-gray-100 mb-4 overflow-hidden shadow-md border-3 border-white group-hover:border-brand-red/30 group-hover:shadow-brand-red/10 transition-all duration-400">
                <img v-if="member.photoUrl" :src="member.photoUrl" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                <div v-else class="w-full h-full flex items-center justify-center text-brand-red/60 text-2xl font-serif font-bold bg-brand-red/5">{{ member.name.charAt(0) }}</div>
              </div>
              <div class="text-center">
                <h3 class="font-bold text-gray-900 text-base group-hover:text-brand-red transition-colors">{{ member.name }}</h3>
                <span class="inline-block px-3 py-0.5 bg-brand-gold/10 text-brand-gold text-[10px] font-bold rounded-full mt-2 tracking-wider uppercase">{{ member.level }}</span>
              </div>
              <div class="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span class="text-xs text-brand-red font-bold">選擇</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 4: DateTime -->
        <div v-else-if="step === 4" key="step4">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-serif font-bold text-brand-dark mb-2">選擇預約時間</h2>
              <p class="text-sm text-gray-400">{{ bookingData.staff?.name || '不指定技師' }} · 選擇方便的時段</p>
            </div>
            <button @click="goBack" class="text-sm text-gray-400 hover:text-brand-red transition-colors flex items-center gap-1 group">
              <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              更換技師
            </button>
          </div>

          <!-- Horizontal Date Picker -->
          <div class="flex overflow-x-auto pb-4 gap-3 no-scrollbar mb-8">
            <button v-for="day in next7Days" :key="day.dateStr"
              @click="selectDate(day.dateStr)"
              class="flex flex-col items-center justify-center min-w-[76px] h-[90px] rounded-2xl border-2 transition-all duration-300 p-2 shrink-0"
              :class="bookingData.date === day.dateStr 
                ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/30 scale-105' 
                : 'border-gray-100 bg-white text-gray-500 hover:border-brand-red/30 hover:shadow-md'">
              <span class="text-[10px] font-bold mb-1 tracking-wider uppercase"
                :class="bookingData.date === day.dateStr ? 'text-white/80' : 'text-gray-400'">{{ day.dayName }}</span>
              <span class="text-2xl font-bold">{{ day.dayNum }}</span>
            </button>
          </div>

          <!-- Time Slots -->
          <div v-if="loadingSlots" class="py-12 flex flex-col items-center gap-4">
            <div class="loading-spinner"></div>
            <span class="text-sm text-gray-400 animate-pulse">查詢時段中...</span>
          </div>
          
          <div v-else-if="errorSlots" class="py-12 text-center text-red-500">
            <div class="text-4xl mb-3">⚠️</div>
            無法載入時段，請稍後再試
          </div>

          <div v-else>
            <h3 class="text-base font-bold text-gray-600 mb-4 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
              可預約時段
            </h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              <button v-for="block in availability?.blocks || []" :key="block.time"
                @click="selectTime(block.time, block.available)"
                :disabled="!block.available"
                class="py-3.5 rounded-xl text-sm font-bold transition-all duration-300 border-2"
                :class="block.available 
                  ? 'border-gray-100 bg-white hover:border-brand-red hover:text-brand-red hover:bg-brand-red/5 text-gray-600 shadow-sm hover:shadow-md active:scale-95' 
                  : 'bg-gray-50 text-gray-300 border-transparent cursor-not-allowed line-through'">
                {{ block.time }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 5: Customer Info & Confirmation -->
        <div v-else-if="step === 5" key="step5">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-serif font-bold text-brand-dark mb-2">確認並送出</h2>
              <p class="text-sm text-gray-400">確認預約內容，並填寫聯絡資料</p>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Summary -->
            <div class="order-2 md:order-1">
              <h3 class="text-sm font-bold text-gray-400 mb-4 tracking-wider uppercase flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                預約摘要
              </h3>
              <div class="bg-gradient-to-br from-brand-cream/60 to-white p-6 rounded-2xl border border-brand-gold/15 space-y-4 sticky top-6">
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 text-sm">分館</span>
                  <span class="font-bold text-gray-900">{{ bookingData.branch?.name }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 text-sm">服務</span>
                  <span class="font-bold text-gray-900">{{ bookingData.service?.name }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 text-sm">技師</span>
                  <span class="font-bold text-gray-900">{{ bookingData.staff?.name || '不指定' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 text-sm">時間</span>
                  <span class="font-bold text-brand-red">{{ bookingData.date }} {{ bookingData.time }}</span>
                </div>
                <div class="border-t border-brand-gold/15 pt-4 mt-4 flex justify-between items-center">
                  <span class="text-gray-400 text-sm">預估費用</span>
                  <span class="font-bold text-2xl text-brand-dark font-serif">NT$ {{ bookingData.service?.basePrice }}</span>
                </div>
              </div>
            </div>

            <!-- Form -->
            <div class="order-1 md:order-2">
               <h3 class="text-sm font-bold text-gray-400 mb-4 tracking-wider uppercase flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                聯絡資料
               </h3>
               <form @submit.prevent="submitBooking" class="space-y-5">
                 <div class="form-group">
                   <label class="block text-sm font-bold text-gray-600 mb-2">姓名 <span class="text-brand-red">*</span></label>
                   <input v-model="bookingData.customer.name" type="text" required class="form-input" placeholder="請輸入姓名">
                 </div>
                 <div class="form-group">
                   <label class="block text-sm font-bold text-gray-600 mb-2">手機號碼 <span class="text-brand-red">*</span></label>
                   <input v-model="bookingData.customer.phone" type="tel" required class="form-input" placeholder="請輸入手機號碼">
                 </div>
                 <div class="form-group">
                   <label class="block text-sm font-bold text-gray-600 mb-2">Email <span class="text-gray-300 text-xs font-normal">(選填)</span></label>
                   <input v-model="bookingData.customer.email" type="email" class="form-input" placeholder="接收預約確認信">
                 </div>
                 <div class="form-group">
                   <label class="block text-sm font-bold text-gray-600 mb-2">備註需求</label>
                   <textarea v-model="bookingData.customer.note" class="form-input resize-none" rows="3" placeholder="如有特殊需求請在此說明"></textarea>
                 </div>

                 <!-- Error Message -->
                 <div v-if="submitError" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3 border border-red-100">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                   </svg>
                   <span>{{ submitError }}</span>
                 </div>

                 <div class="flex gap-4 pt-2">
                    <button type="button" @click="goBack" class="flex-1 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 active:scale-95">
                      返回
                    </button>
                    <button type="submit" :disabled="submitting" class="flex-[2] py-3.5 bg-gradient-to-r from-brand-red to-red-700 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-brand-red/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.97]">
                      <div v-if="submitting" class="loading-spinner-sm"></div>
                      <span>{{ submitting ? '預約處理中...' : '確認預約' }}</span>
                    </button>
                 </div>
               </form>
            </div>
          </div>
        </div>

        <!-- Step 6: Success -->
        <div v-else-if="step === 6" key="step6" class="text-center py-12">
          <div class="success-icon mx-auto mb-8">
            <div class="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white animate-check-draw" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 class="text-3xl font-serif font-bold text-brand-dark mb-3">預約成功！</h2>
          <p class="text-gray-400 mb-10 text-sm">感謝您的預約，系統已發送確認通知。</p>

          <div class="bg-gradient-to-br from-brand-cream/60 to-white max-w-sm mx-auto rounded-2xl p-6 border border-brand-gold/15 mb-10 text-left space-y-3">
            <div class="flex justify-between items-center border-b border-brand-gold/10 pb-3">
              <span class="text-gray-400 text-sm">預約詳情</span>
              <span class="bg-emerald-50 text-emerald-600 text-[10px] px-3 py-1 rounded-full font-bold tracking-wider border border-emerald-100">✓ 已確認</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400 text-sm">訂單編號</span>
              <span class="font-mono font-bold text-gray-900">#{{ bookingResult?.bookingId || '---' }}</span>
            </div>
             <div class="flex justify-between">
              <span class="text-gray-400 text-sm">預約日期</span>
              <span class="font-bold text-gray-900">{{ bookingResult?.details?.date }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400 text-sm">預約時間</span>
              <span class="font-bold text-brand-red">{{ bookingResult?.details?.time }}</span>
            </div>
             <div class="flex justify-between">
              <span class="text-gray-400 text-sm">服務項目</span>
              <span class="font-bold text-gray-900">{{ bookingResult?.details?.branch }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400 text-sm">指定技師</span>
              <span class="font-bold text-gray-900">{{ bookingResult?.details?.staff }}</span>
            </div>
          </div>

          <NuxtLink to="/" class="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-brand-red to-red-700 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-red/25 transition-all duration-300 active:scale-95">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            回到首頁
          </NuxtLink>
        </div>
        </Transition>

      </div>

      <!-- Debug Info (Optional, can remove later) -->
      <!-- <div class="mt-8 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-500">...</div> -->

    </div>

    <!-- Mobile Sticky CTA (only on step 1 landing) -->
    <!-- Removed: the booking page itself IS the booking flow -->
  </div>
</template>

<style scoped>
/* ============ Transitions ============ */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ============ Loading Spinners ============ */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 0, 0, 0.1);
  border-top-color: #8B0000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner-sm {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============ Form Inputs ============ */
.form-input {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-brand-cream/30
    focus:ring-0 focus:border-brand-red/40 focus:bg-white
    outline-none transition-all duration-300 text-gray-800 placeholder-gray-300;
}

.form-input:hover {
  @apply border-gray-200;
}

/* ============ Success Check Animation ============ */
.animate-check-draw {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: checkDraw 0.6s ease-out 0.3s forwards;
}

@keyframes checkDraw {
  to { stroke-dashoffset: 0; }
}

.animate-check-in {
  animation: checkIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes checkIn {
  from { transform: scale(0) rotate(-45deg); opacity: 0; }
  to { transform: scale(1) rotate(0); opacity: 1; }
}

.success-icon {
  animation: successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes successPop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

/* ============ Scrollbar ============ */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
