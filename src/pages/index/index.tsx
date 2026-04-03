import { useState, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useDidShow, usePullDownRefresh as useTaroPullDownRefresh, stopPullDownRefresh } from '@tarojs/taro'
import { useRequest } from '@/hooks/useRequest'
import { Skeleton } from '@/components/Skeleton'
import { ErrorRetry } from '@/components/ErrorRetry'
import { DishCard } from '@/components/DishCard'
import { MealSelector } from '@/components/MealSelector'
import { useMenuStore } from '@/stores/useMenuStore'
import { menuApi } from '@/api/menu'
import { recommendationApi } from '@/api/recommendation'
import { navigateToSearch, navigateToDishDetail, switchToMenu } from '@/utils/navigation'
import type { TodayMenu } from '@/types/menu'
import type { MealType } from '@/types/common'
import styles from './index.module.less'

export default function IndexPage() {
  const [showMealSelector, setShowMealSelector] = useState(false)
  const [selectedDishId, setSelectedDishId] = useState<number>(0)
  const addDish = useMenuStore((s) => s.addDish)

  // 今日菜单数据
  const {
    data: todayMenu,
    loading: menuLoading,
    error: menuError,
    refresh: refreshMenu,
  } = useRequest(() => menuApi.getToday(), { manual: false })

  // 推荐数据
  const {
    data: recommendations,
    loading: recLoading,
    error: recError,
    refresh: refreshRec,
  } = useRequest(() => recommendationApi.getList(10), { manual: false })

  useDidShow(() => {
    refreshMenu()
    refreshRec()
  })

  useTaroPullDownRefresh(async () => {
    await Promise.all([refreshMenu(), refreshRec()])
    stopPullDownRefresh()
  })

  const handleSearchTap = useCallback(() => {
    navigateToSearch()
  }, [])

  const handleDishTap = useCallback((dishId: number) => {
    navigateToDishDetail(dishId)
  }, [])

  const handleAddToMenu = useCallback((dishId: number) => {
    setSelectedDishId(dishId)
    setShowMealSelector(true)
  }, [])

  const handleMealSelect = useCallback((mealType: MealType) => {
    if (selectedDishId) {
      addDish(selectedDishId, mealType)
    }
    setShowMealSelector(false)
  }, [selectedDishId, addDish])

  const handleRefreshRecommend = useCallback(() => {
    refreshRec()
  }, [refreshRec])

  const handleMenuCardTap = useCallback(() => {
    switchToMenu()
  }, [])

  const getAddedMeals = useCallback((dishId: number): MealType[] => {
    if (!todayMenu) return []
    const meals: MealType[] = []
    todayMenu.meals.breakfast.dishes.forEach(d => {
      if (d.dishId === dishId) meals.push(1)
    })
    todayMenu.meals.lunch.dishes.forEach(d => {
      if (d.dishId === dishId) meals.push(2)
    })
    todayMenu.meals.dinner.dishes.forEach(d => {
      if (d.dishId === dishId) meals.push(3)
    })
    return meals
  }, [todayMenu])

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollView} scrollY>
        {/* 搜索入口 */}
        <View className={styles.searchSection}>
          <View className={styles.searchBar} onClick={handleSearchTap}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Text className={styles.searchPlaceholder}>搜索菜品名称</Text>
          </View>
        </View>

        {/* 今日菜单概览 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>今日菜单</Text>
            <Text className={styles.sectionMore} onClick={handleMenuCardTap}>查看全部 &gt;</Text>
          </View>

          {menuLoading ? (
            <View className={styles.menuOverviewSkeleton}>
              <View className={styles.menuCardSkeleton} />
              <View className={styles.menuCardSkeleton} />
              <View className={styles.menuCardSkeleton} />
            </View>
          ) : menuError ? (
            <View className={styles.menuOverviewError} onClick={handleMenuCardTap}>
              <Text className={styles.errorText}>点击查看今日菜单</Text>
            </View>
          ) : (
            <View className={styles.menuOverview}>
              <MenuCard
                type="breakfast"
                title="早餐"
                data={todayMenu?.meals.breakfast}
                onTap={handleMenuCardTap}
              />
              <MenuCard
                type="lunch"
                title="午餐"
                data={todayMenu?.meals.lunch}
                onTap={handleMenuCardTap}
              />
              <MenuCard
                type="dinner"
                title="晚餐"
                data={todayMenu?.meals.dinner}
                onTap={handleMenuCardTap}
              />
            </View>
          )}
        </View>

        {/* 推荐区域 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>为你推荐</Text>
            <Text className={styles.refreshBtn} onClick={handleRefreshRecommend}>换一批</Text>
          </View>

          {recLoading ? (
            <View className={styles.recommendations}>
              <Skeleton type="card" />
              <Skeleton type="card" />
            </View>
          ) : recError ? (
            <ErrorRetry onRetry={refreshRec} />
          ) : (
            <View className={styles.recommendations}>
              {recommendations?.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  size="large"
                  showAddButton={true}
                  onTap={handleDishTap}
                  onAddToMenu={handleAddToMenu}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 餐次选择器 */}
      <MealSelector
        visible={showMealSelector}
        dishId={selectedDishId}
        addedMeals={getAddedMeals(selectedDishId)}
        onSelect={handleMealSelect}
        onClose={() => setShowMealSelector(false)}
      />
    </View>
  )
}

// 菜单卡片组件
interface MenuCardProps {
  type: 'breakfast' | 'lunch' | 'dinner'
  title: string
  data?: TodayMenu['meals']['breakfast']
  onTap: () => void
}

function MenuCard({ type, title, data, onTap }: MenuCardProps) {
  const icon = type === 'breakfast' ? '🌅' : type === 'lunch' ? '☀️' : '🌙'
  const dishCount = data?.dishes.length || 0
  const isConfirmed = data?.isConfirmed

  return (
    <View className={styles.menuCard} onClick={onTap}>
      <Text className={styles.menuCardIcon}>{icon}</Text>
      <Text className={styles.menuCardTitle}>{title}</Text>
      {isConfirmed ? (
        <Text className={styles.menuCardStatus}>✅ 已完成</Text>
      ) : dishCount > 0 ? (
        <Text className={styles.menuCardDish}>
          {dishCount === 1 ? data?.dishes[0]?.name : `${dishCount}道菜`}
        </Text>
      ) : (
        <Text className={styles.menuCardEmpty}>暂未安排</Text>
      )}
    </View>
  )
}
