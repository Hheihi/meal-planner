import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { useMemo } from 'react'
import { useRequest } from '@/hooks/useRequest'
import { Skeleton } from '@/components/Skeleton'
import { ErrorRetry } from '@/components/ErrorRetry'
import { NutritionSummary } from '@/components/NutritionSummary'
import { recordApi } from '@/api/record'
import { navigateToDishDetail } from '@/utils/navigation'
import { getWeekdayText } from '@/utils/format'
import { MEAL_TYPE_TEXT, RecordType } from '@/types/record'
import styles from './index.module.less'

export default function RecordDetailPage() {
  const router = useRouter()
  const date = useMemo(() => router.params.date || '', [router.params.date])

  const { data: dailyDetail, loading, error, refresh } = useRequest(
    () => recordApi.getDaily(date),
    { manual: false }
  )

  const handleDishTap = (dishId?: number) => {
    if (dishId) {
      navigateToDishDetail(dishId)
    }
  }

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

  if (!dailyDetail) {
    return (
      <View className={styles.page}>
        <Text className={styles.emptyText}>暂无数据</Text>
      </View>
    )
  }

  const d = new Date(dailyDetail.date)
  const meals = [
    { key: 'breakfast', title: '早餐', icon: '🌅' },
    { key: 'lunch', title: '午餐', icon: '☀️' },
    { key: 'dinner', title: '晚餐', icon: '🌙' },
    { key: 'other', title: '其他', icon: '📝' },
  ] as const

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollView} scrollY>
        {/* 日期和星期 */}
        <View className={styles.header}>
          <Text className={styles.date}>{d.getMonth() + 1}月{d.getDate()}日</Text>
          <Text className={styles.weekday}>{getWeekdayText(dailyDetail.date)}</Text>
        </View>

        {/* 全天营养汇总 */}
        <View className={styles.nutritionSection}>
          <Text className={styles.sectionTitle}>营养摄入</Text>
          <NutritionSummary total={dailyDetail.nutritionTotal} />
        </View>

        {/* 各餐次记录 */}
        <View className={styles.mealsSection}>
          {meals.map(({ key, title, icon }) => {
            const mealData = dailyDetail.meals[key]
            if (mealData.records.length === 0) return null

            return (
              <View key={key} className={styles.mealCard}>
                <View className={styles.mealHeader}>
                  <Text className={styles.mealIcon}>{icon}</Text>
                  <Text className={styles.mealTitle}>{title}</Text>
                  <Text className={styles.mealCalories}>
                    {mealData.nutritionSubtotal.calories} kcal
                  </Text>
                </View>

                <View className={styles.records}>
                  {mealData.records.map((record) => (
                    <View key={record.id} className={styles.recordItem}>
                      {record.recordType === RecordType.Auto ? (
                        <View
                          className={styles.autoRecord}
                          onClick={() => handleDishTap(record.dishId)}
                        >
                          {record.dishImageUrl && (
                            <Image
                              className={styles.recordImage}
                              src={record.dishImageUrl}
                              mode="aspectFill"
                            />
                          )}
                          <View className={styles.recordInfo}>
                            <Text className={styles.recordName}>{record.dishName}</Text>
                            <Text className={styles.recordCalories}>
                              {record.nutrition?.calories || 0} kcal
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View className={styles.manualRecord}>
                          <Text className={styles.manualText}>{record.manualText}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )
          })}
        </View>

        <View className={styles.bottomPlaceholder} />
      </ScrollView>
    </View>
  )
}
