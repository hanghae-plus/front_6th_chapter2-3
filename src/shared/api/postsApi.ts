import { Post, PostResponse } from "../../types/product.type"
import { User, UserResponse } from "../../types/user.type"
import { URL_PATH } from "../config/routes"

// 사용자 관련 API
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${URL_PATH.USERS.LIST}?limit=0&select=username,image`)
  const data = (await response.json()) as UserResponse
  return data.users
}

export const getUserById = async (userId: number): Promise<User> => {
  const users = await fetchUsers()
  return users.find((user) => user.id === userId) as User
}

export const fetchUserDetail = async (userId: number) => {
  const response = await fetch(URL_PATH.USERS.DETAIL(userId))
  return response.json()
}

// 게시물 관련 API
export const fetchPosts = async (limit: number, skip: number): Promise<PostResponse> => {
  const response = await fetch(`${URL_PATH.POSTS.LIST}?limit=${limit}&skip=${skip}`)
  return response.json()
}

export const searchPosts = async (query: string): Promise<PostResponse> => {
  const response = await fetch(`${URL_PATH.POSTS.SEARCH}?q=${query}`)
  return response.json()
}

export const fetchPostsByTag = async (tag: string): Promise<PostResponse> => {
  const response = await fetch(URL_PATH.POSTS.BY_TAG(tag))
  return response.json()
}

export const fetchTags = async () => {
  const response = await fetch(URL_PATH.POSTS.TAGS)
  return response.json()
}

export const createPost = async (postData: { title: string; body: string; userId: number }): Promise<Post> => {
  const response = await fetch(URL_PATH.POSTS.ADD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
  return response.json()
}

export const updatePost = async (id: number, postData: Partial<Post>): Promise<Post> => {
  const response = await fetch(URL_PATH.POSTS.UPDATE(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
  return response.json()
}

export const deletePost = async (id: number): Promise<void> => {
  await fetch(URL_PATH.POSTS.DELETE(id), {
    method: "DELETE",
  })
}
