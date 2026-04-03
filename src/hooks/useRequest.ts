import { useState, useCallback, useRef, useEffect } from 'react'

interface UseRequestOptions<T> {
  manual?: boolean
  onSuccess?: (data: T) => void
  onError?: (err: Error) => void
}

interface UseRequestReturn<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
  run: () => Promise<void>
  refresh: () => Promise<void>
}

export function useRequest<T>(
  fetcher: (() => Promise<T>) | null,
  options: UseRequestOptions<T> = {},
): UseRequestReturn<T> {
  const { manual = false, onSuccess, onError } = options
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const fetcherRef = useRef(fetcher)
  const mountedRef = useRef(true)

  // 更新 fetcherRef
  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  // 组件卸载标记
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const execute = useCallback(async () => {
    if (!fetcherRef.current) return

    setLoading(true)
    setError(undefined)

    try {
      const result = await fetcherRef.current()
      if (mountedRef.current) {
        setData(result)
        onSuccess?.(result)
      }
    } catch (err) {
      if (mountedRef.current) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [onSuccess, onError])

  const run = useCallback(async () => {
    await execute()
  }, [execute])

  const refresh = useCallback(async () => {
    await execute()
  }, [execute])

  // 自动执行
  useEffect(() => {
    if (!manual && fetcher) {
      execute()
    }
  }, [manual, fetcher, execute])

  return { data, loading, error, run, refresh }
}
