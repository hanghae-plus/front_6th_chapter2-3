import { postApi } from "@/entities/post"
import { PostQueryParams } from "@/entities/post/model/types"

export const getPosts = async (params: Partial<PostQueryParams & { tag: string }>, changedFields: string[]) => {
  const { limit, order, search, skip, sortBy, tag } = params

  if (changedFields.includes("search") && search && search.trim()) {
    return await postApi.search({ q: search })
  }

  if (changedFields.includes("tag") && tag && tag !== "all") {
    return await postApi.getAllByTag(tag)
  }

  return await postApi.getAll({ limit, order, skip, sortBy })
}
