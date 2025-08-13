import { apiClient } from "../../../shared/api/base"
import { Tag } from "../model/types"

export const tagApi = {
  /** 태그 목록 가져오기 */
  async getTags(): Promise<Tag[]> {
    return await apiClient.get<Tag[]>("/posts/tags")
  },
}
