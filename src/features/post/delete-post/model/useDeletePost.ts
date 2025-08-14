import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost as deletePostApi } from "@/entities/post/api"
import { POST_QK } from "@/entities/post/model/query-key"
import { Post, PostPaginatedResponse } from "@/shared/types"

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const {
    mutate: deletePost,
    isPending,
    error,
  } = useMutation({
    mutationFn: deletePostApi,
    onSuccess: (_, id) => {
      // 상세 캐시 제거
      queryClient.removeQueries({ queryKey: POST_QK.detail(id) })

      // 모든 관련 쿼리에서 해당 포스트 제거
      queryClient.setQueriesData({ queryKey: POST_QK.list({}) }, (prev: PostPaginatedResponse) => {
        return {
          ...prev,
          posts: prev.posts.filter((p: Post) => p.id !== id),
          total: prev.total - 1,
        }
      })
    },
  })
  return { deletePost, isPending, error }
}
