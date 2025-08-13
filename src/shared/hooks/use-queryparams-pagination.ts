import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"

export const useQueryParamsPagination = () => {
  return useQueryStates({
    skip: parseAsInteger.withDefault(0),
    limit: parseAsInteger.withDefault(10),
    searchQuery: parseAsString.withDefault(""),
    order: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
  })
}
