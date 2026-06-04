<template>
  <div class="min-h-screen flex justify-center py-10 px-4">
    <div class="w-full max-w-lg">
      
      <!-- Form card -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <AForm ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">

          <AFormItem field="subject" label="Subject" required>
            <AInput v-model="form.subject" placeholder="Short description of the issue" />
          </AFormItem>

          <AFormItem field="requester_name" label="Your Name" required>
            <AInput v-model="form.requester_name" placeholder="Enter your name" />
          </AFormItem>

          <AFormItem field="requester_email" label="Your Email" required>
            <AInput v-model="form.requester_email" placeholder="your@email.com" />
          </AFormItem>

          <div class="grid grid-cols-2 gap-4">
            <AFormItem field="status" label="Status" required>
              <ASelect v-model="form.status">
                <AOption value="open">Open</AOption>
                <AOption value="in_progress">In Progress</AOption>
                <AOption value="resolved">Resolved</AOption>
                <AOption value="closed">Closed</AOption>
              </ASelect>
            </AFormItem>

            <AFormItem field="priority" label="Priority" required>
              <ASelect v-model="form.priority">
                <AOption value="low">Low</AOption>
                <AOption value="medium">Medium</AOption>
                <AOption value="high">High</AOption>
                <AOption value="urgent">Urgent</AOption>
              </ASelect>
            </AFormItem>
          </div>

          <AFormItem field="description" label="Description" required>
            <ATextarea v-model="form.description" :auto-size="{ minRows: 4 }" />
          </AFormItem>

          <div class="flex justify-end gap-2 pt-2">
            <NuxtLink to="/tickets">
              <AButton size="small">Cancel</AButton>
            </NuxtLink>
            <AButton type="primary" size="small" html-type="submit" :loading="submitting">
              {{ submitting ? 'Creating...' : 'Create Ticket' }}
            </AButton>
          </div>

        </AForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// Import composable
import { useTickets } from '~/composables/useTickets'

definePageMeta({
  middleware: ['sanctum:auth']
})

// Use ticket composable 
const { createTicket } = useTickets()

interface TicketForm {
  subject: string
  requester_name: string
  requester_email: string
  status: string
  priority: string
  description: string
}

const form = reactive<TicketForm>({
  subject: '',
  requester_name: '',
  requester_email: '',
  status: 'open',
  priority: 'medium',
  description: '',
})

const submitting = ref(false)
const formRef = ref<any>(null)

const rules = {
  subject: [
    { required: true, message: 'Subject is required' }
  ],
  requester_name: [
    { required: true, message: 'Name is required' }
  ],
  requester_email: [
    { required: true, message: 'Email is required' },
    { type: 'email' as const, message: 'Enter a valid email' }
  ],
  status: [
    { required: true, message: 'Select a status' }
  ],
  priority: [
    { required: true, message: 'Select a priority' }
  ],
  description: [
    { required: true, message: 'Description is required' }
  ],
}

//  Handle form submission
//  Uses composable: useTickets().createTicket()
async function handleSubmit() {
  const invalid = await formRef.value?.validate()
  if (invalid) return

  submitting.value = true
  try {
    await createTicket(form)
    navigateTo('/tickets')
  } catch (err) {
    console.error('Create ticket failed:', err)
  } finally {
    submitting.value = false
  }
}
</script>