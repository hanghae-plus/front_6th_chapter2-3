import { useQuery } from "@tanstack/react-query"
import { fetchPosts, searchPosts, fetchPostsByTag, fetchTags } from "./index"

// 게시물 목록 조회
export const useGetPosts = (limit: number, skip: number) => {
  return useQuery({
    queryKey: ["posts", "list", { limit, skip }],
    queryFn: () => fetchPosts(limit, skip),
  })
}

// 게시물 검색
export const useGetPostSearch = (query: string, limit: number, skip: number) => {
  return useQuery({
    queryKey: ["posts", "search", { query, limit, skip }],
    queryFn: () => searchPosts(query, limit, skip),
    enabled: !!query.trim(), // 검색어가 있을 때만 실행
  })
}

// 태그별 게시물 조회
export const useGetPostsByTag = (tag: string, limit: number, skip: number) => {
  return useQuery({
    queryKey: ["posts", "by-tag", { tag, limit, skip }],
    queryFn: () => fetchPostsByTag(tag, limit, skip),
    enabled: !!tag && tag !== "all", // 유효한 태그일 때만 실행
  })
}

// 태그 목록 조회
export const useGetTags = () => {
  return useQuery({
    queryKey: ["posts", "tags"],
    queryFn: fetchTags,
  })
}
