import { useState } from "react"
import { useUpdateURL } from "../../../update-URL/useUpdateURL"
import { useFetchPostsModeStore } from "../fetchMode.store"

export const useSearchMode = () => {
  const { action, params } = useUpdateURL()
  const [searchQuery, setSearchQuery] = useState(params.search || "")
  const {
    action: { setMode },
  } = useFetchPostsModeStore()

  /**
   * 검색 파라미터 업데이트
   * @param keyword 검색 파라미터
   */
  const updateSearchParams = (keyword: string) => {
    console.log("updateSearchParams", keyword)
    action.updateSearchParams(keyword)

    setMode({ mode: "search", q: keyword || "", skip: 0 })
  }

  return {
    param: params.search,
    update: updateSearchParams,
    change: setSearchQuery,
    value: searchQuery,
  }
}
