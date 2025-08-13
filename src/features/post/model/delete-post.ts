import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "@/features/post/api"

export const POST_QUERY_KEYS = {
  all: ["posts"] as const,
  lists: () => [...POST_QUERY_KEYS.all, "list"] as const,
  details: () => [...POST_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...POST_QUERY_KEYS.details(), id] as const,
}

/**
 * 게시물 삭제 뮤테이션 훅
 * @returns 게시물 삭제 뮤테이션 객체
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, deletedId) => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

      // 삭제된 게시물 캐시 제거
      queryClient.removeQueries({ queryKey: POST_QUERY_KEYS.detail(deletedId) })
    },
    onError: (error) => {
      console.error("게시물 삭제 실패:", error)
    },
  })
}
