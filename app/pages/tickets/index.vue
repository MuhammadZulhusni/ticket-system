<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-10 px-4">
      
      <div class="flex items-center justify-between mb-8">
        <div>
          <ATypographyTitle :heading="2" class="!mb-1">Tickets</ATypographyTitle>
          <ATypographyText type="secondary">Manage your support tickets</ATypographyText>
        </div>
        <ASpace :size="12">
          <AButton type="primary" @click="navigateTo('/tickets/create')">
            Create Ticket
          </AButton>
          <AButton @click="handleLogout">
            Logout
          </AButton>
        </ASpace>
      </div>

      <div v-if="loading" class="text-center py-12">
        <ASpin :loading="true" size="large">
          <div class="h-32"></div>
        </ASpin>
        <ATypographyText type="secondary" class="mt-4 block">Loading tickets...</ATypographyText>
      </div>

      <ACard v-else-if="error" :bordered="true" class="text-center py-12">
        <AResult
          status="error"
          title="Error loading tickets"
          :subtitle="error"
        >
          <template #extra>
            <AButton type="primary" @click="fetchTickets">Try Again</AButton>
          </template>
        </AResult>
      </ACard>

      <ACard v-else-if="!tickets.length" :bordered="true" class="text-center py-12">
        <AResult
          status="404"
          title="No tickets yet"
          subtitle="Get started by creating your first ticket."
        >
          <template #extra>
            <AButton type="primary" @click="navigateTo('/tickets/create')">
              Create Ticket
            </AButton>
          </template>
        </AResult>
      </ACard>

      <ACard v-else :bordered="true" class="overflow-hidden">
        <ATable
          :columns="columns"
          :data="tickets"
          :bordered="false"
          :stripe="false"
          :pagination="false"
          row-key="id"
        >
          <template #subject="{ record }">
            <NuxtLink 
              :to="`/tickets/${record.id}`"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              {{ record.subject }}
            </NuxtLink>
          </template>
          
          <template #status="{ record }">
            <ATag :color="getStatusColor(record.status)">
              {{ formatStatus(record.status) }}
            </ATag>
          </template>
          
          <template #priority="{ record }">
            <ATag :color="getPriorityColor(record.priority)">
              {{ formatPriority(record.priority) }}
            </ATag>
          </template>
          
          <template #actions="{ record }">
            <ASpace :size="8">
              <AButton 
                type="text" 
                size="small"
                @click="navigateTo(`/tickets/${record.id}/edit`)"
              >
                Edit
              </AButton>
              <AButton 
                type="text" 
                status="danger" 
                size="small"
                @click="openDeleteModal(record)"
              >
                Delete
              </AButton>
            </ASpace>
          </template>
        </ATable>
      </ACard>

      <AModal
        v-model:visible="deleteModal.isOpen"
        title="Delete Ticket"
        :footer="false"
        :mask-closable="!deleting"
        :closable="!deleting"
        width="480px"
      >
        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
              <IconExclamationCircle class="h-5 w-5 text-red-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-700">
                Are you sure you want to delete ticket 
                <span class="font-semibold">#{{ deleteModal.ticket?.id }}</span>?
              </p>
              <p class="text-sm text-gray-500 mt-1">
                Subject: <span class="font-medium text-gray-700">{{ deleteModal.ticket?.subject }}</span>
              </p>
              <p class="text-sm text-red-500 mt-2">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <AButton 
              @click="closeDeleteModal"
              :disabled="deleting"
            >
              Cancel
            </AButton>
            <AButton 
              type="primary" 
              status="danger"
              :loading="deleting"
              @click="confirmDelete"
            >
              {{ deleting ? 'Deleting...' : 'Delete Ticket' }}
            </AButton>
          </div>
        </div>
      </AModal>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconExclamationCircle } from '@arco-design/web-vue/es/icon'

// Import composables
import { useTickets } from '~/composables/useTickets'
import { useAuth } from '~/composables/useAuth'
import { useHelpers } from '~/composables/useHelpers'

definePageMeta({
  middleware: ['sanctum:auth']
})

// Use composables
const { tickets, loading, error, fetchTickets, deleteTicket } = useTickets()
const { handleLogout } = useAuth()
const { getStatusColor, getPriorityColor, formatStatus, formatPriority } = useHelpers()

const deleting = ref(false)
const deleteModal = ref<{ isOpen: boolean; ticket: any | null }>({
  isOpen: false,
  ticket: null
})

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    render: ({ record }: any) => `#${record.id}`
  },
  {
    title: 'Subject',
    dataIndex: 'subject',
    slotName: 'subject'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    slotName: 'status',
    width: 130
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    slotName: 'priority',
    width: 110
  },
  {
    title: 'Requester',
    dataIndex: 'requester_name',
    width: 150
  },
  {
    title: 'Actions',
    slotName: 'actions',
    align: 'right',
    width: 200
  }
]

function openDeleteModal(ticket: any) {
  deleteModal.value.ticket = ticket
  deleteModal.value.isOpen = true
}

function closeDeleteModal() {
  if (!deleting.value) {
    deleteModal.value.isOpen = false
    setTimeout(() => {
      deleteModal.value.ticket = null
    }, 300)
  }
}

async function confirmDelete() {
  if (!deleteModal.value.ticket) return
  
  deleting.value = true
  
  try {
    await deleteTicket(deleteModal.value.ticket.id)
    deleteModal.value.isOpen = false
    deleteModal.value.ticket = null
  } catch (err) {
    console.error('Failed to delete ticket:', err)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchTickets()
})
</script>