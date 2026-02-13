<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const errorMessages: Record<number, string> = {
  401: '未授權，請重新登入',
  403: '權限不足',
  404: '頁面不存在',
  500: '伺服器內部錯誤',
}

const title = computed(() => errorMessages[props.error.statusCode] || '發生錯誤')
const description = computed(() => {
  if (props.error.statusCode === 404) return '你所尋找的頁面可能已移除或不存在'
  return '請稍後再試，或聯繫系統管理員'
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-brand-cream flex items-center justify-center px-4 font-sans">
    <div class="text-center max-w-md">
      <div class="text-8xl font-serif font-bold text-brand-red/20 mb-4">
        {{ error.statusCode }}
      </div>
      <h1 class="text-2xl font-serif font-bold text-brand-dark mb-3">
        {{ title }}
      </h1>
      <p class="text-gray-500 mb-8">
        {{ description }}
      </p>
      <button
        @click="handleError"
        class="px-8 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-red-800 transition-all shadow-lg shadow-brand-red/20"
      >
        回到首頁
      </button>
    </div>
  </div>
</template>
