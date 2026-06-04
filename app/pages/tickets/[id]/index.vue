<template>
  <div class="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
    <div class="w-full max-w-lg">

      <div class="mb-6">
        <AButton type="text" @click="navigateTo('/tickets')" class="!px-0">
          Back to All Tickets
        </AButton>
      </div>

      <div v-if="loading" class="text-center py-12">
        <ASpin :loading="true" size="large">
          <div class="h-32"></div>
        </ASpin>
        <ATypographyText type="secondary" class="mt-4 block">Loading ticket...</ATypographyText>
      </div>

      <ACard v-else-if="error" :bordered="true">
        <AResult
          status="error"
          title="Error loading ticket"
          :subtitle="error"
        >
          <template #extra>
            <AButton type="primary" @click="navigateTo('/tickets')">
              Back to tickets
            </AButton>
          </template>
        </AResult>
      </ACard>

      <template v-else-if="ticket">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <ATag color="arcoblue" class="mb-2">
              TICKET #{{ ticket.id }}
            </ATag>
            <ATypographyTitle :heading="3" class="!mb-0">{{ ticket.subject }}</ATypographyTitle>
          </div>
          <AButton
            type="primary"
            size="small"
            @click="navigateTo(`/tickets/${ticket.id}/edit`)"
          >
            <template #icon>
              <IconEdit />
            </template>
            Edit
          </AButton>
        </div>

        <ASpace :size="8" class="mb-5">
          <ATag :color="getStatusColor(ticket.status)" size="large">
            {{ formatStatus(ticket.status) }}
          </ATag>
          <ATag :color="getPriorityColor(ticket.priority)" size="large">
            {{ formatPriority(ticket.priority) }}
          </ATag>
        </ASpace>

        <ACard :bordered="true">
          <ADescriptions
            :column="2"
            layout="inline-horizontal"
            :label-style="{ color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }"
            :value-style="{ color: '#374151', fontSize: '14px', fontWeight: '500' }"
          >
            <ADescriptionsItem label="Requester">
              {{ ticket.requester_name }}
            </ADescriptionsItem>
            <ADescriptionsItem label="Email">
              {{ ticket.requester_email }}
            </ADescriptionsItem>
          </ADescriptions>

          <ADivider />

          <div>
            <ATypographyText type="secondary" class="text-xs uppercase block mb-2">
              Description
            </ATypographyText>
            <ATypographyText class="text-sm whitespace-pre-wrap leading-relaxed">
              {{ ticket.description }}
            </ATypographyText>
          </div>

          <ADivider />

          <ADescriptions
            :column="2"
            layout="inline-horizontal"
            :label-style="{ color: '#9ca3af', fontSize: '12px' }"
            :value-style="{ color: '#6b7280', fontSize: '12px' }"
            >
            <ADescriptionsItem label="Created">
              {{ formatDate(ticket.created_at) }}
            </ADescriptionsItem>
            <ADescriptionsItem label="Updated">
              {{ formatDate(ticket.updated_at) }}
            </ADescriptionsItem>
          </ADescriptions>
        </ACard>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconArrowLeft, IconEdit } from '@arco-design/web-vue/es/icon'

// Import composables
import { useTickets } from '~/composables/useTickets'
import { useHelpers } from '~/composables/useHelpers'

const route = useRoute()

definePageMeta({
  middleware: ['sanctum:auth']
})

// Use composables
const { getTicket } = useTickets()
const { getStatusColor, getPriorityColor, formatStatus, formatPriority, formatDate } = useHelpers()

const ticket = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchTicket() {
  loading.value = true
  error.value = null
  
  try {
    const ticketId = Number(route.params.id)
    ticket.value = await getTicket(ticketId)
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to load ticket'
    console.error('Failed to fetch ticket:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTicket()
})
</script>