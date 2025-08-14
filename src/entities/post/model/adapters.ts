import type { PostsApiResponse, Post } from "./types"

export const applyInsertTop = (
  data: PostsApiResponse,
  post: Post,
): PostsApiResponse => ({ ...data, posts: [post, ...data.posts], total: (data.total ?? 0) + 1 })

export const applyInsertBottom = (
  data: PostsApiResponse,
  post: Post,
): PostsApiResponse => ({ ...data, posts: [...data.posts, post], total: (data.total ?? 0) + 1 })

export const applyDeleteByIdOrClient = (
  data: PostsApiResponse,
  id: number,
  clientId?: string,
): PostsApiResponse => ({
  ...data,
  posts: data.posts.filter((p: any) => (clientId ? p.clientId !== clientId : p.id !== id)),
  total: Math.max(0, (data.total ?? 1) - 1),
})

export const applyPatchReactions = (
  data: PostsApiResponse,
  id: number,
  clientId: string | undefined,
  patch: (p: Post) => Post,
): PostsApiResponse => ({
  ...data,
  posts: data.posts.map((p: any) => {
    const isTarget = clientId ? p.clientId === clientId : p.id === id
    return isTarget ? (patch(p) as any) : p
  }),
})


