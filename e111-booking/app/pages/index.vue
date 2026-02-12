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
    price: 'NT$ 600 起',
    icon: '🦶'
  },
  {
    title: '經絡推拿',
    desc: '針對全身經絡穴位進行按壓，緩解肌肉痠痛與僵硬',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    price: 'NT$ 1,000 起',
    icon: '💆'
  },
  {
    title: '精油 SPA',
    desc: '搭配頂級精油與舒緩手技，釋放深層壓力，滋潤肌膚',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800',
    price: 'NT$ 1,500 起',
    icon: '🌿'
  }
]

// Scroll indicator
const showScrollHint = ref(true)
onMounted(() => {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) showScrollHint.value = false
  }, { passive: true })
})
</script>

<template>
  <div class="bg-brand-cream min-h-screen font-sans text-brand-dark overflow-x-hidden">
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Image with Overlay -->
      <div 
        class="absolute inset-0 bg-cover bg-center z-0 animate-kenburns" 
        style="background-image: url('https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1920')"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-brand-dark/95 z-10"></div>
      
      <!-- Decorative particles -->
      <div class="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div v-for="i in 6" :key="i" class="floating-particle" :style="{ 
          left: `${10 + i * 15}%`,
          animationDelay: `${i * 0.8}s`,
          animationDuration: `${6 + i * 1.2}s`
        }"></div>
      </div>

      <!-- Content -->
      <div class="relative z-20 text-center px-4 max-w-4xl mx-auto w-full">
        <div v-motion-fade-visible-once :delay="200" class="mb-8">
           <span class="inline-block py-2 px-5 border border-brand-gold/60 text-brand-gold text-sm md:text-base tracking-[0.25em] mb-4 rounded-full bg-black/40 backdrop-blur-xl shadow-brand-gold/10 shadow-2xl font-light">
             源自中醫 · 專注養生
           </span>
        </div>
        
        <h1 
          v-motion-slide-visible-once-bottom
          :delay="400"
          class="text-6xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-2xl tracking-wide leading-tight"
        >
          御手國醫<br/><span class="text-4xl md:text-6xl font-light text-brand-gold/90 block mt-3 tracking-[0.15em]">養生會館</span>
        </h1>
        
        <p 
          v-motion-slide-visible-once-bottom
          :delay="600"
          class="text-gray-300 text-lg md:text-xl mb-14 max-w-2xl mx-auto font-light leading-relaxed px-4"
        >
          在繁忙的都市中，尋找一處靜謐的角落。<br class="hidden md:block" />
          透過專業技師的手，喚醒身體的自癒力量。
        </p>
        
        <div 
          v-motion-slide-visible-once-bottom
          :delay="800"
          class="flex flex-col md:flex-row gap-5 justify-center items-center w-full max-w-sm md:max-w-none mx-auto"
        >
          <NuxtLink to="/booking" class="group relative px-10 py-4 bg-brand-red text-white text-lg font-bold rounded-full overflow-hidden shadow-[0_0_25px_rgba(139,0,0,0.5)] hover:shadow-[0_0_40px_rgba(139,0,0,0.7)] transition-all duration-500 w-full md:w-auto active:scale-95">
             <span class="relative z-10 flex items-center justify-center gap-2 tracking-[0.15em]">
               立即預約
               <svg class="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
             </span>
             <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          </NuxtLink>
          
          <a href="#services" class="px-10 py-4 border border-white/20 text-white/90 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 w-full md:w-auto backdrop-blur-sm tracking-[0.15em] font-light active:scale-95">
            服務介紹
          </a>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <Transition name="fade">
        <div v-if="showScrollHint" class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <span class="text-white/40 text-[10px] tracking-[0.3em] uppercase font-light">Scroll</span>
          <div class="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
            <div class="w-1 h-2.5 bg-brand-gold/80 rounded-full animate-scroll-dot"></div>
          </div>
        </div>
      </Transition>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-28 px-4 md:px-0 bg-white relative">
      <!-- Decorative Element -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-brand-red rotate-45 flex items-center justify-center shadow-2xl border-4 border-white z-30">
         <span class="text-brand-gold text-3xl font-serif font-bold -rotate-45">御</span>
      </div>

      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-20" v-motion-slide-visible-once-bottom>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4 relative inline-block">
             經典服務
             <span class="absolute -bottom-3 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent rounded-full"></span>
          </h2>
          <p class="text-gray-400 mt-8 tracking-wider text-lg font-light">結合傳統經絡理論與現代舒壓手法</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
          <div 
            v-for="(service, index) in services" 
            :key="index" 
            v-motion-slide-visible-once-bottom
            :delay="index * 200"
            class="group bg-brand-cream/50 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 border border-brand-gold/10 flex flex-col h-full"
          >
            <div class="h-72 overflow-hidden relative shrink-0">
              <img :src="service.image" :alt="service.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                 <p class="text-brand-gold text-[10px] font-bold tracking-[0.25em] mb-2 uppercase">{{ service.icon }} Recommended</p>
                 <h3 class="text-3xl font-serif font-bold tracking-wider drop-shadow-lg">{{ service.title }}</h3>
              </div>
            </div>
            <div class="p-8 flex flex-col flex-grow bg-gradient-to-br from-brand-cream/60 to-white">
              <p class="text-gray-500 mb-8 leading-relaxed text-justify flex-grow font-light">{{ service.desc }}</p>
              <div class="flex items-center justify-between pt-6 border-t border-brand-gold/15">
                <span class="text-brand-red font-bold text-2xl font-serif">{{ service.price }}</span>
                <NuxtLink to="/booking" class="inline-flex items-center justify-center px-6 py-2.5 border-2 border-brand-dark/80 text-brand-dark hover:bg-brand-dark hover:text-brand-gold transition-all duration-300 rounded-full text-sm font-bold tracking-wider group/btn active:scale-95">
                  <span>預約</span>
                  <svg class="w-4 h-4 ml-1 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info/Ambience Section -->
    <section class="py-28 bg-brand-dark text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <!-- Decorative orbs -->
        <div class="absolute top-20 right-20 w-[300px] h-[300px] bg-brand-gold/5 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-20 left-20 w-[200px] h-[200px] bg-brand-red/5 rounded-full blur-[80px]"></div>
        
        <div class="max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-16">
           <div class="w-full md:w-1/2" v-motion-slide-visible-once-left>
              <p class="text-brand-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Experience</p>
              <h2 class="text-4xl md:text-5xl font-serif font-bold text-white mb-8 leading-snug">頂級環境，<br/>極致放鬆</h2>
              <p class="text-gray-400 leading-relaxed mb-10 text-lg text-justify font-light">
                館內採用中式禪風設計，沉穩的原木色調搭配柔和燈光，營造出遠離塵囂的寧靜氛圍。
                每個包廂皆配備獨立空調與舒適按摩椅，讓您在私密的空間中徹底釋放壓力。
              </p>
              <ul class="space-y-5">
                 <li class="flex items-center gap-4 group">
                    <span class="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 group-hover:scale-110 transition-all duration-300">✨</span>
                    <span class="text-lg tracking-wide font-light">獨立隱私包廂</span>
                 </li>
                 <li class="flex items-center gap-4 group">
                    <span class="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 group-hover:scale-110 transition-all duration-300">🌿</span>
                    <span class="text-lg tracking-wide font-light">嚴選天然精油</span>
                 </li>
                 <li class="flex items-center gap-4 group">
                    <span class="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 group-hover:scale-110 transition-all duration-300">🍵</span>
                    <span class="text-lg tracking-wide font-light">養生漢方茶飲</span>
                 </li>
              </ul>
           </div>
           <div class="w-full md:w-1/2 grid grid-cols-2 gap-6 relative" v-motion-slide-visible-once-right>
               <div class="absolute -inset-8 bg-brand-gold/5 blur-3xl rounded-full"></div>
               <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400&h=500" alt="spa environment" class="rounded-3xl object-cover w-full h-80 translate-y-12 shadow-2xl z-10 hover:scale-105 transition-transform duration-700 border border-white/5">
               <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400&h=500" alt="massage room" class="rounded-3xl object-cover w-full h-80 shadow-2xl z-10 hover:scale-105 transition-transform duration-700 border border-white/5">
           </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black text-gray-500 py-20 text-center text-sm border-t border-gray-900/50">
       <div class="max-w-4xl mx-auto px-4">
          <div class="mb-10">
             <span class="text-4xl text-brand-gold font-serif tracking-[0.2em] block mb-2">御手國醫</span>
             <span class="text-[10px] tracking-[0.4em] uppercase text-gray-600">Master Hand Massage</span>
          </div>
          <div class="flex flex-col md:flex-row justify-center gap-8 mb-12 text-gray-400 font-light">
             <div class="flex flex-col items-center">
                <span class="text-brand-red mb-1.5 font-bold text-sm">台南文化館</span>
                <span class="text-xs text-gray-500">台南市中華東路三段380巷47號</span>
             </div>
             <div class="hidden md:block w-px bg-gray-800 h-10 self-center"></div>
             <div class="flex flex-col items-center">
                <span class="text-brand-red mb-1.5 font-bold text-sm">永康中華館</span>
                <span class="text-xs text-gray-500">台南市永康區中華二路340巷7號</span>
             </div>
          </div>
          <div class="mb-8 flex flex-wrap justify-center gap-6 text-xs text-gray-600 font-medium tracking-wider uppercase">
             <NuxtLink to="/order" class="hover:text-brand-gold transition-colors duration-300">訂單查詢</NuxtLink>
             <NuxtLink to="/admin" class="hover:text-brand-gold transition-colors duration-300">管理登入</NuxtLink>
             <span class="text-gray-800">|</span>
             <NuxtLink to="/privacy" class="hover:text-brand-gold transition-colors duration-300">隱私權政策</NuxtLink>
             <NuxtLink to="/terms" class="hover:text-brand-gold transition-colors duration-300">服務條款</NuxtLink>
          </div>
          <p class="text-gray-700 text-xs">&copy; 2026 E111 Booking System. All rights reserved.</p>
       </div>
    </footer>

    <!-- Mobile Sticky CTA -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-brand-gold/10 md:hidden z-50 safe-area-bottom">
       <NuxtLink to="/booking" class="block w-full py-4 bg-gradient-to-r from-brand-red to-red-800 text-white text-center font-bold text-lg rounded-2xl shadow-xl shadow-brand-red/20 active:scale-[0.97] transition-transform tracking-wider">
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
  animation: kenburns 25s ease-out infinite alternate;
}

/* Floating particles */
.floating-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% {
    bottom: -10px;
    opacity: 0;
    transform: translateX(0);
  }
  10% { opacity: 0.6; }
  90% { opacity: 0.2; }
  100% {
    bottom: 110%;
    opacity: 0;
    transform: translateX(30px);
  }
}

/* Scroll dot */
@keyframes scrollDot {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(8px); opacity: 0; }
}

.animate-scroll-dot {
  animation: scrollDot 1.5s ease-in-out infinite;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Safe area for mobile */
.safe-area-bottom {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
</style>
