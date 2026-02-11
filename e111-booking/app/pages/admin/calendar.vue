<script setup lang="ts">
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, startOfWeek, endOfWeek } from 'date-fns'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(new Date())

// Fetch bookings for the month
// Ideally pass range to API. For simplicity, fetch all recent or client-side filter if small dataset.
// Let's create a query param for month filtering later. For now fetch standard list.
const { data: bookings, refresh } = await useFetch('/api/admin/bookings')

const daysInMonth = computed(() => {
    const start = startOfWeek(startOfMonth(currentDate.value))
    const end = endOfWeek(endOfMonth(currentDate.value))
    return eachDayOfInterval({ start, end })
})

const bookingsOnDay = (date: Date) => {
    if (!bookings.value) return []
    return bookings.value.filter(b => isSameDay(new Date(b.bookingDate), date))
}

const selectDate = (date: Date) => {
    selectedDate.value = date
}

const prevMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}
const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const statusColor = (status: string) => {
    switch(status) {
        case 'Confirmed': return 'bg-green-500'
        case 'Pending': return 'bg-yellow-500'
        case 'Cancelled': return 'bg-red-500'
        case 'Completed': return 'bg-blue-500'
        default: return 'bg-gray-400'
    }
}
</script>

<template>
  <div class="h-full flex flex-col md:flex-row gap-6">
    <!-- Calendar Side -->
    <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">{{ format(currentDate, 'yyyy MMMM') }}</h2>
            <div class="flex gap-2">
                <button @click="prevMonth" class="p-2 hover:bg-gray-100 rounded text-gray-600">&lt;</button>
                <button @click="today" class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-700">Today</button>
                <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded text-gray-600">&gt;</button>
            </div>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center mb-2">
            <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="text-xs font-bold text-gray-400 uppercase py-2">
                {{ day }}
            </div>
        </div>
        
        <div class="grid grid-cols-7 gap-1 h-[calc(100%-80px)]">
            <div 
                v-for="day in daysInMonth" 
                :key="day.toString()"
                @click="selectDate(day)"
                class="min-h-[80px] border border-gray-50 p-2 relative cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-start gap-1"
                :class="{ 
                    'bg-brand-gold/10 border-brand-gold/30': isSameDay(day, new Date()),
                    'bg-blue-50 ring-2 ring-blue-200': selectedDate && isSameDay(day, selectedDate),
                    'opacity-40': day.getMonth() !== currentDate.getMonth()
                }"
            >
                <span class="text-sm font-bold text-gray-700">{{ format(day, 'd') }}</span>
                
                <!-- Dots for bookings -->
                <div class="flex flex-wrap gap-1 mt-1 w-full">
                    <div 
                        v-for="b in bookingsOnDay(day).slice(0, 5)" 
                        :key="b.id"
                        class="h-1.5 w-1.5 rounded-full"
                        :class="statusColor(b.status)"
                        :title="`${b.startTime.split('T')[1].substr(0,5)} ${b.customer.name}`"
                    ></div>
                    <span v-if="bookingsOnDay(day).length > 5" class="text-[10px] text-gray-400">+{{ bookingsOnDay(day).length - 5 }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Details Side -->
    <div class="w-full md:w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-4">
            {{ selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Select a date' }}
        </h3>
        
        <div v-if="selectedDate" class="overflow-y-auto flex-1 space-y-4">
            <div v-if="bookingsOnDay(selectedDate).length === 0" class="text-gray-400 text-center py-10">
                無預約
            </div>

            <div 
                v-for="booking in bookingsOnDay(selectedDate)" 
                :key="booking.id"
                class="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors"
            >
                <div class="flex justify-between items-start mb-2">
                    <span class="text-sm font-bold text-brand-dark">
                        {{ booking.startTime.split('T')[1].substr(0,5) }}
                    </span>
                    <span class="text-xs px-2 py-0.5 rounded-full font-bold" 
                        :class="{
                            'bg-green-100 text-green-700': booking.status === 'Confirmed',
                            'bg-yellow-100 text-yellow-700': booking.status === 'Pending',
                            'bg-red-100 text-red-700': booking.status === 'Cancelled'
                        }">
                        {{ booking.status }}
                    </span>
                </div>
                <p class="font-bold text-gray-800 text-sm mb-1">{{ booking.customer.name }}</p>
                <p class="text-xs text-gray-500 mb-1">{{ booking.items[0]?.service.name }}</p>
                <div class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                    <span>👤 {{ booking.staff?.name || '無指定' }}</span>
                    <span>📞 {{ booking.customer.phone }}</span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
