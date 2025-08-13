import { Tag } from "@/entities/tag/model/type"
import { HttpClient } from "@/shared/api/http"

export const tagApi = {
  async getTags(): Promise<Tag[]> {
    return HttpClient.get<Tag[]>("/posts/tags")
  },
}
