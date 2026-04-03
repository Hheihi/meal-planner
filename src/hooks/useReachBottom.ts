import { useState, useCallback, useRef } from 'react'
import { useReachBottom as useTaroReachBottom } from '@tarojs/taro'

interface UseReachBottomReturn<T> {
  list: T[]
  loading: boolean
  hasMore: boolean
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

export function useReachBottom<T>(
  fetcher: (page: number) => Promise<{ list: T[]; total: number }>,
  pageSize = 20,
): UseReachBottomReturn<T> {
  const [list, setList] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(1)
  const totalRef = useRef(0)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const { list: newList, total } = await fetcher(pageRef.current)
      totalRef.current = total

      if (pageRef.current === 1) {
        setList(newList)
      } else {
        setList((prev) => [...prev, ...newList])
      }

      // 判断是否还有更多
      const loadedCount = pageRef.current === 1
        ? newList.length
        : list.length + newList.length
      setHasMore(loadedCount < total)

      pageRef.current += 1
    } finally {
      setLoading(false)
    }
  }, [fetcher, loading, hasMore, pageSize, list.length])

  const refresh = useCallback(async () => {
    pageRef.current = 1
    totalRef.current = 0
    setHasMore(true)
    await loadMore()
  }, [loadMore])

  // 监听触底
  useTaroReachBottom(() => {
    loadMore()
  })

  return { list, loading, hasMore, loadMore, refresh }
}
