import { useCallback } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { useRequest } from '@/hooks/useRequest'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorRetry } from '@/components/ErrorRetry'
import { cuisineApi } from '@/api/cuisine'
import { navigateToDishList } from '@/utils/navigation'
import styles from './index.module.less'

export default function CuisineListPage() {
  const { data: cuisines, loading, error, refresh } = useRequest(
    () => cuisineApi.getList(),
    { manual: false }
  )

  useDidShow(() => {
    refresh()
  })

  const handleCuisineTap = useCallback((id: number, name: string) => {
    navigateToDishList(id, name)
  }, [])

  if (loading) {
    return (
      <View className={styles.container}>
        <Skeleton type="list" rows={6} />
      </View>
    )
  }

  if (error) {
    return (
      <View className={styles.container}>
        <ErrorRetry onRetry={refresh} />
      </View>
    )
  }

  if (!cuisines || cuisines.length === 0) {
    return (
      <View className={styles.container}>
        <EmptyState text="暂无菜系数据" />
      </View>
    )
  }

  return (
    <View className={styles.container}>
      <View className={styles.grid}>
        {cuisines.map((cuisine) => (
          <View
            key={cuisine.id}
            className={styles.gridItem}
            onClick={() => handleCuisineTap(cuisine.id, cuisine.name)}
          >
            <Image className={styles.icon} src={cuisine.iconUrl} mode="aspectFit" />
            <Text className={styles.name}>{cuisine.name}</Text>
            <Text className={styles.count}>{cuisine.dishCount}道菜</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
