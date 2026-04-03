import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { useMemo } from 'react'
import { useRequest } from '@/hooks/useRequest'
import { Skeleton } from '@/components/Skeleton'
import { ErrorRetry } from '@/components/ErrorRetry'
import { NutritionSummary } from '@/components/NutritionSummary'
import { EmptyState } from '@/components/EmptyState'
import { familyApi } from '@/api/family'
import { DEFAULT_AVATAR } from '@/utils/constants'
import styles from './index.module.less'

export default function MemberMenuPage() {
  const router = useRouter()
  const memberId = useMemo(() => Number(router.params.memberId), [router.params.memberId])

  const { data, loading, error, refresh } = useRequest(
    () => familyApi.getMemberMenu(memberId),
    { manual: false }
  )

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

  if (!data) {
    return (
      <View className={styles.page}>
        <EmptyState text="暂无数据" />
      </View>
    )
  }

  const { member, todayMenu } = data
  const meals = [
    { key: 'breakfast', title: '早餐', icon: '🌅' },
    { key: 'lunch', title: '午餐', icon: '☀️' },
    { key: 'dinner', title: '晚餐', icon: '🌙' },
  ] as const

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollView} scrollY>
        {/* 成员信息 */}
        <View className={styles.memberHeader}>
          <Image className={styles.memberAvatar} src={member.avatarUrl || DEFAULT_AVATAR} mode="aspectFill" />
          <Text className={styles.memberName}>{member.nickname}</Text>
          <Text className={styles.memberLabel}>的今日菜单</Text>
        </View>

        {todayMenu ? (
          <>
            {/* 全天营养汇总 */}
            <View className={styles.nutritionSection}>
              <Text className={styles.sectionTitle}>今日营养摄入</Text>
              <NutritionSummary total={todayMenu.nutritionTotal} />
            </View>

            {/* 各餐次 */}
            <View className={styles.mealsSection}>
              {meals.map(({ key, title, icon }) => {
                const mealData = todayMenu.meals[key]
                if (mealData.dishes.length === 0) return null

                return (
                  <View key={key} className={styles.mealCard}>
                    <View className={styles.mealHeader}>
                      <Text className={styles.mealIcon}>{icon}</Text>
                      <Text className={styles.mealTitle}>{title}</Text>
                      <Text className={styles.mealCalories}>
                        {mealData.nutritionSubtotal.calories} kcal
                      </Text>
                    </View>

                    <View className={styles.dishList}>
                      {mealData.dishes.map((dish) => (
                        <View key={dish.id} className={styles.dishItem}>
                          <Image
                            className={styles.dishImage}
                            src={dish.imageUrl}
                            mode="aspectFill"
                          />
                          <View className={styles.dishInfo}>
                            <Text className={styles.dishName}>{dish.name}</Text>
                            <Text className={styles.dishCalories}>
                              {dish.nutrition.calories} kcal
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>

                    {mealData.isConfirmed && (
                      <View className={styles.confirmedBadge}>
                        <Text className={styles.confirmedText}>已完成</Text>
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          </>
        ) : (
          <EmptyState text="今日暂无菜单安排" />
        )}

        <View className={styles.bottomPlaceholder} />
      </ScrollView>
    </View>
  )
}
