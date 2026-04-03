import { useState, useCallback } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useDidShow, usePullDownRefresh as useTaroPullDownRefresh, stopPullDownRefresh, showModal } from '@tarojs/taro'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorRetry } from '@/components/ErrorRetry'
import { NutritionSummary } from '@/components/NutritionSummary'
import { SafeAreaBottom } from '@/components/SafeAreaBottom'
import { useMenuStore } from '@/stores/useMenuStore'
import { navigateToDishDetail, navigateToSearch } from '@/utils/navigation'
import { formatDate, getTodayStr, getWeekdayText } from '@/utils/format'
import { MEAL_TYPE_TEXT, MealType } from '@/types/common'
import styles from './index.module.less'

export default function TodayMenuPage() {
  const todayMenu = useMenuStore((s) => s.todayMenu)
  const loading = useMenuStore((s) => s.loading)
  const fetchToday = useMenuStore((s) => s.fetchToday)
  const removeDish = useMenuStore((s) => s.removeDish)
  const confirmMeal = useMenuStore((s) => s.confirmMeal)
  const unconfirmMeal = useMenuStore((s) => s.unconfirmMeal)

  useDidShow(() => {
    fetchToday()
  })

  useTaroPullDownRefresh(async () => {
    await fetchToday()
    stopPullDownRefresh()
  })

  const handleRemoveDish = useCallback(async (menuItemId: number, dishName: string) => {
    const { confirm } = await showModal({
      title: '确认移除',
      content: `确定要从菜单中移除"${dishName}"吗？`,
    })
    if (confirm) {
      removeDish(menuItemId)
    }
  }, [removeDish])

  const handleConfirmMeal = useCallback(async (mealType: MealType) => {
    const mealKey = mealType === MealType.Breakfast ? 'breakfast' : mealType === MealType.Lunch ? 'lunch' : 'dinner'
    const dishes = todayMenu?.meals[mealKey].dishes || []

    if (dishes.length === 0) {
      return
    }

    const { confirm } = await showModal({
      title: '确认完成',
      content: `确定已完成${MEAL_TYPE_TEXT[mealType]}吗？确认后将生成饮食记录。`,
    })
    if (confirm) {
      confirmMeal(mealType)
    }
  }, [todayMenu, confirmMeal])

  const handleUnconfirmMeal = useCallback(async (mealType: MealType) => {
    const { confirm } = await showModal({
      title: '取消确认',
      content: `确定要取消${MEAL_TYPE_TEXT[mealType]}的完成状态吗？`,
    })
    if (confirm) {
      unconfirmMeal(mealType)
    }
  }, [unconfirmMeal])

  const handleDishTap = useCallback((dishId: number) => {
    navigateToDishDetail(dishId)
  }, [])

  const handleAddDish = useCallback(() => {
    navigateToSearch()
  }, [])

  if (loading && !todayMenu) {
    return (
      <View className={styles.page}>
        <Skeleton type="detail" />
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollView} scrollY>
        {/* 日期标题 */}
        <View className={styles.header}>
          <Text className={styles.date}>{formatDate(getTodayStr())}</Text>
          <Text className={styles.weekday}>{getWeekdayText(getTodayStr())}</Text>
        </View>

        {/* 全天营养汇总 */}
        {todayMenu && (
          <View className={styles.nutritionSection}>
            <Text className={styles.sectionTitle}>今日营养摄入</Text>
            <NutritionSummary total={todayMenu.nutritionTotal} />
          </View>
        )}

        {/* 三个餐次 */}
        <View className={styles.mealsSection}>
          {todayMenu && (
            <>
              <MealCard
                title="早餐"
                icon="🌅"
                mealType={MealType.Breakfast}
                data={todayMenu.meals.breakfast}
                onRemoveDish={handleRemoveDish}
                onDishTap={handleDishTap}
                onConfirm={handleConfirmMeal}
                onUnconfirm={handleUnconfirmMeal}
                onAddDish={handleAddDish}
              />
              <MealCard
                title="午餐"
                icon="☀️"
                mealType={MealType.Lunch}
                data={todayMenu.meals.lunch}
                onRemoveDish={handleRemoveDish}
                onDishTap={handleDishTap}
                onConfirm={handleConfirmMeal}
                onUnconfirm={handleUnconfirmMeal}
                onAddDish={handleAddDish}
              />
              <MealCard
                title="晚餐"
                icon="🌙"
                mealType={MealType.Dinner}
                data={todayMenu.meals.dinner}
                onRemoveDish={handleRemoveDish}
                onDishTap={handleDishTap}
                onConfirm={handleConfirmMeal}
                onUnconfirm={handleUnconfirmMeal}
                onAddDish={handleAddDish}
              />
            </>
          )}
        </View>

        <View className={styles.bottomPlaceholder} />
      </ScrollView>
    </View>
  )
}

interface MealCardProps {
  title: string
  icon: string
  mealType: MealType
  data: {
    dishes: Array<{
      id: number
      dishId: number
      name: string
      imageUrl: string
      nutrition: { calories: number }
    }>
    isConfirmed: boolean
    nutritionSubtotal: { calories: number }
  }
  onRemoveDish: (menuItemId: number, dishName: string) => void
  onDishTap: (dishId: number) => void
  onConfirm: (mealType: MealType) => void
  onUnconfirm: (mealType: MealType) => void
  onAddDish: () => void
}

function MealCard({
  title,
  icon,
  mealType,
  data,
  onRemoveDish,
  onDishTap,
  onConfirm,
  onUnconfirm,
  onAddDish,
}: MealCardProps) {
  const { dishes, isConfirmed, nutritionSubtotal } = data

  return (
    <View className={styles.mealCard}>
      <View className={styles.mealHeader}>
        <View className={styles.mealTitleRow}>
          <Text className={styles.mealIcon}>{icon}</Text>
          <Text className={styles.mealTitle}>{title}</Text>
          {isConfirmed && <Text className={styles.confirmedBadge}>已完成</Text>}
        </View>
        <Text className={styles.mealCalories}>{nutritionSubtotal.calories} kcal</Text>
      </View>

      {dishes.length === 0 ? (
        <View className={styles.emptyMeal}>
          <Text className={styles.emptyMealText}>暂无菜品</Text>
          {!isConfirmed && (
            <View className={styles.addBtn} onClick={onAddDish}>
              <Text className={styles.addBtnText}>+ 添加菜品</Text>
            </View>
          )}
        </View>
      ) : (
        <View className={styles.dishList}>
          {dishes.map((dish) => (
            <View key={dish.id} className={styles.dishItem}>
              <Image
                className={styles.dishImage}
                src={dish.imageUrl}
                mode="aspectFill"
                onClick={() => onDishTap(dish.dishId)}
              />
              <View className={styles.dishInfo} onClick={() => onDishTap(dish.dishId)}>
                <Text className={styles.dishName}>{dish.name}</Text>
                <Text className={styles.dishCalories}>{dish.nutrition.calories} kcal</Text>
              </View>
              {!isConfirmed && (
                <View
                  className={styles.removeBtn}
                  onClick={() => onRemoveDish(dish.id, dish.name)}
                >
                  <Text className={styles.removeBtnText}>✕</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {dishes.length > 0 && !isConfirmed && (
        <View className={styles.mealActions}>
          <View className={styles.addMoreBtn} onClick={onAddDish}>
            <Text className={styles.addMoreText}>+ 添加菜品</Text>
          </View>
          <View className={styles.confirmBtn} onClick={() => onConfirm(mealType)}>
            <Text className={styles.confirmText}>确认完成</Text>
          </View>
        </View>
      )}

      {isConfirmed && (
        <View className={styles.mealActions}>
          <View className={styles.unconfirmBtn} onClick={() => onUnconfirm(mealType)}>
            <Text className={styles.unconfirmText}>取消完成</Text>
          </View>
        </View>
      )}
    </View>
  )
}
