import { useCallback, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export const useSearchQuery = <T extends { [K in keyof T]: unknown }>(initParams: T) => {
  const { search } = useLocation()
  /** 검색 조건 초기 설정 */
  const [searchCondition, setSearchCondition] = useState<T>(() => ({
    ...initParams,
    ...Object.fromEntries(new URLSearchParams(search)),
  }))

  /** 검색 URL 업데이트 */
  const updateUrl = useCallback((params: T) => {
    // searchCondition의 값이 없는 경우 제외
    const filteredParams = Object.fromEntries(
      Object.entries(params)
        .filter(
          ([, value]) => value !== "" && value !== null && value !== undefined && value !== "all" && value !== "none",
        )
        .map(([key, value]) => [key, String(value)]),
    )

    const url = new URL(window.location.href)
    url.search = new URLSearchParams(filteredParams).toString()
    window.history.pushState(null, "", url)
  }, [])

  /** 검색할 때마다 업데이트 */
  useEffect(() => {
    updateUrl(searchCondition)
  }, [searchCondition, updateUrl])

  return { searchCondition, setSearchCondition }
}
