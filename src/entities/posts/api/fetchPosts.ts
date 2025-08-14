import fetchClient from "../../../shared/api/fetchClient"
import { PostDTO } from "./types"
import { User } from "../../users/api/types"

type FetchPostsReq = {
  limit: number
  skip: number
}

type FetchPostsRes = {
  posts: (PostDTO & { author: User })[]
  total: number
}

export const fetchPostsApi = async ({ limit, skip }: FetchPostsReq) => {
  return fetchClient<FetchPostsRes>(`/posts?limit=${limit}&skip=${skip}`)
}
