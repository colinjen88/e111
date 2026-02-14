<script setup lang="ts">
definePageMeta({
  layout: 'staff',
  middleware: ['staff']
})

const { data: bookings } = await useFetch('/api/staff/bookings')
</script>

<template>
  <div class="space-y-6 pb-24 md:pb-10">
    <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
       <div>
          <h2 class="text-2xl font-bold font-serif text-gray-900 mb-2">今日任務</h2>
          <p class="text-gray-400 text-sm flex items-center gap-2">
             <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             待執行任務
          </p>
       </div>
       <div v-if="bookings?.length" class="bg-gray-50 px-4 py-2 rounded-xl text-gray-500 font-bold text-sm">
          共 {{ bookings.length }} 筆
       </div>
    </div>

    <div v-if="!bookings?.length" class="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
       <div class="text-4xl opacity-20 mb-4">💤</div>
       <p class="text-gray-400 font-medium">目前暫無預約任務</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div v-for="b in bookings" :key="b.id" class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
         <div class="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl font-serif text-brand-red pointer-events-none group-hover:scale-110 transition-transform select-none">
            {{ new Date(b.startTime).getHours() }}
         </div>
         
         <div class="relative z-10 flex flex-col gap-4">
            <div class="flex items-start justify-between">
               <div class="bg-brand-red/5 text-brand-red px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase">
                  {{ new Date(b.startTime).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) }}
               </div>
               <span class="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-500">#{{ b.id }}</span>
            </div>

            <div>
               <h3 class="text-lg font-bold text-gray-900 mb-1">{{ b.items[0]?.service?.name }}</h3>
               <p class="text-sm text-gray-500 flex items-center gap-2">
                  <span>{{ b.customer?.name || '未知顧客' }}</span>
                  <span class="text-gray-300">|</span>
                  <a :href="`tel:${b.customer?.phone}`" class="text-blue-500 underline font-mono hover:text-blue-600">{{ b.customer?.phone }}</a>
               </p>
            </div>
            
            <div v-if="b.customerNotes" class="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 font-medium border border-amber-100/50">
               📝 {{ b.customerNotes }}
            </div>
         </div>
      </div>
    </div>
  </div>
</template>
