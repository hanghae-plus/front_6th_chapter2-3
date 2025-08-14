import type * as PostModels from "@/entities/post/model"
import { fetcher } from "@/shared/api"

export async function fetchPosts({ limit, skip }: PostModels.FetchPosts.Payload) {
  const searchParams = { limit, skip }
  const response = await fetcher.get(`/posts`, { searchParams })
  return response.json<PostModels.FetchPosts.Response>()
}

export async function fetchPostsBySearch({ query }: PostModels.FetchPostsSearch.Payload) {
  const searchParams = { q: query }
  const response = await fetcher.get(`/posts/search`, { searchParams })
  return response.json<PostModels.FetchPostsSearch.Response>()
}

export async function fetchPostsByTag({ tag }: PostModels.FetchPostsByTag.Payload) {
  const response = await fetcher.get(`/posts/tag/${tag}`)
  return response.json<PostModels.FetchPostsByTag.Response>()
}

export async function addPost(payload: PostModels.AddPost.Payload) {
  const response = await fetcher.post(`/posts/add`, { body: payload })
  return response.json<PostModels.AddPost.Response>()
}

export async function updatePost({ id, ...body }: PostModels.UpdatePost.Payload) {
  const response = await fetcher.put(`/posts/${id}`, { body })
  return response.json<PostModels.UpdatePost.Response>()
}

export async function deletePost({ id }: PostModels.DeletePost.Payload) {
  const response = await fetcher.delete(`/posts/${id}`)
  return response.json<PostModels.DeletePost.Response>()
}
