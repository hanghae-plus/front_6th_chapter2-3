import fetchClient from "../../../shared/api/fetchClient"
import { PostDTO } from "./types"
import { UserDto } from "../../users/api/types"

type FetchPostsReq = {
  limit: number
  skip: number
}

type FetchPostsRes = {
  posts: (PostDTO & { author: UserDto })[]
  total: number
}

export const fetchPostsApi = async ({ limit, skip }: FetchPostsReq) => {
  return fetchClient<FetchPostsRes>(`/posts?limit=${limit}&skip=${skip}`)
}
