import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "../../../entities/post/api"
import { useAtomValue } from "jotai"
import { localCreatedPostIdsAtom } from "../../../shared/lib/localAtoms"
import type { PostsApiResponse } from "../../../entities/post/model"

export const usePostDelete = () => {
  const queryClient = useQueryClient()
  const localCreatedIds = useAtomValue(localCreatedPostIdsAtom)

  const deletePostMutation = useMutation({
    mutationFn: ({ postId }: { postId: number; clientId?: string }) =>
      localCreatedIds.has(postId) ? Promise.resolve({} as any) : deletePost(postId),
    onMutate: async ({ postId, clientId }: { postId: number; clientId?: string }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      const previous = queryClient.getQueriesData({ queryKey: ["posts"] })
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        const data = old as PostsApiResponse | undefined
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
      if (ctx?.previous) for (const [k, d] of ctx.previous) queryClient.setQueryData(k as any, d as any)
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
