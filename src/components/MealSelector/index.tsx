import { useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import { MEAL_TYPE_TEXT, MealType } from '@/types/common'
import styles from './index.module.less'

interface MealSelectorProps {
  visible: boolean
  dishId: number
  addedMeals?: MealType[]
  onSelect: (mealType: MealType) => void
  onClose: () => void
}

const MEAL_OPTIONS = [
  { type: MealType.Breakfast, key: 'breakfast' },
  { type: MealType.Lunch, key: 'lunch' },
  { type: MealType.Dinner, key: 'dinner' },
] as const

export const MealSelector: React.FC<MealSelectorProps> = ({
  visible,
  dishId,
  addedMeals = [],
  onSelect,
  onClose,
}) => {
  const handleSelect = useCallback((mealType: MealType) => {
    if (!addedMeals.includes(mealType)) {
      onSelect(mealType)
    }
  }, [addedMeals, onSelect])

  const handleMaskClick = useCallback(() => {
    onClose()
  }, [onClose])

  if (!visible) return null

  return (
    <View className={styles.container}>
      <View className={styles.mask} onClick={handleMaskClick} />
      <View className={styles.content}>
        <Text className={styles.title}>加入哪一餐</Text>
        <View className={styles.options}>
          {MEAL_OPTIONS.map(({ type, key }) => {
            const isAdded = addedMeals.includes(type)
            return (
              <View
                key={key}
                className={`${styles.option} ${isAdded ? styles.optionDisabled : ''}`}
                onClick={() => handleSelect(type)}
              >
                <Text className={`${styles.optionText} ${isAdded ? styles.optionTextDisabled : ''}`}>
                  {MEAL_TYPE_TEXT[type]}
                  {isAdded ? ' (已添加)' : ''}
                </Text>
              </View>
            )
          })}
        </View>
        <View className={styles.cancelBtn} onClick={handleMaskClick}>
          <Text className={styles.cancelText}>取消</Text>
        </View>
      </View>
    </View>
  )
}
