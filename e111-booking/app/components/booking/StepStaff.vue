<script setup lang="ts">
const { bookingData, staffList, loadingStaff, errorStaff, selectStaff, selectNoPreference, goBack } = useBooking()
</script>

<template>
  <div>
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
          <img v-if="member.photoUrl" :src="member.photoUrl" :alt="member.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
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
</template>
