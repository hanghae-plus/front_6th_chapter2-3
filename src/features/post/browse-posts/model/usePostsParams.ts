import { parseAsString, useQueryStates } from "nuqs"
import { useQueryParamsPagination } from "../../../../shared/hooks/useQueryParamsPagination"

export type PostsBrowseParams = {
  skip: number
  limit: number
  searchQuery: string
  order: "asc" | "desc"
  sortBy: string
  tag: string
}

export const usePostsBrowseParams = () => {
  const { params: paginationParams, setParams: setPaginationParams, stepPrev, stepNext } = useQueryParamsPagination()

  const [additionalParams, setAdditionalParams] = useQueryStates({
    sortBy: parseAsString.withDefault(""),
    tag: parseAsString.withDefault(""),
  })

  const params = { ...paginationParams, ...additionalParams }

  const setParams = (newParams: Partial<PostsBrowseParams>) => {
    const { sortBy, tag, ...paginationFields } = newParams

    if (Object.keys(paginationFields).length > 0) {
      setPaginationParams(paginationFields)
    }

    if (sortBy !== undefined || tag !== undefined) {
      setAdditionalParams({ sortBy, tag })
    }
  }

  return {
    params,
    setParams,
    stepPrev,
    stepNext,
  }
}
