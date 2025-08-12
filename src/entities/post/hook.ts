import { useMutation, useQuery } from "@tanstack/react-query"
import { addPost, deletePost, fetchPosts, fetchPostsByTag, fetchTags, searchPosts, updatePost } from "./api"
import { AddPostRequest, UpdatePostRequest } from "./model"

const POST_QUERY_KEY = {
  LIST: "posts",
  SEARCH: "searchPosts",
  TAG: "postsByTag",
  TAGS: "tags",
}

/**
 * 게시물 목록 조회
 * @param limit - 페이지당 게시물 수
 * @param skip - 건너뛸 게시물 수
 * @returns 게시물 목록
 */
export const usePostsQuery = (limit: number, skip: number) => {
  return useQuery({
    queryKey: [POST_QUERY_KEY.LIST, limit, skip],
    queryFn: () => fetchPosts(limit, skip),
  })
}

/**
 * 게시물 검색
 * @param searchQuery - 검색어
 * @returns 게시물 목록
 */
export const useSearchPostsQuery = (searchQuery: string) => {
  return useQuery({
    queryKey: [POST_QUERY_KEY.SEARCH, searchQuery],
    queryFn: () => searchPosts(searchQuery),
  })
}

/**
 * 게시물 태그 조회
 * @param tag - 태그
 * @returns 게시물 목록
 */
export const usePostsByTagQuery = (tag: string) => {
  return useQuery({
    queryKey: [POST_QUERY_KEY.TAG, tag],
    queryFn: () => fetchPostsByTag(tag),
  })
}

/**
 * 태그 목록 조회
 * @returns 태그 목록
 */
export const useTagsQuery = () => {
  return useQuery({
    queryKey: [POST_QUERY_KEY.TAGS],
    queryFn: () => fetchTags(),
  })
}

/**
 * 게시물 추가
 * @returns 게시물 추가
 */
export const useAddPostMutation = () => {
  return useMutation({
    mutationFn: (post: AddPostRequest) => addPost(post),
  })
}

/**
 * 게시물 수정
 * @returns 게시물 수정
 */
export const useUpdatePostMutation = () => {
  return useMutation({
    mutationFn: (post: UpdatePostRequest) => updatePost(post),
  })
}

/**
 * 게시물 삭제
 * @returns 게시물 삭제
 */
export const useDeletePostMutation = () => {
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
  })
}
