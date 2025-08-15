import { axiosInstance } from "../../../shared/utils/axios"
import { CommentsPostData } from "./types"

export const getCommentsPost = async (postId: number) => {
  return axiosInstance.get<CommentsPostData>(`/comments/post/${postId}`)
}
