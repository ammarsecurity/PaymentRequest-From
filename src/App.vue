<script setup>
/* ----------------------- Imports ---------------------- */
// Tools
import { RouterView } from 'vue-router';
import { computed } from 'vue';
import i18n from '@/locales/i18n';

/* ------------------------ Index ----------------------- */
// Language
const lang = computed(() => {
  return i18n.global.locale;
});
</script>

<template>
  <div
    class="bg-background dark:bg-background_dark bg-[url('/images/pattern.svg')]"
    :dir="lang == 'en' ? 'ltr' : 'rtl'">
    <RouterView
      v-slot="{ Component }"
      :key="lang">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
</style>
