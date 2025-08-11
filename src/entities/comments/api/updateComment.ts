import fetchClient from "../../../shared/utils/fetchClient"
import { Comment } from "./types"

type UpdateCommentReq = {
  id: number
  body: string
}

export const updateCommentApi = async ({ id, body }: UpdateCommentReq): Promise<Comment> => {
  return fetchClient<Comment>(`/comments/${id}`, {
    method: "PUT",
    body: JSON.stringify({ body }),
  })
}
