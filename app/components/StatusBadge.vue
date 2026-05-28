<template>
  <span :class="['badge', `badge--${status}`]">
    {{ label }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: { type: String, default: 'open' }
})

const label = computed(() => ({
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}[props.status] ?? props.status))
</script>

<style scoped>
.badge {
  @apply inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium;
}
.badge--open        { @apply bg-orange-100 text-orange-700; }
.badge--in_progress { @apply bg-blue-100 text-blue-700; }
.badge--resolved    { @apply bg-green-100 text-green-700; }
.badge--closed      { @apply bg-gray-100 text-gray-500; }
</style>