import { Post, PostsApiResponse, NewPost } from "@entities/post/model/types"

export const fetchPosts = async (limit: number, skip: number): Promise<PostsApiResponse> => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  return response.json()
}

export const searchPosts = async (query: string, limit: number, skip: number): Promise<PostsApiResponse> => {
  const response = await fetch(`/api/posts/search?q=${query}&limit=${limit}&skip=${skip}`)
  return response.json()
}

export const fetchPostsByTag = async (tag: string, limit: number, skip: number): Promise<PostsApiResponse> => {
  const response = await fetch(`/api/posts/tag/${tag}?limit=${limit}&skip=${skip}`)
  return response.json()
}

export const addPost = async (post: NewPost): Promise<Post> => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

export const updatePost = async (id: number, post: Partial<Post>): Promise<Post> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

export const deletePost = async (id: number): Promise<void> => {
  await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
}

export const fetchTags = async () => {
  const response = await fetch("/api/posts/tags")
  return response.json()
}
