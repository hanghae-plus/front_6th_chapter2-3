import { postApi } from "./api"
import { postQueries } from "./queries"
import { queryClient } from "../../../shared/config/query-client"
import type { CreatePostRequest, UpdatePostRequest, PostsResponse } from "./api"
import type { QueryKey } from "@tanstack/react-query"

export const postMutations = {
  addMutation: () => ({
    mutationKey: [...postQueries.all(), "add"] as const,
    mutationFn: (post: CreatePostRequest) => postApi.addPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postQueries.all(),
      })
    },
  }),

  updateMutation: () => ({
    mutationKey: [...postQueries.all(), "update"] as const,
    mutationFn: ({ id, post }: { id: number; post: UpdatePostRequest }) => postApi.updatePost(id, post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postQueries.all(),
      })
    },
  }),

  deleteMutation: () => ({
    mutationKey: [...postQueries.all(), "delete"] as const,
    mutationFn: (id: number) => postApi.deletePost(id),
    onMutate: async (id: number) => {
      const basePostQueries = [postQueries.list(), postQueries.search(), postQueries.listByTag()]
      const snapshots: Array<[QueryKey, PostsResponse]> = []

      for (const query of basePostQueries) {
        await queryClient.cancelQueries({ queryKey: query })
        const pairs = queryClient.getQueriesData<PostsResponse>({ queryKey: query })
        for (const [key, data] of pairs) {
          if (!data) continue
          snapshots.push([key, data])
          queryClient.setQueryData(key, {
            ...data,
            posts: data.posts.filter((post) => post.id !== id),
            total: Math.max(0, data.total - 1),
          } as PostsResponse)
        }
      }

      return { snapshots }
    },
    onError: (_e: unknown, _vars: number, ctx?: { snapshots?: Array<[QueryKey, PostsResponse]> }) => {
      ctx?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
  }),
}
