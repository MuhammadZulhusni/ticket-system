<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <ACard :bordered="true" class="w-full max-w-md" :body-style="{ padding: '32px' }">
      
      <!-- Header -->
      <div class="mb-6 text-center">
        <ATypographyTitle :heading="3" class="!mb-1">TicketSys</ATypographyTitle>
        <ATypographyText type="secondary">Create your account to get started</ATypographyText>
      </div>

      <!-- Error Message -->
      <AAlert
        v-if="errorMessage"
        type="error"
        closable
        class="mb-4"
        @close="errorMessage = ''"
      >
        {{ errorMessage }}
      </AAlert>

      <!-- Registration Form -->
      <AForm
        ref="formRef"
        :model="form"
        layout="vertical"
        @submit="submitRegister"
      >
        <AFormItem
          field="name"
          label="Full Name"
          :rules="[{ required: true, message: 'Name is required' }]"
        >
          <AInput
            v-model="form.name"
            placeholder="John Doe"
            size="large"
          />
        </AFormItem>

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
          :rules="[
            { required: true, message: 'Password is required' },
            { minLength: 8, message: 'Password must be at least 8 characters' }
          ]"
        >
          <AInputPassword
            v-model="form.password"
            placeholder="Min. 8 characters"
            size="large"
            allow-clear
          />
        </AFormItem>

        <AFormItem
          field="password_confirmation"
          label="Confirm Password"
          :rules="[
            { required: true, message: 'Please confirm your password' },
            {
              validator: (value: string, callback: any) => {
                if (value !== form.password) {
                  callback('Passwords do not match')
                } else {
                  callback()
                }
              }
            }
          ]"
        >
          <AInputPassword
            v-model="form.password_confirmation"
            placeholder="Repeat your password"
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
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </AButton>
        </AFormItem>
      </AForm>

      <ADivider />

      <div class="text-center">
        <ATypographyText type="secondary">
          Already have an account?
        </ATypographyText>
        <AButton
          type="text"
          size="small"
          @click="navigateTo('/login')"
          class="!text-blue-600"
        >
          Sign in
        </AButton>
      </div>

    </ACard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// Import composable
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'sanctum:guest',
})

// Use auth composable
const { handleRegister } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const errorMessage = ref('')
const loading = ref(false)

// Handle registration form submission
// Uses composable: useAuth().handleRegister()
async function submitRegister() {
  errorMessage.value = ''
  loading.value = true

  try {
    await handleRegister(form)
  } catch (error: any) {
    if (error?.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat().join(' ')
    } else {
      errorMessage.value = error?.data?.message ?? 'Registration failed. Please check your inputs.'
    }
  } finally {
    loading.value = false
  }
}
</script>