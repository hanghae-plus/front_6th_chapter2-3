import fetchClient from "../../../shared/api/fetchClient"
import { PostApi } from "./types"

type UpdatePostReq = { selectedPost: PostApi }

export const updatePostApi = async ({ selectedPost }: UpdatePostReq): Promise<PostApi> => {
  return fetchClient<PostApi>(`/posts/${selectedPost.id}`, {
    method: "PUT",
    body: JSON.stringify(selectedPost),
  })
}
