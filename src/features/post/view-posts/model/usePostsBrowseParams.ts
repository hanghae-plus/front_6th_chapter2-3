import { parseAsString, useQueryStates } from "nuqs"
import { useQueryParamsPagination } from "@shared/lib/useQueryParamsPagination"
import type { SortOrder } from "@shared/types"

export type PostsBrowseParams = {
  skip: number
  limit: number
  searchQuery: string
  order: SortOrder
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

    const definedPagination = Object.fromEntries(
      Object.entries(paginationFields).filter(([, v]) => v !== undefined),
    ) as Partial<Pick<PostsBrowseParams, "skip" | "limit" | "searchQuery" | "order">>

    if (Object.keys(definedPagination).length > 0) {
      setPaginationParams(definedPagination)
    }

    const additionalParams: { sortBy?: string | null; tag?: string | null } = {}
    if (sortBy !== undefined) additionalParams.sortBy = sortBy === "" ? null : sortBy
    if (tag !== undefined) additionalParams.tag = tag === "" ? null : tag

    if (Object.keys(additionalParams).length > 0) {
      setAdditionalParams(additionalParams)
    }
  }

  return {
    params,
    setParams,
    stepPrev,
    stepNext,
  }
}
