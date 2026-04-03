import { create } from 'zustand'
import { userApi } from '@/api/user'
import { getUserInfo, setUserInfo } from '@/utils/storage'
import type { UserInfo, PreferenceKey } from '@/types/user'

interface UserState {
  user: UserInfo | null
  loading: boolean

  // Actions
  fetchUser: () => Promise<void>
  updatePreferences: (preferences: PreferenceKey[]) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  user: getUserInfo<UserInfo>(),
  loading: false,

  fetchUser: async () => {
    set({ loading: true })
    try {
      const user = await userApi.getInfo()
      setUserInfo(user)
      set({ user })
    } finally {
      set({ loading: false })
    }
  },

  updatePreferences: async (preferences: PreferenceKey[]) => {
    await userApi.updatePreferences(preferences)
    const user = get().user
    if (user) {
      const updatedUser = { ...user, preferences }
      setUserInfo(updatedUser)
      set({ user: updatedUser })
    }
  },
}))
