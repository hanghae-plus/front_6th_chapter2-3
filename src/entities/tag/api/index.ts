import { apiClient } from "../../../shared/api/base"
import { useTagStore } from "../model/store"
import { Tag } from "../model/types"

export const useTagApi = () => {
  const { setTags } = useTagStore()

  /** 태그 목록 가져오기 */
  const getTags = async () => {
    try {
      const tags = await apiClient.get<Tag[]>("/posts/tags")
      setTags(tags)
    } catch (err) {
      console.error("태그 가져오기 오류:", err)
    }
  }
  return { getTags }
}
