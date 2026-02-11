<script setup lang="ts">
useHead({
  title: '御手國醫養生會館 - 源自中醫，專注養生',
  meta: [
    { name: 'description', content: '提供專業足底按摩、經絡推拿、精油SPA服務。源自中醫養生智慧，為您舒緩身心疲勞。' }
  ]
})

const services = [
  {
    title: '足底按摩',
    desc: '刺激足部反射區，調理臟腑功能，舒緩雙腿疲勞',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac927ac4ad?auto=format&fit=crop&q=80&w=800',
    price: 'NT$ 600 起'
  },
  {
    title: '經絡推拿',
    desc: '針對全身經絡穴位進行按壓，緩解肌肉痠痛與僵硬',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    price: 'NT$ 1,000 起'
  },
  {
    title: '精油 SPA',
    desc: '搭配頂級精油與舒緩手技，釋放深層壓力，滋潤肌膚',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800',
    price: 'NT$ 1,500 起'
  }
]
</script>

<template>
  <div class="bg-brand-cream min-h-screen font-sans text-brand-dark overflow-x-hidden">
    <!-- Hero Section -->
    <section class="relative h-[85vh] flex items-center justify-center overflow-hidden">
      <!-- Background Image with Overlay -->
      <div 
        class="absolute inset-0 bg-cover bg-center z-0 animate-kenburns" 
        style="background-image: url('https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1920')"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-brand-dark/95 z-10"></div>

      <!-- Content -->
      <div class="relative z-20 text-center px-4 max-w-4xl mx-auto w-full">
        <div v-motion-fade-visible-once :delay="200" class="mb-8">
           <span class="inline-block py-1.5 px-4 border border-brand-gold text-brand-gold text-sm md:text-base tracking-[0.2em] mb-4 rounded-full bg-black/40 backdrop-blur-md shadow-brand-gold/20 shadow-lg">
             源自中醫 · 專注養生
           </span>
        </div>
        
        <h1 
          v-motion-slide-visible-once-bottom
          :delay="400"
          class="text-6xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-xl tracking-wide leading-tight"
        >
          御手國醫<br/><span class="text-4xl md:text-6xl font-light text-brand-gold/90 block mt-2">養生會館</span>
        </h1>
        
        <p 
          v-motion-slide-visible-once-bottom
          :delay="600"
          class="text-gray-200 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed px-4"
        >
          在繁忙的都市中，尋找一處靜謐的角落。<br class="hidden md:block" />
          透過專業技師的手，喚醒身體的自癒力量。
        </p>
        
        <div 
          v-motion-slide-visible-once-bottom
          :delay="800"
          class="flex flex-col md:flex-row gap-6 justify-center items-center w-full max-w-sm md:max-w-none mx-auto"
        >
          <NuxtLink to="/booking" class="group relative px-10 py-4 bg-brand-red text-white text-lg font-bold rounded-full overflow-hidden shadow-[0_0_20px_rgba(139,0,0,0.5)] hover:shadow-[0_0_30px_rgba(139,0,0,0.7)] transition-all duration-300 w-full md:w-auto">
             <span class="relative z-10 flex items-center justify-center gap-2 tracking-widest">
               立即預約
               <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
             </span>
             <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </NuxtLink>
          
          <a href="#services" class="px-10 py-4 border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors w-full md:w-auto backdrop-blur-sm tracking-widest">
            服務介紹
          </a>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-24 px-4 md:px-0 bg-white relative">
      <!-- Decorative Element -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-brand-red rotate-45 flex items-center justify-center shadow-xl border-4 border-white z-30">
         <span class="text-brand-gold text-3xl font-serif font-bold">御</span>
      </div>

      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-20" v-motion-slide-visible-once-bottom>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4 relative inline-block">
             經典服務
             <span class="absolute -bottom-3 left-0 w-full h-1 bg-brand-gold/60 rounded-full"></span>
          </h2>
          <p class="text-gray-500 mt-6 tracking-wide text-lg">結合傳統經絡理論與現代舒壓手法</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 md:px-0">
          <div 
            v-for="(service, index) in services" 
            :key="index" 
            v-motion-slide-visible-once-bottom
            :delay="index * 200"
            class="group bg-brand-cream rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-brand-gold/10 flex flex-col h-full"
          >
            <div class="h-72 overflow-hidden relative shrink-0">
              <img :src="service.image" :alt="service.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
              <div class="absolute bottom-6 left-6 text-white">
                 <p class="text-brand-gold text-xs font-bold tracking-[0.2em] mb-2 uppercase">Recommended</p>
                 <h3 class="text-3xl font-serif font-bold tracking-wide shadow-black drop-shadow-md">{{ service.title }}</h3>
              </div>
            </div>
            <div class="p-8 flex flex-col flex-grow bg-gradient-to-br from-brand-cream to-white">
              <p class="text-gray-600 mb-8 leading-relaxed text-justify flex-grow h-24">{{ service.desc }}</p>
              <div class="flex items-center justify-between pt-6 border-t border-brand-gold/20 mt-auto">
                <span class="text-brand-red font-bold text-2xl font-serif">{{ service.price }}</span>
                <NuxtLink to="/booking" class="inline-flex items-center justify-center px-6 py-2 border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-gold transition-colors rounded-full text-sm font-bold tracking-wider">
                  預約
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info/Ambience Section -->
    <section class="py-24 bg-brand-dark text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
        <div class="max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-16">
           <div class="w-full md:w-1/2" v-motion-slide-visible-once-left>
              <h2 class="text-4xl md:text-5xl font-serif font-bold text-brand-gold mb-8 leading-snug">頂級環境，<br/>極致放鬆</h2>
              <p class="text-gray-300 leading-relaxed mb-10 text-lg text-justify font-light">
                館內採用中式禪風設計，沉穩的原木色調搭配柔和燈光，營造出遠離塵囂的寧靜氛圍。
                每個包廂皆配備獨立空調與舒適按摩椅，讓您在私密的空間中徹底釋放壓力。
              </p>
              <ul class="space-y-6">
                 <li class="flex items-center gap-4 group">
                    <span class="w-3 h-3 rounded-full bg-brand-gold group-hover:scale-150 transition-transform"></span>
                    <span class="text-lg tracking-wide">獨立隱私包廂</span>
                 </li>
                 <li class="flex items-center gap-4 group">
                    <span class="w-3 h-3 rounded-full bg-brand-gold group-hover:scale-150 transition-transform"></span>
                    <span class="text-lg tracking-wide">嚴選天然精油</span>
                 </li>
                 <li class="flex items-center gap-4 group">
                    <span class="w-3 h-3 rounded-full bg-brand-gold group-hover:scale-150 transition-transform"></span>
                    <span class="text-lg tracking-wide">養生漢方茶飲</span>
                 </li>
              </ul>
           </div>
           <div class="w-full md:w-1/2 grid grid-cols-2 gap-6 relative" v-motion-slide-visible-once-right>
               <div class="absolute -inset-4 bg-brand-gold/10 blur-3xl rounded-full"></div>
               <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400&h=500" class="rounded-2xl object-cover w-full h-80 translate-y-12 shadow-2xl z-10 hover:scale-105 transition-transform duration-500">
               <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400&h=500" class="rounded-2xl object-cover w-full h-80 shadow-2xl z-10 hover:scale-105 transition-transform duration-500">
           </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black text-gray-500 py-16 text-center text-sm border-t border-gray-900">
       <div class="max-w-4xl mx-auto px-4">
          <div class="mb-8">
             <span class="text-3xl text-brand-gold font-serif tracking-widest block mb-2">御手國醫</span>
             <span class="text-xs tracking-[0.3em] uppercase opacity-50">Master Hand Massage</span>
          </div>
          <div class="flex flex-col md:flex-row justify-center gap-6 mb-10 text-gray-400 font-light">
             <div class="flex flex-col items-center">
                <span class="text-brand-red mb-1 font-bold">台南文化館</span>
                <span>台南市中華東路三段380巷47號</span>
             </div>
             <div class="hidden md:block w-px bg-gray-800 h-10"></div>
             <div class="flex flex-col items-center">
                <span class="text-brand-red mb-1 font-bold">永康中華館</span>
                <span>台南市永康區中華二路340巷7號</span>
             </div>
          </div>
          <p class="text-gray-700 text-xs">&copy; 2026 E111 Booking System. All rights reserved.</p>
       </div>
    </footer>

    <!-- Mobile Sticky CTA -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-gray-200 md:hidden z-50">
       <NuxtLink to="/booking" class="block w-full py-4 bg-brand-red text-white text-center font-bold text-lg rounded-xl shadow-lg active:scale-95 transition-transform">
         立即預約按摩
       </NuxtLink>
    </div>

  </div>
</template>

<style scoped>
@keyframes kenburns {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
.animate-kenburns {
  animation: kenburns 20s ease-out infinite alternate;
}

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
