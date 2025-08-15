import fetchClient from "../../../shared/api/fetchClient"
import { Comment } from "./types"

type AddCommentReq = {
  body: string
  postId: number
  userId: number
}

export const addCommentApi = async (newComment: AddCommentReq): Promise<Comment> => {
  return fetchClient<Comment>("/comments/add", {
    method: "POST",
    body: JSON.stringify(newComment),
  })
}
