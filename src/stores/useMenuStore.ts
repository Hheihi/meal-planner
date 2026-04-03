import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { menuApi } from '@/api/menu'
import type { TodayMenu, MealType } from '@/types/menu'
import { getTodayStr } from '@/utils/format'

interface MenuState {
  todayMenu: TodayMenu | null
  loading: boolean

  // Actions
  fetchToday: () => Promise<void>
  addDish: (dishId: number, mealType: MealType) => Promise<void>
  removeDish: (menuItemId: number) => Promise<void>
  confirmMeal: (mealType: MealType) => Promise<void>
  unconfirmMeal: (mealType: MealType) => Promise<void>
}

export const useMenuStore = create<MenuState>((set, get) => ({
  todayMenu: null,
  loading: false,

  fetchToday: async () => {
    set({ loading: true })
    try {
      const data = await menuApi.getToday()
      set({ todayMenu: data })
    } finally {
      set({ loading: false })
    }
  },

  addDish: async (dishId: number, mealType: MealType) => {
    Taro.showLoading({ title: '添加中...' })
    try {
      await menuApi.addDish({
        dish_id: dishId,
        meal_type: mealType,
        date: getTodayStr(),
      })
      Taro.showToast({ title: '已加入菜单', icon: 'success' })
      // 刷新今日菜单
      await get().fetchToday()
    } catch {
      Taro.showToast({ title: '添加失败', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  },

  removeDish: async (menuItemId: number) => {
    Taro.showLoading({ title: '移除中...' })
    try {
      await menuApi.removeDish(menuItemId)
      Taro.showToast({ title: '已移除', icon: 'success' })
      // 刷新今日菜单
      await get().fetchToday()
    } catch {
      Taro.showToast({ title: '移除失败', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  },

  confirmMeal: async (mealType: MealType) => {
    Taro.showLoading({ title: '确认中...' })
    try {
      await menuApi.confirm({
        date: getTodayStr(),
        meal_type: mealType,
      })
      Taro.showToast({ title: '已确认完成', icon: 'success' })
      await get().fetchToday()
    } catch {
      Taro.showToast({ title: '确认失败', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  },

  unconfirmMeal: async (mealType: MealType) => {
    Taro.showLoading({ title: '取消中...' })
    try {
      await menuApi.unconfirm({
        date: getTodayStr(),
        meal_type: mealType,
      })
      Taro.showToast({ title: '已取消确认', icon: 'success' })
      await get().fetchToday()
    } catch {
      Taro.showToast({ title: '取消失败', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  },
}))
