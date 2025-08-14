import { useMutation, useQuery } from "@tanstack/react-query"
import PostAPI from "../api/PostAPI"
import { CreatePost, UpdatePost } from "./types"

// Query Keys 상수 정의
const QUERY_KEYS = {
  POSTS: "posts",
  TAGS: "tags",
} as const

/**
 * 게시글 목록 조회
 * @param limit - 한 페이지에 표시할 게시글 수
 * @param skip - 건너뛸 게시글 수
 * @param sortBy - 정렬 기준
 * @param Order - 정렬 순서
 * @param tag - 태그 (선택사항)
 * @param searchQuery - 검색어 (선택사항)
 * @returns 게시글 목록
 */
export const usePosts = (
  limit: number,
  skip: number,
  sortBy?: string,
  order?: string,
  tag?: string,
  searchQuery?: string,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, { limit, skip, sortBy, order, tag, searchQuery }],
    queryFn: () => {
      if (tag && tag !== "all") {
        return PostAPI.getPostsByTag(tag, limit, skip, sortBy, order)
      }
      if (searchQuery) {
        return PostAPI.getPostsBySearch(searchQuery, limit, skip, sortBy, order)
      }
      return PostAPI.getPosts(limit, skip, sortBy, order)
    },
  })
}

/**
 * 게시글 추가
 * @param post - 추가할 게시글 정보
 * @returns 추가된 게시글 정보
 */
export const useCreatePost = () => {
  return useMutation({
    mutationFn: (post: CreatePost) => PostAPI.createPost(post),
  })
}

/**
 * 게시글 업데이트
 * @param post - 업데이트할 게시글 정보
 * @returns 업데이트된 게시글 정보
 */
export const useUpdatePost = (id: number) => {
  return useMutation({
    mutationFn: (post: UpdatePost) => PostAPI.updatePost(id, post),
  })
}

/**
 * 게시글 삭제
 * @param id - 삭제할 게시글 ID
 * @returns 삭제된 게시글 정보
 */
export const useDeletePost = () => {
  return useMutation({
    mutationFn: (id: number) => PostAPI.deletePost(id),
  })
}

/**
 * 태그 목록 조회
 * @returns 태그 목록
 */
export const useGetTags = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TAGS],
    queryFn: () => PostAPI.getTags(),
  })
}
