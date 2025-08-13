import { useQuery } from "@tanstack/react-query"
import { getPosts, searchPosts, getPostsByTag, getPost } from "@/entities/post/api"
import type { PostFilter } from "@/entities/post/model/types"
import { POST_QUERY_KEYS } from "@/entities/post/model/query-key"

/**
 * 게시물 목록 조회 훅
 * @param filters - 게시물 필터링 옵션
 */
export const usePosts = (filters: PostFilter = {}) => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.list(filters),
    queryFn: () => getPosts(filters),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}

/**
 * 게시물 검색 훅
 * @param query - 검색어
 * @param enabled - 쿼리 활성화 여부
 */
export const useSearchPosts = (query: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.search(query),
    queryFn: () => searchPosts(query),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2분
  })
}

/**
 * 태그별 게시물 조회 훅
 * @param tag - 검색할 태그
 * @param enabled - 쿼리 활성화 여부
 */
export const usePostsByTag = (tag: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.tag(tag),
    queryFn: () => getPostsByTag(tag),
    enabled: enabled && tag !== "all",
    staleTime: 5 * 60 * 1000, // 5분
  })
}

/**
 * 단일 게시물 조회 훅
 * @param id - 게시물 ID
 * @param enabled - 쿼리 활성화 여부
 */
export const usePost = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.detail(id),
    queryFn: () => getPost(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10분
  })
}
