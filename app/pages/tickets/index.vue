<template>
  <div class="p-8">

    <div class="flex items-center justify-between mb-6">
      <div></div>
      <NuxtLink to="/tickets/create">
        <AButton type="primary">New Ticket</AButton>
      </NuxtLink>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <ATable :data="tickets" :loading="loading" row-key="id">
        <template #columns>

          <ATableColumn title="ID" data-index="id" :width="70" />

          <ATableColumn title="Subject" data-index="subject">
            <template #cell="{ record }">
              <NuxtLink
                :to="`/tickets/${record.id}`"
                class="text-blue-600 hover:underline font-medium"
              >
                {{ record.subject }}
              </NuxtLink>
            </template>
          </ATableColumn>

          <ATableColumn title="Requester" data-index="requester_name" />

          <ATableColumn title="Status" data-index="status" :width="130">
            <template #cell="{ record }">
              <StatusBadge :status="record.status" />
            </template>
          </ATableColumn>

          <ATableColumn title="Priority" data-index="priority" :width="120">
            <template #cell="{ record }">
              <PriorityBadge :priority="record.priority" />
            </template>
          </ATableColumn>

          <ATableColumn title="Actions" :width="140">
            <template #cell="{ record }">
              <div class="flex gap-2">
                <NuxtLink :to="`/tickets/${record.id}/edit`">
                  <AButton size="mini" type="outline">Edit</AButton>
                </NuxtLink>
                <AButton
                  size="mini"
                  type="outline"
                  status="danger"
                  @click="confirmDelete(record)"
                >
                  Delete
                </AButton>
              </div>
            </template>
          </ATableColumn>

        </template>
      </ATable>
    </div>

  <AModal
    v-model:visible="deleteModal.visible"
    title="Delete Ticket"
    ok-text="Yes, Delete"
    cancel-text="Cancel"
    ok-status="danger"
    :ok-loading="deleteModal.loading"
    @ok="handleDelete"
  >
    <p>Delete ticket <strong>#{{ deleteModal.ticket?.id }}</strong>?</p>
    <p class="text-gray-400 text-sm mt-1">This cannot be undone.</p>
  </AModal>

  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { Message } from '@arco-design/web-vue'

const config = useRuntimeConfig()

const { data, pending: loading, refresh } = await useFetch(
  `${config.public.apiBase}/tickets`,
  { default: () => ({ data: [] }) }
)

const tickets = computed(() => data.value?.data ?? [])

const deleteModal = reactive({
  visible: false,
  loading: false,
  ticket: null,
})

function confirmDelete(record) {
  deleteModal.ticket = record
  deleteModal.visible = true
}

async function handleDelete() {
  deleteModal.loading = true
  try {
    await $fetch(`${config.public.apiBase}/tickets/${deleteModal.ticket.id}`, {
      method: 'DELETE',
    })
    Message.success('Deleted successfully!')
    deleteModal.visible = false
    await refresh()
  } catch (error) {
    Message.error('Delete failed')
  } finally {
    deleteModal.loading = false
  }
}
</script>