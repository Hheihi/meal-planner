import { useState, useCallback } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { DEFAULT_DISH_IMAGE } from '@/utils/constants'
import { formatCookingTime, formatCalories } from '@/utils/format'
import { DIFFICULTY_TEXT } from '@/types/common'
import type { DishListItem } from '@/types/dish'
import styles from './index.module.less'

interface DishCardProps {
  dish: DishListItem
  size?: 'large' | 'small'
  showAddButton?: boolean
  onTap?: (dishId: number) => void
  onAddToMenu?: (dishId: number) => void
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  size = 'large',
  showAddButton = true,
  onTap,
  onAddToMenu,
}) => {
  const [imgSrc, setImgSrc] = useState(dish.imageUrl)

  const handleTap = useCallback(() => {
    onTap?.(dish.id)
  }, [dish.id, onTap])

  const handleAdd = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    onAddToMenu?.(dish.id)
  }, [dish.id, onAddToMenu])

  const handleImageError = useCallback(() => {
    setImgSrc(DEFAULT_DISH_IMAGE)
  }, [])

  if (size === 'small') {
    return (
      <View className={styles.smallCard} onClick={handleTap}>
        <Image
          className={styles.smallImage}
          src={imgSrc}
          mode="aspectFill"
          lazyLoad
          onError={handleImageError}
        />
        <View className={styles.smallContent}>
          <Text className={styles.smallName}>{dish.name}</Text>
          <Text className={styles.smallInfo}>
            {dish.cuisineName} · {formatCookingTime(dish.cookingTime)} · {DIFFICULTY_TEXT[dish.difficulty]}
          </Text>
          <Text className={styles.smallCalories}>{formatCalories(dish.calories)}</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.card} onClick={handleTap}>
      <Image
        className={styles.image}
        src={imgSrc}
        mode="aspectFill"
        lazyLoad
        onError={handleImageError}
      />
      <View className={styles.content}>
        <Text className={styles.name}>{dish.name}</Text>
        <View className={styles.tags}>
          <Text className={styles.tag}>{dish.cuisineName}</Text>
          <Text className={styles.tag}>{formatCookingTime(dish.cookingTime)}</Text>
          <Text className={styles.tag}>{DIFFICULTY_TEXT[dish.difficulty]}</Text>
        </View>
        <View className={styles.footer}>
          <Text className={styles.calories}>{formatCalories(dish.calories)}</Text>
          {showAddButton && (
            <View className={styles.addBtn} onClick={handleAdd}>
              <Text className={styles.addText}>+</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
