import { requestApi } from "../../shared"
import { Tags } from "./type"

export const getTags = async () => {
  return await requestApi<Tags>("/posts/tags")
}
