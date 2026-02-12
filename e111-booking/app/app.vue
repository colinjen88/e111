<template>
  <div class="antialiased text-gray-800 min-h-screen bg-brand-cream selection:bg-brand-red/20 selection:text-brand-red">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
/* ============ Global Styles ============ */

/* Smooth scroll globally */
html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(139, 0, 0, 0.15);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 0, 0, 0.3);
}

/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  filter: blur(2px);
}

.page-leave-to {
  opacity: 0;
  filter: blur(2px);
}
</style>
