// 用户相关类型

// 用户信息
export interface UserInfo {
  id: number
  nickname: string
  avatarUrl: string
  preferences: string[]
}

// 登录响应
export interface LoginResponse {
  token: string
  is_new_user: boolean
  user: UserInfo
}

// 口味偏好标签
export const PREFERENCE_TAGS = [
  { key: 'spicy', label: '偏辣' },
  { key: 'light', label: '清淡' },
  { key: 'vegetarian', label: '素食' },
  { key: 'sweet', label: '偏甜' },
  { key: 'sour', label: '偏酸' },
  { key: 'salty', label: '偏咸' },
  { key: 'low_salt', label: '少盐' },
  { key: 'low_oil', label: '少油' },
  { key: 'low_sugar', label: '低糖' },
] as const

export type PreferenceKey = typeof PREFERENCE_TAGS[number]['key']
