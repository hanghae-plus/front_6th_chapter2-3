import type { QueryKey } from "@tanstack/react-query"
import { mutationOptions } from "@tanstack/react-query"
import { postApi } from "./api"
import { postQueries } from "./queries"
import { queryClient } from "@shared/config/query-client"
import type { CreatePostRequest, UpdatePostRequest, PostsResponse } from "./api"
import type { Post } from "../model"

export const postMutations = {
  addMutation: () =>
    mutationOptions({
      mutationKey: [...postQueries.all(), "add"] as const,
      mutationFn: (post: CreatePostRequest) => postApi.addPost(post),
      onMutate: async (newPost) => {
        const listQuery = postQueries.list()
        const snapshots: Array<[QueryKey, PostsResponse]> = []

        const tempId = -(Date.now() + Math.floor(Math.random() * 1000))

        const optimisticPost: Post = {
          id: tempId,
          title: newPost.title,
          body: newPost.body,
          userId: newPost.userId,
          tags: [],
          reactions: { likes: 0, dislikes: 0 },
          isTemporary: true,
        }

        await queryClient.cancelQueries({ queryKey: listQuery })
        const pairs = queryClient.getQueriesData<PostsResponse>({ queryKey: listQuery })

        for (const [key, data] of pairs) {
          if (!data) continue
          snapshots.push([key, data])

          queryClient.setQueryData(key, {
            ...data,
            posts: [optimisticPost, ...data.posts],
            total: data.total + 1,
          } as PostsResponse)
        }

        return { snapshots, tempId }
      },
      onError: (_e, _vars, ctx) => {
        ctx?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data))
      },
      onSuccess: (createdPost, _vars, ctx) => {
        if (!ctx) {
          queryClient.invalidateQueries({ queryKey: postQueries.all() })
          return
        }

        const listQuery = postQueries.list()
        const pairs = queryClient.getQueriesData<PostsResponse>({ queryKey: listQuery })

        for (const [key, data] of pairs) {
          if (!data) continue

          const posts = data.posts
          const tempIndex = posts.findIndex((p) => p.id === ctx.tempId)

          if (tempIndex === -1) continue

          const existingPost = posts.find((p) => p.id === createdPost.id && p.id !== ctx.tempId)
          if (existingPost) {
            const updatedPost = { ...createdPost, id: ctx.tempId, isTemporary: true }
            queryClient.setQueryData(key, {
              ...data,
              posts: posts.map((p) => (p.id === ctx.tempId ? updatedPost : p)),
            } as PostsResponse)
          } else {
            queryClient.setQueryData(key, {
              ...data,
              posts: posts.map((p) => (p.id === ctx.tempId ? { ...createdPost, isTemporary: true } : p)),
            } as PostsResponse)
          }
        }
      },
    }),

  updateMutation: () =>
    mutationOptions({
      mutationKey: [...postQueries.all(), "update"] as const,
      mutationFn: async ({ id, post, isTemporary }: { id: number; post: UpdatePostRequest; isTemporary?: boolean }) => {
        if (id < 0 || isTemporary) {
          return { id, ...post, userId: 1, tags: [], reactions: { likes: 0, dislikes: 0 }, isTemporary: true } as Post
        }
        return postApi.updatePost(id, post)
      },
      onMutate: async ({ id, post: updateData, isTemporary }) => {
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
              posts: data.posts.map((p) => (p.id === id ? { ...p, ...updateData } : p)),
            } as PostsResponse)
          }
        }

        const currentPost = snapshots[0]?.[1]?.posts?.find((p) => p.id === id)
        const isPostTemporary = isTemporary || currentPost?.isTemporary || id < 0

        return { snapshots, isTemporary: isPostTemporary }
      },
      onError: (_e, _vars, ctx) => {
        if (ctx?.snapshots && !ctx.isTemporary) {
          ctx.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data))
        }
      },
      onSuccess: (updatedPost, _vars, ctx) => {
        if (!ctx) {
          queryClient.invalidateQueries({ queryKey: postQueries.all() })
          return
        }

        if (ctx.isTemporary) return

        const basePostQueries = [postQueries.list(), postQueries.search(), postQueries.listByTag()]

        for (const query of basePostQueries) {
          const pairs = queryClient.getQueriesData<PostsResponse>({ queryKey: query })

          for (const [key, data] of pairs) {
            if (!data) continue

            queryClient.setQueryData(key, {
              ...data,
              posts: data.posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
            } as PostsResponse)
          }
        }
      },
    }),

  deleteMutation: () => ({
    mutationKey: [...postQueries.all(), "delete"] as const,
    mutationFn: async ({ id, isTemporary }: { id: number; isTemporary?: boolean }) => {
      if (id < 0 || isTemporary) {
        return Promise.resolve()
      }
      return postApi.deletePost(id)
    },
    onMutate: async ({ id, isTemporary }: { id: number; isTemporary?: boolean }) => {
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

      const currentPost = snapshots[0]?.[1]?.posts?.find((p) => p.id === id)
      const isPostTemporary = isTemporary || currentPost?.isTemporary || id < 0

      return { snapshots, isTemporary: isPostTemporary }
    },
    onError: (
      _e: unknown,
      _vars: { id: number; isTemporary?: boolean },
      ctx?: { snapshots?: Array<[QueryKey, PostsResponse]>; isTemporary?: boolean },
    ) => {
      if (ctx?.snapshots && !ctx.isTemporary) {
        ctx.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data))
      }
    },
  }),
}
