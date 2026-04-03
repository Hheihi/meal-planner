import type { Nutrition } from './common'
import type { MealType } from './common'

// 菜单中的菜品
export interface MealDish {
  id: number
  dishId: number
  name: string
  imageUrl: string
  nutrition: Nutrition
}

// 单餐数据
export interface MealData {
  dishes: MealDish[]
  isConfirmed: boolean
  nutritionSubtotal: Nutrition
}

// 今日菜单
export interface TodayMenu {
  date: string
  meals: {
    breakfast: MealData
    lunch: MealData
    dinner: MealData
  }
  nutritionTotal: Nutrition
}

// 添加菜品参数
export interface AddDishParams {
  dish_id: number
  meal_type: MealType
  date: string
}

// 确认餐次参数
export interface ConfirmMealParams {
  date: string
  meal_type: MealType
}
