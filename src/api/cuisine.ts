import { get } from './request'
import type { Cuisine } from '@/types/dish'

export const cuisineApi = {
  // 获取菜系列表
  getList: () =>
    get<Cuisine[]>('/v1/cuisines'),
}
