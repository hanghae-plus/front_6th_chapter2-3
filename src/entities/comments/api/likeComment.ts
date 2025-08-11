import fetchClient from "../../../shared/utils/fetchClient"
import { Comment } from "./types"

export const likeCommentApi = async (id: number, likes: number): Promise<Comment> => {
  return fetchClient<Comment>(`/comments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ likes }),
  })
}
