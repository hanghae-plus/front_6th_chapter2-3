import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi } from "../api"
import { CreatePost, UpdatePost, PostFilter } from "./schema"

export const POST_QUERY_KEYS = {
  all: ["posts"] as const,
  lists: () => [...POST_QUERY_KEYS.all, "list"] as const,
  list: (filters: PostFilter) => [...POST_QUERY_KEYS.lists(), filters] as const,
  details: () => [...POST_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...POST_QUERY_KEYS.details(), id] as const,
  tags: () => [...POST_QUERY_KEYS.all, "tags"] as const,
}

// 게시물 목록 조회 훅
export const usePosts = (filters: PostFilter = {}) => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.list(filters),
    queryFn: () => postApi.getPosts(filters),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}

// 게시물 검색 훅
export const useSearchPosts = (query: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: [...POST_QUERY_KEYS.lists(), "search", query],
    queryFn: () => postApi.searchPosts(query),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2분
  })
}

// 태그별 게시물 조회 훅
export const usePostsByTag = (tag: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...POST_QUERY_KEYS.lists(), "tag", tag],
    queryFn: () => postApi.getPostsByTag(tag),
    enabled: enabled && tag !== "all",
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// 단일 게시물 조회 훅
export const usePost = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.detail(id),
    queryFn: () => postApi.getPost(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10분
  })
}

// 태그 목록 조회 훅
export const useTags = () => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.tags(),
    queryFn: () => postApi.getTags(),
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
  })
}

// 게시물 생성 뮤테이션
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePost) => postApi.createPost(data),
    onSuccess: (newPost) => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

      // 새 게시물을 캐시에 추가
      queryClient.setQueryData(POST_QUERY_KEYS.detail(newPost.id), newPost)
    },
  })
}

// 게시물 수정 뮤테이션
export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePost }) => postApi.updatePost(id, data),
    onSuccess: (updatedPost) => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

      // 수정된 게시물 캐시 업데이트
      queryClient.setQueryData(POST_QUERY_KEYS.detail(updatedPost.id), updatedPost)
    },
  })
}

// 게시물 삭제 뮤테이션
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: (_, deletedId) => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

      // 삭제된 게시물 캐시 제거
      queryClient.removeQueries({ queryKey: POST_QUERY_KEYS.detail(deletedId) })
    },
  })
}
