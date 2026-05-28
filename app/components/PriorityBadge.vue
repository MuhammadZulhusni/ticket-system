<template>
  <span :class="['badge', `badge--${priority}`]">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  priority: { type: String, default: 'medium' }
})

const label = computed(() => ({
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}[props.priority] ?? props.priority))
</script>

<style scoped>
.badge {
  @apply inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge--low    { @apply bg-gray-100 text-gray-500; }
.badge--medium { @apply bg-yellow-100 text-yellow-700; }
.badge--high   { @apply bg-red-100 text-red-700; }
.badge--urgent { @apply bg-red-600 text-white; }
</style>