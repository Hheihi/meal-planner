import { useCallback } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'

export function useAuth() {
  const { isLoggedIn, login } = useAuthStore()

  const ensureLogin = useCallback(async () => {
    if (!isLoggedIn) {
      await login()
    }
  }, [isLoggedIn, login])

  return {
    isLoggedIn,
    login,
    ensureLogin,
  }
}
