import type { Nutrition } from './common'

// 菜系
export interface Cuisine {
  id: number
  name: string
  iconUrl: string
  dishCount: number
}

// 食材
export interface Ingredient {
  name: string
  amount: string
}

// 烹饪步骤
export interface CookingStep {
  order: number
  text: string
  imageUrl?: string
}

// 菜品列表项
export interface DishListItem {
  id: number
  name: string
  imageUrl: string
  cuisineName: string
  cookingTime: number
  difficulty: 1 | 2 | 3
  calories: number
}

// 菜品完整信息
export interface Dish {
  id: number
  name: string
  cuisineId: number
  cuisineName: string
  imageUrl: string
  cookingTime: number
  difficulty: 1 | 2 | 3
  nutrition: Nutrition
  ingredients: Ingredient[]
  steps: CookingStep[]
  tags: string[]
}
