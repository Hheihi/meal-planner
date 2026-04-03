import { get, post } from './request'
import type { DishListItem } from '@/types/dish'

export const recommendationApi = {
  // 获取推荐列表
  getList: (count = 10) =>
    get<DishListItem[]>('/v1/recommendations', { count }),

  // 刷新推荐（排除已展示的菜品）
  refresh: (excludeIds: number[]) =>
    post<DishListItem[]>('/v1/recommendations/refresh', { exclude_ids: excludeIds }),
}
