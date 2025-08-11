import fetchClient from "../../../shared/utils/fetchClient"
import { Post } from "./types"

type AddPostReq = {
  title: string
  body: string
  userId: number
}

export const addPostApi = async (newPost: AddPostReq): Promise<Post> => {
  return fetchClient<Post>("/posts/add", {
    method: "POST",
    body: JSON.stringify(newPost),
  })
}
