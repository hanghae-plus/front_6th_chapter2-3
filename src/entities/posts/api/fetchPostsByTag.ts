import fetchClient from "../../../shared/api/fetchClient"
import { PostDTO } from "./types"

type FetchPostsByTagReq = {
  tag: string
}

type FetchPostsByTagRes = {
  posts: PostDTO[]
  total: number
}

export const fetchPostsByTagApi = async ({ tag }: FetchPostsByTagReq) => {
  return fetchClient<FetchPostsByTagRes>(`/posts/tag/${tag}`)
}
