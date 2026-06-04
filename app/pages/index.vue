<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <!-- Loading spinner -->
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: async () => {
    // Get current authenticated user
    const { user } = useSanctumAuth()
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Redirect based on authentication status
    if (user.value) {
      return navigateTo('/tickets')  // Authenticated = go to tickets
    } else {
      return navigateTo('/login')    // Not authenticated = go to login
    }
  }
})
</script>