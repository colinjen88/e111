<script setup lang="ts">
definePageMeta({
  layout: 'staff',
  middleware: ['staff']
})

const { data: res, refresh } = await useFetch<any>('/api/staff/schedule')

const scheduleData = computed(() => res.value?.data || [])
const meta = computed(() => res.value?.meta || { totalHours: 0, totalCustomers: 0 })
const dateRange = computed(() => {
    if (!scheduleData.value.length) return { start: new Date(), end: new Date() }
    const start = new Date(scheduleData.value[0].date)
    const end = new Date(scheduleData.value[6].date)
    return { start, end }
})

const isToday = (dateStr: string) => {
  const d = new Date(dateStr)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

const formatDate = (dateStr: string) => {
    return new Date(dateStr)
}
</script>

<template>
  <div class="space-y-6 pb-24 md:pb-10">
    <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-6 sticky top-24 md:static z-20">
       <div class="flex justify-between items-center">
         <div>
            <h2 class="text-2xl font-bold font-serif text-gray-900 mb-2">我的班表</h2>
            <p v-if="scheduleData.length" class="text-gray-400 text-sm flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                本週排程 ({{ dateRange.start.getMonth()+1 }}/{{ dateRange.start.getDate() }} - {{ dateRange.end.getMonth()+1 }}/{{ dateRange.end.getDate() }})
            </p>
         </div>
         <div class="hidden md:block">
            <button class="px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                上週
            </button>
            <button class="px-4 py-2 bg-brand-dark rounded-xl text-sm font-bold text-white ml-2 hover:bg-black transition-colors shadow-lg shadow-brand-dark/20">
                本週
            </button>
             <button class="px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-500 ml-2 hover:bg-gray-100 transition-colors">
                下週
            </button>
         </div>
       </div>
    </div>

    <!-- Calendar Grid -->
    <div v-if="scheduleData.length" class="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div v-for="day in scheduleData" :key="day.date" 
             class="bg-white rounded-[2rem] p-6 shadow-sm border transition-all relative overflow-hidden group"
             :class="isToday(day.date) ? 'border-brand-red/30 ring-4 ring-brand-red/5' : 'border-gray-100 hover:border-gray-200'">
             
             <!-- Header -->
             <div class="flex justify-between items-start mb-4 relative z-10">
                <div class="flex flex-col">
                    <span class="text-xs font-bold uppercase tracking-wider mb-1" :class="isToday(day.date) ? 'text-brand-red' : 'text-gray-400'">
                        {{ formatDate(day.date).toLocaleDateString('en-US', { weekday: 'short' }) }}
                    </span>
                    <span class="text-2xl font-serif font-bold" :class="isToday(day.date) ? 'text-brand-dark' : 'text-gray-900'">
                        {{ formatDate(day.date).getDate() }}
                    </span>
                </div>
                <div v-if="day.type === 'off'" class="bg-gray-100 text-gray-400 px-2 py-1 rounded-lg text-xs font-bold">
                    OFF
                </div>
                <div v-else class="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-bold">
                    ON
                </div>
             </div>

             <!-- Content -->
             <div class="relative z-10 space-y-3">
                <div class="p-3 rounded-xl text-center transition-colors"
                     :class="day.type === 'work' ? 'bg-brand-cream/30 text-brand-dark' : 'bg-gray-50 text-gray-300'">
                    <p class="text-sm font-bold">{{ day.time }}</p>
                </div>

                <div v-if="day.type === 'work'" class="flex justify-between items-center px-2">
                    <span class="text-xs text-gray-400 font-medium">預計接客</span>
                    <span class="text-sm font-bold text-brand-red">{{ day.slots || 0 }} 人</span>
                </div>
             </div>

             <!-- Decorative BG for Today -->
             <div v-if="isToday(day.date)" class="absolute inset-0 bg-gradient-to-br from-brand-red/[0.02] to-transparent pointer-events-none"></div>
        </div>
    </div>
    
    <!-- Summary -->
    <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mt-6 flex flex-col md:flex-row gap-8 items-center justify-between">
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
                <p class="text-sm text-gray-400 font-bold uppercase tracking-wider">本週工時</p>
                <p class="text-2xl font-bold text-gray-900">{{ meta.totalHours }} <span class="text-sm font-normal text-gray-400">hrs</span></p>
            </div>
        </div>
         <div class="w-px h-12 bg-gray-100 hidden md:block"></div>
         <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div>
                <p class="text-sm text-gray-400 font-bold uppercase tracking-wider">預計服務</p>
                <p class="text-2xl font-bold text-gray-900">{{ meta.totalCustomers }} <span class="text-sm font-normal text-gray-400">人次</span></p>
            </div>
        </div>
    </div>
  </div>
</template>
