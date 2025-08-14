import type { addPostResponseSchema, deletePostResponseSchema, getPostsResponseSchema, postSchema, updatePostResponseSchema } from "../model"

import type z from "zod"

export const addPostResponseSchemaToPostSchemaAdapter = (
  response: z.infer<typeof addPostResponseSchema>,
): z.infer<typeof postSchema> => {
  return {
    ...response,
    reactions: { likes: 0, dislikes: 0 },
    tags: [],
    views: 0,
  }
}

export const updatePostResponseSchemaToPostSchemaAdapter = (
  response: z.infer<typeof updatePostResponseSchema>,
): z.infer<typeof postSchema> => {
  return {
    ...response,
    views: 0,
  }
}

export const optimisticAddPost = (
  prevPost: z.infer<typeof getPostsResponseSchema> | undefined,
  addPostResponse: z.infer<typeof addPostResponseSchema>,
): z.infer<typeof getPostsResponseSchema> => ({
  ...prevPost,
  limit: prevPost?.limit ?? 0,
  skip: prevPost?.skip ?? 0,
  total: prevPost?.total ?? 0,
  posts: [addPostResponseSchemaToPostSchemaAdapter(addPostResponse), ...(prevPost?.posts ?? [])],
})

export const optimisticUpdatePost = (
  prevPost: z.infer<typeof getPostsResponseSchema> | undefined,
  updatePostResponse: z.infer<typeof updatePostResponseSchema>,
): z.infer<typeof getPostsResponseSchema> => ({
  ...prevPost,
  limit: prevPost?.limit ?? 0,
  skip: prevPost?.skip ?? 0,
  total: prevPost?.total ?? 0,
  posts: prevPost?.posts?.map((post) => {
    if (post.id === updatePostResponse.id) {
      return updatePostResponseSchemaToPostSchemaAdapter(updatePostResponse)
    }

    return post
  }) ?? [],
})

export const optimisticDeletePost = (
  prevPost: z.infer<typeof getPostsResponseSchema> | undefined,
  deletePostResponse: z.infer<typeof deletePostResponseSchema>,
): z.infer<typeof getPostsResponseSchema> => ({
  ...prevPost,
  limit: prevPost?.limit ?? 0,
  skip: prevPost?.skip ?? 0,
  total: prevPost?.total ?? 0,
  posts: prevPost?.posts?.filter((post) => post.id !== deletePostResponse.id) ?? [],
})

export const optimisticLikePost = (
  prevPost: z.infer<typeof getPostsResponseSchema> | undefined,
  likePostResponse: z.infer<typeof updatePostResponseSchema>,
): z.infer<typeof getPostsResponseSchema> => ({
  ...prevPost,
  limit: prevPost?.limit ?? 0,
  skip: prevPost?.skip ?? 0,
  total: prevPost?.total ?? 0,
  posts: prevPost?.posts?.map((post) => {
    if (post.id === likePostResponse.id) {
      return { ...post, reactions: { ...post.reactions, likes: post.reactions.likes + 1 } }
    }

    return post
  }) ?? [],
})

export const optimisticUndoLikePost = (
  prevPost: z.infer<typeof getPostsResponseSchema> | undefined,
  undoLikePostResponse: z.infer<typeof updatePostResponseSchema>,
): z.infer<typeof getPostsResponseSchema> => ({
  ...prevPost,
  limit: prevPost?.limit ?? 0,
  skip: prevPost?.skip ?? 0,
  total: prevPost?.total ?? 0,
  posts: prevPost?.posts?.map((post) => {
    if (post.id === undoLikePostResponse.id) {
      return { ...post, reactions: { ...post.reactions, likes: post.reactions.likes - 1 } }
    }

    return post
  }) ?? [],
})

export const optimisticDislikePost = (
  prevPost: z.infer<typeof getPostsResponseSchema> | undefined,
  dislikePostResponse: z.infer<typeof updatePostResponseSchema>,
): z.infer<typeof getPostsResponseSchema> => ({
  ...prevPost,
  limit: prevPost?.limit ?? 0,
  skip: prevPost?.skip ?? 0,
  total: prevPost?.total ?? 0,
  posts: prevPost?.posts?.map((post) => {
    if (post.id === dislikePostResponse.id) {
      return { ...post, reactions: { ...post.reactions, dislikes: post.reactions.dislikes + 1 } }
    }

    return post
  }) ?? [],
})

export const optimisticUndoDislikePost = (
  prevPost: z.infer<typeof getPostsResponseSchema> | undefined,
  undoDislikePostResponse: z.infer<typeof updatePostResponseSchema>,
): z.infer<typeof getPostsResponseSchema> => ({
  ...prevPost,
  limit: prevPost?.limit ?? 0,
  skip: prevPost?.skip ?? 0,
  total: prevPost?.total ?? 0,
  posts: prevPost?.posts?.map((post) => {
    if (post.id === undoDislikePostResponse.id) {
      return { ...post, reactions: { ...post.reactions, dislikes: post.reactions.dislikes - 1 } }
    }

    return post
  }) ?? [],
})
