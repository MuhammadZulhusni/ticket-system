//  protects authenticated routes
export default defineNuxtRouteMiddleware(() => {
  const { user } = useSanctumAuth()

  if (!user.value) {
    return navigateTo('/login')
  }
})