<template>
  <div class="min-h-screen bg-gray-50"></div>
</template>

<script setup>
  definePageMeta({
    middleware: (to) => navigateTo('/tickets', { redirectCode: 301 })
  })
</script>