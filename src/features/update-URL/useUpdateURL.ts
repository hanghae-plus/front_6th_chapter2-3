import { useSearchParams } from "react-router-dom"

const initialParams = {
  search: "",
  skip: 0,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
  tag: "",
}

export const useUpdateURL = () => {
  const [params, setParams] = useSearchParams()

  const updateSearchParams = (keyword: string) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("search", keyword)
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

  const updateSortByParams = (sortBy: string) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("sortBy", sortBy)
      return newParams
    })
  }

  const updateSortOrderParams = (sortOrder: string) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("sortOrder", sortOrder)
      return newParams
    })
  }

  const updateTagParams = (tag: string) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("tag", tag)
      return newParams
    })
  }

  return {
    action: {
      updateSearchParams,
      updateSkipParams,
      updateLimitParams,
      updateSortByParams,
      updateSortOrderParams,
      updateTagParams,
    },
    params: {
      search: params.get("search") || initialParams.search,
      skip: params.get("skip") || initialParams.skip,
      limit: params.get("limit") || initialParams.limit,
      sortBy: params.get("sortBy") || initialParams.sortBy,
      sortOrder: params.get("sortOrder") || initialParams.sortOrder,
      tag: params.get("tag") || initialParams.tag,
    },
  }
}
