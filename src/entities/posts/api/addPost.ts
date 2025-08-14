import fetchClient from "../../../shared/api/fetchClient"
import { PostDTO } from "./types"

type AddPostReq = {
  title: string
  body: string
  userId: number
}

export const addPostApi = async (newPost: AddPostReq): Promise<PostDTO> => {
  return fetchClient<PostDTO>("/posts/add", {
    method: "POST",
    body: JSON.stringify(newPost),
  })
}
