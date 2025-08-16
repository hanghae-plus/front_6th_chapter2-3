import { useSearchParams } from "react-router-dom"
import { useMemo } from "react"
import { BaseQueryParams } from "../lib"

type BaseQueryParamsReturnType = BaseQueryParams

export function useBaseQueryParams(): BaseQueryParamsReturnType {
  const [searchParams] = useSearchParams()

  return useMemo(
    () => ({
      skip: Number(searchParams.get("skip")) || 0,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || "",
      tag: searchParams.get("tag") || "",
      sortBy: (searchParams.get("sortBy") as "id" | "title" | "reactions" | "none") || "none",
      sortOrder: (searchParams.get("sortOrder") as "desc" | "asc") || "desc",
    }),
    [searchParams],
  )
}
