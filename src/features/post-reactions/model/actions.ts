import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likePost, dislikePost } from "../../../entities/post/api"
import type { PostsApiResponse, Post } from "../../../entities/post/model"
import { applyUpdateByIdOrClient } from "../../../entities/post/model/adapters"
import { useAtomValue } from "jotai"
import { localCreatedPostIdsAtom } from "../../../shared/lib/localAtoms"
import { postsKey } from "../../../shared/api/queryKeys"
import { ENV_USE_SERVER_TRUTH } from "../../../shared/lib/env"

export const usePostReactions = () => {
  const queryClient = useQueryClient()
  const localCreatedIds = useAtomValue(localCreatedPostIdsAtom)

  const optimisticallyUpdatePosts = (postId: number, updater: (p: Post) => Post, clientId?: string) => {
    queryClient.setQueriesData({ queryKey: postsKey.all }, (old: PostsApiResponse | undefined) => {
      if (!old) return old
      return applyUpdateByIdOrClient(old, postId, clientId, updater)
    })
  }

  const likePostMutation = useMutation({
    mutationFn: ({ postId, currentLikes }: { postId: number; currentLikes: number; clientId?: string }) =>
      localCreatedIds.has(postId) ? Promise.resolve({} as unknown as Post) : likePost(postId, currentLikes),
    onMutate: async ({ postId, clientId }: { postId: number; clientId?: string }) => {
      await queryClient.cancelQueries({ queryKey: postsKey.all })
      const previous = queryClient.getQueriesData({ queryKey: postsKey.all }) as Array<
        [readonly ["posts"], PostsApiResponse | undefined]
      >
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
        for (const [key, data] of ctx.previous) queryClient.setQueryData(key, data)
      }
    },
    // 환경 분기: 실서버 전환 시 invalidate 복원 고려
    onSettled: () => {
      if (ENV_USE_SERVER_TRUTH) {
        queryClient.invalidateQueries({ queryKey: postsKey.all })
      }
    },
  })

  const dislikePostMutation = useMutation({
    mutationFn: ({ postId, currentDislikes }: { postId: number; currentDislikes: number; clientId?: string }) =>
      localCreatedIds.has(postId) ? Promise.resolve({} as unknown as Post) : dislikePost(postId, currentDislikes),
    onMutate: async ({ postId, clientId }: { postId: number; clientId?: string }) => {
      await queryClient.cancelQueries({ queryKey: postsKey.all })
      const previous = queryClient.getQueriesData({ queryKey: postsKey.all }) as Array<
        [readonly ["posts"], PostsApiResponse | undefined]
      >
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
        for (const [key, data] of ctx.previous) queryClient.setQueryData(key, data)
      }
    },
    onSettled: () => {
      if (ENV_USE_SERVER_TRUTH) {
        queryClient.invalidateQueries({ queryKey: postsKey.all })
      }
    },
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
