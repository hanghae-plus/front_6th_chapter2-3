import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

export const useQueryParamsPagination = () => {
  return useQueryStates({
    skip: parseAsInteger.withDefault(0),
    limit: parseAsInteger.withDefault(10),
    searchQuery: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault(""),
    sortOrder: parseAsString.withDefault(""),
  })
}
