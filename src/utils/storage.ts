import Taro from '@tarojs/taro'

const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'user_info'

// Token 管理
export const getToken = (): string | null => {
  try {
    return Taro.getStorageSync(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = (token: string): void => {
  Taro.setStorageSync(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  Taro.removeStorageSync(TOKEN_KEY)
}

// 用户信息管理
export const getUserInfo = <T>(): T | null => {
  try {
    return Taro.getStorageSync(USER_INFO_KEY)
  } catch {
    return null
  }
}

export const setUserInfo = <T>(userInfo: T): void => {
  Taro.setStorageSync(USER_INFO_KEY, userInfo)
}

export const removeUserInfo = (): void => {
  Taro.removeStorageSync(USER_INFO_KEY)
}

// 清除所有认证信息
export const clearAuth = (): void => {
  removeToken()
  removeUserInfo()
}
