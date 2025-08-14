import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"
import { SortOrder } from "../types/sort"

export const useQueryParamsPagination = () => {
  const [params, setParams] = useQueryStates({
    skip: parseAsInteger.withDefault(0),
    limit: parseAsInteger.withDefault(10),
    searchQuery: parseAsString.withDefault(""),
    order: parseAsStringEnum([SortOrder.ASC, SortOrder.DESC]).withDefault(SortOrder.ASC),
  })

  const stepPrev = () => setParams({ skip: Math.max(0, params.skip - params.limit) })
  const stepNext = () => setParams({ skip: params.skip + params.limit })

  return { params, setParams, stepPrev, stepNext }
}
