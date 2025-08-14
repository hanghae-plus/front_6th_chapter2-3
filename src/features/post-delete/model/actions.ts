import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { deletePost } from "../../../entities/post/api"
import { useAtomValue } from "jotai"
import { localCreatedPostIdsAtom } from "../../../shared/lib/localAtoms"
import type { PostsApiResponse } from "../../../entities/post/model"

export const usePostDelete = () => {
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
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      const previous = queryClient.getQueriesData({ queryKey: ["posts"] }) as PreviousCtx
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: PostsApiResponse | undefined) => {
        const data = old
        if (!data) return old
        return {
          ...data,
          posts: data.posts.filter((p) => (clientId ? p.clientId !== clientId : p.id !== postId)),
          total: Math.max(0, (data.total ?? 1) - 1),
        }
      })
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) for (const [k, d] of ctx.previous) queryClient.setQueryData(k, d)
    },
    onSettled: () => {},
  })

  const handleDelete = async ({ postId, clientId }: { postId: number; clientId?: string }) => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        await deletePostMutation.mutateAsync({ postId, clientId })
      } catch (error) {
        console.error("Failed to delete post:", error)
      }
    }
  }

  return { handleDelete }
}
