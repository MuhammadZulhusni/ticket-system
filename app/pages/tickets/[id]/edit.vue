<template>
  <div class="min-h-screen flex justify-center py-10 px-4">
    <div class="w-full max-w-lg">

      <!-- Form card -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <AForm ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleUpdate">

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
            <NuxtLink :to="`/tickets`">
              <AButton size="small">Cancel</AButton>
            </NuxtLink>
            <AButton type="primary" size="small" html-type="submit" :loading="submitting">
              Save Changes
            </AButton>
          </div>

        </AForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Message } from '@arco-design/web-vue'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const ticketId = route.params.id

const { data } = await useFetch(`${config.public.apiBase}/tickets/${ticketId}`)

const form = reactive({
  subject: '',
  requester_name: '',
  requester_email: '',
  status: 'open',
  priority: 'medium',
  description: '',
})

watch(data, (val) => {
  const t = val?.data ?? val
  if (t) {
    form.subject         = t.subject
    form.requester_name  = t.requester_name
    form.requester_email = t.requester_email
    form.status          = t.status
    form.priority        = t.priority
    form.description     = t.description
  }
}, { immediate: true })

const submitting = ref(false)
const formRef = ref(null)

const rules = {
  subject:         [{ required: true, message: 'Subject is required' }],
  requester_name:  [{ required: true, message: 'Name is required' }],
  requester_email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Enter a valid email' },
  ],
  status:      [{ required: true, message: 'Select a status' }],
  priority:    [{ required: true, message: 'Select a priority' }],
  description: [{ required: true, message: 'Description is required' }],
}

async function handleUpdate() {
  const invalid = await formRef.value?.validate()
  if (invalid) return

  submitting.value = true
  try {
    await $fetch(`${config.public.apiBase}/tickets/${ticketId}`, {
      method: 'PUT',
      body: form,
    })
    Message.success('Ticket updated!')
    router.push('/tickets')
  } catch (err) {
    Message.error('Failed to update ticket')
  } finally {
    submitting.value = false
  }
}
</script>