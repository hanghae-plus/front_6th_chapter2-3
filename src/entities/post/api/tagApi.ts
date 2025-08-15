import { Tag } from "@/entities/post/model"
import { http } from "@/shared/lib"

export const tagsApi = {
  getTags: () => http.get<Tag[]>("/posts/tags"),
}
