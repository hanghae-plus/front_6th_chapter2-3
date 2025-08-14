import { Post, PostsApiResponse, NewPost } from "@entities/post/model/types"
import { createURLParams, createApiUrl } from "@shared/lib"

// Export hooks
export * from "./queries"
export * from "./mutations"

export const fetchPosts = async (
  limit: number,
  skip: number,
  sortBy: string = "none",
  sortOrder: string = "asc",
): Promise<PostsApiResponse> => {
  const query = createURLParams({
    limit,
    skip,
    ...(sortBy && sortBy !== "none" ? { sortBy, order: sortOrder } : {}),
  })
  const response = await fetch(createApiUrl(`posts?${query}`))
  return response.json()
}

export const searchPosts = async (
  query: string,
  limit: number,
  skip: number,
  sortBy: string = "none",
  sortOrder: string = "asc",
): Promise<PostsApiResponse> => {
  const queryString = createURLParams({
    q: query,
    limit,
    skip,
    ...(sortBy && sortBy !== "none" ? { sortBy, order: sortOrder } : {}),
  })
  const response = await fetch(createApiUrl(`posts/search?${queryString}`))
  return response.json()
}

export const fetchPostsByTag = async (
  tag: string,
  limit: number,
  skip: number,
  sortBy: string = "none",
  sortOrder: string = "asc",
): Promise<PostsApiResponse> => {
  const queryString = createURLParams({
    limit,
    skip,
    ...(sortBy && sortBy !== "none" ? { sortBy, order: sortOrder } : {}),
  })
  const response = await fetch(createApiUrl(`posts/tag/${encodeURIComponent(tag)}?${queryString}`))
  return response.json()
}

export const addPost = async (post: NewPost): Promise<Post> => {
  const response = await fetch(createApiUrl("posts/add"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

export const updatePost = async (id: number, post: Partial<Post>): Promise<Post> => {
  const response = await fetch(createApiUrl(`posts/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

export const deletePost = async (id: number): Promise<void> => {
  await fetch(createApiUrl(`posts/${id}`), {
    method: "DELETE",
  })
}

export const fetchTags = async () => {
  const response = await fetch(createApiUrl("posts/tags"))
  return response.json()
}
