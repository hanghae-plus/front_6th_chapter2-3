import fetchClient from "../../../shared/api/fetchClient"
import { Tag } from "./types"

export const fetchTagsApi = async (): Promise<Tag[]> => {
  return fetchClient<Tag[]>("/posts/tags")
}
