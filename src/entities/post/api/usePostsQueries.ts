import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { postsApi } from "./postsApi"
import { Post, Tag } from "../../../types"

// 게시물 목록 가져오기 (내부용)
export const usePostsQuery = (
  limit: number,
  skip: number,
  options?: Omit<UseQueryOptions<{ posts: Post[]; total: number }>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["posts", limit, skip],
    queryFn: () => postsApi.getPosts(limit, skip),
    ...options,
  })
}

// 사용자 정보 가져오기
export const useUsers = (options?: Omit<UseQueryOptions<{ users: any[] }>, "queryKey" | "queryFn">) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => postsApi.getUsers(),
    staleTime: 10 * 60 * 1000, // 사용자 정보는 10분간 fresh 상태 유지
    ...options,
  })
}

// 게시물과 사용자 정보를 함께 가져오기
export const usePostsWithUsers = (
  limit: number,
  skip: number,
  sortBy?: string,
  sortOrder?: string,
  options?: Omit<UseQueryOptions<{ posts: Post[]; total: number }>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["postsWithUsers", limit, skip, sortBy, sortOrder],
    queryFn: () => postsApi.getPostsWithUsers(limit, skip, sortBy, sortOrder),
    ...options,
  })
}

// 태그 목록 가져오기
export const useTags = (options?: Omit<UseQueryOptions<Tag[]>, "queryKey" | "queryFn">) => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => postsApi.getTags(),
    staleTime: 30 * 60 * 1000, // 태그는 30분간 fresh 상태 유지
    ...options,
  })
}

// 게시물 검색
export const useSearchPosts = (
  query: string,
  options?: Omit<UseQueryOptions<{ posts: Post[]; total: number }>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["searchPosts", query],
    queryFn: () => postsApi.searchPosts(query),
    enabled: !!query, // query가 있을 때만 실행
    ...options,
  })
}

// 태그별 게시물 가져오기
export const usePostsByTag = (
  tag: string,
  limit: number,
  skip: number,
  options?: Omit<UseQueryOptions<{ posts: Post[]; total: number }>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["postsByTag", tag, limit, skip],
    queryFn: () => postsApi.getPostsByTag(tag, limit, skip),
    ...options,
  })
}
