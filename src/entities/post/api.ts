import { IPost, ITag } from './model'
import { http } from '@shared/lib/http-client'

/**
 * 게시물 목록 조회
 * @param limit - 한 페이지에 보여지는 게시물 수
 * @param skip - 건너뛸 게시물 수
 * @returns 게시물 목록
 */
export async function fetchPosts({ limit, skip }: { limit: number; skip: number }) {
  const searchParams = { limit, skip }
  const response = await http.get(`/posts`, { params: searchParams })
  return response
}

/**
 * 게시물 검색
 * @param query - 검색어
 * @returns 게시물 목록
 */
export async function fetchPostsBySearch({ query }: { query: string }) {
  const searchParams = { q: query }
  const response = await http.get(`/posts/search`, { params: searchParams })
  return response
}

/**
 * 태그로 게시물 목록 조회
 * @param tag - 태그
 * @returns 게시물 목록
 */
export async function fetchPostsByTag(tag: string) {
  const response = await http.get(`/posts/tag/${tag}`)
  return response
}

export interface INewPost {
  title: string
  body: string
  userId: number
}

/**
 * 게시물 추가
 * @param payload - 게시물 정보
 * @returns 게시물 정보
 */

export async function addPost(payload: INewPost) {
  const response = await http.post(`/posts/add`, { body: payload })
  return response
}

/**
 * 게시물 수정
 * @param payload - 게시물 정보
 * @returns 게시물 정보
 */
export async function updatePost({ id, ...body }: IPost) {
  const response = await http.put(`/posts/${id}`, { body })
  return response
}

/**
 * 게시물 삭제
 * @param id - 게시물 ID
 * @returns 게시물 정보
 */
export async function deletePost({ id }: { id: number }) {
  const response = await http.delete(`/posts/${id}`)
  return response
}

export async function fetchTags() {
  const response = await http.get<ITag[]>(`/posts/tags`)
  return response
}
