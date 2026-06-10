<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <ACard :bordered="true" class="w-full max-w-md" :body-style="{ padding: '32px' }">
      
      <div class="mb-6 text-center">
        <ATypographyTitle :heading="3" class="!mb-1">TicketSys</ATypographyTitle>
        <ATypographyText type="secondary">Sign in to manage your tickets</ATypographyText>
      </div>

      <AAlert
        v-if="infoMessage"
        type="warning"
        closable
        class="mb-4"
        @close="infoMessage = ''"
      >
        {{ infoMessage }}
      </AAlert>

      <AAlert
        v-if="error"
        type="error"
        closable
        class="mb-4"
        @close="error = ''"
      >
        {{ error }}
      </AAlert>

      <AForm
        ref="formRef"
        :model="form"
        layout="vertical"
        @submit="submit"
      >
        <AFormItem
          field="email"
          label="Email Address"
          :rules="[
            { required: true, message: 'Email is required' },
            { type: 'email' as const, message: 'Please enter a valid email' }
          ]"
        >
          <AInput
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            size="large"
          />
        </AFormItem>

        <AFormItem
          field="password"
          label="Password"
          :rules="[{ required: true, message: 'Password is required' }]"
        >
          <AInputPassword
            v-model="form.password"
            placeholder="••••••••"
            size="large"
            allow-clear
          />
        </AFormItem>

        <AFormItem>
          <AButton
            type="primary"
            html-type="submit"
            :loading="loading"
            long
            size="large"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </AButton>
        </AFormItem>
      </AForm>

      <ADivider />

      <div class="text-center">
        <ATypographyText type="secondary">
          Don't have an account?
        </ATypographyText>
        <AButton
          type="text"
          size="small"
          @click="navigateTo('/register')"
          class="!text-blue-600"
        >
          Create one
        </AButton>
      </div>

    </ACard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Import composable
import { useAuth } from '~/composables/useAuth'

// this page only can be acces for that user not login yet (guest)
definePageMeta({
  middleware: 'sanctum:guest',
})

// Use auth composable
const { handleLogin } = useAuth()
const route = useRoute()

const form = reactive({
  email: '',
  password: '',
})

const error = ref('')
const infoMessage = ref('')
const loading = ref(false)

onMounted(() => {
  if (route.query.message === 'unauthorized') {
    infoMessage.value = 'Access denied. Please log in to your account first.'
  }
})

async function submit() {
  error.value = ''
  infoMessage.value = ''
  loading.value = true
  try {
    await handleLogin(form)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>