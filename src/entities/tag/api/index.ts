import { Tag } from "@/entities/tag/model/types"
import { HttpClient } from "@/shared/api/http"

export const getTags = async (): Promise<Tag[]> => {
  return HttpClient.get<Tag[]>("/posts/tags")
}
