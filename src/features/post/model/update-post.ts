import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePost } from "@/features/post/api"
import type { UpdatePost } from "@/entities/post/model/type"

export const POST_QUERY_KEYS = {
  all: ["posts"] as const,
  lists: () => [...POST_QUERY_KEYS.all, "list"] as const,
  details: () => [...POST_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...POST_QUERY_KEYS.details(), id] as const,
}

/**
 * 게시물 수정 뮤테이션 훅
 * @returns 게시물 수정 뮤테이션 객체
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePost }) => updatePost(id, data),
    onSuccess: (updatedPost) => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

      // 수정된 게시물 캐시 업데이트
      queryClient.setQueryData(POST_QUERY_KEYS.detail(updatedPost.id), updatedPost)
    },
    onError: (error) => {
      console.error("게시물 수정 실패:", error)
    },
  })
}
