<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullscreen?: boolean
  brand?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  text: '',
  fullscreen: false,
  brand: true
})

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
}

const ringSizes = {
  sm: 'border-2',
  md: 'border-[3px]',
  lg: 'border-4',
  xl: 'border-[5px]'
}
</script>

<template>
  <div 
    class="flex flex-col items-center justify-center gap-4"
    :class="{ 'fixed inset-0 bg-white/90 backdrop-blur-sm z-50': fullscreen }"
  >
    <div 
      class="relative"
      :class="sizeClasses[size]"
    >
      <!-- Outer ring -->
      <div 
        class="absolute inset-0 rounded-full animate-spin-slow"
        :class="[ringSizes[size], brand ? 'border-brand-red/30' : 'border-gray-200']"
        style="animation-duration: 3s;"
      ></div>
      
      <!-- Middle ring -->
      <div 
        class="absolute inset-1 rounded-full animate-spin-reverse"
        :class="[ringSizes[size], brand ? 'border-brand-gold/50' : 'border-gray-300']"
        style="animation-duration: 2s;"
      ></div>
      
      <!-- Inner ring (main spinner) -->
      <div 
        class="absolute inset-2 rounded-full animate-spin"
        :class="[ringSizes[size], brand ? 'border-brand-red border-t-transparent' : 'border-gray-400 border-t-transparent']"
        style="animation-duration: 1s;"
      ></div>
      
      <!-- Center dot -->
      <div 
        class="absolute inset-[35%] rounded-full animate-pulse"
        :class="brand ? 'bg-brand-gold/80' : 'bg-gray-400'"
      ></div>
    </div>
    
    <p 
      v-if="text" 
      class="text-sm font-medium animate-pulse"
      :class="brand ? 'text-brand-dark/70' : 'text-gray-500'"
    >
      {{ text }}
    </p>
  </div>
</template>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

.animate-spin-slow {
  animation: spin-slow linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse linear infinite;
}
</style>
