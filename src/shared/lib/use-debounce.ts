import { useCallback, useEffect, useRef } from "react"

/**
 * 디바운스된 콜백 Hook
 * 함수 호출을 지정된 시간만큼 지연시킵니다
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(callback: T, delay: number): T {
  const timeoutRef = useRef<number | null>(null)

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay],
  )

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback as T
}
