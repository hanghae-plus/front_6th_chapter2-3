import fetchClient from "../../../shared/utils/fetchClient"
import { PostApi } from "./types"

type FetchPostsByTagReq = {
  tag: string
}

type FetchPostsByTagRes = {
  posts: PostApi[]
  total: number
}

export const fetchPostsByTagApi = async ({ tag }: FetchPostsByTagReq) => {
  return fetchClient<FetchPostsByTagRes>(`/posts/tag/${tag}`)
}
