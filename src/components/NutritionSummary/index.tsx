import { View, Text } from '@tarojs/components'
import type { Nutrition } from '@/types/common'
import styles from './index.module.less'

interface NutritionSummaryProps {
  total: Nutrition
  reference?: Nutrition
  showComparison?: boolean
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({
  total,
  reference,
  showComparison = false,
}) => {
  const getColorClass = (value: number, refValue?: number): string => {
    if (!showComparison || !refValue) return ''
    const ratio = value / refValue
    if (ratio >= 0.8 && ratio <= 1.2) {
      return styles.success
    }
    return styles.warning
  }

  return (
    <View className={styles.container}>
      <View className={styles.item}>
        <Text className={`${styles.value} ${getColorClass(total.calories, reference?.calories)}`}>
          {Math.round(total.calories)}
        </Text>
        <Text className={styles.label}>热量(kcal)</Text>
      </View>
      <View className={styles.divider} />
      <View className={styles.item}>
        <Text className={`${styles.value} ${getColorClass(total.protein, reference?.protein)}`}>
          {total.protein.toFixed(1)}g
        </Text>
        <Text className={styles.label}>蛋白质</Text>
      </View>
      <View className={styles.divider} />
      <View className={styles.item}>
        <Text className={`${styles.value} ${getColorClass(total.carbs, reference?.carbs)}`}>
          {total.carbs.toFixed(1)}g
        </Text>
        <Text className={styles.label}>碳水</Text>
      </View>
      <View className={styles.divider} />
      <View className={styles.item}>
        <Text className={`${styles.value} ${getColorClass(total.fat, reference?.fat)}`}>
          {total.fat.toFixed(1)}g
        </Text>
        <Text className={styles.label}>脂肪</Text>
      </View>
    </View>
  )
}
