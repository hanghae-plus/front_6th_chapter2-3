import { useSearchParams } from "react-router-dom"
import { QUERY_PARAM_KEYS, BaseQueryParams } from "@/shared/lib/queryParams"

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const getParam = (key: keyof typeof QUERY_PARAM_KEYS) => searchParams.get(QUERY_PARAM_KEYS[key])

  const setParam = (key: keyof typeof QUERY_PARAM_KEYS, value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set(QUERY_PARAM_KEYS[key], value)
      return newParams
    })
  }

  const removeParam = (key: keyof typeof QUERY_PARAM_KEYS) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.delete(QUERY_PARAM_KEYS[key])
      return newParams
    })
  }

  const getAllParams = (): BaseQueryParams => ({
    limit: Number(getParam("LIMIT")) || undefined,
    skip: Number(getParam("SKIP")) || 0,
    search: getParam("SEARCH") || undefined,
    tag: getParam("TAG") || undefined,
    sortBy: (getParam("SORT_BY") as BaseQueryParams["sortBy"]) || undefined,
    sortOrder: (getParam("SORT_ORDER") as BaseQueryParams["sortOrder"]) || undefined,
  })

  return {
    getParam,
    setParam,
    removeParam,
    getAllParams,
    searchParams,
  }
}
