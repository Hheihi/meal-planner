import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { authApi } from '@/api/auth'
import { setToken, getToken, removeToken, setUserInfo, removeUserInfo } from '@/utils/storage'
import type { UserInfo } from '@/types/user'

interface AuthState {
  token: string | null
  isLoggedIn: boolean
  user: UserInfo | null
  loading: boolean

  // Actions
  login: () => Promise<void>
  logout: () => void
  setUser: (user: UserInfo) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getToken(),
  isLoggedIn: !!getToken(),
  user: null,
  loading: false,

  login: async () => {
    set({ loading: true })
    try {
      const { code } = await Taro.login()
      const res = await authApi.login(code)

      setToken(res.token)
      setUserInfo(res.user)
      set({
        token: res.token,
        isLoggedIn: true,
        user: res.user,
      })
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    } finally {
      set({ loading: false })
    }
  },

  logout: () => {
    removeToken()
    removeUserInfo()
    set({
      token: null,
      isLoggedIn: false,
      user: null,
    })
  },

  setUser: (user: UserInfo) => {
    setUserInfo(user)
    set({ user })
  },
}))
