import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { deletePost } from "../../../entities/post/api"
import { useAtomValue } from "jotai"
import { localCreatedPostIdsAtom } from "../../../shared/lib/localAtoms"
import type { PostsApiResponse } from "../../../entities/post/model"
import { applyDeleteByIdOrClient } from "../../../entities/post/model/adapters"
import { postsKey } from "../../../shared/api/queryKeys"
import { ENV_USE_SERVER_TRUTH } from "../../../shared/lib/env"

type UsePostDeleteOptions = {
  onConfirm?: (message: string) => Promise<boolean> | boolean
  onNotify?: (message: string) => void
}

export const usePostDelete = (options: UsePostDeleteOptions = {}) => {
  const queryClient = useQueryClient()
  const localCreatedIds = useAtomValue(localCreatedPostIdsAtom)

  type PreviousCtx = Array<[QueryKey, PostsApiResponse | undefined]>
  const deletePostMutation = useMutation<
    { isDeleted: boolean },
    Error,
    { postId: number; clientId?: string },
    { previous: PreviousCtx }
  >({
    mutationFn: ({ postId }) =>
      localCreatedIds.has(postId) ? Promise.resolve({ isDeleted: true }) : deletePost(postId),
    onMutate: async ({ postId, clientId }) => {
      await queryClient.cancelQueries({ queryKey: postsKey.all })
      const previous = queryClient.getQueriesData({ queryKey: postsKey.all }) as PreviousCtx
      queryClient.setQueriesData({ queryKey: postsKey.all }, (old: PostsApiResponse | undefined) => {
        const data = old
        if (!data) return old
        return applyDeleteByIdOrClient(data, postId, clientId)
      })
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) for (const [k, d] of ctx.previous) queryClient.setQueryData(k, d)
    },
    onSettled: () => {
      if (ENV_USE_SERVER_TRUTH) {
        queryClient.invalidateQueries({ queryKey: postsKey.all })
      }
    },
  })

  const handleDelete = async ({ postId, clientId }: { postId: number; clientId?: string }) => {
    const confirmed = options.onConfirm
      ? await options.onConfirm("정말로 이 게시물을 삭제하시겠습니까?")
      : window.confirm("정말로 이 게시물을 삭제하시겠습니까?")
    if (confirmed) {
      try {
        await deletePostMutation.mutateAsync({ postId, clientId })
        options.onNotify?.("게시물이 삭제되었습니다")
      } catch (error) {
        console.error("Failed to delete post:", error)
      }
    }
  }

  return { handleDelete }
}
