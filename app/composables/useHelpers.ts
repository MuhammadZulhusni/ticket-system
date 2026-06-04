// pages/tickets/index.vue (getStatusColor, getPriorityColor, formatStatus, formatPriority)
// pages/tickets/[id]/index.vue (getStatusColor, getPriorityColor, formatStatus, formatPriority, formatDate)
// Any page displaying ticket status/priority badges or dates

export const useHelpers = () => {

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      open: 'blue',
      in_progress: 'orange',
      resolved: 'green',
      closed: 'gray'
    }
    return colors[status] || 'gray'
  }

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      low: 'gray',
      medium: 'blue',
      high: 'orange',
      urgent: 'red'
    }
    return colors[priority] || 'gray'
  }

  const formatStatus = (status: string): string => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatPriority = (priority: string): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    getStatusColor,
    getPriorityColor,
    formatStatus,
    formatPriority,
    formatDate
  }
}