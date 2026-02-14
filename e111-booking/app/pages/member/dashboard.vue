<script setup lang="ts">
definePageMeta({
  middleware: ['member']
})

const { data: auth } = await useFetch('/api/auth/me')
const user = computed(() => auth.value?.user)

const { data: bookings, refresh } = await useFetch('/api/member/bookings')

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  navigateTo('/member/login')
}

const formatDate = (date: any) => {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  })
}

const getStatusLabel = (status: string) => {
  const map: any = {
    'Pending': '預訂中',
    'Confirmed': '已確認',
    'Completed': '已完成',
    'Cancelled': '已取消'
  }
  return map[status] || status
}

const getLevelName = (level: string) => {
  const map: any = {
    'General': '一般會員',
    'Silver': '白銀會員',
    'Gold': '黃金會員',
    'Platinum': '尊榮鉑金'
  }
  return map[level] || level
}
</script>

<template>
  <div class="min-h-screen bg-brand-cream/30 pb-20 md:pb-10 font-sans text-gray-900">
    
    <!-- Mobile Header (Hidden on Desktop) -->
    <div class="md:hidden bg-brand-dark text-white pt-16 pb-32 px-6 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
      <div class="flex flex-col gap-6 relative z-10">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-[2rem] bg-brand-gold flex items-center justify-center text-4xl shadow-inner border border-white/20">
            👤
          </div>
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold font-serif">{{ user?.name || '貴賓' }}</h1>
              <span class="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-widest border border-white/10 uppercase">
                {{ getLevelName(user?.memberLevel) }}
              </span>
            </div>
            <p class="text-white/50 text-sm mt-1 font-mono tracking-wider">{{ user?.phone }}</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur-md min-w-[120px] flex-1">
             <p class="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">可用點數</p>
             <p class="text-2xl font-bold text-brand-gold">{{ user?.points || 0 }}</p>
          </div>
          <button @click="logout" class="bg-white/10 hover:bg-white/20 p-4 rounded-3xl transition-all self-start aspect-square flex items-center justify-center">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </div>
      <!-- Decoration -->
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-6 -mt-16 md:mt-0 md:py-10 relative z-20">
      <div class="flex flex-col md:flex-row gap-8">
        
        <!-- Desktop Sidebar / Profile Card -->
        <aside class="hidden md:flex flex-col w-80 shrink-0 gap-6">
            <!-- Profile Info -->
            <div class="bg-brand-dark text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                <div class="relative z-10 flex flex-col items-center text-center gap-4">
                    <div class="w-24 h-24 rounded-[2rem] bg-brand-gold flex items-center justify-center text-5xl shadow-inner border-4 border-white/10">
                        👤
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold font-serif mb-2">{{ user?.name || '貴賓' }}</h1>
                        <span class="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-widest border border-white/10 uppercase">
                            {{ getLevelName(user?.memberLevel) }}
                        </span>
                        <p class="text-white/40 text-sm mt-3 font-mono tracking-wider">{{ user?.phone }}</p>
                    </div>

                    <div class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-2">
                        <p class="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">目前點數</p>
                        <p class="text-3xl font-bold text-brand-gold">{{ user?.points || 0 }} <span class="text-xs text-white/30 font-normal">pts</span></p>
                    </div>
                    
                    <button @click="logout" class="w-full py-3 mt-4 text-sm text-gray-400 hover:text-white transition-colors border-t border-white/10">
                        登出會員中心
                    </button>
                </div>
                <!-- Decoration -->
                <div class="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <!-- Promotion Sidebar Item -->
             <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-brand-red/10 overflow-hidden relative group">
                <div class="relative z-10">
                    <h3 class="text-lg font-bold text-brand-red mb-2">會員專屬禮遇</h3>
                    <p class="text-gray-500 text-sm leading-relaxed mb-6">邀請好友加入御手國醫，雙方皆可獲得 100 點回饋點數。</p>
                    <button class="text-xs font-bold text-brand-dark bg-brand-gold/20 px-4 py-2 rounded-lg hover:bg-brand-gold hover:text-white transition-colors">
                        立即邀請
                    </button>
                </div>
                <div class="absolute -right-6 -bottom-6 text-9xl opacity-5 group-hover:scale-110 transition-transform">🎁</div>
             </div>
        </aside>

        <!-- Right Content Area -->
        <div class="flex-1 space-y-8">
            <!-- Promo Banner (Mobile only or Top Banner) -->
            <div class="md:hidden bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                 <!-- Keep existing mobile promo content if needed, currently reusing design -->
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">專屬優惠</h3>
                    <p class="text-gray-400 text-sm leading-relaxed">作為 {{ getLevelName(user?.memberLevel) }}，您在下次預約時可額外獲得 5% 點數回饋。</p>
                  </div>
                  <NuxtLink to="/" class="bg-brand-red text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-brand-red/20 text-center w-full">
                      立即預約
                  </NuxtLink>
            </div>

            <div class="bg-white md:bg-transparent rounded-[2.5rem] md:rounded-none p-6 md:p-0 shadow-lg md:shadow-none">
                <div class="flex justify-between items-end mb-6 px-2">
                    <h2 class="text-2xl font-serif font-bold text-brand-dark">預約紀錄</h2>
                    <NuxtLink to="/" class="hidden md:inline-flex bg-brand-dark text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-colors items-center gap-2">
                        <span>+</span> 新增預約
                    </NuxtLink>
                </div>
              
              <div v-if="!bookings?.length" class="bg-white border-2 border-dashed border-gray-200 rounded-[3rem] py-20 text-center">
                 <div class="text-4xl mb-4 opacity-30">📅</div>
                 <p class="text-gray-400 font-medium">目前尚無任何預約紀錄</p>
                 <NuxtLink to="/" class="inline-block mt-4 text-brand-red font-bold hover:underline">去預約第一個療程</NuxtLink>
              </div>

              <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div v-for="b in bookings" :key="b.id" v-motion-slide-visible-bottom
                  class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between gap-4 hover:shadow-lg hover:-translate-y-1 transition-all group">
                  
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-4">
                         <div class="w-16 h-16 rounded-2xl bg-brand-cream/50 flex flex-col items-center justify-center border border-brand-gold/20 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                            <span class="text-[10px] font-bold uppercase opacity-60">{{ new Date(b.startTime).getMonth() + 1 }}月</span>
                            <span class="text-2xl font-bold leading-none">{{ new Date(b.startTime).getDate() }}</span>
                         </div>
                         <div>
                            <span class="text-xs font-bold px-2 py-0.5 rounded-md border border-gray-100 bg-gray-50 text-gray-400 mb-1 inline-block">#{{ b.id }}</span>
                            <h3 class="text-lg font-bold text-gray-900 group-hover:text-brand-red transition-colors">{{ b.items[0]?.service?.name }}</h3>
                            <p class="text-sm text-gray-400">{{ b.branch?.name }}</p>
                         </div>
                    </div>
                    <div class="text-right">
                       <span class="px-3 py-1 rounded-full text-xs font-bold" 
                            :class="{
                                'bg-yellow-100 text-yellow-700': b.status === 'Pending',
                                'bg-green-100 text-green-700': b.status === 'Confirmed',
                                'bg-gray-100 text-gray-500': b.status === 'Cancelled',
                                'bg-blue-100 text-blue-700': b.status === 'Completed',
                            }">
                          {{ getStatusLabel(b.status) }}
                       </span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-4 border-t border-gray-50 mt-2">
                     <div class="flex items-center gap-2 text-sm text-gray-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {{ new Date(b.startTime).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) }}
                        <span class="text-gray-300">|</span>
                        <span>{{ b.staff?.name || '指定技師' }}</span>
                     </div>
                     <NuxtLink :to="`/order/${b.id}?phone=${user.phone}`" class="text-sm font-bold text-gray-400 hover:text-brand-dark flex items-center gap-1 group/btn">
                        查看詳情 
                        <svg class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                     </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
