import type * as PostModels from "@/entities/post/model"
import { fetcher } from "@/shared/api"

export async function fetchPostTags() {
  const response = await fetcher.get(`/posts/tags`)
  return response.json<PostModels.FetchTags.Response>()
}
