import { usePullDownRefresh as useTaroPullDownRefresh, stopPullDownRefresh } from '@tarojs/taro'
import { useCallback } from 'react'

export function usePullDownRefresh(onRefresh: () => Promise<void>): void {
  const handleRefresh = useCallback(async () => {
    try {
      await onRefresh()
    } finally {
      stopPullDownRefresh()
    }
  }, [onRefresh])

  useTaroPullDownRefresh(handleRefresh)
}
