import { useState, useCallback, useMemo } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useRouter, previewImage } from '@tarojs/taro'
import { useRequest } from '@/hooks/useRequest'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorRetry } from '@/components/ErrorRetry'
import { NutritionBar } from '@/components/NutritionBar'
import { SafeAreaBottom } from '@/components/SafeAreaBottom'
import { MealSelector } from '@/components/MealSelector'
import { dishApi } from '@/api/dish'
import { useMenuStore } from '@/stores/useMenuStore'
import { DIFFICULTY_TEXT, MealType } from '@/types/common'
import { formatCookingTime } from '@/utils/format'
import { DEFAULT_DISH_IMAGE } from '@/utils/constants'
import styles from './index.module.less'

export default function DishDetailPage() {
  const router = useRouter()
  const dishId = useMemo(() => Number(router.params.id), [router.params.id])
  const [imgSrc, setImgSrc] = useState('')
  const [showMealSelector, setShowMealSelector] = useState(false)
  const [addedMeals, setAddedMeals] = useState<MealType[]>([])

  const addDish = useMenuStore((s) => s.addDish)

  const { data: dish, loading, error, refresh } = useRequest(
    () => dishApi.getDetail(dishId),
    { manual: false }
  )

  const handleImageError = useCallback(() => {
    setImgSrc(DEFAULT_DISH_IMAGE)
  }, [])

  const handleImageTap = useCallback(() => {
    if (dish?.imageUrl) {
      previewImage({
        urls: [dish.imageUrl],
        current: dish.imageUrl,
      })
    }
  }, [dish?.imageUrl])

  const handleStepImageTap = useCallback((url: string) => {
    previewImage({
      urls: [url],
      current: url,
    })
  }, [])

  const handleAddToMeal = useCallback((mealType: MealType) => {
    if (dish) {
      addDish(dish.id, mealType)
      setAddedMeals((prev) => [...prev, mealType])
      setShowMealSelector(false)
    }
  }, [dish, addDish])

  const handleShowSelector = useCallback(() => {
    setShowMealSelector(true)
  }, [])

  if (loading) {
    return (
      <View className={styles.page}>
        <Skeleton type="detail" />
      </View>
    )
  }

  if (error) {
    return (
      <View className={styles.page}>
        <ErrorRetry onRetry={refresh} />
      </View>
    )
  }

  if (!dish) {
    return (
      <View className={styles.page}>
        <EmptyState text="菜品不存在" />
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollView} scrollY>
        {/* 菜品大图 */}
        <Image
          className={styles.image}
          src={imgSrc || dish.imageUrl}
          mode="aspectFill"
          onClick={handleImageTap}
          onError={handleImageError}
        />

        <View className={styles.content}>
          {/* 基本信息 */}
          <View className={styles.header}>
            <Text className={styles.name}>{dish.name}</Text>
            <View className={styles.tags}>
              <Text className={styles.tag}>{dish.cuisineName}</Text>
              <Text className={styles.tag}>{formatCookingTime(dish.cookingTime)}</Text>
              <Text className={styles.tag}>{DIFFICULTY_TEXT[dish.difficulty]}</Text>
            </View>
          </View>

          {/* 营养信息 */}
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>营养信息（每份）</Text>
            <NutritionBar nutrition={dish.nutrition} />
            <Text className={styles.hint}>营养信息仅供参考</Text>
          </View>

          {/* 食材清单 */}
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>食材清单</Text>
            <View className={styles.ingredients}>
              {dish.ingredients.map((ingredient, index) => (
                <View key={index} className={styles.ingredient}>
                  <Text className={styles.ingredientName}>{ingredient.name}</Text>
                  <Text className={styles.ingredientAmount}>{ingredient.amount}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 制作步骤 */}
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>制作步骤</Text>
            <View className={styles.steps}>
              {dish.steps.map((step) => (
                <View key={step.order} className={styles.step}>
                  <View className={styles.stepNumber}>
                    <Text className={styles.stepNumberText}>{step.order}</Text>
                  </View>
                  <View className={styles.stepContent}>
                    <Text className={styles.stepText}>{step.text}</Text>
                    {step.imageUrl && (
                      <Image
                        className={styles.stepImage}
                        src={step.imageUrl}
                        mode="aspectFill"
                        onClick={() => handleStepImageTap(step.imageUrl!)}
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 底部占位 */}
          <View className={styles.bottomPlaceholder} />
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <SafeAreaBottom className={styles.bottomBar}>
        <View className={styles.mealButtons}>
          <View
            className={`${styles.mealBtn} ${addedMeals.includes(MealType.Breakfast) ? styles.mealBtnDisabled : ''}`}
            onClick={addedMeals.includes(MealType.Breakfast) ? undefined : () => handleAddToMeal(MealType.Breakfast)}
          >
            <Text className={styles.mealBtnText}>
              {addedMeals.includes(MealType.Breakfast) ? '已加早餐' : '加入早餐'}
            </Text>
          </View>
          <View
            className={`${styles.mealBtn} ${addedMeals.includes(MealType.Lunch) ? styles.mealBtnDisabled : ''}`}
            onClick={addedMeals.includes(MealType.Lunch) ? undefined : () => handleAddToMeal(MealType.Lunch)}
          >
            <Text className={styles.mealBtnText}>
              {addedMeals.includes(MealType.Lunch) ? '已加午餐' : '加入午餐'}
            </Text>
          </View>
          <View
            className={`${styles.mealBtn} ${addedMeals.includes(MealType.Dinner) ? styles.mealBtnDisabled : ''}`}
            onClick={addedMeals.includes(MealType.Dinner) ? undefined : () => handleAddToMeal(MealType.Dinner)}
          >
            <Text className={styles.mealBtnText}>
              {addedMeals.includes(MealType.Dinner) ? '已加晚餐' : '加入晚餐'}
            </Text>
          </View>
        </View>
      </SafeAreaBottom>

      {/* 餐次选择器 */}
      <MealSelector
        visible={showMealSelector}
        dishId={dish.id}
        addedMeals={addedMeals}
        onSelect={handleAddToMeal}
        onClose={() => setShowMealSelector(false)}
      />
    </View>
  )
}
