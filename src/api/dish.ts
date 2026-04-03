import { get } from './request'
import type { Dish, DishListItem } from '@/types/dish'
import type { PaginatedData } from '@/types/common'

export const dishApi = {
  // 获取菜品详情
  getDetail: (dishId: number) =>
    get<Dish>(`/v1/dishes/${dishId}`),

  // 获取菜系下的菜品列表
  getListByCuisine: (cuisineId: number, page: number, pageSize = 20) =>
    get<PaginatedData<DishListItem>>(`/v1/cuisines/${cuisineId}/dishes`, {
      page,
      page_size: pageSize,
    }),

  // 搜索菜品
  search: (keyword: string, page: number, pageSize = 20) =>
    get<PaginatedData<DishListItem>>('/v1/dishes/search', {
      keyword,
      page,
      page_size: pageSize,
    }),
}
