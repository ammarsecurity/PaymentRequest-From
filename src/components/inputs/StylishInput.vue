<script setup>
const props = defineProps({
  text: String,
  type: String,
});
</script>
<template>
  <div
    class="border-2 border-on_background border-opacity-50 h-12 relative rounded-xl flex flex-col">
    <span
      class="text-lg text-primary absolute -translate-y-6 -translate-x-2 bg-background p-1">
      {{ text }}
    </span>
    <input
      class="rounded-xl h-full px-4 focus:outline-primary"
      :type="type" />
  </div>
</template>
