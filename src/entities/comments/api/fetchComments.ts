import fetchClient from "../../../shared/utils/fetchClient"
import { Comment } from "./types"

type FetchCommentsRes = {
  comments: Comment[]
}

export const fetchCommentsApi = async (postId: number): Promise<FetchCommentsRes> => {
  return fetchClient<FetchCommentsRes>(`/comments/post/${postId}`)
}
