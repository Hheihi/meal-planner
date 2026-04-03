import { useState, useCallback, useMemo } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { useRequest } from '@/hooks/useRequest'
import { Skeleton } from '@/components/Skeleton'
import { ErrorRetry } from '@/components/ErrorRetry'
import { NutritionSummary } from '@/components/NutritionSummary'
import { recordApi } from '@/api/record'
import { navigateToDishDetail } from '@/utils/navigation'
import { getWeekdayText } from '@/utils/format'
import { MEAL_TYPE_TEXT, RecordType } from '@/types/record'
import type { DailyDetail } from '@/types/record'
import styles from './index.module.less'

export default function RecordPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  // 获取月度标记
  const { data: calendarMarks, refresh: refreshCalendar } = useRequest(
    () => recordApi.getCalendar(year, month),
    { manual: false }
  )

  // 获取选中日期的详情
  const selectedDateStr = useMemo(() => {
    const d = selectedDate
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }, [selectedDate])

  const { data: dailyDetail, loading: detailLoading, error: detailError, refresh: refreshDetail } = useRequest(
    () => recordApi.getDaily(selectedDateStr),
    { manual: false }
  )

  useDidShow(() => {
    refreshCalendar()
    refreshDetail()
  })

  // 生成日历数据
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const startWeekday = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days: Array<{ date: number; isCurrentMonth: boolean; hasRecord?: boolean }> = []

    // 上月日期
    for (let i = 0; i < startWeekday; i++) {
      days.push({ date: 0, isCurrentMonth: false })
    }

    // 当月日期
    const datesWithRecords = new Set(calendarMarks?.datesWithRecords || [])
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        hasRecord: datesWithRecords.has(i),
      })
    }

    return days
  }, [year, month, calendarMarks])

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 2, 1))
  }, [year, month])

  const handleNextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month, 1))
  }, [year, month])

  const handleDateSelect = useCallback((date: number) => {
    if (date > 0) {
      const newDate = new Date(year, month - 1, date)
      // 不能选择未来日期
      if (newDate > new Date()) return
      setSelectedDate(newDate)
    }
  }, [year, month])

  const handleDishTap = useCallback((dishId?: number) => {
    if (dishId) {
      navigateToDishDetail(dishId)
    }
  }, [])

  const isToday = useCallback((date: number) => {
    const today = new Date()
    return date === today.getDate() &&
      month === today.getMonth() + 1 &&
      year === today.getFullYear()
  }, [year, month])

  const isSelected = useCallback((date: number) => {
    return date === selectedDate.getDate() &&
      month === selectedDate.getMonth() + 1 &&
      year === selectedDate.getFullYear()
  }, [selectedDate, year, month])

  const isFuture = useCallback((date: number) => {
    const checkDate = new Date(year, month - 1, date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return checkDate > today
  }, [year, month])

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollView} scrollY>
        {/* 月份切换 */}
        <View className={styles.monthHeader}>
          <Text className={styles.arrow} onClick={handlePrevMonth}>←</Text>
          <Text className={styles.monthText}>{year}年{month}月</Text>
          <Text className={styles.arrow} onClick={handleNextMonth}>→</Text>
        </View>

        {/* 星期标题 */}
        <View className={styles.weekHeader}>
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <Text key={day} className={styles.weekDay}>{day}</Text>
          ))}
        </View>

        {/* 日历网格 */}
        <View className={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <View
              key={index}
              className={`${styles.calendarCell} ${
                day.isCurrentMonth ? styles.currentMonth : styles.otherMonth
              } ${isToday(day.date) ? styles.today : ''} ${
                isSelected(day.date) ? styles.selected : ''
              } ${isFuture(day.date) ? styles.future : ''}`}
              onClick={() => handleDateSelect(day.date)}
            >
              <Text className={styles.dateText}>{day.date > 0 ? day.date : ''}</Text>
              {day.hasRecord && <View className={styles.recordDot} />}
            </View>
          ))}
        </View>

        {/* 日详情 */}
        <View className={styles.detailSection}>
          {detailLoading ? (
            <Skeleton type="list" rows={3} />
          ) : detailError ? (
            <ErrorRetry onRetry={refreshDetail} />
          ) : dailyDetail ? (
            <DailyDetailView detail={dailyDetail} onDishTap={handleDishTap} />
          ) : null}
        </View>

        <View className={styles.bottomPlaceholder} />
      </ScrollView>
    </View>
  )
}

interface DailyDetailViewProps {
  detail: DailyDetail
  onDishTap: (dishId?: number) => void
}

function DailyDetailView({ detail, onDishTap }: DailyDetailViewProps) {
  const date = new Date(detail.date)

  const meals = [
    { key: 'breakfast', title: '早餐', icon: '🌅' },
    { key: 'lunch', title: '午餐', icon: '☀️' },
    { key: 'dinner', title: '晚餐', icon: '🌙' },
    { key: 'other', title: '其他', icon: '📝' },
  ] as const

  return (
    <View>
      {/* 日期和星期 */}
      <View className={styles.detailHeader}>
        <Text className={styles.detailDate}>{date.getMonth() + 1}月{date.getDate()}日</Text>
        <Text className={styles.detailWeekday}>{getWeekdayText(detail.date)}</Text>
      </View>

      {/* 全天营养汇总 */}
      <View className={styles.detailNutrition}>
        <NutritionSummary total={detail.nutritionTotal} />
      </View>

      {/* 各餐次记录 */}
      {meals.map(({ key, title, icon }) => {
        const mealData = detail.meals[key]
        if (mealData.records.length === 0) return null

        return (
          <View key={key} className={styles.mealSection}>
            <View className={styles.mealHeader}>
              <Text className={styles.mealIcon}>{icon}</Text>
              <Text className={styles.mealTitle}>{title}</Text>
              <Text className={styles.mealCalories}>{mealData.nutritionSubtotal.calories} kcal</Text>
            </View>

            <View className={styles.records}>
              {mealData.records.map((record) => (
                <View key={record.id} className={styles.recordItem}>
                  {record.recordType === RecordType.Auto ? (
                    <View
                      className={styles.autoRecord}
                      onClick={() => onDishTap(record.dishId)}
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
  )
}
