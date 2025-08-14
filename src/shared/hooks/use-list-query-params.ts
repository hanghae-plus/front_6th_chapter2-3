import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"

export const useListQueryParams = () => {
  const [queryParams, setQueryParams] = useQueryStates({
    skip: parseAsInteger.withDefault(0),
    limit: parseAsInteger.withDefault(10),
    searchQuery: parseAsString.withDefault(""),
    order: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
  })

  const onPageChange = (page: number) => {
    const nextSkip = (page - 1) * queryParams.limit
    setQueryParams({ skip: nextSkip })
  }

  const onLimitChange = (limit: number) => {
    setQueryParams({ limit, skip: 0 })
  }

  const onSearchQueryChange = (searchQuery: string) => {
    setQueryParams({ searchQuery: searchQuery || null, skip: 0 })
  }

  const onOrderChange = (order: "asc" | "desc") => {
    setQueryParams({ order })
  }

  const onSkipChange = (skip: number) => {
    setQueryParams({ skip })
  }

  return {
    queryParams,
    setQueryParams,
    onPageChange,
    onLimitChange,
    onSearchQueryChange,
    onOrderChange,
    onSkipChange,
  }
}


