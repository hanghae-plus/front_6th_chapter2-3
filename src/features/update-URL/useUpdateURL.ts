import { useSearchParams } from "react-router-dom"

const initialParams = {
  search: "",
  skip: 0,
  limit: 10,
  sortBy: "none",
  order: "asc",
  tag: "",
}

export const useUpdateURL = () => {
  const [params, setParams] = useSearchParams()

  const updateSearchParams = (keyword: string) => {
    console.log("updateSearchParams", keyword)
    setParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (keyword.trim() === "") {
        newParams.delete("search") // 빈 문자열이면 파라미터 제거
      } else {
        newParams.set("search", keyword)
        newParams.set("skip", "0")
      }
      return newParams
    })
  }
  const updateSkipParams = (skip: number) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("skip", skip.toString())
      return newParams
    })
  }

  const updateLimitParams = (limit: number) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("limit", limit.toString())
      return newParams
    })
  }

  const updateSortAndOrderParams = (sortBy: string, sortOrder: string) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (sortBy === "") {
        newParams.delete("sortBy")
        newParams.delete("order")
        newParams.set("skip", "0")
      } else {
        newParams.set("sortBy", sortBy)
        newParams.set("order", sortOrder)
      }
      return newParams
    })
  }

  const updateTagParams = (tag: string) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("tag", tag)
      newParams.set("skip", "0")
      return newParams
    })
  }

  return {
    action: {
      updateSearchParams,
      updateSkipParams,
      updateLimitParams,
      updateSortAndOrderParams,
      updateTagParams,
    },
    params: {
      search: params.get("search") || initialParams.search,
      skip: parseInt(params.get("skip") || "0") || initialParams.skip,
      limit: parseInt(params.get("limit") || "0") || initialParams.limit,
      sortBy: params.get("sortBy") || initialParams.sortBy,
      order: params.get("order") || initialParams.order,
      tag: params.get("tag") || initialParams.tag,
    },
  }
}
