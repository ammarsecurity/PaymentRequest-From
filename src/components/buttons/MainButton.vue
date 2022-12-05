<script setup>
const props = defineProps({
  text: String,
  bordered: Boolean,
});
</script>
<template>
  <button
    :class="
      bordered
        ? 'bg-background  text-primary dark:text-primary_dark  border border-primary dark:border-primary_dark'
        : 'bg-primary dark:bg-primary_dark text-on_primary dark:text-on_primary_dark border border-primary dark:border-primary_dark'
    "
    class="flex items-center justify-center max-w-max gap-2 cursor-pointer text-xl rounded-full px-6 py-2 transition-all duration-300 hover:brightness-125 hover:gap-3">
    {{ text }}
    <slot></slot>
  </button>
</template>
