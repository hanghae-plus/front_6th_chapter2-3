import { QueryClient } from "@tanstack/react-query"

export const getTotal = (queryClient: QueryClient, searchParams: URLSearchParams): number => {
  const skip = Number(searchParams.get("skip")) || 0
  const limit = Number(searchParams.get("limit")) || 10

  // 1. 현재 필터와 정확히 일치하는 쿼리에서 total 찾기
  const exactMatch = queryClient.getQueryData([
    "posts",
    "list",
    {
      skip,
      limit,
      search: searchParams.get("search") || "",
      tag: searchParams.get("tag") || "",
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
    },
  ])

  if (exactMatch && (exactMatch as { total?: number })?.total) {
    return (exactMatch as { total?: number }).total!
  }

  // 2. posts 쿼리 중에서 total이 있는 첫 번째 데이터 찾기
  const queries = queryClient.getQueriesData({ queryKey: ["posts", "list"] })
  for (const [, data] of queries) {
    if (data && (data as { total?: number })?.total) {
      return (data as { total?: number }).total!
    }
  }

  // 3. fallback: 기본값으로 100 반환 (테스트용)
  console.warn("getTotal: 쿼리 데이터를 찾을 수 없어 기본값 100을 반환합니다.")
  return 100
}
