import { useAtom } from "jotai"
import { searchQueryAtom } from "../../../store/postsAtoms"
import { useSearchPosts } from "../api"

export const usePostSearch = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)

  // TanStack Query 훅 사용
  const searchQueryResult = useSearchPosts(searchQuery, {
    enabled: !!searchQuery.trim(),
    staleTime: 2 * 60 * 1000, // 검색 결과는 2분간 fresh 상태 유지
  })

  const posts = searchQueryResult.data?.posts || []
  const total = searchQueryResult.data?.total || 0
  const loading = searchQueryResult.isLoading
  const error = searchQueryResult.error

  const clearSearch = () => {
    setSearchQuery("")
  }

  return {
    searchQuery,
    setSearchQuery,
    posts,
    total,
    loading,
    error,
    // 쿼리 상태들
    isFetching: searchQueryResult.isFetching,
    isRefetching: searchQueryResult.isRefetching,
    clearSearch,
  }
}
