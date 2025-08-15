import type { Post, PostsApiResponse } from "../model/types"
import { API_BASE_URL } from "../../../shared/lib/env"

export const fetchPosts = async (limit: number, skip: number): Promise<PostsApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`)
  if (!response.ok) throw new Error("Failed to fetch posts")
  return response.json()
}

export const searchPosts = async (query: string): Promise<PostsApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/posts/search?q=${query}`)
  if (!response.ok) throw new Error("Failed to search posts")
  return response.json()
}

export const fetchPostsByTag = async (tag: string): Promise<PostsApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/posts/tag/${tag}`)
  if (!response.ok) throw new Error(`Failed to fetch posts for tag: ${tag}`)
  return response.json()
}

export const addPost = async (postData: { title: string; body: string; userId: number }): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
  if (!response.ok) throw new Error("Failed to add post")
  return response.json()
}

export const updatePost = async (postId: number, postData: Partial<Post>): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
  if (!response.ok) throw new Error("Failed to update post")
  return response.json()
}

export const deletePost = async (postId: number): Promise<{ isDeleted: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete post")
  return response.json()
}

export const likePost = async (postId: number, currentLikes: number): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reactions: { likes: currentLikes + 1 } }),
  })
  if (!response.ok) throw new Error("Failed to like post")
  return response.json()
}

export const dislikePost = async (postId: number, currentDislikes: number): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reactions: { dislikes: currentDislikes + 1 } }),
  })
  if (!response.ok) throw new Error("Failed to dislike post")
  return response.json()
}
