import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likePost, dislikePost } from "../../../entities/post/api"
import type { PostsApiResponse, Post } from "../../../entities/post/model"
import { applyUpdateByIdOrClient } from "../../../entities/post/model/adapters"
import { useAtomValue } from "jotai"
import { localCreatedPostIdsAtom } from "../../../shared/lib/localAtoms"
import { postsKey } from "../../../shared/api/queryKeys"

export const usePostReactions = () => {
  const queryClient = useQueryClient()
  const localCreatedIds = useAtomValue(localCreatedPostIdsAtom)

  const optimisticallyUpdatePosts = (postId: number, updater: (p: Post) => Post, clientId?: string) => {
    queryClient.setQueriesData({ queryKey: postsKey.all }, (old: any) => {
      const data = old as PostsApiResponse | undefined
      if (!data) return old
      return applyUpdateByIdOrClient(data, postId, clientId, updater)
    })
  }

  const likePostMutation = useMutation({
    mutationFn: ({ postId, currentLikes }: { postId: number; currentLikes: number; clientId?: string }) =>
      localCreatedIds.has(postId) ? Promise.resolve({} as any) : likePost(postId, currentLikes),
    onMutate: async ({ postId, clientId }: { postId: number; clientId?: string }) => {
      await queryClient.cancelQueries({ queryKey: postsKey.all })
      const previous = queryClient.getQueriesData({ queryKey: postsKey.all })
      optimisticallyUpdatePosts(
        postId,
        (post) => ({
          ...post,
          reactions: { ...post.reactions, likes: (post.reactions?.likes ?? 0) + 1 },
        }),
        clientId,
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        for (const [key, data] of ctx.previous) queryClient.setQueryData(key as any, data as any)
      }
    },
    // 서버가 반영되지 않는 환경(dummyjson)에서는 캐시 무효화를 하면
    // 원본 데이터로 되돌아가므로 수행하지 않습니다
  })

  const dislikePostMutation = useMutation({
    mutationFn: ({ postId, currentDislikes }: { postId: number; currentDislikes: number; clientId?: string }) =>
      localCreatedIds.has(postId) ? Promise.resolve({} as any) : dislikePost(postId, currentDislikes),
    onMutate: async ({ postId, clientId }: { postId: number; clientId?: string }) => {
      await queryClient.cancelQueries({ queryKey: postsKey.all })
      const previous = queryClient.getQueriesData({ queryKey: postsKey.all })
      optimisticallyUpdatePosts(
        postId,
        (post) => ({
          ...post,
          reactions: { ...post.reactions, dislikes: (post.reactions?.dislikes ?? 0) + 1 },
        }),
        clientId,
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        for (const [key, data] of ctx.previous) queryClient.setQueryData(key as any, data as any)
      }
    },
    // 서버가 반영되지 않는 환경(dummyjson)에서는 캐시 무효화를 하지 않습니다
  })

  const handleLike = (postId: number, currentLikes: number, clientId?: string) => {
    likePostMutation.mutate({ postId, currentLikes, clientId })
  }

  const handleDislike = (postId: number, currentDislikes: number, clientId?: string) => {
    dislikePostMutation.mutate({ postId, currentDislikes, clientId })
  }

  return {
    handleLike,
    handleDislike,
  }
}
