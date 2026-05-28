<template>
  <div class="min-h-screen flex justify-center py-10 px-4">
    <div class="w-full max-w-lg">

      <!-- Back link -->
      <NuxtLink to="/tickets" class="text-xs text-gray-400 hover:text-gray-600 mb-6 block">
        Back to All Tickets
      </NuxtLink>

      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <span class="text-xs text-gray-400 font-mono">TICKET #{{ ticket.id }}</span>
          <h2 class="text-lg font-semibold text-gray-800">{{ ticket.subject }}</h2>
        </div>
      </div>

      <!-- Badges -->
      <div class="flex gap-2 mb-5">
        <StatusBadge :status="ticket.status" />
        <PriorityBadge :priority="ticket.priority" />
      </div>

      <!-- Detail card -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-gray-400 uppercase mb-1">Requester</p>
            <p class="text-sm font-medium text-gray-700">{{ ticket.requester_name }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase mb-1">Email</p>
            <p class="text-sm font-medium text-gray-700">{{ ticket.requester_email }}</p>
          </div>
        </div>

        <ADivider style="margin: 0" />

        <div>
          <p class="text-xs text-gray-400 uppercase mb-1">Description</p>
          <p class="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {{ ticket.description }}
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const { data } = await useFetch(
  `${config.public.apiBase}/tickets/${route.params.id}`
)

const ticket = computed(() => data.value?.data ?? {})
</script>