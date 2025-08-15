import { usePostFilters } from "../../post/model/usePostFilters"
import { atom } from "jotai"

// 외부에서 정렬 순서를 설정하는 atom (기존 코드와의 호환성을 위해 유지)
export const externalSortOrderAtom = atom<string>("asc")

// 외부 setSortOrder 함수를 주입받는 atom (기존 코드와의 호환성을 위해 유지)
export const setSortOrderAtom = atom<((value: string) => void) | null>(null)

// 정렬 순서 변경 hooks
export const useSortOrder = () => {
  const { sortOrder, setSortOrder } = usePostFilters()

  const changeSortOrder = (value: string) => {
    setSortOrder(value)
  }

  return {
    sortOrder,
    changeSortOrder,
  }
}
