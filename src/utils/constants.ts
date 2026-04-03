// 全局常量

// API 基础地址
export const API_BASE_URL = process.env.TARO_APP_API_URL || 'https://api.meal.example.com'

// 业务错误码
export const ERROR_CODE = {
  SUCCESS: 0,
  TOKEN_INVALID: 1002,
  NOT_FOUND: 2001,
  DUPLICATE: 2002,
  PARAM_ERROR: 2003,
  SERVER_ERROR: 5000,
} as const

// 默认分页大小
export const DEFAULT_PAGE_SIZE = 20

// 默认菜品图片
export const DEFAULT_DISH_IMAGE = 'https://placehold.co/400x300/FFF0E8/FF6B35?text=暂无图片'

// 默认头像
export const DEFAULT_AVATAR = 'https://placehold.co/100x100/EEEEEE/999999?text=用户'
