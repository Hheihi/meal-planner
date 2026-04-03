import Taro from '@tarojs/taro'
import { API_BASE_URL, ERROR_CODE } from '@/utils/constants'
import { getToken, setToken } from '@/utils/storage'

// 业务错误
export class BusinessError extends Error {
  code: number
  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.name = 'BusinessError'
  }
}

// 网络错误
export class NetworkError extends Error {
  constructor(message = '网络异常') {
    super(message)
    this.name = 'NetworkError'
  }
}

// 等待续锁的请求队列
interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
  config: Taro.request.Option
}

let isRefreshing = false
const pendingQueue: PendingRequest[] = []

// 执行静默登录
const silentLogin = async (): Promise<string> => {
  const { code } = await Taro.login()
  const res = await Taro.request({
    url: `${API_BASE_URL}/v1/auth/login`,
    method: 'POST',
    data: { code },
  })

  if (res.statusCode !== 200 || (res.data as { code: number }).code !== ERROR_CODE.SUCCESS) {
    throw new Error('登录失败')
  }

  const { token } = (res.data as { data: { token: string } }).data
  setToken(token)
  return token
}

// 处理 Token 续签
const handleTokenRefresh = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingQueue.push({
        resolve: resolve as (value: unknown) => void,
        reject,
        config: {} as Taro.request.Option,
      })
    }) as Promise<string>
  }

  isRefreshing = true
  try {
    const newToken = await silentLogin()
    // 释放队列
    pendingQueue.forEach((req) => req.resolve(newToken))
    pendingQueue.length = 0
    return newToken
  } catch (err) {
    pendingQueue.forEach((req) => req.reject(err))
    pendingQueue.length = 0
    throw err
  } finally {
    isRefreshing = false
  }
}

// 基础请求函数
const baseRequest = async <T>(options: Taro.request.Option): Promise<T> => {
  const token = getToken()

  const config: Taro.request.Option = {
    ...options,
    url: `${API_BASE_URL}${options.url}`,
    header: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.header,
    },
  }

  try {
    const res = await Taro.request(config)

    // HTTP 错误处理
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw new NetworkError(`HTTP ${res.statusCode}`)
    }

    const { code, message, data } = res.data as { code: number; message: string; data: T }

    // Token 失效，自动续签
    if (code === ERROR_CODE.TOKEN_INVALID) {
      try {
        await handleTokenRefresh()
        // 重放原请求
        return await baseRequest(options)
      } catch {
        throw new BusinessError(ERROR_CODE.TOKEN_INVALID, '登录已过期，请重新进入')
      }
    }

    // 业务错误
    if (code !== ERROR_CODE.SUCCESS) {
      throw new BusinessError(code, message)
    }

    return data
  } catch (err) {
    if (err instanceof BusinessError) {
      throw err
    }
    if (err instanceof NetworkError) {
      throw err
    }
    throw new NetworkError()
  }
}

// 请求封装
export const request = <T>(options: Taro.request.Option): Promise<T> => {
  return baseRequest<T>(options).catch((err) => {
    // 统一错误提示
    if (err instanceof BusinessError && err.code !== ERROR_CODE.TOKEN_INVALID) {
      Taro.showToast({ title: err.message, icon: 'none' })
    } else if (err instanceof NetworkError) {
      Taro.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
    }
    throw err
  })
}

// GET 请求
export const get = <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  return request<T>({
    url,
    method: 'GET',
    data: params,
  })
}

// POST 请求
export const post = <T>(url: string, data?: Record<string, unknown>): Promise<T> => {
  return request<T>({
    url,
    method: 'POST',
    data,
  })
}

// PUT 请求
export const put = <T>(url: string, data?: Record<string, unknown>): Promise<T> => {
  return request<T>({
    url,
    method: 'PUT',
    data,
  })
}

// DELETE 请求
export const del = <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  return request<T>({
    url,
    method: 'DELETE',
    data: params,
  })
}
