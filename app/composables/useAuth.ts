// pages/login.vue (handleLogin)
// pages/register.vue (handleRegister)
// pages/tickets/index.vue (handleLogout)
// for page with logout button (handleLogout)
// for page need current user info (user)
 
import { Message } from '@arco-design/web-vue'

export const useAuth = () => {
  const { login, logout, user } = useSanctumAuth()
  const client = useSanctumClient()

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await login(credentials)
      await navigateTo('/tickets')
    } catch (err: any) {
      throw err
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      Message.success('Logged out successfully')
      await navigateTo('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      await navigateTo('/login')
    }
  }

  const handleRegister = async (form: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    try {
      const response: any = await client('/api/register', {
        method: 'POST',
        body: form
      })
      Message.success(response.message || 'Registration successful!')
      // Auto-login after registration
      await handleLogin({
        email: form.email,
        password: form.password
      })
    } catch (err: any) {
      if (err?.data?.errors) {
        const errors = err.data.errors as Record<string, string[]>
        Message.error(Object.values(errors).flat().join(', '))
      } else {
        Message.error(err?.data?.message || 'Registration failed')
      }
      throw err
    }
  }

  return {
    user,           
    handleLogin,    
    handleLogout,   
    handleRegister  
  }
}