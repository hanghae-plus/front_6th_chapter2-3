import { HttpClient } from "@/shared/api/http"
import type { Post, PostFilter, PostPaginatedResponse, Tag } from "@/shared/types"

export const postApi = {
  list: (filters: PostFilter = {}) => {
    const params = new URLSearchParams()

    if (filters.limit) params.set("limit", filters.limit.toString())
    if (filters.skip) params.set("skip", filters.skip.toString())
    if (filters.search) params.set("q", filters.search)
    if (filters.tag && filters.tag !== "all") params.set("tag", filters.tag)
    if (filters.sortBy && filters.sortBy !== "none") {
      params.set("sortBy", filters.sortBy)
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder)
    }

    const url = `/posts${params.toString() ? `?${params.toString()}` : ""}`
    return HttpClient.get<PostPaginatedResponse>(url)
  },

  detail: (id: number) => HttpClient.get<Post>(`/posts/${id}`),

  tags: () => HttpClient.get<Tag[]>(`/posts/tags`),
}
