import { Post } from "../model/types"

// 게시물 목록을 가져오는 API 함수
export const getPostApi = async (limit: number, skip: number) => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  if (!response.ok) {
    throw new Error("게시물 목록을 가져오는데 실패했습니다.")
  }
  return response
}

// 게시물 추가 API 함수
export const addPostApi = async (newPost: Post) => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  })
  if (!response.ok) {
    throw new Error("게시물 추가에 실패했습니다.")
  }
  return response
}
// 게시물 수정 API 함수
export const updatePostApi = async (post: Post) => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  if (!response.ok) {
    throw new Error("게시물 수정에 실패했습니다.")
  }
  return response
}

// 게시물 삭제 API 함수
export const deletePostApi = async (id: string) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("게시물 삭제에 실패했습니다.")
  }
  return response
}

// 게시물 검색 API 함수
export const searchPostApi = async (searchQuery: string) => {
  const response = await fetch(`/api/posts/search?q=${searchQuery}`)
  if (!response.ok) {
    throw new Error("게시물 검색에 실패했습니다.")
  }
  return response
}

export const getTagApi = async () => {
  const response = await fetch("/api/posts/tags")
  if (!response.ok) {
    throw new Error("태그 추가에 실패했습니다.")
  }
  return response
}

// 특정 태그로 게시물 목록을 가져오는 API 함수
export const getPostsByTagApi = async (tag: string) => {
  const response = await fetch(`/api/posts/tag/${tag}`)
  if (!response.ok) {
    throw new Error("해당 태그의 게시물 목록을 가져오는데 실패했습니다.")
  }
  return response
}

// 모든 유저의 username과 image만 가져오는 API 함수
export const getAllUsersApi = async () => {
  const response = await fetch("/api/users?limit=0&select=username,image")
  if (!response.ok) {
    throw new Error("유저 목록을 가져오는데 실패했습니다.")
  }
  return response
}
