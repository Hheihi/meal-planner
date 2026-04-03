import { View, Text } from '@tarojs/components'
import styles from './index.module.less'
import type { Nutrition } from '@/types/common'

interface NutritionBarProps {
  nutrition: Nutrition
}

export const NutritionBar: React.FC<NutritionBarProps> = ({ nutrition }) => {
  const { calories, protein, carbs, fat } = nutrition

  return (
    <View className={styles.container}>
      <View className={styles.item}>
        <Text className={styles.value}>{calories}</Text>
        <Text className={styles.label}>kcal</Text>
      </View>
      <View className={styles.divider} />
      <View className={styles.item}>
        <Text className={styles.value}>{protein}g</Text>
        <Text className={styles.label}>蛋白质</Text>
      </View>
      <View className={styles.divider} />
      <View className={styles.item}>
        <Text className={styles.value}>{carbs}g</Text>
        <Text className={styles.label}>碳水</Text>
      </View>
      <View className={styles.divider} />
      <View className={styles.item}>
        <Text className={styles.value}>{fat}g</Text>
        <Text className={styles.label}>脂肪</Text>
      </View>
    </View>
  )
}
