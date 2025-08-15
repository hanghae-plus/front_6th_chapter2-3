import { api } from "../../shared/api/api"
import { ListResponse } from "../../shared/types/types"
import { AddPostRequest, PostItem, Tag, UpdatePostRequest } from "./model"

/**
 * 주소에 따라 게시물 조회
 * @param url - 주소
 * @returns 게시물 목록
 */
export const fetchPostsByUrl = async (url: string) => {
  const response = await api.get<ListResponse<"posts", PostItem>>(url)
  return response
}

/**
 * 게시물 목록 조회
 * @param limit - 페이지당 게시물 수
 * @param skip - 건너뛸 게시물 수
 * @returns 게시물 목록
 */
export const fetchPosts = async (limit: number, skip: number) => {
  const response = await api.get<ListResponse<"posts", PostItem>>(`/posts?limit=${limit}&skip=${skip}`)
  return response
}

/**
 * 게시물 검색
 * @param searchQuery - 검색어
 * @returns 게시물 목록
 */
export const searchPosts = async (searchQuery: string, limit: number, skip: number) => {
  const response = await api.get<ListResponse<"posts", PostItem>>(
    `/posts/search?q=${searchQuery}&limit=${limit}&skip=${skip}`,
  )
  return response
}

/**
 * 태그별 게시물 조회
 * @param tag - 태그
 * @returns 게시물 목록
 */
export const fetchPostsByTag = async (tag: string, limit: number, skip: number) => {
  const response = await api.get<ListResponse<"posts", PostItem>>(`/posts/tag/${tag}?limit=${limit}&skip=${skip}`)
  return response
}

/**
 * 게시물 추가
 * @param post - 게시물 정보
 * @returns 게시물 정보
 */
export const addPost = async (post: AddPostRequest) => {
  const response = await api.post(`/posts/add`, post)
  return response
}

/**
 * 게시물 수정
 * @param post - 게시물 정보
 * @returns 게시물 정보
 */
export const updatePost = async (post: UpdatePostRequest) => {
  const response = await api.put(`/posts/${post.id}`, post)
  return response
}

/**
 * 게시물 삭제
 * @param id - 게시물 ID
 * @returns 게시물 정보
 */
export const deletePost = async (id: number) => {
  const response = await api.delete(`/posts/${id}`)
  return response
}

/**
 * 태그 목록 조회
 * @returns 태그 목록
 */
export const fetchTags = async () => {
  const response = await api.get<Tag[]>("/posts/tags")
  return response
}
