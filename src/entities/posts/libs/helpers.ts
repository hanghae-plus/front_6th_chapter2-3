import z from "zod"
import { addPostResponseSchema, getPostsResponseSchema, postSchema } from "../model"

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
