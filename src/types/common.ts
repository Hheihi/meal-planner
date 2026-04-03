// 通用类型定义

// 统一 API 响应结构
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 分页响应
export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  page_size: number
}

// 营养信息
export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

// 餐次枚举
export enum MealType {
  Breakfast = 1,
  Lunch = 2,
  Dinner = 3,
  Other = 4,
}

// 餐次名称映射
export const MEAL_TYPE_TEXT: Record<MealType, string> = {
  [MealType.Breakfast]: '早餐',
  [MealType.Lunch]: '午餐',
  [MealType.Dinner]: '晚餐',
  [MealType.Other]: '其他',
}

// 难度文本映射
export const DIFFICULTY_TEXT: Record<number, string> = {
  1: '简单',
  2: '中等',
  3: '困难',
}
