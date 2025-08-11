import fetchClient from "../../../shared/utils/fetchClient"
import { PostApi } from "./types"

type AddPostReq = {
  title: string
  body: string
  userId: number
}

export const addPostApi = async (newPost: AddPostReq): Promise<PostApi> => {
  return fetchClient<PostApi>("/posts/add", {
    method: "POST",
    body: JSON.stringify(newPost),
  })
}
