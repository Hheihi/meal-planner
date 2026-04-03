import { useState, useCallback } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { useReachBottom } from '@/hooks/useReachBottom'
import { useDebounce } from '@/hooks/useDebounce'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorRetry } from '@/components/ErrorRetry'
import { DishCard } from '@/components/DishCard'
import { dishApi } from '@/api/dish'
import { navigateToDishDetail } from '@/utils/navigation'
import styles from './index.module.less'

export default function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebounce(keyword, 300)

  const fetcher = useCallback((page: number) => {
    if (!debouncedKeyword) {
      return Promise.resolve({ list: [], total: 0, page, page_size: 20 })
    }
    return dishApi.search(debouncedKeyword, page, 20)
  }, [debouncedKeyword])

  const { list, loading, hasMore, loadMore, refresh } = useReachBottom(fetcher, 20)

  const handleInput = useCallback((e: { detail: { value: string } }) => {
    setKeyword(e.detail.value)
  }, [])

  const handleDishTap = useCallback((dishId: number) => {
    navigateToDishDetail(dishId)
  }, [])

  // 空关键词状态
  if (!debouncedKeyword) {
    return (
      <View className={styles.page}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="输入菜品名称搜索"
            value={keyword}
            onInput={handleInput}
            focus
          />
        </View>
        <View className={styles.emptyState}>
          <Text className={styles.emptyText}>输入菜品名称搜索</Text>
        </View>
      </View>
    )
  }

  // 首次加载中
  if (loading && list.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="输入菜品名称搜索"
            value={keyword}
            onInput={handleInput}
          />
        </View>
        <Skeleton type="list" rows={5} />
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.searchBar}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          className={styles.searchInput}
          placeholder="输入菜品名称搜索"
          value={keyword}
          onInput={handleInput}
        />
      </View>

      {list.length === 0 ? (
        <EmptyState
          text="未找到相关菜品，换个关键词试试"
          actionText="清除搜索"
          onAction={() => setKeyword('')}
        />
      ) : (
        <View className={styles.results}>
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

          {!hasMore && (
            <View className={styles.noMore}>
              <Text className={styles.noMoreText}>没有更多了</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
