import { get, post, del } from './request'
import type { TodayMenu, AddDishParams, ConfirmMealParams } from '@/types/menu'

export const menuApi = {
  // 获取今日菜单
  getToday: () =>
    get<TodayMenu>('/v1/menus/today'),

  // 添加菜品到菜单
  addDish: (params: AddDishParams) =>
    post('/v1/menus/dishes', params),

  // 从菜单移除菜品
  removeDish: (menuItemId: number) =>
    del(`/v1/menus/dishes/${menuItemId}`),

  // 确认完成餐次
  confirm: (params: ConfirmMealParams) =>
    post('/v1/menus/confirm', params),

  // 取消确认餐次
  unconfirm: (params: ConfirmMealParams) =>
    post('/v1/menus/unconfirm', params),
}
