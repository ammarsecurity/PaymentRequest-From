<script setup>
import { ref } from 'vue';
// const props = defineProps({
//   placeholder: String,
//   modelValue: String,
// });
// const emits = defineEmits({
//   update: modelValue,
// });
</script>
<template>
  <input
    class="border p-4 rounded-2xl"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    type="text"
    :placeholder="placeholder" />
</template>
