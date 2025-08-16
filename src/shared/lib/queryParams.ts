export interface BaseQueryParams {
  limit?: number
  skip?: number
  search?: string
  tag?: string
  sortBy?: "id" | "title" | "reactions" | "none"
  sortOrder?: "asc" | "desc"
}

export const QUERY_PARAM_KEYS = {
  LIMIT: "limit",
  SKIP: "skip",
  SEARCH: "search",
  TAG: "tag",
  SORT_BY: "sortBy",
  SORT_ORDER: "sortOrder",
  SEARCH_QUERY: "q", // API용 검색 파라미터
} as const

export const buildApiQueryParams = (filters: BaseQueryParams = {}): string => {
  const params = new URLSearchParams()

  if (filters.limit) params.set(QUERY_PARAM_KEYS.LIMIT, filters.limit.toString())
  if (filters.skip) params.set(QUERY_PARAM_KEYS.SKIP, filters.skip.toString())
  if (filters.search) params.set(QUERY_PARAM_KEYS.SEARCH_QUERY, filters.search) // API는 'q' 사용
  if (filters.tag && filters.tag !== "all") params.set(QUERY_PARAM_KEYS.TAG, filters.tag)
  if (filters.sortBy && filters.sortBy !== "none") {
    params.set(QUERY_PARAM_KEYS.SORT_BY, filters.sortBy)
    if (filters.sortOrder) params.set(QUERY_PARAM_KEYS.SORT_ORDER, filters.sortOrder)
  }

  return params.toString()
}
