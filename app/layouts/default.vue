<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">

    <!-- sidebar -->
    <aside class="w-48 bg-white border-r border-gray-100 flex flex-col">

      <!-- brand -->
      <div class="px-4 py-3 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-700 text-sm">TicketSys</span>
        </div>
      </div>

      <!-- nav links -->
      <nav class="flex-1 p-2 space-y-0.5">
        <NuxtLink to="/tickets" class="nav-link" active-class="nav-link--active">
          Tickets
        </NuxtLink>
        <NuxtLink to="/tickets/create" class="nav-link" active-class="nav-link--active">
          New Ticket
        </NuxtLink>
      </nav>

    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="bg-white border-b border-gray-100 px-5 py-2.5 flex items-center justify-between">
        <span class="text-sm text-gray-500">{{ pageTitle }}</span>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const pageTitle = computed(() => {
  if (route.path === '/tickets') return 'All Tickets'
  if (route.path === '/tickets/create') return 'New Ticket'
  if (route.path.includes('/edit')) return 'Edit Ticket'
  if (route.path.includes('/tickets/')) return 'Ticket Detail'
  return 'Ticket System'
})
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg text-xs
         text-gray-500 hover:bg-gray-50 hover:text-gray-800
         transition-colors font-medium;
}
.nav-link--active {
  @apply bg-blue-50 text-blue-600;
}
</style>