import fetchClient from "../../../shared/api/fetchClient"
import { PostDTO } from "./types"

type UpdatePostReq = { selectedPost: PostDTO }

export const updatePostApi = async ({ selectedPost }: UpdatePostReq): Promise<PostDTO> => {
  return fetchClient<PostDTO>(`/posts/${selectedPost.id}`, {
    method: "PUT",
    body: JSON.stringify(selectedPost),
  })
}
