import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { createURLParams } from "@shared/lib"

/**
 * 게시물 목록/관리 페이지에서 사용하는 URL 쿼리 파라미터를 읽고 업데이트하는 훅입니다.
 */
export const usePostQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const getNumber = useCallback(
    (key: string, fallback: number) => Number(searchParams.get(key)) || fallback,
    [searchParams],
  )
  const getString = useCallback((key: string, fallback = "") => searchParams.get(key) || fallback, [searchParams])

  const param = useMemo(
    () => ({
      skip: getNumber("skip", 0),
      limit: getNumber("limit", 10),
      sortBy: getString("sortBy"),
      sortOrder: getString("sortOrder", "asc") as "asc" | "desc",
      tag: getString("tag"),
      search: getString("search"),
    }),
    [getNumber, getString],
  )

  /**
   * 일부 파라미터만 패치합니다. undefined/null/빈문자열/"all" 를 넘기면 해당 키를 제거합니다.
   */
  const updateUrl = useCallback(
    (
      patch: Partial<{
        skip: number
        limit: number
        search: string
        sortBy: string
        sortOrder: "asc" | "desc"
        tag: string
      }>,
    ) => {
      // 현재 파라미터와 패치를 병합
      const merged = { ...param, ...patch }

      // null/undefined/"all"/"none"/"" 값을 제거하여 정리
      const normalized = Object.fromEntries(
        Object.entries(merged).filter(
          ([, value]) => value != null && value !== "" && value !== "all" && value !== "none",
        ),
      )

      // createURLParams로 URLSearchParams 문자열 생성 후 적용
      const urlString = createURLParams(normalized)
      setSearchParams(urlString)
    },
    [param, setSearchParams],
  )

  return {
    param,
    updateUrl,
  }
}

export type PostQueryParams = ReturnType<typeof usePostQueryParams>
