import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost } from "@/features/post/api"
import type { CreatePost } from "@/entities/post/model/type"

export const POST_QUERY_KEYS = {
  all: ["posts"] as const,
  lists: () => [...POST_QUERY_KEYS.all, "list"] as const,
  details: () => [...POST_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...POST_QUERY_KEYS.details(), id] as const,
}

/**
 * 게시물 생성 뮤테이션 훅
 * @returns 게시물 생성 뮤테이션 객체
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePost) => createPost(data),
    onSuccess: (newPost) => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

      // 새 게시물을 캐시에 추가
      queryClient.setQueryData(POST_QUERY_KEYS.detail(newPost.id), newPost)
    },
    onError: (error) => {
      console.error("게시물 생성 실패:", error)
    },
  })
}
