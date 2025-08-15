import { requestApi } from "../../shared/lib"
import { Comments } from "./type"

export const getComments = async (postId: number) => {
  return await requestApi<Comments>(`/comments/post/${postId}`)
}
