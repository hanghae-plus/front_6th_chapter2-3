import { useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { postWithAuthorQueries } from "./queries"

export function usePostWithAuthor() {
  const [searchParams] = useSearchParams()

  const filters = {
    skip: Number(searchParams.get("skip")) || 0,
    limit: Number(searchParams.get("limit")) || 10,
    searchQuery: searchParams.get("search") || "",
    selectedTag: searchParams.get("tag") || "",
    sortBy: (searchParams.get("sortBy") as "id" | "title" | "reactions" | "none") || undefined,
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
  }

  const { data, isLoading, error } = useQuery(postWithAuthorQueries.list(filters))

  return { posts: data?.posts, total: data?.total, isLoading, error }
}
