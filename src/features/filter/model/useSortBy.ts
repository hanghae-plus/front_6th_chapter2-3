import { usePostFilters } from "../../post/model/usePostFilters"

/**
 * 정렬 기준을 관리하는 hook
 * usePostFilters 훅을 사용해서 정렬 기준을 관리합니다.
 */
export const useSortBy = () => {
  const { sortBy, setSortBy } = usePostFilters()

  /**
   * 정렬 기준을 변경하는 함수
   * @param value - 새로운 정렬 기준 값
   */
  const handleSortByChange = (value: string) => {
    setSortBy(value)
  }

  return {
    sortBy,
    handleSortByChange,
  }
}
