<script setup lang="ts">
const route = useRoute()
const orderId = route.params.ref as string

const phone = ref('')
const loading = ref(false)
const error = ref('')
const booking = ref<any>(null)

// Step 1: Verify Phone & Load Order
const verifyOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch('/api/orders/lookup', {
      method: 'POST',
      body: { 
        ref: orderId, 
        phone: phone.value 
      }
    })
    
    if (res.success) {
      booking.value = res.data
    }
  } catch (err: any) {
    error.value = err.data?.statusMessage || '查詢失敗，請確認電話號碼正確。'
  } finally {
    loading.value = false
  }
}

// Step 2: Cancel Order logic
const cancelOrder = async () => {
  if (!confirm('確定要取消此預約嗎？\n此動作無法復原。')) return

  loading.value = true
  error.value = '' // clear previous
  try {
    const res = await $fetch('/api/orders/cancel', {
      method: 'POST',
      body: {
        ref: orderId,
        phone: phone.value // Pass phone again for double verification
      }
    })
    
    if (res.success) {
      alert('預約已成功取消。')
      // Refresh data
      await verifyOrder()
    }
  } catch (err: any) {
    alert(err.data?.statusMessage || '取消失敗，請稍後再試。')
  } finally {
    loading.value = false
  }
}

const statusColor = (status: string) => {
  switch(status) {
    case 'Confirmed': return 'text-green-600 bg-green-50'
    case 'Pending': return 'text-yellow-600 bg-yellow-50'
    case 'Cancelled': return 'text-red-600 bg-red-50'
    case 'Completed': return 'text-gray-600 bg-gray-50'
    default: return 'text-gray-600'
  }
}

const statusText = (status: string) => {
    switch(status) {
        case 'Confirmed': return '已確認'
        case 'Pending': return '待確認'
        case 'Cancelled': return '已取消'
        case 'Completed': return '已完成'
        case 'NoShow': return '未出席'
        default: return status
    }
}

const canCancel = computed(() => {
   if (!booking.value) return false
   if (booking.value.status === 'Cancelled' || booking.value.status === 'Completed') return false
   
   // Check time (2 hours logic is backend, but frontend guide is good)
   const bookingTime = new Date(booking.value.startTime).getTime()
   const now = new Date().getTime()
   const diffHours = (bookingTime - now) / (1000 * 60 * 60)
   
   return diffHours >= 2
})
</script>

<template>
  <div class="bg-brand-cream min-h-screen py-10 px-4 flex items-center justify-center font-sans tracking-wide">
    <div class="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-brand-dark p-6 text-white flex justify-between items-center">
         <h1 class="text-xl font-serif font-bold">訂單 #{{ orderId }}</h1>
         <NuxtLink to="/order" class="text-sm text-gray-300 hover:text-white underline">重新查詢</NuxtLink>
      </div>

      <!-- Verification Section (If not loaded) -->
      <div v-if="!booking" class="p-8">
         <h2 class="text-lg font-bold text-gray-800 mb-4">身份驗證</h2>
         <p class="text-gray-600 mb-6 text-sm">為了保障您的隱私，請輸入預約時填寫的手機號碼以查看詳細資訊。</p>
         
         <form @submit.prevent="verifyOrder" class="space-y-4">
            <div>
              <label class="block text-gray-700 font-medium mb-1">手機號碼</label>
              <input 
                v-model="phone" 
                type="tel" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                placeholder="09xxxxxxxx"
                required
              >
            </div>
            
            <div v-if="error" class="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
               {{ error }}
            </div>

            <button 
              type="submit" 
              class="w-full py-3 bg-brand-dark text-brand-gold font-bold rounded-lg shadow hover:bg-black transition-colors disabled:opacity-50"
              :disabled="loading || !phone"
            >
              {{ loading ? '查詢中...' : '驗證並查看' }}
            </button>
         </form>
      </div>

      <!-- Details Section (If loaded) -->
      <div v-else class="p-8">
         <div class="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
            <div>
               <p class="text-sm text-gray-500 mb-1">預約狀態</p>
               <span class="px-3 py-1 rounded text-sm font-bold" :class="statusColor(booking.status)">
                  {{ statusText(booking.status) }}
               </span>
            </div>
            <div class="text-right">
               <p class="text-sm text-gray-500 mb-1">總金額</p>
               <span class="text-2xl font-serif font-bold text-brand-red">NT$ {{ Math.floor(booking.totalPrice) }}</span>
            </div>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
            <div>
               <p class="text-gray-500 mb-1">預約日期</p>
               <p class="font-bold text-lg text-gray-800">{{ booking.date.split('T')[0] }}</p>
            </div>
            <div>
               <p class="text-gray-500 mb-1">預約時段</p>
               <p class="font-bold text-lg text-gray-800">
                  {{ booking.startTime.split('T')[1].substring(0,5) }} - {{ booking.endTime.split('T')[1].substring(0,5) }}
               </p>
            </div>
            <div>
               <p class="text-gray-500 mb-1">預約分館</p>
               <p class="font-bold text-gray-800">{{ booking.branchName }}</p>
            </div>
            <div>
               <p class="text-gray-500 mb-1">指定技師</p>
               <p class="font-bold text-gray-800">{{ booking.staffName }}</p>
            </div>
            
            <div class="col-span-1 md:col-span-2 mt-2">
               <p class="text-gray-500 mb-2">服務項目</p>
               <ul class="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <li v-for="(item, idx) in booking.items" :key="idx" class="flex justify-between items-center text-gray-700">
                     <span>{{ item.serviceName }}</span>
                     <span class="font-medium">NT$ {{ Math.floor(item.price) }}</span>
                  </li>
               </ul>
            </div>
            
            <!-- Customer Info (Masked) -->
            <div class="col-span-1 md:col-span-2 border-t pt-4 mt-2">
               <p class="text-gray-500 mb-2">預約人資訊</p>
               <div class="flex gap-6 text-gray-600">
                  <span>{{ booking.customerName }}</span>
                  <span>{{ booking.customerPhone }}</span>
               </div>
            </div>
         </div>

         <!-- Actions -->
         <div class="flex flex-col gap-3">
            <button 
               v-if="canCancel"
               @click="cancelOrder"
               class="w-full py-3 bg-white text-brand-red border border-brand-red font-bold rounded-lg hover:bg-brand-red hover:text-white transition-colors"
               :disabled="loading"
            >
               {{ loading ? '處理中...' : '取消預約' }}
            </button>
            
            <p v-else-if="booking.status !== 'Cancelled' && booking.status !== 'Completed'" class="text-center text-xs text-gray-400">
               * 距離預約時間不足 2 小時，無法線上取消。如有特殊需求請直接致電分館。
            </p>
            
            <NuxtLink 
               to="/"
               class="w-full py-3 text-center text-gray-500 hover:text-brand-dark transition-colors text-sm"
            >
               返回首頁
            </NuxtLink>
         </div>

      </div>

    </div>
  </div>
</template>
