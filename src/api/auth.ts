import { post } from './request'
import type { LoginResponse } from '@/types/user'

export const authApi = {
  // 微信登录
  login: (code: string) =>
    post<LoginResponse>('/v1/auth/login', { code }),
}
