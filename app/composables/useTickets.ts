// pages/tickets/index.vue (fetchTickets, deleteTicket)
// pages/tickets/create.vue (createTicket)
// pages/tickets/[id]/index.vue (getTicket, deleteTicket)
// pages/tickets/[id]/edit.vue (getTicket, updateTicket)

import { Message } from '@arco-design/web-vue'

interface Ticket {
  id: number
  subject: string
  status: string
  priority: string
  requester_name: string
  requester_email: string
  description: string
  created_at: string
  updated_at: string
}

interface TicketsResponse {
  data: Ticket[]
  message?: string
}

interface ApiResponse {
  data: Ticket
  message?: string
}

export const useTickets = () => {
  const client = useSanctumClient()
  const tickets = ref<Ticket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTickets = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await client('/api/tickets') as TicketsResponse
      tickets.value = response.data || []
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to load tickets'
      console.error('Failed to fetch tickets:', err)
      Message.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getTicket = async (id: number) => {
    try {
      const response = await client(`/api/tickets/${id}`) as ApiResponse
      return response.data
    } catch (err: any) {
      Message.error(err?.data?.message || 'Failed to load ticket')
      throw err
    }
  }

  const createTicket = async (form: any) => {
    try {
      const response: any = await client('/api/tickets', {
        method: 'POST',
        body: form
      })
      Message.success(response.message || 'Ticket created successfully!')
      return response
    } catch (err: any) {
      if (err?.data?.errors) {
        const errors = err.data.errors as Record<string, string[]>
        Message.error(Object.values(errors).flat().join(', '))
      } else {
        Message.error(err?.data?.message || 'Failed to create ticket')
      }
      throw err
    }
  }

  const updateTicket = async (id: number, form: any) => {
    try {
      const response: any = await client(`/api/tickets/${id}`, {
        method: 'PUT',
        body: form
      })
      Message.success(response.message || 'Ticket updated successfully!')
      return response
    } catch (err: any) {
      Message.error(err?.data?.message || 'Failed to update ticket')
      throw err
    }
  }

  const deleteTicket = async (id: number) => {
    try {
      const response: any = await client(`/api/tickets/${id}`, {
        method: 'DELETE'
      })
      tickets.value = tickets.value.filter(t => t.id !== id)
      Message.success(response.message || 'Ticket deleted successfully!')
      return response
    } catch (err: any) {
      Message.error(err?.data?.message || 'Failed to delete ticket')
      throw err
    }
  }

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket
  }
}