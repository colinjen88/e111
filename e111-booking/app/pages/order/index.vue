<script setup lang="ts">
const orderId = ref('')
const router = useRouter()

const submit = () => {
    if (orderId.value) {
        router.push(`/order/${orderId.value}`)
    }
}
</script>

<template>
  <div class="bg-brand-cream min-h-screen py-10 px-4 flex items-center justify-center font-sans tracking-wide">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-2xl font-serif font-bold text-brand-dark mb-6 text-center border-b pb-4">訂單查詢</h1>
      
      <form @submit.prevent="submit" class="space-y-6">
        <div>
           <label class="block text-gray-700 font-medium mb-2">訂單編號 (Order ID)</label>
           <input 
             v-model="orderId" 
             type="number" 
             class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-300" 
             placeholder="請輸入預約時的訂單編號"
             required
           >
           <p class="text-xs text-gray-400 mt-2">訂單編號可在預約成功頁面或確認簡訊中找到。</p>
        </div>

        <button 
           type="submit" 
           class="w-full py-3 bg-brand-red text-white font-bold rounded-lg shadow-md hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           :disabled="!orderId"
        >
           下一步
        </button>
      </form>

      <div class="mt-8 text-center">
         <NuxtLink to="/" class="text-brand-dark hover:text-brand-gold underline text-sm">
           返回首頁
         </NuxtLink>
      </div>
    </div>
  </div>
</template>
