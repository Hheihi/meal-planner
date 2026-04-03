import { get, post } from './request'
import type { UserInfo, PreferenceKey } from '@/types/user'

export const userApi = {
  // 获取用户信息
  getInfo: () =>
    get<UserInfo>('/v1/users/info'),

  // 更新口味偏好
  updatePreferences: (preferences: PreferenceKey[]) =>
    post('/v1/users/preferences', { preferences }),
}
