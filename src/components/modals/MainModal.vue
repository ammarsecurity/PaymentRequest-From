<script setup>
/* --------------------------------- Imports -------------------------------- */
// Tools
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

/* ---------------------------------- Index --------------------------------- */
const emit = defineEmits(['close']);
const close = () => {
  emit('close');
};
const props = defineProps({
  text: String,
  styles: String,
});
const modal = ref(null);
onClickOutside(modal, close);
</script>

<template>
  <Teleport to="#modal">
    <!-- Modal Background -->
    <div
      class="bg-background_dark bg-opacity-50 fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-[90]">
      <!-- Modal -->
      <div :class="styles"
        class="flex flex-col items-end bg-background dark:bg-background_dark rounded-2xl max-h-[90vh] max-w-[90vw] overflow-y-auto overflow-x-hidden"
        ref="modal" v-motion-pop>
        <div class="flex justify-between pt-6 px-6 w-full">

          <h1 class="text-2xl text-primary dark:text-primary_dark font-bold">{{ text }}</h1>
          <PhX
            class="fill-on_background dark:fill-on_background_dark w-6 h-6 transition-all duration-300 hover:scale-110 hover:fill-red cursor-pointer"
            @click="close" />
        </div>
        <div class="w-full overflow-y-auto rounded-lg xl:rounded-2xl p-4 py-8 flex flex-col gap-4">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
::-webkit-scrollbar-thumb {
  background: rgb(182, 182, 182);
}

::-webkit-scrollbar {
  width: 1.5vmin;
}
</style>
