import { fetcher } from "@/base/api"
import type * as PostModels from "@/entities/post/model"

export async function fetchPostTags() {
  const response = await fetcher.get(`/posts/tags`)
  return response.json<PostModels.FetchTags.Response>()
}
