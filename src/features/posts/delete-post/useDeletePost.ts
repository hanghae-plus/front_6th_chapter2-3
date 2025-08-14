import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "../../../entities/post/api"
import { useFetchPostsModeStore } from "../fetch-posts-by-mode/fetchMode.store"
import { ListResponse } from "../../../shared/types/types"
import { PostItem } from "../../../entities/post/model"

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  // 포스트 모드 상태
  const { state } = useFetchPostsModeStore()

  // 쿼리키 생성
  const queryKey = ["postsView", ...Object.values(state)]

  /**
   * 포스트 삭제 뮤테이션
   */
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey })
      const previousPosts = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: ListResponse<"posts", PostItem>) => ({
        ...old,
        posts: old.posts.filter((post) => post.id !== postId),
      }))
      return { previousPosts }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previousPosts !== undefined) {
        queryClient.setQueryData(queryKey, ctx.previousPosts)
      }
    },
  })

  return {
    action: {
      delete: deletePostMutation.mutate,
    },
  }
}
