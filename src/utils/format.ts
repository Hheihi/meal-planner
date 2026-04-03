// 格式化工具函数

// 格式化热量
export const formatCalories = (calories: number): string => {
  return `${calories} kcal`
}

// 格式化营养值
export const formatNutrition = (value: number, unit: string): string => {
  return `${value}${unit}`
}

// 格式化烹饪时间
export const formatCookingTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours}小时`
  }
  return `${hours}小时${mins}分钟`
}

// 格式化日期
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 获取今天日期字符串
export const getTodayStr = (): string => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 获取星期几文本
export const getWeekdayText = (dateStr: string): string => {
  const date = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[date.getDay()]
}
