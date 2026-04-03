import { useCallback, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { useRouter, useDidShow } from '@tarojs/taro'
import { useReachBottom } from '@/hooks/useReachBottom'
import { usePullDownRefresh } from '@/hooks/usePullDownRefresh'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorRetry } from '@/components/ErrorRetry'
import { DishCard } from '@/components/DishCard'
import { dishApi } from '@/api/dish'
import { navigateToDishDetail } from '@/utils/navigation'
import styles from './index.module.less'

export default function DishListPage() {
  const router = useRouter()
  const cuisineId = useMemo(() => Number(router.params.id), [router.params.id])
  const cuisineName = useMemo(() => router.params.name || '菜品列表', [router.params.name])

  const fetcher = useCallback((page: number) => {
    return dishApi.getListByCuisine(cuisineId, page, 20)
  }, [cuisineId])

  const { list, loading, hasMore, loadMore, refresh } = useReachBottom(fetcher, 20)

  useDidShow(() => {
    refresh()
  })

  usePullDownRefresh(async () => {
    await refresh()
  })

  const handleDishTap = useCallback((dishId: number) => {
    navigateToDishDetail(dishId)
  }, [])

  // 首屏加载
  if (loading && list.length === 0) {
    return (
      <View className={styles.container}>
        <Skeleton type="list" rows={5} />
      </View>
    )
  }

  if (list.length === 0) {
    return (
      <View className={styles.container}>
        <EmptyState text="暂无菜品，敬请期待" />
      </View>
    )
  }

  return (
    <View className={styles.container}>
      {list.map((dish) => (
        <DishCard
          key={dish.id}
          dish={dish}
          size="small"
          showAddButton={false}
          onTap={handleDishTap}
        />
      ))}

      {loading && hasMore && (
        <View className={styles.loadingMore}>
          <Text className={styles.loadingText}>加载中...</Text>
        </View>
      )}

      {!hasMore && list.length > 0 && (
        <View className={styles.noMore}>
          <Text className={styles.noMoreText}>没有更多了</Text>
        </View>
      )}
    </View>
  )
}
