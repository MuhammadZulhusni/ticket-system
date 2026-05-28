<template>
  <div class="min-h-screen flex justify-center py-10 px-4">
    <div class="w-full max-w-lg">

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
              <ASelect v-model="form.status" placeholder="Select status">
                <AOption value="open">Open</AOption>
                <AOption value="in_progress">In Progress</AOption>
                <AOption value="resolved">Resolved</AOption>
                <AOption value="closed">Closed</AOption>
              </ASelect>
            </AFormItem>

            <AFormItem field="priority" label="Priority" required>
              <ASelect v-model="form.priority" placeholder="Select priority">
                <AOption value="low">Low</AOption>
                <AOption value="medium">Medium</AOption>
                <AOption value="high">High</AOption>
                <AOption value="urgent">Urgent</AOption>
              </ASelect>
            </AFormItem>
          </div>

          <AFormItem field="description" label="Description" required>
            <ATextarea
              v-model="form.description"
              placeholder="Describe the issue in detail..."
              :auto-size="{ minRows: 4 }"
            />
          </AFormItem>

          <div class="flex justify-end gap-2 pt-2">
            <NuxtLink to="/tickets">
              <AButton size="small">Cancel</AButton>
            </NuxtLink>
            <AButton type="primary" size="small" html-type="submit" :loading="submitting">
              Submit Ticket
            </AButton>
          </div>

        </AForm>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $message } = useNuxtApp()
const router = useRouter()
const config = useRuntimeConfig()

const form = reactive({
  subject: '',
  requester_name: '',
  requester_email: '',
  status: '',
  priority: '',
  description: '',
})

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

async function handleSubmit({ errors }) {
  if (errors) return

  submitting.value = true
  try {
    await $fetch(`${config.public.apiBase}/tickets`, {
      method: 'POST',
      body: form,
    })
    $message.success('Ticket submitted successfully!')
    router.push('/tickets')
  } catch (error) {
    $message.error('Failed to submit ticket. Please try again.')
    console.error(error)
  } finally {
    submitting.value = false
  }
}
</script>