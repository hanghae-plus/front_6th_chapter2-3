import { useEffect, useState } from "react"
import { useUpdateURL } from "../../../update-URL/useUpdateURL"
import { useFetchPostsModeStore } from "../fetchMode.store"

export const useSearchMode = () => {
  const { action, params } = useUpdateURL()
  const [searchQuery, setSearchQuery] = useState(params.search || "")
  const { setMode, mode } = useFetchPostsModeStore()
  console.log("모드!", mode)
  const updateSearchParams = (keyword: string) => {
    action.updateSearchParams(keyword)
    setMode({ type: "search", q: params.search || "" })
  }

  //   useEffect(() => {
  //     setMode({ type: "search", q: params.search || "" })
  //   }, [params.search])

  return {
    param: params.search,
    update: updateSearchParams,
    change: setSearchQuery,
    value: searchQuery,
  }
}
