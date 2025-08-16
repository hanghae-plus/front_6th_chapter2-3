import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost as deletePostApi } from "@/entities/post/api"
import { POST_QK } from "@/entities/post/model"
import { Post, PostPaginatedResponse } from "@/entities/post/model"
import { useBaseQueryParams } from "@/shared/hooks"

export const useDeletePost = () => {
  const baseQueryParams = useBaseQueryParams()
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
      queryClient.setQueriesData(
        {
          queryKey: POST_QK.list({
            ...baseQueryParams,
          }),
        },
        (old: PostPaginatedResponse) => {
          return {
            ...old,
            posts: old.posts.filter((p: Post) => p.id !== id),
            total: old.total - 1,
          }
        },
      )
    },
  })
  return { deletePost, isPending, error }
}
