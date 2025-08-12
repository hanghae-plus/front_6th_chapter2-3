import { api } from "../../shared/api/api"
import { Tag } from "./model"

/**
 * 태그 목록 조회
 * @returns 태그 목록
 */
export const fetchTags = async () => {
  const response = await api.get<Tag[]>("/posts/tags")
  return response
}
