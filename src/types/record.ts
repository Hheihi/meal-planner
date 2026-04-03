import type { Nutrition } from './common'
import type { MealType } from './common'

// 记录类型
export enum RecordType {
  Auto = 1,    // 自动记录（从菜单确认）
  Manual = 2,  // 手动记录
}

// 饮食记录
export interface DietRecord {
  id: number
  recordType: RecordType
  dishId?: number
  dishName?: string
  dishImageUrl?: string
  manualText?: string
  nutrition?: Nutrition
}

// 单餐记录
export interface MealRecords {
  records: DietRecord[]
  nutritionSubtotal: Nutrition
}

// 日详情
export interface DailyDetail {
  date: string
  meals: {
    breakfast: MealRecords
    lunch: MealRecords
    dinner: MealRecords
    other: MealRecords
  }
  nutritionTotal: Nutrition
}

// 月度标记
export interface CalendarMarks {
  year: number
  month: number
  datesWithRecords: number[]
}

// 手动添加记录参数
export interface AddManualRecordParams {
  date: string
  meal_type: MealType
  content: string
}
